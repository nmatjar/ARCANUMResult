/**
 * OpenRouter API Integration dla panelu doradcy
 * 
 * Ten moduł zapewnia dostęp do różnych modeli AI poprzez OpenRouter.
 * Umożliwia analizę danych doradców i generowanie rekomendacji.
 */

// Funkcja do zapisywania logów do localStorage
const saveToLogFile = async (data, type = 'request', sessionInfo = null) => {
  try {
    // Zapisz timestamp
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      data,
      sessionInfo
    };
    
    // 1. Zapisz w localStorage 
    const logsKey = 'doradcy_panel_logs';
    const existingLogs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem(logsKey, JSON.stringify(existingLogs));
    
    // 2. Zapisz w dedykowanej sesji
    const sessionId = sessionInfo?.sessionId || `session-${Date.now()}`;
    const sessionLogsKey = `doradcy_session_logs_${sessionId}`;
    const sessionLogs = JSON.parse(localStorage.getItem(sessionLogsKey) || '{}');
    
    if (!sessionLogs.info) {
      sessionLogs.info = {
        sessionId,
        startTime: timestamp,
        mode: sessionInfo?.mode || 'unknown'
      };
    }
    
    if (!sessionLogs.entries) {
      sessionLogs.entries = [];
    }
    
    sessionLogs.entries.push(logEntry);
    sessionLogs.lastUpdated = timestamp;
    
    localStorage.setItem(sessionLogsKey, JSON.stringify(sessionLogs));
    
    // Dodaj identyfikator sesji do listy aktywnych sesji
    const sessionsKey = 'doradcy_active_sessions';
    const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    if (!sessions.includes(sessionId)) {
      sessions.push(sessionId);
      localStorage.setItem(sessionsKey, JSON.stringify(sessions));
    }
    
    // 3. Loguj do konsoli z timestampem
    console.log(`[${timestamp}] DORADCY-PANEL ${type.toUpperCase()}:`, data);
    
    return true;
  } catch (error) {
    console.error('Failed to save log:', error);
    return false;
  }
};

// Funkcja dostępna publicznie do eksportu logów
export const exportLogs = (sessionId = null) => {
  try {
    if (sessionId) {
      const sessionLogsKey = `doradcy_session_logs_${sessionId}`;
      const sessionLogs = JSON.parse(localStorage.getItem(sessionLogsKey) || '{}');
      
      if (!sessionLogs.entries || sessionLogs.entries.length === 0) {
        return { success: false, message: 'Brak logów dla tej sesji' };
      }
      
      // Formatuj logi
      const formattedLogs = `# Panel Doradcy - Logi sesji: ${sessionId}\n` +
        `Data rozpoczęcia: ${sessionLogs.info?.startTime || 'brak danych'}\n` +
        `Tryb analizy: ${sessionLogs.info?.mode || 'nieokreślony'}\n\n` +
        sessionLogs.entries.map(log => 
          `[${log.timestamp}] ${log.type.toUpperCase()}\n${
            typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)
          }\n${'-'.repeat(80)}\n`
        ).join('\n');
      
      // Twórz link do pobrania pliku
      const blob = new Blob([formattedLogs], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `doradcy_panel_session_${sessionId.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, message: `Logi sesji ${sessionId} zostały wyeksportowane` };
    } 
    else {
      // Eksportuj wszystkie logi
      const sessions = JSON.parse(localStorage.getItem('doradcy_active_sessions') || '[]');
      
      if (sessions.length > 0) {
        const sessionLogs = sessions.map(sid => {
          const key = `doradcy_session_logs_${sid}`;
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          return {
            sessionId: sid,
            info: data.info || {},
            entries: data.entries || []
          };
        });
        
        // Formatuj wszystkie sesje razem
        const formattedLogs = sessionLogs.map(session => 
          `# Panel Doradcy - Logi sesji: ${session.sessionId}\n` +
          `Data rozpoczęcia: ${session.info?.startTime || 'brak danych'}\n` +
          `Tryb analizy: ${session.info?.mode || 'nieokreślony'}\n\n` +
          (session.entries.map(log => 
            `[${log.timestamp}] ${log.type.toUpperCase()}\n${
              typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)
            }\n${'-'.repeat(80)}\n`
          ).join('\n') || 'Brak logów w tej sesji')
        ).join('\n\n' + '='.repeat(100) + '\n\n');
        
        // Twórz link do pobrania pliku
        const blob = new Blob([formattedLogs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `doradcy_panel_all_sessions_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return { success: true, message: `Logi wszystkich sesji (${sessions.length}) zostały wyeksportowane` };
      }
      else {
        const logs = JSON.parse(localStorage.getItem('doradcy_panel_logs') || '[]');
        if (logs.length === 0) {
          return { success: false, message: 'Brak logów do eksportu' };
        }
        
        // Formatuj logi w czytelny sposób
        const formattedLogs = logs.map(log => 
          `[${log.timestamp}] ${log.type.toUpperCase()}\n${
            typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)
          }\n${'-'.repeat(80)}\n`
        ).join('\n');
        
        // Twórz link do pobrania pliku
        const blob = new Blob([formattedLogs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `doradcy_panel_logs_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return { success: true, message: 'Logi zostały wyeksportowane' };
      }
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    return { success: false, message: `Błąd podczas eksportu: ${error.message}` };
  }
};

// Wyczyść logi
export const clearLogs = (sessionId = null) => {
  // Jeśli określono sessionId, wyczyść tylko tę sesję
  if (sessionId) {
    const sessionLogsKey = `doradcy_session_logs_${sessionId}`;
    localStorage.removeItem(sessionLogsKey);
    
    // Usuń również tę sesję z listy aktywnych
    const sessionsKey = 'doradcy_active_sessions';
    const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    const updatedSessions = sessions.filter(sid => sid !== sessionId);
    localStorage.setItem(sessionsKey, JSON.stringify(updatedSessions));
    
    return { success: true, message: `Logi sesji ${sessionId} zostały wyczyszczone` };
  }
  
  // W przeciwnym razie wyczyść wszystkie logi
  localStorage.removeItem('doradcy_panel_logs');
  
  // Wyczyść wszystkie sesje
  const sessionsKey = 'doradcy_active_sessions';
  const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
  
  // Usuń logi każdej sesji
  sessions.forEach(sid => {
    const sessionLogsKey = `doradcy_session_logs_${sid}`;
    localStorage.removeItem(sessionLogsKey);
  });
  
  // Wyczyść listę aktywnych sesji
  localStorage.removeItem(sessionsKey);
  
  return { success: true, message: 'Wszystkie logi zostały wyczyszczone' };
};

// Główna funkcja do komunikacji z OpenRouter API
export const callOpenRouterAPI = async (prompt, model = "anthropic/claude-3.7-sonnet", systemPrompt = "", sessionInfo = null) => {
  // Start a new console group for the API call
  console.group('📡 DORADCY PANEL OPENROUTER API REQUEST');
  
  // Generuj unikalne ID sesji, jeśli nie zostało podane
  const currentSessionId = sessionInfo?.sessionId || `session-${Date.now()}`;
  console.log('Request session ID:', currentSessionId);
  
  // Log request parameters
  console.log('Target model:', model);
  console.log('Mode:', sessionInfo?.mode || 'unknown');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Temperature:', 0.2); // Nieco wyższa temperatura dla kreatywnych sugestii
  console.log('Max tokens:', 4000);

  // Przygotuj dane zapytania
  let messages = [];
  
  // Dodaj system prompt jako pierwszą wiadomość
  messages.push({
    role: "system",
    content: systemPrompt || `Jesteś specjalistycznym asystentem do analizy danych doradców zawodowych.
             Twoje zadanie to analizować dane doradców i udzielać spersonalizowanych rekomendacji.
             Odpowiadaj w formacie JSON zgodnie z wymaganiami trybu.
             Twoje analizy powinny być profesjonalne, konstruktywne i skupione na rozwoju.`
  });
  
  // Jeśli przekazano historię konwersacji, użyj jej
  if (sessionInfo?.messages && Array.isArray(sessionInfo.messages) && sessionInfo.messages.length > 0) {
    console.log('Using conversation history with', sessionInfo.messages.length, 'messages');
    // Użyj istniejącej historii konwersacji
    messages = [...messages, ...sessionInfo.messages.slice(0, -1)]; // Dodaj wszystkie wiadomości oprócz ostatniej
  }
  
  // Dodaj aktualne zapytanie jako ostatnią wiadomość użytkownika
  messages.push({
    role: "user",
    content: prompt
  });
  
  // Oszacuj liczbę tokenów
  let totalWords = 0;
  messages.forEach(msg => {
    totalWords += msg.content.split(/\s+/).length;
  });
  const estimatedTokens = Math.round(totalWords * 1.3);
  console.log('Estimated input tokens:', estimatedTokens);
  console.log('Total messages:', messages.length);
  
  // Utwórz dane zapytania
  const requestData = {
    model,
    messages,
    max_tokens: 4000,
    temperature: 0.2
  };
  
  console.log('System prompt length:', requestData.messages[0].content.length);
  console.log('User prompt length:', prompt.length);

  // Zapisz zapytanie do logów
  await saveToLogFile({
    model,
    systemPrompt: requestData.messages[0].content,
    userPrompt: prompt
  }, 'request', {
    sessionId: currentSessionId,
    mode: sessionInfo?.mode || 'unknown',
    timestamp: new Date().toISOString()
  });
  
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Panel Doradcy"
      },
      body: JSON.stringify(requestData)
    });

    console.log('Response status:', response.status, response.statusText);
    console.log('Response received at:', new Date().toISOString());
    
    if (!response.ok) {
      console.error('API ERROR RESPONSE:');
      console.log('HTTP status:', response.status, response.statusText);
      
      let errorData;
      try {
        errorData = await response.json();
        console.log('Error response body:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON:', e);
        errorData = { error: { message: "Nie można zdekodować odpowiedzi błędu z API" } };
      }
      
      // Create a more specific error message based on the status code
      let errorMessage;
      if (response.status === 401 || response.status === 403) {
        errorMessage = `Problem z autoryzacją API (błąd ${response.status}): Klucz API może być nieprawidłowy lub wygasły.`;
      } else if (response.status === 429) {
        errorMessage = `Przekroczono limit zapytań API (błąd ${response.status}): Zbyt wiele zapytań w krótkim czasie.`;
      } else if (response.status >= 500) {
        errorMessage = `Błąd serwera OpenRouter (błąd ${response.status}): Serwis może być tymczasowo niedostępny.`;
      } else {
        errorMessage = `Błąd API (${response.status}): ${errorData.error?.message || response.statusText}`;
      }
      
      console.error('Full error details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        timestamp: new Date().toISOString()
      });
      
      // Zapisz błąd do logów
      await saveToLogFile({
        error: errorMessage,
        status: response.status,
        details: errorData
      }, 'error', {
        sessionId: currentSessionId,
        mode: sessionInfo?.mode || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      console.groupEnd();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log key response metadata
    const responseMetadata = {
      model: data.model || model,
      object: data.object || 'unknown',
      created: data.created ? new Date(data.created * 1000).toISOString() : 'unknown',
      choicesCount: data.choices?.length || 0,
      responseTime: new Date().toISOString()
    };
    
    console.log('Response metadata:', responseMetadata);
    
    // Check for usage information
    if (data.usage) {
      console.log('Token usage:', {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      });
    }
    
    let responseContent = null;
    
    if (data.choices && data.choices.length > 0) {
      console.log('Choices found:', data.choices.length);
      
      if (data.choices[0].message && data.choices[0].message.content) {
        responseContent = data.choices[0].message.content;
      } else if (data.choices[0].content) {
        responseContent = data.choices[0].content;
      } else {
        console.error('Could not locate content in response choices:', data.choices[0]);
      }
    } else {
      console.error('No choices array found in response');
    }
    
    if (responseContent) {
      // Log content length
      console.log('Response content length:', responseContent.length, 'characters');
      console.log('Content preview:', responseContent.substring(0, 100) + '...');
      
      // Zapisz odpowiedź do logów z tym samym ID sesji
      await saveToLogFile({
        model,
        response: responseContent,
      }, 'response', {
        sessionId: currentSessionId,
        mode: sessionInfo?.mode || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      console.log('Response saved to logs successfully');
      console.groupEnd();
      
      return responseContent;
    }
    
    // Handle unexpected structure with graceful fallback
    console.error('UNEXPECTED RESPONSE FORMAT:');
    console.log('Expected to find content in the response but received an unexpected format');
    
    if (data.error) {
      console.error('Error object found in response:', data.error);
      const errorMessage = `API error: ${data.error.message || 'Unknown API error'}`;
      
      // Zapisz błąd do logów
      await saveToLogFile({
        error: errorMessage,
        details: data
      }, 'error', {
        sessionId: currentSessionId,
        mode: sessionInfo?.mode || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      console.groupEnd();
      throw new Error(errorMessage);
    }
    
    console.error('Completely unexpected API response structure:', data);
    console.log('Top-level keys:', Object.keys(data));
    
    // Zapisz błąd do logów
    await saveToLogFile({
      error: 'Unexpected API response structure',
      details: data
    }, 'error', {
      sessionId: currentSessionId,
      mode: sessionInfo?.mode || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    console.groupEnd();
    throw new Error('Unexpected API response structure. Check console for details.');

  } catch (error) {
    console.error('OPENROUTER API CALL FAILED:', error);
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error occurred at:', new Date().toISOString());
    
    // Check network-related errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Network error detected. Possible causes:');
      console.log('- No internet connection');
      console.log('- OpenRouter API is down');
      console.log('- CORS issues');
      console.log('- Firewall blocking the request');
    }
    
    // Check for timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      console.error('Request timeout detected. Possible causes:');
      console.log('- OpenRouter API is slow or unresponsive');
      console.log('- Request was too large');
      console.log('- Network latency issues');
    }
    
    // Zapisz błąd do logów, jeśli jeszcze nie został zapisany
    if (!error.message.includes('API error')) {
      await saveToLogFile({
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack
      }, 'error', {
        sessionId: currentSessionId,
        mode: sessionInfo?.mode || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
    
    console.groupEnd();
    throw error;
  }
};

// Pobierz dostępne modele
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