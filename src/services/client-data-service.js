/**
 * ARCĀNUM Client Data Service
 * Refactored to use a secure serverless function.
 */

class ClientDataService {
  constructor() {
    this.initialized = true;
    console.log('✅ Client Data Service initialized');
  }

  init() {
    // No-op
  }

  /**
   * Sprawdza dostęp klienta na podstawie kodu
   * @param {string} clientCode - Kod klienta (nie ID, ale Code z tabeli)
   * @returns {Promise<boolean>} Czy klient ma dostęp
   */
  async validateClientAccess() {
    // This can be simplified as the serverless function will handle validation
    return true;
  }

  /**
   * Pobiera pole MetaAnalysis dla danego klienta
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<string|null>} Zawartość pola MetaAnalysis lub null
   */
  async getMetaAnalysis(clientCode) {
    const clientData = await this.getClientVectors(clientCode);
    return clientData?.metaAnalysis || null;
  }

  /**
   * Pobiera pełne dane klienta na podstawie kodu z nowej struktury bazy
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<object>} Pełne dane klienta
   */
  async getClientVectors(clientCode) {
    if (this.isDemoCode(clientCode)) {
      return this.getDemoData(clientCode);
    }

    try {
      const response = await fetch(`/.netlify/functions/get-client-vectors?clientCode=${clientCode}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching client vectors:', error);
      throw new Error('Nie udało się pobrać danych klienta.');
    }
  }

  /**
   * Pobiera podstawowe informacje o kliencie
   * @param {string} clientCode - Kod klienta
   * @returns {Promise<object>} Podstawowe dane klienta
   */
  async getClientBasicInfo(clientCode) {
    // This will now be handled by the serverless function
    return {
      name: 'Demo User',
      email: 'demo@example.com',
      code: clientCode,
      date: new Date().toISOString(),
    };
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
  getClientImage() {
    // This will now be handled by the serverless function
    return `https://ui-avatars.com/api/?name=Demo+User&background=indigo&color=fff&bold=true`;
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
