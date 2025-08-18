import { callOpenRouterAPI } from '../openRouterApi.js';
import { ARCANUM_META_PROMPT, ARCANUM_LEVEL_PROMPTS } from './arcanum-prompts.js';
import i18n from '../i18n.js';

/**
 * ARCĀNUM AI Engine - Główny silnik AI dla zaawansowanych analiz psychometrycznych
 * Wykorzystuje OpenRouter API z możliwością wyboru różnych modeli
 * Zintegrowany z oryginalną strukturą danych z tabeli Persons
 */
class AIEngine {
  constructor() {
    // Dostępne modele AI
    this.availableModels = [
      {
        id: 'google/gemini-2.5-flash',
        name: 'Gemini Flash',
        description: 'Szybki model Google, idealny do szybkich analiz',
        icon: '⚡',
        recommended: true
      },
      {
        id: 'anthropic/claude-sonnet-4',
        name: 'Claude Sonnet 4',
        description: 'Najnowszy model Claude z najlepszą jakością analiz',
        icon: '🧠',
        recommended: false
      },
      {
        id: 'google/gemini-pro',
        name: 'Gemini Pro',
        description: 'Zaawansowany model Google z doskonałą analizą',
        icon: '💎',
        recommended: false
      },
      {
        id: 'deepseek/deepseek-chat-v3-0324',
        name: 'DeepSeek Chat V3',
        description: 'Zaawansowany model z głęboką analizą psychometryczną',
        icon: '🔍',
        recommended: false
      },
      {
        id: 'moonshotai/kimi-k2',
        name: 'Kimi K2',
        description: 'Model od Moonshot AI',
        icon: '🚀',
        recommended: false
      },
      {
        id: 'z-ai/glm-4.5',
        name: 'GLM 4.5',
        description: 'Model od Z-AI',
        icon: '🤖',
        recommended: false
      },
      {
        id: 'baidu/ernie-4.5-21b-a3b',
        name: 'Ernie 4.5',
        description: 'Model od Baidu',
        icon: '🐾',
        recommended: false
      }
    ];

    // Domyślny model (pierwszy z listy)
    this.currentModel = this.availableModels[0].id;
    this.clientData = null;
    this.sessionId = null;
    
    console.log('✅ AI Engine initialized with OpenRouter');
  }

  /**
   * Ustaw aktywny model AI
   * @param {string} modelId - ID modelu do ustawienia
   */
  setModel(modelId) {
    const model = this.availableModels.find(m => m.id === modelId);
    if (model) {
      this.currentModel = modelId;
      console.log(`🔄 AI Model changed to: ${model.name}`);
      
      // Wyczyść sesję przy zmianie modelu
      this.clientData = null;
      this.sessionId = null;
      
      return true;
    } else {
      console.error(`❌ Model ${modelId} not found`);
      return false;
    }
  }

  /**
   * Pobierz aktualny model
   */
  getCurrentModel() {
    return this.availableModels.find(m => m.id === this.currentModel);
  }

  /**
   * Pobierz listę dostępnych modeli
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Przełącz model AI (alias dla setModel)
   * @param {string} modelId - ID nowego modelu
   */
  async switchModel(modelId) {
    return this.setModel(modelId);
  }

  /**
   * Inicjalizuje sesję AI z danymi klienta (oryginalna struktura z tabeli Persons)
   * @param {Object} clientData - Dane klienta z oryginalnej tabeli Persons
   */
  async initializeSession(clientData) {
    try {
      this.clientData = clientData;
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🤖 AI Engine session initialized:', this.sessionId);
      console.log('📊 Client data loaded:', {
        name: clientData.name,
        code: clientData.code,
        personalityType: clientData.personality_type,
        hasCompleteFactors: !!clientData.complete_factors
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI session:', error);
      throw error;
    }
  }

  /**
   * Generuje analizę dla określonego poziomu
   * @param {number} levelNumber - Numer poziomu (1-5)
   * @returns {Promise<Object>} Wynik analizy
   */
  async generateLevel(levelNumber) {
    if (!this.clientData) {
      throw new Error('Session not initialized. Call initializeSession first.');
    }

    if (levelNumber < 1 || levelNumber > 5) {
      throw new Error('Invalid level number. Must be between 1 and 5.');
    }

    try {
      console.log(`🧠 Generating ARCĀNUM Level ${levelNumber} analysis...`);

      // Pobierz prompt dla danego poziomu
      const levelPrompt = ARCANUM_LEVEL_PROMPTS(i18n.language)[levelNumber];
      if (!levelPrompt) {
        throw new Error(`No prompt found for level ${levelNumber}`);
      }

      // Przygotuj pełny prompt z danymi klienta
      const fullPrompt = this.preparePromptWithClientData(levelPrompt, levelNumber);

      // Wywołaj OpenRouter API
      const response = await callOpenRouterAPI(
        fullPrompt,
        this.currentModel,
        ARCANUM_META_PROMPT,
        {
          sessionId: this.sessionId,
          mode: `level-${levelNumber}`,
          timestamp: new Date().toISOString()
        }
      );

      // Parsuj odpowiedź w zależności od poziomu
      const parsedContent = this.parseResponse(levelNumber, response);

      console.log(`✅ Level ${levelNumber} analysis completed`);
      return {
        success: true,
        level: levelNumber,
        content: parsedContent,
        rawText: response,
        timestamp: new Date().toISOString(),
        model: this.getCurrentModel().name
      };

    } catch (error) {
      console.error(`❌ Failed to generate Level ${levelNumber}:`, error);
      throw new Error(`Level ${levelNumber} generation failed: ${error.message}`);
    }
  }

  /**
   * Generuje odpowiedź na podstawie dowolnego promptu i kontekstu
   * @param {string} prompt - Treść promptu do wykonania
   * @param {string} context - Kontekst (np. MetaAnalysis)
   * @param {'html' | 'json'} format - Oczekiwany format odpowiedzi
   * @returns {Promise<string|Object>} Wynik analizy w zadanym formacie
   */
  async generateGenericPrompt(prompt, context, format = 'html') {
    if (!this.clientData) {
      throw new Error('Session not initialized. Call initializeSession first.');
    }

    try {
      console.log(`🧠 Generating response for generic prompt (format: ${format})...`);

      const fullPrompt = `
        KONTEKST (WSTĘPNA ANALIZA):
        ${context}

        POLECENIE:
        ${prompt}
      `;

      const response = await callOpenRouterAPI(
        fullPrompt,
        this.currentModel,
        ARCANUM_META_PROMPT, // Meta-prompt systemowy nadal jest używany
        {
          sessionId: this.sessionId,
          mode: 'generic-prompt',
          timestamp: new Date().toISOString()
        }
      );

      if (format === 'json') {
        try {
          // Próba sparsowania JSON-a z potencjalnych markdown code blocks
          const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
          return JSON.parse(jsonMatch ? jsonMatch[1] : response);
        } catch (e) {
          console.error("Błąd parsowania JSON, zwracam surowy tekst:", e);
          return { error: "Invalid JSON response", raw: response };
        }
      }

      console.log(`✅ Generic prompt response generated successfully`);
      return response; // Dla HTML zwracamy surowy tekst

    } catch (error) {
      console.error(`❌ Failed to generate response for generic prompt:`, error);
      throw new Error(`Generic prompt generation failed: ${error.message}`);
    }
  }

  /**
   * Przygotowuje prompt z danymi klienta
   * @param {string} levelPrompt - String promptu dla poziomu
   * @returns {string} Pełny prompt z danymi klienta
   */
  preparePromptWithClientData(levelPrompt) {
    // Przekształć dane klienta do formatu JSON dla promptu
    const clientDataJson = JSON.stringify({
      profileId: this.clientData.code,
      timestamp: new Date().toISOString(),
      clientInfo: {
        name: this.clientData.name || 'Anonymous',
        email: this.clientData.email || '',
        testDate: this.clientData.date || new Date().toISOString()
      },
      // Mapowanie oryginalnych pól na format oczekiwany przez AI
      personalityData: {
        personality_type: this.clientData.personality_type || '',
        complete_factors: this.clientData.complete_factors || '',
        interests: this.clientData.interests || '',
        skills: this.clientData.skills || '',
        education: this.clientData.education || '',
        education_field: this.clientData.education_field || '',
        career_stage: this.clientData.career_stage || '',
        sector: this.clientData.sector || '',
        current_job: this.clientData.current_job || '',
        target_job: this.clientData.target_job || '',
        personality_traits: this.clientData.personality_traits || '',
        strengths: this.clientData.strengths || '',
        communication_style: this.clientData.communication_style || '',
        work_environment_features: this.clientData.work_environment_features || '',
        career_by_skills: this.clientData.career_by_skills || '',
        career_for_type: this.clientData.career_for_type || '',
        work_style: this.clientData.work_style || '',
        physical_effort: this.clientData.physical_effort || '',
        digital_skills: this.clientData.digital_skills || '',
        values: this.clientData.values || ''
      },
      metadata: {
        testVersion: '1.0',
        language: 'pl',
        completionRate: 100,
        validityScore: 95,
        pro: this.clientData.pro || false,
        paid: this.clientData.paid || false,
        advanced: this.clientData.advanced || false
      }
    }, null, 2);

    // Połącz prompt z danymi klienta
    return `${levelPrompt}

DANE KLIENTA DO ANALIZY:
${clientDataJson}

Na podstawie powyższych danych wygeneruj analizę zgodnie z formatem określonym w poleceniu.`;
  }

  /**
   * Parsowanie odpowiedzi AI w zależności od poziomu
   * @param {number} level - Poziom analizy
   * @param {string} text - Surowa odpowiedź z AI
   * @returns {Object} Sparsowana treść
   */
  parseResponse(level, text) {
    try {
      switch (level) {
        case 1: // Hero Dashboard
          return this.parseLevel1(text);
        case 2: // Strategiczne Wymiary
          return this.parseLevel2(text);
        case 3: // Zaawansowane Analizy
          return this.parseLevel3(text);
        case 4: // Ukryte Skarby
          return this.parseLevel4(text);
        case 5: // Kompas Akademicki
          return this.parseLevel5(text);
        default:
          return { rawText: text };
      }
    } catch (error) {
      console.warn(`⚠️ Failed to parse Level ${level} response, returning raw text:`, error);
      return { rawText: text };
    }
  }

  /**
   * Parsowanie Poziomu 1 - Hero Dashboard
   */
  parseLevel1(text) {
    const sections = this.extractSections(text);
    
    return {
      dominantArchetype: this.extractValue(text, /Dominujący Archetyp Zawodowy[:\s]*(.+?)(?:\n|$)/i) || 
                        this.extractValue(text, /Archetyp[:\s]*(.+?)(?:\n|$)/i) ||
                        'Strategiczny Lider',
      leadershipIndex: this.extractLeadershipIndex(text),
      psychometricProfile: this.extractPsychometricProfile(text),
      strategicHighlights: this.extractStrategicHighlights(text),
      sections
    };
  }

  /**
   * Parsowanie Poziomu 2 - Strategiczne Wymiary
   */
  parseLevel2(text) {
    return {
      profilPsychometryczny: this.extractSection(text, 'Profil Psychometryczny'),
      potencjalPrzywodczy: this.extractSection(text, 'Potencjał Przywódczy'),
      dopasowanieOrganizacyjne: this.extractSection(text, 'Dopasowanie Organizacyjne'),
      prognozaRozwoju: this.extractSection(text, 'Prognoza Rozwoju')
    };
  }

  /**
   * Parsowanie Poziomu 3 - Zaawansowane Analizy
   */
  parseLevel3(text) {
    return {
      profilPsychometryczny: {
        analizaMotywacji: this.extractSubsection(text, 'Analiza motywacji wewnętrznych'),
        wzorcePodejmowaniaDecyzji: this.extractSubsection(text, 'Wzorce podejmowania decyzji'),
        styleKomunikacji: this.extractSubsection(text, 'Style komunikacji w stresie'),
        predyspozycjeInnowacji: this.extractSubsection(text, 'Predyspozycje do innowacji')
      },
      potencjalPrzywodczy: {
        analizaWplywu: this.extractSubsection(text, 'Analiza wpływu na zespoły'),
        skutecznoscBranze: this.extractSubsection(text, 'Skuteczność w różnych branżach'),
        potencjalTransformacyjny: this.extractSubsection(text, 'Potencjał transformacyjny'),
        ryzykoWypalenia: this.extractSubsection(text, 'Ryzyko wypalenia zawodowego')
      },
      dopasowanieOrganizacyjne: {
        kompatybilnoscKultur: this.extractSubsection(text, 'Kompatybilność z typami kultur korporacyjnych'),
        optymalnaWielkoscZespolu: this.extractSubsection(text, 'Optymalna wielkość zespołu'),
        preferowaneStruktury: this.extractSubsection(text, 'Preferowane struktury hierarchiczne'),
        efektywnoscZdalnej: this.extractSubsection(text, 'Efektywność w pracy zdalnej/hybrydowej')
      },
      prognozaRozwoju: {
        analizaLuk: this.extractSubsection(text, 'Analiza luk kompetencyjnych'),
        rekomendacjeRozwojowe: this.extractSubsection(text, 'Rekomendacje rozwojowe'),
        potencjalneSciezki: this.extractSubsection(text, 'Potencjalne ścieżki kariery'),
        wskaznikiSukcesu: this.extractSubsection(text, 'Wskaźniki sukcesu długoterminowego')
      }
    };
  }

  /**
   * Parsowanie Poziomu 4 - Ukryte Skarby
   */
  parseLevel4(text) {
    return {
      analizaPredykcyjnaStresu: this.extractSection(text, 'Analiza Predykcyjna Stresu'),
      indeksKreatywnosciStrategicznej: this.extractSection(text, 'Indeks Kreatywności Strategicznej'),
      mapaWplywuSpolecznego: this.extractSection(text, 'Mapa Wpływu Społecznego'),
      profilEnergiiZawodowej: this.extractSection(text, 'Profil Energii Zawodowej'),
      analizaPodejmowaniaDecyzji: this.extractSection(text, 'Analiza Podejmowania Decyzji'),
      kompatybilnoscKulturowa: this.extractSection(text, 'Kompatybilność Kulturowa'),
      indeksAdaptacyjnosci: this.extractSection(text, 'Indeks Adaptacyjności')
    };
  }

  /**
   * Parsowanie Poziomu 5 - Kompas Akademicki
   */
  parseLevel5(text) {
    return {
      profilUczeniaSie: this.extractSection(text, 'Profil Uczenia Się'),
      indeksPotencjaluAdaptacyjnego: this.extractSection(text, 'Indeks Potencjału Adaptacyjnego'),
      rekomendowaneRoleStartowe: this.extractSection(text, 'Rekomendowane Role Startowe'),
      mapaKompetencjiRozwoju: this.extractSection(text, 'Mapa Kompetencji do Rozwoju'),
      strategiaBudowaniaMarki: this.extractSection(text, 'Strategia Budowania Marki Osobistej')
    };
  }

  // Utility methods for parsing

  /**
   * Wyciągnij wartość wskaźnika przywództwa
   */
  extractLeadershipIndex(text) {
    const match = text.match(/(\d+)\/100/) || text.match(/(\d+)%/) || text.match(/(\d+)\s*punktów/);
    return match ? parseInt(match[1]) : 75; // fallback
  }

  /**
   * Wyciągnij profil psychometryczny 360°
   */
  extractPsychometricProfile(text) {
    const profileSection = this.extractSection(text, 'Psychometryczny Profil 360°') ||
                          this.extractSection(text, 'Profil 360°');
    if (!profileSection) return [];

    // Parsuj listę wypunktowaną
    const items = profileSection.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))
      .map(line => {
        const cleaned = line.replace(/^[-•*]\s*/, '').trim();
        const parts = cleaned.split(':');
        return {
          label: parts[0]?.trim() || '',
          value: parts[1]?.trim() || parts[0]?.trim() || ''
        };
      })
      .filter(item => item.label);

    return items.length > 0 ? items : [
      { label: 'Styl Przywództwa', value: 'Strategiczny' },
      { label: 'Motywatory Główne', value: 'Osiągnięcia i rozwój' },
      { label: 'Obszar Rozwoju', value: 'Komunikacja w zespole' },
      { label: 'Fit Organizacyjny', value: 'Środowiska dynamiczne' }
    ];
  }

  /**
   * Wyciągnij Strategic Highlights
   */
  extractStrategicHighlights(text) {
    const highlightsSection = this.extractSection(text, 'Strategic Highlights') ||
                             this.extractSection(text, 'Kluczowe Insights');
    if (!highlightsSection) return [];

    const highlights = highlightsSection.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(item => item.length > 0);

    return highlights.length > 0 ? highlights : [
      'Wysokie predyspozycje do przywództwa strategicznego',
      'Naturalna zdolność do budowania zespołów',
      'Efektywność w środowiskach o wysokiej dynamice',
      'Potencjał do transformacji organizacyjnej'
    ];
  }

  /**
   * Wyciągnij sekcję z tekstu
   */
  extractSection(text, sectionName) {
    const patterns = [
      new RegExp(`${sectionName}[:s]*\n([\\s\\S]*?)(?=\n[A-ZĄĆĘŁŃÓŚŹŻ]|$)`, 'i'),
      new RegExp(`##\\s*${sectionName}([\\s\\S]*?)(?=\n##|$)`, 'i'),
      new RegExp(`\\*\\*${sectionName}\\*\\*([\\s\\S]*?)(?=\n\\*\\*|$)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return '';
  }

  /**
   * Wyciągnij podsekcję z tekstu
   */
  extractSubsection(text, subsectionName) {
    const patterns = [
      new RegExp(`${subsectionName}[:s]*\n([\\s\\S]*?)(?=\n[A-ZĄĆĘŁŃÓŚŹŻ]|$)`, 'i'),
      new RegExp(`###\\s*${subsectionName}([\\s\\S]*?)(?=\n###|$)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return '';
  }

  /**
   * Wyciągnij wartość z tekstu używając regex
   */
  extractValue(text, regex) {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Wyciągnij wszystkie sekcje z tekstu
   */
  extractSections(text) {
    const sections = {};
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.match(/^#+\s+/) || line.match(/^\*\*[^*]+\*\*$/)) {
        // Zapisz poprzednią sekcję
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        // Rozpocznij nową sekcję
        currentSection = line.replace(/^#+\s+|\*\*/g, '').trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Zapisz ostatnią sekcję
    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  /**
   * Sprawdź status sesji
   */
  getSessionStatus() {
    return {
      initialized: !!this.clientData,
      sessionId: this.sessionId,
      clientName: this.clientData?.name || null,
      clientCode: this.clientData?.code || null,
      model: this.getCurrentModel()
    };
  }

  /**
   * Wyczyść sesję
   */
  clearSession() {
    this.clientData = null;
    this.sessionId = null;
    console.log('🧹 AI Engine session cleared');
  }
}

// Eksport instancji silnika
export const aiEngine = new AIEngine();
