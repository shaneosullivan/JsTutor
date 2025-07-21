"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, X, Loader2 } from "lucide-react";
import ApiKeySetup from "@/components/api-key-setup";
import MessageContent from "@/components/message-content";
import { getProfileItem } from "@/lib/profile-storage";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiChatProps {
  tutorialId: string;
  courseId?: string;
  code: string;
  onClose: () => void;
  isVisible: boolean;
  canvasError?: { message: string; line?: number } | null;
  isKeyboardVisible?: boolean;
}

export default function AiChat({
  tutorialId,
  courseId,
  code,
  onClose,
  isVisible,
  canvasError,
  isKeyboardVisible = false
}: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [lastErrorSent, setLastErrorSent] = useState<{
    message: string;
    line?: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for existing API key on mount
  useEffect(() => {
    const storedApiKey = getProfileItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowSetup(true);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat when tutorial or course changes
  useEffect(() => {
    setMessages([]);
    setHasInitialized(false);
    setLastErrorSent(null);
  }, [tutorialId, courseId]);

  // Initialize chat with context when first shown (only if API key is available)
  useEffect(() => {
    if (
      !hasInitialized &&
      messages.length === 0 &&
      apiKey &&
      !showSetup &&
      isVisible
    ) {
      let initialContent;

      if (canvasError) {
        const errorText = canvasError.line
          ? `"${canvasError.message}" on line ${canvasError.line}`
          : `"${canvasError.message}"`;
        initialContent = `Hi! I'm having trouble with the code I sent you. I'm getting this error: ${errorText}. Can you help me understand what's wrong and how to fix it?`;
        // Mark this error as already sent to prevent duplicate messages
        setLastErrorSent(canvasError);
      } else {
        initialContent =
          "Hi! I'm working on this tutorial and could use some help. Can you look at my code and let me know if there are any bugs or suggest what I should try next?";
      }

      const initialMessage: Message = {
        role: "user",
        content: initialContent,
        timestamp: new Date()
      };

      setMessages([initialMessage]);
      sendMessage(initialMessage);
      setHasInitialized(true);
    }
  }, [
    hasInitialized,
    messages.length,
    apiKey,
    showSetup,
    canvasError,
    isVisible,
    code
  ]);

  // Send error message when Help Me button is clicked with an error present
  useEffect(() => {
    if (
      hasInitialized &&
      isVisible &&
      canvasError &&
      apiKey &&
      !showSetup &&
      !isLoading &&
      JSON.stringify(canvasError) !== JSON.stringify(lastErrorSent)
    ) {
      const errorText = canvasError.line
        ? `"${canvasError.message}" on line ${canvasError.line}`
        : `"${canvasError.message}"`;
      const errorMessage: Message = {
        role: "user",
        content: `I just got this error in my code: ${errorText}. Can you help me understand what's wrong and how to fix it?`,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, errorMessage]);
      sendMessage(errorMessage);
      setLastErrorSent(canvasError);
    }
  }, [
    canvasError,
    isVisible,
    hasInitialized,
    apiKey,
    showSetup,
    isLoading,
    lastErrorSent,
    code
  ]);

  const sendMessage = async (message: Message) => {
    setIsLoading(true);

    try {
      // Import OpenAI SDK dynamically to avoid SSR issues
      const { OpenAI } = await import("openai");

      const openai = new OpenAI({
        apiKey: apiKey!,
        dangerouslyAllowBrowser: true
      });

      const chatMessages = messages.concat(message).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      const guidelines = ` Guidelines:
- ONLY discuss coding, programming, and the current JavaScript tutorial
- NEVER discuss personal information, inappropriate topics, or anything unrelated to coding
- Use simple words that 8-year-olds can understand
- Be super encouraging and supportive - celebrate their efforts!
- Explain coding concepts like you're talking to a friend
- Ask helpful questions that guide them to discover answers
- Help them understand their mistakes in a friendly way
- Don't write their code for them, but help them figure it out step by step
- Focus on learning and having fun with coding
- Use fun emojis to keep it exciting! 🎉
- If they ask about non-coding topics, politely redirect them back to coding
- If they have an error, help them understand what went wrong and how to fix it
- Always keep conversations safe and appropriate for young children`;

      const codeMessage = code
        ? `Here is their current code:\n\`\`\`javascript\n${code}\n\`\`\``
        : "";

      let systemMessageContent = "";

      if (hasInitialized) {
        systemMessageContent = codeMessage;
      } else {
        systemMessageContent = `You are a friendly coding tutor helping 8-year-old children learn JavaScript in a fun and safe way. The student is working on tutorial ${tutorialId}. You must ONLY help with coding and programming topics. Never discuss personal information, inappropriate topics, or anything unrelated to coding. Always use simple, kid-friendly language and keep conversations appropriate for young children.
        
        ${codeMessage || ""}
        
        ${guidelines}`;
      }

      // Add system message for context (includes latest code)
      const systemMessage = {
        role: "system" as const,
        content: systemMessageContent
      };

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...chatMessages],
        max_tokens: 500,
        temperature: 0.7
      });

      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.choices[0]?.message?.content ||
          "I'm sorry, I didn't understand that. Can you try asking again?",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Failed to send message:", error);

      let errorContent =
        "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!";

      if (error?.status === 401) {
        errorContent =
          "It looks like your API key might not be working. Try setting it up again!";
      } else if (error?.status === 429) {
        errorContent =
          "You've reached your API usage limit. Please check your OpenAI account or try again later.";
      } else if (error?.status === 403) {
        errorContent =
          "Your API key doesn't have permission to use this service. Please check your OpenAI account settings.";
      }

      const errorMessage: Message = {
        role: "assistant",
        content: errorContent,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    sendMessage(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-full flex flex-col max-h-full">
      {/* Header */}
      <div
        className={`flex-shrink-0 p-4 border-b bg-white keyboard-responsive-header ${isKeyboardVisible ? "keyboard-hidden" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 border-2 border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
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
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <MessageContent content={message.content} />
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
            onKeyDown={handleKeyPress}
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

        <p
          className={`text-xs text-gray-500 text-center keyboard-responsive-header ${isKeyboardVisible ? "keyboard-hidden" : ""}`}
        >
          I'm here to help explain bugs and suggest next steps. I won't write
          code for you - that's the fun part!
        </p>
      </div>
    </div>
  );
}
