import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, Sparkles, Heart, CheckCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onKeyValidated: (apiKey: string) => void;
  onCancel: () => void;
}

export default function ApiKeySetup({ onKeyValidated, onCancel }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);

  const validateApiKey = async (key: string) => {
    try {
      const response = await fetch('/api/validate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid API key');
      }
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key first!');
      return;
    }

    setIsValidating(true);
    setError('');

    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      localStorage.setItem('openai_api_key', apiKey);
      onKeyValidated(apiKey);
    } else {
      setError('Hmm, that API key doesn\'t seem to work. Double-check that you copied it correctly, or ask your parent to help verify it\'s the right one!');
    }
    
    setIsValidating(false);
  };

  if (!showInput) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Unlock Your AI Helper!
            <Sparkles className="w-6 h-6 text-purple-500" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-center p-6">
          <div className="text-center space-y-6">
            <div className="text-6xl">🤖✨</div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Get Your Personal Coding Assistant!
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-3 text-left">
                <p className="text-gray-700">
                  <strong>Hey there, future programmer!</strong> To get your AI helper working, you'll need a special "API key" from OpenAI. 
                </p>
                
                <p className="text-gray-700">
                  <strong>You might need to ask your parent or guardian to help with this part!</strong> Here's what they need to do:
                </p>
                
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-4">
                  <li>Go to <strong>platform.openai.com</strong></li>
                  <li>Create an account or sign in</li>
                  <li>Click on "API Keys" in the menu</li>
                  <li>Create a new secret key</li>
                  <li>Copy the key (it looks like: sk-...)</li>
                </ol>
                
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Don't worry!</strong> Your key stays safe on your computer and is never shared with anyone else.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Once you have your key, you'll be able to:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Ask questions about your code
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Get help fixing bugs
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Learn new programming tricks
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Get encouragement when learning
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setShowInput(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Key className="w-4 h-4 mr-2" />
                I Have My API Key!
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <Key className="w-5 h-5 text-purple-500" />
          Enter Your API Key
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔑✨</div>
            <p className="text-gray-700">
              Paste your API key below and we'll make sure it works!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your OpenAI API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm"
                disabled={isValidating}
              />
              <p className="text-xs text-gray-500 mt-1">
                This key stays safe on your computer and is never shared!
              </p>
            </div>
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!apiKey.trim() || isValidating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Key...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Activate My AI Helper!
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowInput(false)}
                variant="outline"
                disabled={isValidating}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}