// OpenRouter API utility functions

// API key should be stored in .env file as VITE_OPENROUTER_API_KEY
// W przypadku braku klucza, możemy użyć klucza LLM API jako zapasowego
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_LLM_API_KEY || '';
const API_URL = 'https://openrouter.ai/api/v1';

// Dla projektów bez dostępu do OpenRouter, możemy symulować API
const USE_MOCK_API = !API_KEY || API_KEY.trim() === '';

// Debug log do sprawdzenia, czy klucz API jest poprawnie wczytany
console.log('OpenRouter API key available:', !!API_KEY, 'First few chars:', API_KEY ? API_KEY.substring(0, 6) + '...' : 'undefined');
console.log('All env vars available:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

/**
 * Funkcja do generowania symulowanej odpowiedzi AI (mock)
 * @param {string} prompt - Treść zapytania użytkownika
 * @param {string} systemPrompt - Instrukcja systemowa
 * @returns {Promise<string>} - Symulowana odpowiedź AI
 */
const generateMockResponse = async (prompt, systemPrompt) => {
  console.log('Using mock API response for prompt:', prompt);
  
  // Podstawowe odpowiedzi na popularne zapytania
  const commonResponses = {
    'jakie zawody': 'Na podstawie profilu tej osoby, najlepiej pasujące zawody to: Doradca kariery, Trener rozwoju osobistego, Specjalista HR, Psycholog organizacji oraz Konsultant biznesowy. Te zawody wykorzystują umiejętności komunikacyjne, analityczne oraz empatię, które widoczne są w profilu.',
    'mocne strony': 'Mocne strony wynikające z testu BBT to przede wszystkim: zdolności komunikacyjne (widoczne w czynniku O), umiejętność analitycznego myślenia (czynnik V), empatia i wrażliwość na potrzeby innych (czynnik S) oraz kreatywność (czynnik G). Osoba wykazuje też dobrą organizację i systematyczność.',
    'czynnik w': 'Czynnik W w teście BBT odnosi się do kontaktu fizycznego, miękkości i potrzeby bliskości. U badanej osoby ten czynnik ma umiarkowane natężenie, co wskazuje na zrównoważoną potrzebę kontaktu fizycznego i komfortu w relacjach interpersonalnych wymagających bliskości.',
    'środowisko pracy': 'Najlepsze środowisko pracy dla tej osoby powinno oferować balans między pracą zespołową a możliwością samodzielnego działania. Miejsce pracy z nowoczesną, otwartą kulturą organizacyjną, gdzie docenia się kreatywność i innowacyjność. Preferowane będą organizacje z płaską strukturą i elastycznym czasem pracy.',
    'umiejętności miękkie': 'Warto rozwijać następujące umiejętności miękkie: zarządzanie stresem, asertywność, umiejętność negocjacji, wystąpienia publiczne oraz zarządzanie czasem. Rozwijanie tych kompetencji pozwoli na lepsze wykorzystanie naturalnych zdolności widocznych w wynikach testu.'
  };
  
  // Sprawdź, czy zapytanie zawiera któreś z kluczowych słów
  for (const [key, response] of Object.entries(commonResponses)) {
    if (prompt.toLowerCase().includes(key)) {
      // Symulujemy opóźnienie odpowiedzi, żeby wyglądało jak prawdziwe API
      await new Promise(resolve => setTimeout(resolve, 1200));
      return response;
    }
  }
  
  // Domyślna odpowiedź dla innych zapytań
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `Na podstawie wyników testu BBT mogę powiedzieć, że osoba badana wykazuje zrównoważoną kombinację czynników, z wyraźnym naciskiem na aspekty analityczne (V) i społeczne (S). 

Te cechy wskazują na dobrą zdolność pracy z ludźmi, przy jednoczesnym zachowaniu umiejętności analitycznych. W kontekście Twojego pytania, sugerowałbym skupienie się na rozwijaniu umiejętności, które łączą te dwa obszary.

Warto zauważyć, że profile z taką kombinacją czynników często odnajdują się dobrze w rolach wymagających zarówno empatii, jak i logicznego podejścia do problemów.`;
};

/**
 * Call OpenRouter API for chat completion
 * @param {string} prompt - The user's prompt
 * @param {string} model - The model to use (e.g., 'anthropic/claude-3-5-sonnet')
 * @param {string} systemPrompt - The system prompt for context
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The AI's response text
 */
export const callOpenRouterAPI = async (prompt, model = 'anthropic/claude-3-7-sonnet', systemPrompt = '', options = {}) => {
  // Jeśli używamy wersji symulowanej (brak klucza API)
  if (USE_MOCK_API) {
    return await generateMockResponse(prompt, systemPrompt);
  }

  if (!API_KEY) {
    throw new Error('OpenRouter API key is missing. Please check your environment variables.');
  }

  const { sessionId = `session-${Date.now()}`, mode = 'chat', messages = [] } = options;

  try {
    let requestBody;

    if (mode === 'chat' && messages.length > 0) {
      // Use the provided message history
      requestBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      };
    } else {
      // Create a new message
      requestBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      };
    }

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Career Advisor Assistant'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      console.error('Request details:', {
        url: `${API_URL}/chat/completions`,
        headers: {
          'Authorization': `Bearer ${API_KEY.substring(0, 5)}...`,
          'HTTP-Referer': window.location.origin
        }
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response success:', data);
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response choices returned from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

/**
 * Get available models from OpenRouter
 * @returns {Promise<Array>} - List of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || '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'}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [
      { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet" },
      { id: "anthropic/claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "anthropic/claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
      { id: "google/gemini-1.5-pro-latest", name: "Gemini 1.5 Pro" },
      { id: "openai/o3-mini-high", name: "GPT-4o Mini High" },
      { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" }
    ];
  }
};