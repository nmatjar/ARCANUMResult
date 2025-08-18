import axios from 'axios';
import { getFeatureById } from '../config/featuresConfig';
import { getCareerDataByCode } from './airtableService';

/**
 * Funkcja zwracająca wyjaśnienie dla danego typu osobowości według systemu BBT
 * @param {string} personalityType - String z czynnikami BBT (np. "W4 K-2 S6 Z3...")
 * @returns {string} Wyjaśnienie typu osobowości BBT
 */
const getPersonalityTypeExplanation = (personalityType) => {
  // Opis czynników prymarnych BBT
  const primaryFactors = {
    'W': 'Kontakt fizyczny, miękkość, potrzeba bliskości i dotyku',
    'K': 'Siła fizyczna, wytrzymałość, twardość',
    'S': 'Aspekt społeczny, potrzeba pomocy innym',
    'Z': 'Estetyka, prezentacja, potrzeba pokazywania',
    'V': 'Inteligencja, logika, potrzeba jasności myślenia',
    'G': 'Duchowość, intuicja, twórcza wyobraźnia',
    'M': 'Materia, praktyczność, skupienie na konkretach',
    'O': 'Oralność, komunikacja werbalna, potrzeba ekspresji'
  };
  
  // Opis czynników sekundarnych BBT
  const secondaryFactors = {
    'w': 'Zdolność do delikatnego i wrażliwego podejścia, wspierająca empatia',
    'k': 'Praktyczne zastosowanie siły, zdolność do wytrwałego działania',
    's': 'Wspierająca tendencja do działań społecznych, pomocniczość',
    'z': 'Wrażliwość na piękno w codziennych działaniach, estetyka praktyczna',
    'v': 'Praktyczne zastosowanie myślenia logicznego, analityczne podejście',
    'g': 'Wspierająca rola intuicji, kreatywne podejście do problemów',
    'm': 'Praktyczne podejście w zadaniach, koncentracja na szczegółach',
    'o': 'Wspierająca rola komunikacji, zdolność wyrażania myśli'
  };
  
  // Opis czynników intensyfikowanych BBT
  const intensifiedFactors = {
    'V\'': 'Zaawansowane myślenie systemowe i strategiczne, zdolność do kompleksowej analizy i syntezy',
    'G\'': 'Rozwinięta kreatywność konceptualna i wizjonerskie myślenie, innowacyjność na wysokim poziomie',
    'Z\'': 'Pogłębione rozumienie zasad estetyki, wyrafinowany gust i zdolność tworzenia',
    'S\'': 'Pogłębione zrozumienie dynamiki społecznej, przywództwo i charyzma społeczna'
  };
  
  // Sprawdź, czy personalityType istnieje
  if (!personalityType || typeof personalityType !== 'string') {
    return 'Brak danych o typie osobowości lub nieprawidłowy format.';
  }
  
  // Znajdź wszystkie czynniki za pomocą wyrażenia regularnego
  // Obsługuje formaty: "G+ 6" lub "G'+ 5" lub "K- -6" lub "G-6" lub "G'-5"
  const factorRegex = /([A-Za-z]'?)(\+|\-)?\s*(-?\d+)/g;
  const matches = [...personalityType.matchAll(factorRegex)];
  
  if (matches.length === 0) {
    return 'Nie znaleziono czynników BBT w podanym formacie.';
  }
  
  // Podziel czynniki na prymarne, sekundarne i intensyfikowane
  const factorGroups = {
    primary: [],
    secondary: [],
    intensified: []
  };
  
  matches.forEach(match => {
    const [, factor, sign, valueStr] = match;
    let numValue = parseInt(valueStr, 10);
    
    // Upewnij się, że znak jest uwzględniony (jeśli wartość nie ma już znaku)
    if (sign === '-' && numValue > 0) {
      numValue = -numValue;
    }
    
    if (factor.includes('\'')) {
      // Czynnik intensyfikowany (np. V')
      if (intensifiedFactors[factor]) {
        factorGroups.intensified.push({
          factor,
          value: numValue,
          description: intensifiedFactors[factor]
        });
      }
    } else if (factor === factor.toUpperCase()) {
      // Czynnik prymarny (duża litera)
      if (primaryFactors[factor]) {
        factorGroups.primary.push({
          factor,
          value: numValue,
          description: primaryFactors[factor]
        });
      }
    } else if (factor === factor.toLowerCase()) {
      // Czynnik sekundarny (mała litera)
      if (secondaryFactors[factor]) {
        factorGroups.secondary.push({
          factor,
          value: numValue,
          description: secondaryFactors[factor]
        });
      }
    }
  });
  
  // Posortuj czynniki według wartości bezwzględnej (od największej do najmniejszej)
  const sortFactors = factors => factors.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  
  factorGroups.primary = sortFactors(factorGroups.primary);
  factorGroups.secondary = sortFactors(factorGroups.secondary);
  factorGroups.intensified = sortFactors(factorGroups.intensified);
  
  // Utwórz opis dla grupy czynników
  const createGroupDescription = (group, title, scale) => {
    if (group.length === 0) return '';
    
    return `
### ${title} (${scale})
${group.map(f => {
  const direction = f.value > 0 ? 'pozytywna' : 'negatywna';
  const strength = Math.abs(f.value);
  const intensity = 
    strength >= 7 ? 'bardzo wysoka' :
    strength >= 5 ? 'wysoka' :
    strength >= 3 ? 'umiarkowana' : 'niska';
  
  return `- **${f.factor}${f.value}**: ${f.description} - ${direction} preferencja o ${intensity} intensywności`;
}).join('\n')}
`;
  };
  
  // Utwórz pełny opis typu osobowości BBT
  const explanation = `
## Profil BBT - Szczegółowa Analiza Czynników

${createGroupDescription(factorGroups.primary, 'Czynniki Prymarne', 'skala od -8 do 8')}
${createGroupDescription(factorGroups.secondary, 'Czynniki Sekundarne', 'skala od -12 do 12')}
${createGroupDescription(factorGroups.intensified, 'Czynniki Intensyfikowane', 'skala od -8 do 8')}

### Implikacje Zawodowe
Ten profil BBT wskazuje na określone predyspozycje zawodowe i style pracy, które warto uwzględnić przy wyborze ścieżki kariery. Wysokie wartości pozytywne wskazują na naturalne zdolności i potrzeby, natomiast wartości negatywne mogą wskazywać na obszary wymagające rozwoju lub świadomego zarządzania.
`;

  return explanation;
};

// Environment configuration - easy to switch between local and production
export const ENV = {
  // Set to 'local' or 'production' to switch environments
  current: 'production'  // Change back to production
};

// API configuration for different environments
export const API_CONFIG = {
  local: {
    baseUrl: 'http://localhost:3001',
    url: 'http://localhost:3001/api/generate',
    model: 'google/gemini-2.0-flash-lite-001' // Domyślnie używamy Gemini
  },
  production: {
    baseUrl: 'https://career-api-production.up.railway.app',
    url: 'https://career-api-production.up.railway.app/api/generate',
    model: 'google/gemini-2.0-flash-lite-001' // Domyślnie używamy Gemini
  },
  // Helper function to get current environment config
  get current() {
    return this[ENV.current];
  }
};

/**
 * Wywołuje API serwera, które pośredniczy w komunikacji z Claude
 * @param {string} prompt - Prompt do Claude
 * @param {object} options - Dodatkowe opcje
 * @returns {Promise<object>} Odpowiedź z API
 */
export const callAPI = async (prompt, options = {}) => {
  try {
    console.log(`Wysyłanie zapytania do API (${ENV.current})...`);
    
    // Call the API server with all relevant parameters
    const response = await axios.post(API_CONFIG.current.url, {
      prompt,
      systemPrompt: options.systemPrompt || "Jesteś ekspertem w doradztwie zawodowym, który pomaga użytkownikom znaleźć najlepszą ścieżkę kariery na podstawie ich profilu.",
      maxTokens: options.maxTokens || 1024,
      temperature: options.temperature || 0.7,
      generateImage: options.generateImage || false,
      imagePrompt: options.imagePrompt || null,
      model: options.model || API_CONFIG.current.model // Umożliwia wybór modelu per zapytanie
    });
    
    return {
      success: true,
      content: response.data.content,
      imageUrl: response.data.imageUrl || null,
      imageAttribution: response.data.imageAttribution || null
    };
  } catch (error) {
    console.error('Błąd podczas wywołania API:', error);
    throw error;
  }
};

/**
 * Weryfikuje kod testu kariery (sprawdza w Airtable)
 * @param {string} code - Kod do weryfikacji
 * @returns {Promise<object>} Wynik weryfikacji z danymi użytkownika
 */
export const verifyCareerCode = async (code) => {
  try {
    // Próba pobrania danych z Airtable
    const userData = await getCareerDataByCode(code);
    
    if (userData) {
      return {
        success: true,
        message: 'Kod zweryfikowany pomyślnie',
        userData
      };
    } else {
      return {
        success: false,
        message: 'Nieprawidłowy kod. Sprawdź i spróbuj ponownie.'
      };
    }
  } catch (error) {
    console.error('Błąd podczas weryfikacji kodu:', error);
    return {
      success: false,
      message: 'Wystąpił błąd podczas weryfikacji kodu. Spróbuj ponownie później.'
    };
  }
};

/**
 * Przygotowuje prompt na podstawie szablonu i danych użytkownika
 * @param {string} promptTemplate - Szablon promptu
 * @param {object} userData - Dane użytkownika
 * @returns {string} Gotowy prompt
 */
const preparePrompt = (promptTemplate, userData) => {
  if (!userData) {
    console.warn('preparePrompt: Brak danych użytkownika!');
    return promptTemplate;
  }
  
  let prompt = promptTemplate;
  console.log('Template przed wypełnieniem:', prompt.substring(0, 100) + '...');
  
  // Zastąp wszystkie zmienne w szablonie promptu
  Object.entries(userData).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    const before = prompt;
    const safeValue = value !== null && value !== undefined ? String(value) : '';
    prompt = prompt.replace(regex, safeValue);
    
    // Sprawdź, czy nastąpiła zmiana (czy zmienna została zastąpiona)
    if (before !== prompt) {
      let displayValue = '(pusta)';
      if (value !== null && value !== undefined) {
        displayValue = typeof value === 'string' 
          ? value.substring(0, 30) + (value.length > 30 ? '...' : '') 
          : String(value);
      }
      console.log(`Zmienna {${key}} zastąpiona wartością: ${displayValue}`);
    }
  });
  
  // Sprawdź, czy zostały jakieś niezastąpione zmienne
  const unreplacedVariables = (prompt.match(/{[a-zA-Z0-9_]+}/g) || []);
  if (unreplacedVariables.length > 0) {
    console.warn('Niezastąpione zmienne w prompcie:', unreplacedVariables);
  }
  
  return prompt;
};

/**
 * Generuje treść na podstawie typu funkcji i kodu użytkownika
 * @param {string} featureType - Typ funkcji (future, studies, activities, workplace, creative)
 * @param {string} userCode - Kod użytkownika
 * @param {object} userData - Dane użytkownika z Airtable
 * @returns {Promise<object>} Wygenerowana treść
 */
export const generateContent = async (featureType, userCode, userData = null) => {
  try {
    // Pobierz konfigurację funkcji
    const feature = getFeatureById(featureType);
    
    if (!feature) {
      throw new Error(`Nieznany typ funkcji: ${featureType}`);
    }
    
    // Jeśli nie mamy danych użytkownika, pobierz je jeszcze raz
    console.log(`Generowanie treści dla funkcji: ${featureType}, kod użytkownika: ${userCode}`);
    let userInfo;
    
    if (userData) {
      console.log('Używam przekazanych danych użytkownika');
      userInfo = userData;
    } else {
      console.log('Pobieranie danych użytkownika z Airtable...');
      userInfo = await getCareerDataByCode(userCode);
      console.log('Dane użytkownika pobrane:', userInfo ? 'Sukces' : 'Brak danych');
    }
    
    if (!userInfo) {
      throw new Error('Nie można pobrać danych użytkownika');
    }
    
    // Log dostępnych pól w danych użytkownika
    console.log('Dostępne pola w danych użytkownika:', Object.keys(userInfo));
    console.log('Przykładowe wartości:');
    console.log('- name:', userInfo.name);
    console.log('- personality_type:', userInfo.personality_type);
    console.log('- skills:', userInfo.skills?.substring(0, 50) + '...');
    console.log('- interests:', userInfo.interests?.substring(0, 50) + '...');
    
    // Przygotuj dane dodatkowe z profilu jeśli istnieją
    let additionalData = {};
    if (userInfo.additional) {
      try {
        const parsedAdditional = typeof userInfo.additional === 'string' 
          ? JSON.parse(userInfo.additional) 
          : userInfo.additional;
        
        // Dołącz informacje z profilu rozszerzonego jeśli istnieją
        if (parsedAdditional.profile_extensions) {
          // Utwórz kolekcję wszystkich elementów z rozszerzonego profilu
          const extensionItems = {};
          
          Object.entries(parsedAdditional.profile_extensions).forEach(([key, value]) => {
            if (value && value.items && Array.isArray(value.items)) {
              extensionItems[key] = value.items.map(item => item.content).join(', ');
            }
          });
          
          console.log('Dodatkowe informacje z profilu rozszerzonego:', extensionItems);
          
          // Dodaj jako dodatkowe dane do userInfo
          userInfo = {
            ...userInfo,
            ...extensionItems,
            profile_completion: parsedAdditional.meta?.completion_rate || 0
          };
        }
      } catch (error) {
        console.error('Błąd podczas parsowania danych dodatkowych:', error);
      }
    }
    
    // Dodaj dane interpretacyjne dla czynników osobowości BBT
    if (userInfo.complete_factors) {
      // Użyj pełnego zestawu czynników BBT z pola complete_factors
      userInfo.personality_explanation = getPersonalityTypeExplanation(userInfo.complete_factors);
      console.log("Dodano szczegółową analizę czynników BBT");
    } else if (userInfo.personality_type) {
      // Fallback do podstawowych czynników, jeśli nie ma pełnego zestawu
      userInfo.personality_explanation = getPersonalityTypeExplanation(userInfo.personality_type);
      console.log("Dodano podstawową analizę czynników BBT");
    }
    
    // Przygotuj prompt na podstawie szablonu i wzbogaconych danych użytkownika
    const prompt = preparePrompt(feature.promptTemplate, userInfo);
    
    // Określ systemową wiadomość na podstawie funkcji
    let systemPromptText = `Jesteś ekspertem w doradztwie zawodowym specjalizującym się w ${feature.title.toLowerCase()}. 
    Twoje zadanie to udzielenie spersonalizowanej i szczegółowej odpowiedzi na podstawie profilu użytkownika.
    
    FORMAT ODPOWIEDZI:
    Zawsze formatuj swoją odpowiedź jako Markdown, używając następujących zasad:
    1. Użyj nagłówka ## dla głównych sekcji
    2. Użyj nagłówka ### dla podsekcji
    3. Używaj list wypunktowanych (- ) dla punktów i przykładów
    4. Używaj **pogrubienia** dla kluczowych terminów i ważnych informacji
    5. Podziel odpowiedź na logiczne sekcje z odpowiednimi nagłówkami
    6. Używaj krótkich akapitów (maksymalnie 3-4 zdania)
    7. Na końcu dodaj sekcję ## Podsumowanie z 3-5 kluczowymi punktami
    
    Twoja odpowiedź powinna być profesjonalna, pozytywna i wzmacniająca, ale też praktyczna i konkretna.`;
    
    // Dodaj analizę czynników BBT, jeśli jest dostępna
    if (userInfo.personality_explanation) {
      systemPromptText += `\n\n### Analiza Czynników BBT Użytkownika\n${userInfo.personality_explanation}\n\n`;
      systemPromptText += `
Pamiętaj, że komunikujesz się bezpośrednio z użytkownikiem, który czyta Twoją analizę na swój temat. 
Zwracaj się do użytkownika w drugiej osobie (Ty, Twój, Twoje), a nie jako "badany" czy "klient".

Przykłady właściwego stylu komunikacji:
- "Jakie zawody najlepiej pasują do mojego profilu na podstawie moich umiejętności?"
- "Jakie są moje mocne strony wynikające z typu osobowości?"
- "Jakie obszary rozwoju zawodowego sugerujesz dla mnie?"
- "Czy kariera w IT pasuje do mojego profilu?"
- "Jakie umiejętności miękkie warto rozwijać w mojej sytuacji?"
- "Jakie środowisko pracy będzie dla mnie najlepsze?"
- "Jak najlepiej wykorzystać moje naturalne predyspozycje w karierze?"
- "Jak przejść z obecnej pracy do wymarzonej kariery?"
- "Jakie kursy lub szkolenia mogą być przydatne dla mojego rozwoju zawodowego?"
- "Jak przygotować się do rozmowy kwalifikacyjnej z moimi umiejętnościami?"
- "Jakie strategie rozwoju zawodowego sugerujesz dla mnie?"
- "Jak budować swoją markę osobistą w mojej branży?"

Unikaj zwrotów typu "badany wykazuje", "klient powinien" czy "osoba o takim profilu".
`;
      console.log("Dodano analizę BBT i instrukcje dotyczące stylu komunikacji do systemPrompt");
    }
    
    let result;
    let imageUrl = null;
    
    // Prepare image prompt if this feature uses image generation
    let imagePrompt = null;
    if (feature.useImageGeneration && feature.imagePrompt) {
      // Clean user data to avoid empty or undefined values in image prompt
      const cleanUserInfo = { ...userInfo };
      Object.keys(cleanUserInfo).forEach(key => {
        if (!cleanUserInfo[key] || cleanUserInfo[key] === 'undefined' || cleanUserInfo[key] === 'null') {
          // Provide fallback values for empty fields
          switch(key) {
            case 'gender':
              cleanUserInfo[key] = 'professional person';
              break;
            case 'age':
              cleanUserInfo[key] = '30';
              break;
            case 'work_style':
              cleanUserInfo[key] = 'balanced';
              break;
            case 'personality_type':
              cleanUserInfo[key] = 'balanced personality type';
              break;
            case 'interests':
              cleanUserInfo[key] = 'professional development';
              break;
            case 'target_job':
              cleanUserInfo[key] = 'career field';
              break;
            case 'work_environment_features':
              cleanUserInfo[key] = 'comfortable workspace';
              break;
            case 'physical_effort':
              cleanUserInfo[key] = 'moderate';
              break;
            case 'digital_skills':
              cleanUserInfo[key] = 'modern technology';
              break;
            default:
              cleanUserInfo[key] = '';
          }
        }
      });
      
      imagePrompt = preparePrompt(feature.imagePrompt, cleanUserInfo);
      console.log('Prepared image prompt with cleaned data:', imagePrompt);
    }
    
    // Dodaj instrukcje, aby zawsze używać prostego języka dla klienta
    systemPromptText += `\n\nBARDZO WAŻNE: Zawsze komunikuj się w prostym, zrozumiałym języku! Tłumacz wszystko na język przystępny dla osoby bez specjalistycznej wiedzy z zakresu psychologii czy doradztwa zawodowego.

ABSOLUTNY ZAKAZ używania nazw czynników BBT (takich jak 'W', 'K', 'S', 'Z', 'V', 'G', 'M', 'O' czy ich warianty z apostrofem lub małych liter). Zamiast tego zawsze opisuj konkretne cechy, predyspozycje i umiejętności w sposób opisowy, np.:
- Zamiast "W6" → "Masz silną potrzebę kontaktu i bliskości z innymi"
- Zamiast "K-4" → "Możesz czasem czuć dyskomfort w sytuacjach wymagających fizycznej siły lub wytrzymałości"
- Zamiast "G+" → "Twoja kreatywność i intuicja to mocne strony"

Wszystkie odpowiedzi kieruj bezpośrednio do osoby w drugiej osobie liczby pojedynczej (Ty, Twój, Twoje).

Podziel odpowiedź na krótkie akapity (maksymalnie 2-3 zdania). Używaj prostych zdań, unikaj żargonu i terminologii specjalistycznej. Wykorzystuj analogie i przykłady z codziennego życia, aby wyjaśnić złożone koncepcje.`;
    
    // Wywołaj API dla treści tekstowej i ewentualnie obrazu
    result = await callAPI(prompt, {
      systemPrompt: systemPromptText,
      temperature: 0.7,
      maxTokens: 1500,
      generateImage: !!feature.useImageGeneration,
      imagePrompt: imagePrompt,
      model: feature.preferredModel || API_CONFIG.current.model // Użyj modelu preferowanego dla funkcji lub domyślnego (Gemini)
    });
    
    // Update imageUrl with the value from the result
    imageUrl = result.imageUrl;
    console.log('Received image URL from API:', imageUrl);
    
    // Formatowanie odpowiedzi
    return {
      success: true,
      content: result.content || '',
      imageUrl: imageUrl,
      imageAttribution: result.imageAttribution || null,
      metadata: {
        model: API_CONFIG.current.model,
        featureType,
        timestamp: new Date().toISOString(),
        environment: ENV.current
      }
    };
  } catch (error) {
    console.error('Błąd podczas generowania treści:', error);
    return {
      success: false,
      message: 'Wystąpił błąd podczas generowania treści. Spróbuj ponownie później.',
      error: error.message
    };
  }
};