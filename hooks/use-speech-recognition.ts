import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  error: string | null;
  browserSupportsSpeechRecognition: boolean; // Renamed for clarity
  startListening: () => void;
  stopListening: () => void;
  currentLang: string; // Add state to expose the detected language
}

// Conditionally access browser APIs only in the client environment
const SpeechRecognition =
  typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

// Supported language codes (BCP 47 format, typically includes region)
const supportedLangs: Record<string, string> = {
    'en': 'en-US', // English (default)
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-IN': 'en-IN',
    'hi': 'hi-IN', // Hindi
    'hi-IN': 'hi-IN',
    'bn': 'bn-IN', // Bengali (India)
    'bn-IN': 'bn-IN',
    'mr': 'mr-IN', // Marathi
    'mr-IN': 'mr-IN',
    'te': 'te-IN', // Telugu
    'te-IN': 'te-IN',
    'ta': 'ta-IN', // Tamil (India)
    'ta-IN': 'ta-IN',
    'gu': 'gu-IN', // Gujarati
    'gu-IN': 'gu-IN',
    'kn': 'kn-IN', // Kannada
    'kn-IN': 'kn-IN',
    'ml': 'ml-IN', // Malayalam
    'ml-IN': 'ml-IN',
    // Add other language/region codes if needed and supported by the browser's API
};

// Function to get the best supported language code
const getSupportedLang = (browserLang: string): string => {
    const langBase = browserLang.split('-')[0].toLowerCase(); // e.g., 'hi' from 'hi-IN'
    const fullLangLower = browserLang.toLowerCase(); // e.g., 'hi-in'

    // Check for exact match first (e.g., 'hi-IN')
    if (supportedLangs[fullLangLower]) {
        return supportedLangs[fullLangLower];
    }
    // Check for base language match (e.g., 'hi')
    if (supportedLangs[langBase]) {
        return supportedLangs[langBase];
    }
    // Default to English (India) or US English
    return supportedLangs['en-IN'] || supportedLangs['en-US'];
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null); // Store recognition instance
  const [currentLang, setCurrentLang] = useState<string>('en-US'); // Store the language being used

  // Check support only in the browser
  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && !!SpeechRecognition;

  // Initialize SpeechRecognition
  useEffect(() => {
    // Only proceed if in a browser environment and speech recognition is supported
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening even after pauses
    recognition.interimResults = true; // Get results while speaking

    // Determine and set language only in the browser
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    const recognitionLang = getSupportedLang(browserLang);
    recognition.lang = recognitionLang;
    setCurrentLang(recognitionLang);
    console.log(`Speech recognition language set to: ${recognitionLang} (Browser default: ${browserLang})`);

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Update transcript with the latest interim or final result
      setTranscript(finalTranscript || interimTranscript);
      // console.log('Interim:', interimTranscript, 'Final:', finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error, 'Lang:', recognition.lang);
      // Provide more specific error feedback if possible
      if (event.error === 'language-not-supported') {
          setError(`The configured language (${recognition.lang}) is not supported by your browser's speech recognition.`);
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else {
         setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    setRecognitionInstance(recognition);

    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  // Initialize only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Changed dependency array to empty

  const startListening = useCallback(() => {
    if (recognitionInstance && !isListening) {
        setTranscript('');
        setError(null);
        try {
             console.log(`Attempting to start recognition with lang: ${recognitionInstance.lang}`);
             recognitionInstance.start();
        } catch (err: any) {
            console.error("Error starting recognition:", err);
            setError("Could not start microphone. Please check permissions or browser compatibility.")
            setIsListening(false);
        }
    }
  }, [recognitionInstance, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionInstance && isListening) {
      recognitionInstance.stop();
    }
  }, [recognitionInstance, isListening]);

  return {
    isListening,
    transcript,
    error,
    browserSupportsSpeechRecognition, // Expose the support status
    startListening,
    stopListening,
    currentLang, // Expose the language being used
  };
};
