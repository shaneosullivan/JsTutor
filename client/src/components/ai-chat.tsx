import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, X, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import ApiKeySetup from '@/components/api-key-setup';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatProps {
  tutorialId: number;
  code: string;
  onClose: () => void;
  isVisible: boolean;
  canvasError?: {message: string; line?: number} | null;
}

export default function AiChat({ tutorialId, code, onClose, isVisible, canvasError }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [lastErrorSent, setLastErrorSent] = useState<{message: string; line?: number} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for existing API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowSetup(true);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat when tutorial changes
  useEffect(() => {
    setMessages([]);
    setHasInitialized(false);
    setLastErrorSent(null);
  }, [tutorialId]);

  // Initialize chat with context when first shown (only if API key is available)
  useEffect(() => {
    if (!hasInitialized && messages.length === 0 && apiKey && !showSetup && isVisible) {
      let initialContent;
      
      if (canvasError) {
        const errorText = canvasError.line 
          ? `"${canvasError.message}" on line ${canvasError.line}`
          : `"${canvasError.message}"`;
        initialContent = `Hi! I'm having trouble with my code. I'm getting this error: ${errorText}. Can you help me understand what's wrong and how to fix it?`;
      } else {
        initialContent = "Hi! I'm working on this tutorial and could use some help. Can you look at my code and let me know if there are any bugs or suggest what I should try next?";
      }
      
      const initialMessage: Message = {
        role: 'user',
        content: initialContent,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      sendMessage(initialMessage, true);
      setHasInitialized(true);
    }
  }, [hasInitialized, messages.length, apiKey, showSetup, isVisible, canvasError]);

  // Send error message when chat becomes visible and there's a new error
  useEffect(() => {
    if (hasInitialized && isVisible && canvasError && apiKey && !showSetup && !isLoading && 
        JSON.stringify(canvasError) !== JSON.stringify(lastErrorSent)) {
      const errorText = canvasError.line 
        ? `"${canvasError.message}" on line ${canvasError.line}`
        : `"${canvasError.message}"`;
      const errorMessage: Message = {
        role: 'user',
        content: `I just got this error in my code: ${errorText}. Can you help me fix it?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      sendMessage(errorMessage, false);
      setLastErrorSent(canvasError);
    }
  }, [canvasError, isVisible, hasInitialized, apiKey, showSetup, isLoading, lastErrorSent]);

  const sendMessage = async (message: Message, isFirstMessage = false) => {
    setIsLoading(true);
    
    try {
      const chatMessages = messages.concat(message).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const apiResponse = await apiRequest('POST', '/api/ai-chat', {
        messages: chatMessages,
        tutorialId,
        code, // Always send current code with every message for complete context
        isFirstMessage,
        apiKey
      });
      
      const response = await apiResponse.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    sendMessage(userMessage, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApiKeyValidated = (validatedApiKey: string) => {
    setApiKey(validatedApiKey);
    setShowSetup(false);
  };

  const handleCancelSetup = () => {
    setShowSetup(false);
    onClose();
  };

  // Show API key setup if needed
  if (showSetup || !apiKey) {
    return (
      <ApiKeySetup
        onKeyValidated={handleApiKeyValidated}
        onCancel={handleCancelSetup}
      />
    );
  }

  return (
    <div className="h-full flex flex-col max-h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden bg-white">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-600">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t bg-white">
        <div className="flex gap-2 mb-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your code..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          I'm here to help explain bugs and suggest next steps. I won't write code for you - that's the fun part!
        </p>
      </div>
    </div>
  );
}