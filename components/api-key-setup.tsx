"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, Sparkles, Heart, CheckCircle } from "lucide-react";
import { setProfileItem } from "@/lib/profile-storage";

interface ApiKeySetupProps {
  onKeyValidated: (apiKey: string) => void;
  onCancel: () => void;
}

export default function ApiKeySetup({
  onKeyValidated,
  onCancel,
}: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);

  const validateApiKey = async (key: string) => {
    try {
      // Import OpenAI SDK dynamically to avoid SSR issues
      const { OpenAI } = await import("openai");

      const openai = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      });

      // Test the API key by making a simple request
      await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, this is a test." }],
        max_tokens: 5,
      });

      // If we get here, the API key is valid
      return true;
    } catch (error: any) {
      console.error("API key validation error:", error);

      // Check for specific error types
      if (error?.status === 401) {
        return false; // Invalid API key
      }
      if (error?.status === 429) {
        return false; // Rate limit or insufficient credits
      }
      if (error?.status === 403) {
        return false; // Forbidden
      }

      // For other errors, assume invalid key
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your API key first!");
      return;
    }

    setIsValidating(true);
    setError("");

    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      setProfileItem("openai_api_key", apiKey);
      onKeyValidated(apiKey);
    } else {
      setError(
        "Hmm, that API key doesn't seem to work. Double-check that you copied it correctly, or ask your parent to help verify it's the right one!",
      );
    }

    setIsValidating(false);
  };

  if (!showInput) {
    return (
      <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-purple-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="text-lg font-bold text-purple-800">
              Unlock Your AI Buddy!
            </h3>
            <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">🤖✨</div>
              <p className="text-gray-700 text-sm font-medium">
                <strong>Hey there, future programmer!</strong> 🚀
              </p>
              <p className="text-gray-700 text-sm font-medium">
                To get your AI helper working, you'll need a special "API key"
                from OpenAI.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-lg border-2 border-dashed border-blue-300">
              <p className="text-gray-700 mb-2 text-sm font-semibold">
                🎯{" "}
                <strong>Ask your parent or guardian to help with this!</strong>{" "}
                Here's what they need to do:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-2">
                <li>
                  Go to <strong>platform.openai.com</strong> 🌐
                </li>
                <li>Create an account or sign in 👤</li>
                <li>Click "API Keys" in the menu 🔑</li>
                <li>Create a new secret key ✨</li>
                <li>Copy the key (starts with: sk-...) 📋</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-dashed border-yellow-400">
              <p className="text-sm text-gray-700 font-medium">
                🔒 <strong>Don't worry!</strong> Your key stays super safe on
                your computer and is never shared with anyone! 🛡️
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg border-2 border-dashed border-green-300">
              <p className="font-bold text-gray-800 mb-2 text-sm">
                🎉 Once you have your key, you'll be able to:
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Ask questions about your code 💭
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Get help fixing bugs 🐛
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Learn new programming tricks 🎪
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-purple-200 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setShowInput(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              size="sm"
            >
              <Key className="w-4 h-4 mr-2" />
              🎉 I Have My API Key!
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Maybe Later 😊
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Key className="w-6 h-6 text-green-600 animate-pulse" />
          <h3 className="text-lg font-bold text-green-800">
            🔑 Enter Your Magic Key!
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3 animate-wiggle">🔑✨</div>
            <p className="text-gray-700 text-sm font-medium">
              Paste your API key below and we'll make sure it works like magic!
              🎪
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 p-3 rounded-lg border-2 border-dashed border-blue-300">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🌟 Your OpenAI API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm border-2 border-blue-300 focus:border-purple-500 focus:ring-purple-500"
                disabled={isValidating}
              />
              <p className="text-sm text-gray-600 mt-2 font-medium">
                🔒 This key stays super safe on your computer! 🛡️
              </p>
            </div>

            {error && (
              <Alert className="border-red-300 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-dashed">
                <AlertDescription className="text-red-700 text-sm font-medium">
                  🚨 {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!apiKey.trim() || isValidating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            size="sm"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                🔍 Testing Magic...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                🚀 Activate My AI Buddy!
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowInput(false)}
            variant="outline"
            disabled={isValidating}
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
