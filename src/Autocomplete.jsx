import { useAuth } from "./AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function Autocomplete() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);
  const latestInput = useRef(input); // For stale closure avoidance

  const API_URL = "https://karbiu.com/predict";

  // Track latest input value
  useEffect(() => {
    latestInput.current = input;
  }, [input]);

  useEffect(() => {
    if (!user) return; // Early return if not authenticated

    const fetchSuggestions = async () => {
      try {
        const response = await axios.post(API_URL, {
          text: latestInput.current,
          top_k: 3,
        });
        
        // Validate response
        if (!Array.isArray(response.data?.predictions)) {
          throw new Error("Invalid API response structure");
        }
        
        setSuggestions(response.data.predictions);
      } catch (err) {
        setError("Failed to fetch suggestions");
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!latestInput.current.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(fetchSuggestions, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [input, user]); // Added user to dependencies

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-red-500">Please log in to use autocomplete</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Smart Autocomplete</h1>
      
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          aria-label="Text input for autocomplete"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <ArrowPathIcon 
              className="h-5 w-5 animate-spin text-gray-500" 
              aria-label="Loading suggestions" 
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-red-500" role="alert">{error}</p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Suggestions:</h3>
          <ul className="space-y-1">
            {suggestions.map(([word, confidence], index) => (
              <li
                key={`${word}-${index}`} // More unique key
                className="p-2 bg-gray-100 hover:bg-blue-50 rounded cursor-pointer"
                onClick={() => setInput(prev => `${prev} ${word}`.trim())}
              >
                <span className="font-medium">{word}</span>
                {confidence && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({(confidence * 100).toFixed(1)}%)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Autocomplete;

