import React, { useState, useEffect, useRef } from 'react';
import { getAvailableModels } from '../utils/openRouterApi.js';
import { useUserContext } from '../contexts/UserContext';
import '../assets/styles/ChatLLM.css';

const ChatLLM = ({ personData, analysisData, onClose }) => {
  const { sendChatMessage } = useUserContext(); // Pobieramy funkcję z kontekstu
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.7-sonnet');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [sessionId] = useState(`chat-${Date.now()}`);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [isSimplifyingForClient, setIsSimplifyingForClient] = useState(false);
  
  // Zestaw gotowych pytań do szybkiego wyboru
  const quickQuestions = [
    "Jakie zawody najlepiej pasują do mojego profilu na podstawie moich umiejętności?",
    "Jakie są moje mocne strony wynikające z typu osobowości?",
    "Jakie obszary rozwoju zawodowego sugerujesz dla mnie?",
    `Czy kariera w ${personData.sektor || 'IT'} pasuje do mojego profilu?`,
    "Jakie umiejętności miękkie warto rozwijać w mojej sytuacji?",
    "Jakie środowisko pracy będzie dla mnie najlepsze?",
    "Jak najlepiej wykorzystać moje naturalne predyspozycje w karierze?",
    `Jak przejść z ${personData.obecnaPraca || 'obecnej pracy'} do ${personData.docelowaPraca || 'wymarzonej kariery'}?`,
    "Jakie kursy lub szkolenia mogą być przydatne dla mojego rozwoju zawodowego?",
    "Jak przygotować się do rozmowy kwalifikacyjnej z moimi umiejętnościami?",
    "Jakie strategie rozwoju zawodowego sugerujesz dla mnie?",
    "Jak budować swoją markę osobistą w mojej branży?"
  ];

  // Pobierz dostępne modele
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await getAvailableModels();
        setModels(availableModels);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Nie udało się pobrać listy dostępnych modeli.');
      }
    };
    
    fetchModels();
  }, []);
  
  // Obsługa klawisza Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  // Obsługa kliknięcia poza komponentem
  const chatRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        onClose && onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Automatyczne przewijanie do najnowszej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Przygotuj systemowy prompt z danymi osoby
  const getSystemPrompt = () => {
    let systemPrompt = `Jesteś asystentem kariery, który pomaga użytkownikom w rozwoju zawodowym.
Masz być pomocny, praktyczny i dostosowywać swoje porady do konkretnej sytuacji użytkownika.
Twoje odpowiedzi powinny być konkretne, przystępne i działać w interesie użytkownika.
`;

    // Dodaj dane osoby
    if (personData) {
      systemPrompt += `\nDane użytkownika:
- Imię: ${personData.name || 'Użytkownik'}
${personData.wiek ? `- Wiek: ${personData.wiek}` : ''}
${personData.plec ? `- Płeć: ${personData.plec}` : ''}
${personData.etapKariery ? `- Etap kariery: ${personData.etapKariery}` : ''}
${personData.zainteresowania ? `- Zainteresowania: ${personData.zainteresowania}` : ''}
${personData.obecnaPraca ? `- Obecna praca: ${personData.obecnaPraca}` : ''}
${personData.docelowaPraca ? `- Docelowa praca: ${personData.docelowaPraca}` : ''}
${personData.edukacja ? `- Edukacja/wykształcenie: ${personData.edukacja}` : ''}
${personData.umiejetnosci ? `- Umiejętności: ${personData.umiejetnosci}` : ''}
${personData.sektor ? `- Preferowany sektor pracy: ${personData.sektor}` : ''}
${personData.pracaLudzie ? `- Preferencje pracy z ludźmi: ${personData.pracaLudzie}` : ''}
${personData.miejscePracy ? `- Preferowane miejsce pracy: ${personData.miejscePracy}` : ''}
${personData.opisTypu ? `- Opis profilu: ${personData.opisTypu}` : ''}
${personData.czynniki ? `- Podsumowanie profilu: ${personData.czynniki}` : ''}
${personData.czynnikiPelne ? `- Szczegółowy opis profilu: ${personData.czynnikiPelne}` : ''}
`;
    }

    // Dodaj dane analizy jeśli są dostępne
    if (analysisData && 
        (analysisData.podstawowePozytywne?.length > 0 || 
         analysisData.podstawoweNegatywne?.length > 0 || 
         analysisData.dodatkowePozytywne?.length > 0 || 
         analysisData.dodatkoweNegatywne?.length > 0)) {
      
      systemPrompt += `\nSzczegółowa analiza profilu:
- Główne mocne strony: ${analysisData.podstawowePozytywne?.map(f => `${f.name} (wartość: ${f.plusCount})`).join(', ') || 'brak'}
- Główne wyzwania: ${analysisData.podstawoweNegatywne?.map(f => `${f.name} (wartość: ${f.minusCount})`).join(', ') || 'brak'}
- Dodatkowe mocne strony: ${analysisData.dodatkowePozytywne?.map(f => `${f.name} (wartość: ${f.plusCount})`).join(', ') || 'brak'}
- Dodatkowe wyzwania: ${analysisData.dodatkoweNegatywne?.map(f => `${f.name} (wartość: ${f.minusCount})`).join(', ') || 'brak'}
`;
    }

    // Dodaj objaśnienie czynników
    systemPrompt += `
### System Czynników BBT - Objaśnienie

### Czynniki Prymarne
Czynniki prymarne (oznaczane wielkimi literami) reprezentują główne skłonności i potrzeby:

- **W**: Kontakt fizyczny, miękkość, potrzeba bliskości i dotyku
- **K**: Siła fizyczna, wytrzymałość, twardość
- **S**: Aspekt społeczny, potrzeba pomocy innym
- **Z**: Estetyka, prezentacja, potrzeba pokazywania
- **V**: Inteligencja, logika, potrzeba jasności myślenia
- **G**: Duchowość, intuicja, twórcza wyobraźnia
- **M**: Materia, praktyczność, skupienie na konkretach
- **O**: Oralność, komunikacja werbalna, potrzeba ekspresji

### Czynniki Sekundarne
Czynniki sekundarne (oznaczane małymi literami) reprezentują wspierające tendencje:

- **w**: Zdolność do delikatnego i wrażliwego podejścia, wspierająca empatia
- **k**: Praktyczne zastosowanie siły, zdolność do wytrwałego działania
- **s**: Wspierająca tendencja do działań społecznych, pomocniczość
- **z**: Wrażliwość na piękno w codziennych działaniach, estetyka praktyczna
- **v**: Praktyczne zastosowanie myślenia logicznego, analityczne podejście
- **g**: Wspierająca rola intuicji, kreatywne podejście do problemów
- **m**: Praktyczne podejście w zadaniach, koncentracja na szczegółach
- **o**: Wspierająca rola komunikacji, zdolność wyrażania myśli

### Czynniki Intensyfikowane
Czynniki intensyfikowane (z apostrofem) reprezentują wysoki poziom rozwinięcia danej cechy:

- **V'**: Zaawansowane myślenie systemowe i strategiczne, zdolność do kompleksowej analizy i syntezy
- **G'**: Rozwinięta kreatywność konceptualna i wizjonerskie myślenie, innowacyjność na wysokim poziomie
- **Z'**: Pogłębione rozumienie zasad estetyki, wyrafinowany gust i zdolność tworzenia
- **S'**: Pogłębione zrozumienie dynamiki społecznej, przywództwo i charyzma społeczna
`;

    systemPrompt += `
Twoim zadaniem jest pomóc w interpretacji wyników testu i odpowiadać na pytania dotyczące predyspozycji zawodowych osoby.
Odpowiedzi powinny być:
1. Konkretne i merytoryczne
2. Oparte na danych z testu i objaśnieniu czynników powyżej
3. Uwzględniające kontekst osoby (wiek, etap kariery itp.)
4. Przedstawiające zarówno mocne strony jak i obszary do rozwoju
5. Dostosowane do zadanego pytania i kontekstu rozmowy

ABSOLUTNY ZAKAZ używania nazw czynników BBT (takich jak 'W', 'K', 'S', 'Z', 'V', 'G', 'M', 'O' czy ich warianty z apostrofem lub małych liter) w komunikacji! 
Zamiast tego zawsze tłumacz czynniki na konkretne cechy i predyspozycje używając przystępnego, niespecjalistycznego języka.

Przykłady prawidłowego tłumaczenia:
- Zamiast "W6" → "Masz silną potrzebę kontaktu i bliskości z innymi"
- Zamiast "K-4" → "Możesz czuć dyskomfort w sytuacjach wymagających fizycznej siły"
- Zamiast "G+" → "Twoja kreatywność i intuicja to mocne strony"
- Zamiast "v-" → "Możesz preferować bardziej praktyczne podejście niż czysto analityczne"

Wszystkie odpowiedzi formułuj bezpośrednio do osoby w drugiej osobie liczby pojedynczej.
Używaj krótkich akapitów (2-3 zdania), prostego języka i przykładów z codziennego życia.

Nie wymyślaj danych, których nie ma w kontekście. Jeśli brakuje informacji, możesz to zaznaczyć i zapytać.`;

    return systemPrompt;
  };

  // Wysyłanie wiadomości
  const sendMessage = async (customInput = null) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim() || isLoading) return;
    
    // Dodaj wiadomość użytkownika
    const userMessage = { role: 'user', content: messageToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!customInput) setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Przygotuj historię konwersacji w formacie dla OpenRouter API
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Wywołaj API z pełną historią konwersacji - używamy funkcji z kontekstu, która obsłuży pobieranie energii
      const responseContent = await sendChatMessage(
        messageToSend,
        selectedModel,
        getSystemPrompt(),
        { 
          sessionId, 
          mode: 'chat',
          messages: conversationHistory  // Przekazanie całej historii konwersacji
        }
      );
      
      // Dodaj odpowiedź asystenta
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
      
      // Reset stanu upraszczania
      if (isSimplifyingForClient) {
        setIsSimplifyingForClient(false);
      }
    } catch (err) {
      console.error('Error calling API:', err);
      setError(`Błąd: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ta funkcjonalność została wyłączona, ponieważ wszystkie odpowiedzi są teraz dopasowane do klienta
  // Zachowujemy pustą funkcję, aby uniknąć błędów w istniejącym kodzie
  const simplifyForClient = async () => {
    // Funkcja wyłączona - wszystkie odpowiedzi są teraz w języku zrozumiałym dla klienta
    return;
  };

  // Obsługa wciśnięcia Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Kopiowanie wiadomości do schowka
  const copyMessageToClipboard = (content, index) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedMessageId(index);
        setShowCopySuccess(true);
        
        // Ukryj komunikat po 2 sekundach
        setTimeout(() => {
          setShowCopySuccess(false);
          setTimeout(() => setCopiedMessageId(null), 300);
        }, 2000);
      })
      .catch(err => {
        console.error('Nie udało się skopiować do schowka:', err);
        setError('Nie udało się skopiować do schowka');
      });
  };
  
  // Pobranie całej rozmowy jako plik
  const downloadConversation = () => {
    try {
      // Generuj treść pliku
      const today = new Date().toISOString().slice(0, 10);
      const header = `ROZMOWA Z ASYSTENTEM DORADCY ZAWODOWEGO\nData: ${today}\n\n`;
      
      // Dodaj informacje o osobie
      let personInfo = '';
      if (personData && personData.name) {
        personInfo = `DANE OSOBY:\n- Imię: ${personData.name}\n`;
        if (personData.wiek) personInfo += `- Wiek: ${personData.wiek}\n`;
        if (personData.plec) personInfo += `- Płeć: ${personData.plec}\n`;
        if (personData.etapKariery) personInfo += `- Etap kariery: ${personData.etapKariery}\n`;
        personInfo += '\n';
      }
      
      // Konwertuj wiadomości na tekst
      const messagesText = messages.map(msg => 
        `${msg.role === 'user' ? 'PYTANIE:' : 'ODPOWIEDŹ:'}\n${msg.content}\n\n${'='.repeat(50)}\n\n`
      ).join('');
      
      const content = header + personInfo + messagesText;
      
      // Utwórz plik do pobrania
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Utwórz nazwę pliku z datą i imieniem osoby badanej
      const fileName = `chat_doradca_${personData?.name ? personData.name.replace(/\s+/g, '_').toLowerCase() + '_' : ''}${today}.txt`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Błąd podczas zapisywania rozmowy:', err);
      setError('Nie udało się pobrać rozmowy jako pliku');
    }
  };

  return (
    <div className="chat-container" ref={chatRef}>
      <div className="chat-header">
        <h2>
          Asystent doradcy zawodowego
        </h2>
        <div className="chat-actions">
          <button 
            onClick={downloadConversation}
            disabled={messages.length === 0}
            className={`download-button ${messages.length === 0 ? 'disabled' : ''}`}
            title="Pobierz rozmowę jako plik"
          >
            <i className="fa-solid fa-download"></i>
            <span>Pobierz rozmowę</span>
          </button>
          <button 
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="model-selector-button"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Zmień model</span>
          </button>
          <button 
            onClick={onClose}
            className="close-button"
            title="Zamknij asystenta"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      </div>

      {showModelSelector && (
        <div className="model-selector">
          <label>
            Wybierz model AI:
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name || model.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <p>Zadaj pytanie dotyczące Twoich wyników testu lub predyspozycji zawodowych.</p>
              <p className="examples-label">Na przykład:</p>
              <ul className="examples-list">
                <li>"Jakie zawody najlepiej pasują do mojego profilu?"</li>
                <li>"Jakie są moje mocne strony wynikające z typu osobowości?"</li>
                <li>"Jakie obszary rozwoju zawodowego sugerujesz dla mnie?"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${
                  msg.role === 'user' 
                    ? msg.content.includes('Przetłumacz poniższą odpowiedź na prostszy język')
                      ? 'system-message hidden' // Ukryj systemowe wiadomości żądające uproszczenia
                      : 'user-message' 
                    : isSimplifyingForClient && index === messages.length - 1
                      ? 'simplified-message'
                      : 'assistant-message'
                }`}
              >
                <div className="message-header">
                  <div className="message-sender">
                    {msg.role === 'user' ? 
                  (msg.content.includes('Przetłumacz poniższą odpowiedź na prostszy język') ? 'System:' : 'Ty:') 
                  : (isSimplifyingForClient && index === messages.length - 1 ? 'Wersja dla klienta:' : 'Asystent:')}
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyMessageToClipboard(msg.content, index)}
                      className="copy-button"
                      title="Kopiuj do schowka"
                    >
                      {copiedMessageId === index ? (
                        <span className="copied">
                          <i className="fa-solid fa-check"></i>
                          Skopiowano
                        </span>
                      ) : (
                        <span>
                          <i className="fa-regular fa-copy"></i>
                          Kopiuj
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="chat-input-area">
{/* Przycisk do uproszczenia ostatniej odpowiedzi został usunięty, ponieważ wszystkie odpowiedzi są teraz w języku zrozumiałym dla klienta */}
        
        <div className="message-input-container">
          <div className="message-input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onClick={() => setShowQuickQuestions(false)}
              placeholder="Wpisz wiadomość lub wybierz gotowe pytanie..."
              className="message-input"
              rows="3"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="suggestions-button"
              title="Pokaż gotowe pytania"
            >
              <i className="fa-solid fa-lightbulb"></i>
              <span className="suggestion-text">Przykładowe pytania</span>
            </button>
            
            {showQuickQuestions && (
              <div className="quick-questions-dropdown">
                <div className="quick-questions-header">
                  Gotowe pytania (kliknij, aby użyć):
                </div>
                <div className="quick-questions-list">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      className="quick-question"
                      onClick={() => {
                        setInput(question);
                        setShowQuickQuestions(false);
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className={`send-button ${isLoading || !input.trim() ? 'disabled' : ''}`}
          >
            {isLoading ? 
              <i className="fa-solid fa-spinner fa-spin"></i> : 
              <i className="fa-solid fa-paper-plane"></i>
            }
            <span>{isLoading ? 'Wysyłanie...' : 'Wyślij'}</span>
          </button>
        </div>
        <div className="input-hint">
          <span>Naciśnij Shift+Enter, aby dodać nowy wiersz</span>
        </div>
      </div>
    </div>
  );
};

export default ChatLLM;