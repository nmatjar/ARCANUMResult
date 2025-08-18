import Airtable from 'airtable';
import { API_CONFIG, ENV } from './apiService';

// Konfiguracja Airtable
const AIRTABLE_CONFIG = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Persons'  // Nazwa tabeli w Airtable
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
 * Pobiera dane użytkownika z Airtable na podstawie kodu testu
 * @param {string} code - Kod testu kariery
 * @returns {Promise<object|null>} Dane użytkownika lub null, jeśli nie znaleziono
 */
export const getCareerDataByCode = async (code) => {
  try {
    const base = initAirtable();
    
    // Pobranie rekordu na podstawie kodu
    const records = await base(AIRTABLE_CONFIG.tableName)
      .select({
        filterByFormula: `{Code} = '${code}'`,
        maxRecords: 1
      })
      .firstPage();
    
    if (records && records.length > 0) {
      const record = records[0];
      
      // Transformacja rekordu na obiekt danych użytkownika zgodnie z otrzymaną strukturą
      return {
        id: record.id,
        name: record.get('Name') || '',
        gender: record.get('Płeć') || '',
        age: record.get('Wiek') || '',
        date: record.get('Date') || '',
        email: record.get('Email') || '',
        code: record.get('Code') || '',
        personality_type: record.get('Czynniki') || '',
        complete_factors: record.get('Czynniki_Pełne') || '',
        interests: record.get('Zainteresowania') || '',
        skills: record.get('Umiejętności') || '',
        education: record.get('Edukacja') || '',
        education_field: record.get('Kierunek edukacji') || '',
        career_stage: record.get('Etap_kariery') || '',
        sector: record.get('Sektor') || '',
        current_job: record.get('Obecna_Praca') || '',
        target_job: record.get('Docelowa praca') || '',
        personality_traits: record.get('Opis_Typu') || '',
        strengths: record.get('Słabe_Mocne') || '',
        communication_style: record.get('Personalizacja komunikacji') || '',
        work_environment_features: record.get('Miejsce_Pracy') || '',
        career_by_skills: record.get('Kariera według umiejętności') || '',
        career_for_type: record.get('Kariera dla typu') || '',
        open_to_work: record.get('OpenToWork') || false,
        task_id: record.get('Task_id') || '',
        image: (() => {
          // Sprawdź pole Avatar jako link (zgodnie z nową informacją)
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
        })(),
        work_style: record.get('Praca_Ludzie') || '',
        physical_effort: record.get('Wysiłek_Fizyczny') || '',
        digital_skills: record.get('Zdolności_Cyfrowe') || '',
        pro: record.get('PRO') || false,
        paid: record.get('Płatna') || false,
        advanced: record.get('Zaawansowana') || false,
        values: record.get('Personalizacja komunikacji') || '', // Assuming this can be adapted from communication personalization
        tokens: record.get('Tokens') || 1000 // Default to 1000 tokens for new users
      };
    }
    
    return null; // Nie znaleziono użytkownika z podanym kodem
    
  } catch (error) {
    console.error('Błąd podczas pobierania danych z Airtable:', error);
    throw error;
  }
};

/**
 * Zapisuje wyniki analizy do Airtable
 * @param {string} userId - ID użytkownika w Airtable
 * @param {string} featureType - Typ funkcji
 * @param {object} result - Wyniki analizy
 * @returns {Promise<object>} Zapisany rekord
 */
export const saveResultToAirtable = async (userId, featureType, result) => {
  try {
    const base = initAirtable();
    
    // Nazwa tabeli dla wyników (może być inna niż dla użytkowników)
    const resultTableName = 'career_test_results';
    
    // Zapisanie wyników do Airtable
    const record = await base(resultTableName).create({
      user_id: userId,
      feature_type: featureType,
      content: result.content,
      image_url: result.imageUrl || '',
      generated_at: new Date().toISOString(),
      metadata: JSON.stringify(result.metadata || {})
    });
    
    return record;
    
  } catch (error) {
    console.error('Błąd podczas zapisywania wyników do Airtable:', error);
    throw error;
  }
};

/**
 * Aktualizuje dane użytkownika w Airtable
 * @param {string} userId - ID użytkownika w Airtable
 * @param {object} userData - Dane do aktualizacji
 * @returns {Promise<object>} Zaktualizowany rekord
 */
export const updateUserData = async (userId, userData) => {
  try {
    const base = initAirtable();
    
    // Aktualizacja rekordu użytkownika
    const record = await base(AIRTABLE_CONFIG.tableName).update(userId, userData);
    
    return record;
    
  } catch (error) {
    console.error('Błąd podczas aktualizacji danych użytkownika w Airtable:', error);
    throw error;
  }
};

/**
 * Aktualizuje rozszerzone dane profilu w polu Dodatkowe
 * @param {string} userId - ID użytkownika
 * @param {object} profileData - Dane profilu do zapisania
 * @returns {Promise<object>} Zaktualizowany rekord
 */
export const updateExtendedProfile = async (userId, profileData) => {
  try {
    // Pobierz aktualny rekord użytkownika wraz z aktualnym polem Dodatkowe
    const base = initAirtable();
    const record = await base(AIRTABLE_CONFIG.tableName).find(userId);
    
    // Pobierz aktualne dane dodatkowe
    const currentAdditional = record.get('Dodatkowe');
    console.log("Current additional data in Airtable:", currentAdditional ? (currentAdditional.substring(0, 50) + "...") : "none");
    
    // Serializuj nowe dane
    let profileJson;
    
    // Jeśli istnieją aktualne dane dodatkowe i są w formacie JSON, zachowaj inne pola
    if (currentAdditional) {
      try {
        // Parsuj aktualne dane
        const currentData = JSON.parse(currentAdditional);
        
        // Zachowaj wszystkie pola oprócz profile_extensions (które aktualizujemy)
        const mergedData = {
          ...currentData,
          profile_extensions: profileData.profile_extensions,
          meta: profileData.meta // Aktualizuj też metadane
        };
        
        profileJson = JSON.stringify(mergedData);
      } catch (e) {
        console.error("Error parsing current additional data, overwriting:", e);
        profileJson = JSON.stringify(profileData);
      }
    } else {
      // Brak aktualnych danych, użyj nowych
      profileJson = JSON.stringify(profileData);
    }
    
    console.log("Updating extended profile for user:", userId);
    console.log("Profile data to save:", profileJson.substring(0, 200) + "...");
    
    // Zapisz zaktualizowane dane w polu Dodatkowe
    const updatedRecord = await base(AIRTABLE_CONFIG.tableName).update(userId, {
      'Dodatkowe': profileJson
    });
    
    console.log("Profile updated successfully in Airtable");
    return updatedRecord;
  } catch (error) {
    console.error('Błąd podczas aktualizacji rozszerzonego profilu w Airtable:', error);
    throw error;
  }
};

/**
 * Pobiera dane użytkownika z Airtable
 * @param {string} userId - ID użytkownika 
 * @returns {Promise<object>} Dane użytkownika
 */
export const getUserById = async (userId) => {
  try {
    const base = initAirtable();
    
    // Pobranie rekordu użytkownika
    const record = await base(AIRTABLE_CONFIG.tableName).find(userId);
    
    if (record) {
      // Transformacja rekordu do obiektu danych użytkownika
      return {
        id: record.id,
        name: record.get('Name') || '',
        gender: record.get('Płeć') || '',
        age: record.get('Wiek') || '',
        date: record.get('Date') || '',
        email: record.get('Email') || '',
        code: record.get('Code') || '',
        personality_type: record.get('Czynniki') || '',
        complete_factors: record.get('Czynniki_Pełne') || '',
        interests: record.get('Zainteresowania') || '',
        skills: record.get('Umiejętności') || '',
        education: record.get('Edukacja') || '',
        education_field: record.get('Kierunek edukacji') || '',
        career_stage: record.get('Etap_kariery') || '',
        sector: record.get('Sektor') || '',
        current_job: record.get('Obecna_Praca') || '',
        target_job: record.get('Docelowa praca') || '',
        personality_traits: record.get('Opis_Typu') || '',
        strengths: record.get('Słabe_Mocne') || '',
        communication_style: record.get('Personalizacja komunikacji') || '',
        work_environment_features: record.get('Miejsce_Pracy') || '',
        career_by_skills: record.get('Kariera według umiejętności') || '',
        career_for_type: record.get('Kariera dla typu') || '',
        open_to_work: record.get('OpenToWork') || false,
        task_id: record.get('Task_id') || '',
        image: (() => {
          // Sprawdź pole Avatar jako link (zgodnie z nową informacją)
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
        })(),
        work_style: record.get('Praca_Ludzie') || '',
        physical_effort: record.get('Wysiłek_Fizyczny') || '',
        digital_skills: record.get('Zdolności_Cyfrowe') || '',
        pro: record.get('PRO') || false,
        paid: record.get('Płatna') || false,
        advanced: record.get('Zaawansowana') || false,
        values: record.get('Personalizacja komunikacji') || '',
        tokens: record.get('Tokens') || 1000,
        additional: record.get('Dodatkowe') || ''
      };
    }
    
    return null; // Nie znaleziono użytkownika
    
  } catch (error) {
    console.error('Błąd podczas pobierania danych użytkownika z Airtable:', error);
    throw error;
  }
};

/**
 * Deducts tokens from a user's account
 * @param {string} userId - ID użytkownika w Airtable
 * @param {number} tokensToDeduct - Number of tokens to deduct
 * @returns {Promise<{ success: boolean, newBalance: number }>} Success status and new token balance
 */
export const deductTokens = async (userId, tokensToDeduct) => {
  try {
    // Try to use the API first (when deployed)
    try {
      // Only use the API in production mode
      if (ENV.current === 'production') {
        const response = await fetch(`${API_CONFIG.current.baseUrl}/api/deduct-tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, tokensToDeduct })
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          const errorData = await response.json();
          if (errorData.success === false) {
            return errorData; // Return error response from API
          }
        }
      } else {
        console.log('Using direct Airtable access in local mode');
      }
    } catch (apiError) {
      console.log('Could not use API for token deduction, falling back to direct Airtable:', apiError);
    }
    
    // Fallback to direct Airtable access
    const base = initAirtable();
    
    // First, get the current token balance
    const record = await base(AIRTABLE_CONFIG.tableName).find(userId);
    const currentTokens = record.get('Tokens') || 0;
    
    // Check if user has enough tokens
    if (currentTokens < tokensToDeduct) {
      return { 
        success: false,
        newBalance: currentTokens,
        message: 'Niewystarczająca liczba tokenów'
      };
    }
    
    // Deduct tokens and update record
    const newBalance = currentTokens - tokensToDeduct;
    await base(AIRTABLE_CONFIG.tableName).update(userId, {
      'Tokens': newBalance
    });
    
    return {
      success: true,
      newBalance,
      message: 'Tokeny zostały pobrane'
    };
    
  } catch (error) {
    console.error('Błąd podczas aktualizacji tokenów w Airtable:', error);
    throw error;
  }
};

/**
 * Adds tokens to a user's account
 * @param {string} userId - ID użytkownika w Airtable
 * @param {number} tokensToAdd - Number of tokens to add
 * @returns {Promise<{ success: boolean, newBalance: number }>} Success status and new token balance
 */
export const addTokens = async (userId, tokensToAdd) => {
  try {
    // Try to use the API first (when deployed)
    try {
      // Only use the API in production mode
      if (ENV.current === 'production') {
        const response = await fetch(`${API_CONFIG.current.baseUrl}/api/add-tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, tokensToAdd })
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } else {
        console.log('Using direct Airtable access in local mode');
      }
    } catch (apiError) {
      console.log('Could not use API for token addition, falling back to direct Airtable:', apiError);
    }
    
    // Fallback to direct Airtable access
    const base = initAirtable();
    
    // First, get the current token balance
    const record = await base(AIRTABLE_CONFIG.tableName).find(userId);
    const currentTokens = record.get('Tokens') || 0;
    
    // Add tokens and update record
    const newBalance = currentTokens + tokensToAdd;
    await base(AIRTABLE_CONFIG.tableName).update(userId, {
      'Tokens': newBalance
    });
    
    return {
      success: true,
      newBalance,
      message: 'Tokeny zostały dodane'
    };
    
  } catch (error) {
    console.error('Błąd podczas dodawania tokenów w Airtable:', error);
    throw error;
  }
};