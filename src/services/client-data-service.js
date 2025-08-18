import Airtable from 'airtable';

/**
 * ARCĀNUM Client Data Service
 * Oparty na oryginalnej logice z starego panelu
 * Używa tabeli "Persons" i pobiera dane po polu "Code"
 */

// Konfiguracja Airtable
const AIRTABLE_CONFIG = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME
};

// Inicjalizacja Airtable
let airtableBase;

const initAirtable = () => {
  if (!airtableBase) {
    Airtable.configure({
      apiKey: AIRTABLE_CONFIG.apiKey
    });
    airtableBase = Airtable.base(AIRTABLE_CONFIG.baseId);
  }
  return airtableBase;
};

/**
 * Client Data Service Class
 */
class ClientDataService {
  constructor() {
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    try {
      initAirtable();
      this.initialized = true;
      console.log('✅ Airtable Client Data Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Airtable Client Data Service:', error);
      throw error;
    }
  }

  /**
   * Sprawdza dostęp klienta na podstawie kodu
   * @param {string} clientCode - Kod klienta (nie ID, ale Code z tabeli)
   * @returns {Promise<boolean>} Czy klient ma dostęp
   */
  async validateClientAccess(clientCode) {
    try {
      // Sprawdź tryb demo
      const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      if (demoMode) {
        console.log('🔧 Demo mode enabled - allowing access for code:', clientCode);
        return true;
      }

      const base = initAirtable();
      
      const records = await base(AIRTABLE_CONFIG.tableName)
        .select({
          filterByFormula: `{Code} = '${clientCode}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        // W oryginalnym systemie każdy klient z kodem ma dostęp
        // Można dodać dodatkowe sprawdzenia jeśli potrzebne
        return true;
      }
      
      // Jeśli nie znaleziono w Airtable, sprawdź czy to kod demo
      if (this.isDemoCode(clientCode)) {
        console.log('🔧 Demo code detected:', clientCode);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to validate access for', clientCode, ':', error);
      
      // W przypadku błędu Airtable, sprawdź czy to kod demo
      if (this.isDemoCode(clientCode)) {
        console.log('🔧 Airtable error, using demo data for:', clientCode);
        return true;
      }
      
      throw error;
    }
  }

  /**
   * Pobiera pole MetaAnalysis dla danego klienta
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<string|null>} Zawartość pola MetaAnalysis lub null
   */
  async getMetaAnalysis(clientCode) {
    try {
      // W trybie demo lub dla kodów demo zwracamy przykładową analizę
      const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      if (demoMode || this.isDemoCode(clientCode)) {
        console.log('🔧 Using demo MetaAnalysis for code:', clientCode);
        return 'To jest przykładowa MetaAnaliza dla profilu demonstracyjnego. Zawiera ona wstępnie przetworzone dane, które służą jako kontekst dla dalszych, bardziej szczegółowych zapytań generowanych z katalogu promptów.';
      }

      const base = initAirtable();
      const records = await base(AIRTABLE_CONFIG.tableName)
        .select({
          filterByFormula: `{Code} = '${clientCode}'`,
          fields: ['MetaAnalysis'],
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        const metaAnalysis = records[0].get('MetaAnalysis');
        console.log('✅ MetaAnalysis fetched successfully for code:', clientCode);
        return metaAnalysis || null;
      }

      console.warn('⚠️ MetaAnalysis not found for code:', clientCode);
      return null;
    } catch (error) {
      console.error('❌ Failed to get MetaAnalysis for', clientCode, ':', error);
      // Zwracamy null w przypadku błędu, aby aplikacja mogła działać dalej
      return null;
    }
  }

  /**
   * Pobiera pełne dane klienta na podstawie kodu z nowej struktury bazy
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<object>} Pełne dane klienta
   */
  async getClientVectors(clientCode) {
    try {
      const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      if (demoMode || this.isDemoCode(clientCode)) {
        console.log('🔧 Using demo data for code:', clientCode);
        return this.getDemoData(clientCode);
      }

      const base = initAirtable();
      const records = await base(AIRTABLE_CONFIG.tableName)
        .select({
          filterByFormula: `{Code} = '${clientCode}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        const record = records[0];
        
        // Mapowanie nowej struktury pól
        const mappedData = {
          id: record.id,
          submissionId: record.get('Submission ID'),
          name: record.get('Name/Nickname') || '',
          gender: record.get('gender') || '',
          age: record.get('Age') || '',
          date: record.get('Created Time') || '',
          email: record.get('Email address') || '',
          code: record.get('Code') || '', // Zakładając, że pole Code nadal istnieje
          language: record.get('Language') || 'pl',
          
          // Mapowanie pól związanych z analizą BBT/OTK
          personality_type: record.get('topfactor') || '', // Używamy topfactor jako głównego typu
          complete_factors: record.get('factors') || '', // Pełne czynniki
          interests: record.get('Your interests (min. 3)') || '',
          skills: record.get('talenty') || '',
          
          // Mapowanie pól edukacji i kariery
          education: record.get('edukacja') || '',
          education_field: record.get('kierunek edukacji') || '',
          sector: record.get('sektory') || '',
          current_job: record.get('Current occupation if I work') || '',
          
          // Pozostałe pola, które mogą być potrzebne
          image: this.getClientImage(record), // Logika obrazu pozostaje
          metaAnalysis: record.get('MetaAnalysis') || '' // Pobieramy pole MetaAnalysis
        };

        console.log('✅ Client data fetched successfully for code:', clientCode);
        return mappedData;
      }

      if (this.isDemoCode(clientCode)) {
        console.log('🔧 Airtable not found, using demo data for:', clientCode);
        return this.getDemoData(clientCode);
      }
      
      throw new Error('Nie znaleziono danych klienta');
    } catch (error) {
      console.error('❌ Failed to get client vectors for', clientCode, ':', error);
      if (this.isDemoCode(clientCode)) {
        console.log('🔧 Airtable error, using demo data for:', clientCode);
        return this.getDemoData(clientCode);
      }
      throw error;
    }
  }

  /**
   * Pobiera podstawowe informacje o kliencie
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<object>} Podstawowe dane klienta
   */
  async getClientBasicInfo(clientCode) {
    try {
      const base = initAirtable();
      
      const records = await base(AIRTABLE_CONFIG.tableName)
        .select({
          filterByFormula: `{Code} = '${clientCode}'`,
          maxRecords: 1,
          fields: ['Name', 'Email', 'Code', 'Date']
        })
        .firstPage();

      if (records && records.length > 0) {
        const record = records[0];
        
        return {
          name: record.get('Name') || '',
          email: record.get('Email') || '',
          code: record.get('Code') || '',
          date: record.get('Date') || ''
        };
      }
      
      throw new Error('Nie znaleziono klienta');
    } catch (error) {
      console.error('❌ Failed to get client basic info for', clientCode, ':', error);
      throw error;
    }
  }

  /**
   * Loguje dostęp klienta (opcjonalne)
   * @param {string} clientCode - Kod klienta
   * @param {object} accessInfo - Informacje o dostępie
   */
  async logAccess(clientCode, accessInfo = {}) {
    try {
      // W oryginalnym systemie nie było logowania dostępu
      // Można dodać jeśli potrzebne
      console.log('📝 Access logged for client:', clientCode, 'Info:', accessInfo);
    } catch (error) {
      console.warn('⚠️ Failed to log access:', error);
    }
  }

  /**
   * Pobiera obraz klienta (oryginalna logika)
   * @param {object} record - Rekord z Airtable
   * @returns {string} URL obrazu
   */
  getClientImage(record) {
    // Sprawdź pole Avatar jako link
    const avatarField = record.get('Avatar');
    if (avatarField && typeof avatarField === 'string' && avatarField.startsWith('http')) {
      return avatarField;
    }
    
    // Fallback do pola Image
    const imageField = record.get('Image');
    if (imageField) {
      // Jeśli to obiekt załącznika z Airtable
      if (typeof imageField === 'object' && Array.isArray(imageField) && imageField.length > 0) {
        return imageField[0].url;
      }
      
      // Jeśli to pełny URL
      if (typeof imageField === 'string' && imageField.startsWith('http')) {
        return imageField;
      }
    }
    
    // Fallback do generowania avatara na podstawie imienia
    const name = record.get('Name') || '';
    if (name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=indigo&color=fff&bold=true`;
    }
    
    return '';
  }

  /**
   * Pobiera statystyki klienta (opcjonalne)
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<object>} Statystyki
   */
  async getClientStats(clientCode) {
    try {
      // Implementacja statystyk - opcjonalna
      console.log('Getting stats for client:', clientCode);
      return {
        totalAccesses: 0,
        lastAccess: null,
        generatedReports: 0
      };
    } catch (error) {
      console.warn('⚠️ Failed to get client stats:', error);
      return null;
    }
  }

  /**
   * Sprawdza czy kod to kod demo
   * @param {string} clientCode - Kod klienta
   * @returns {boolean} Czy to kod demo
   */
  isDemoCode(clientCode) {
    const demoCodes = ['DEMO', 'TEST', 'SAMPLE', 'EE6F1C44', 'ARCANUM'];
    return demoCodes.includes(clientCode?.toUpperCase());
  }

  /**
   * Zwraca dane demo dla testowania, dopasowane do nowej struktury
   * @param {string} clientCode - Kod klienta
   * @returns {object} Dane demo
   */
  getDemoData(clientCode) {
    return {
      id: 'demo-' + clientCode,
      submissionId: 'demo_submission_123',
      name: 'Mateusz Jarosiewicz (Demo)',
      gender: 'Mężczyzna',
      age: '35',
      date: new Date().toISOString(),
      email: 'jarosiewicz.mateusz@gmail.com',
      code: clientCode,
      language: 'pl',
      personality_type: 'Z+',
      complete_factors: "Z+3,G'+3,Z'+3,O+2,S'+2,W+1,G+1,S'E+1,V'+1,K--6,M--6,W--5,V--4,S--3,V'--3,G'--3,G--2,SE--1,Z--1,S'H--1,k+4,or+4,g+3,v+2,se+1,w+1,z+1,m--8,v--6,k--4,g--4,w--3,z--3,se--2,o--2,or--2,s--1",
      interests: 'AI, HR, Psychometria',
      skills: 'Zarządzanie, Innowacje, Analiza',
      education: 'Wyższe',
      education_field: 'Psychologia',
      sector: 'Technologia',
      current_job: 'Director of AI/HR',
      image: `https://ui-avatars.com/api/?name=Mateusz+Jarosiewicz&background=6366f1&color=fff&bold=true`,
      metaAnalysis: 'To jest przykładowa MetaAnaliza dla profilu demonstracyjnego. Zawiera ona wstępnie przetworzone dane, które służą jako kontekst dla dalszych, bardziej szczegółowych zapytań generowanych z katalogu promptów.'
    };
  }
}

// Eksportuj singleton
export const clientDataService = new ClientDataService();

// Eksportuj też oryginalną funkcję dla kompatybilności
export const getCareerDataByCode = async (code) => {
  return await clientDataService.getClientVectors(code);
};
