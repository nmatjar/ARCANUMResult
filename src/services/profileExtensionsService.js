import { updateUserData } from './airtableService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Struktura pól rozszerzonego profilu z etykietami i promptami do zbierania danych
 */
export const PROFILE_EXTENSION_FIELDS = {
  dream_job: {
    label: "Wymarzona praca",
    prompt: "Jaka byłaby Twoja wymarzona praca lub stanowisko?"
  },
  career_values: {
    label: "Wartości zawodowe", 
    prompt: "Jakie wartości są dla Ciebie najważniejsze w pracy?"
  },
  work_environment: {
    label: "Idealne środowisko pracy",
    prompt: "W jakim środowisku pracy czujesz się najlepiej?"
  },
  skills_to_develop: {
    label: "Umiejętności do rozwoju",
    prompt: "Jakie umiejętności chciałbyś/chciałabyś rozwinąć w najbliższym czasie?"
  },
  career_goals: {
    label: "Cele zawodowe",
    prompt: "Jakie są Twoje najważniejsze cele zawodowe na najbliższe 1-3 lata?"
  },
  leadership_style: {
    label: "Styl przywództwa",
    prompt: "Jaki jest Twój preferowany styl przywództwa lub pracy w zespole?"
  },
  ideal_company: {
    label: "Idealna firma",
    prompt: "Jaka byłaby dla Ciebie idealna firma/organizacja?"
  },
  work_challenges: {
    label: "Wyzwania zawodowe",
    prompt: "Jakie wyzwania zawodowe chciałbyś/chciałabyś podjąć?"
  },
  motivation_factors: {
    label: "Czynniki motywacyjne",
    prompt: "Co najbardziej motywuje Cię w pracy?"
  },
  preferred_tasks: {
    label: "Preferowane zadania",
    prompt: "Jakie zadania zawodowe sprawiają Ci największą satysfakcję?"
  },
  strengths_in_action: {
    label: "Mocne strony w praktyce",
    prompt: "W jakich sytuacjach zawodowych najlepiej wykorzystujesz swoje mocne strony?"
  },
  learning_style: {
    label: "Styl uczenia się",
    prompt: "Jaki jest Twój preferowany sposób uczenia się nowych umiejętności?"
  },
  collaboration_style: {
    label: "Styl współpracy",
    prompt: "Jak najchętniej współpracujesz z innymi?"
  },
  work_life_balance: {
    label: "Równowaga praca-życie",
    prompt: "Jak wyobrażasz sobie idealną równowagę między pracą a życiem prywatnym?"
  },
  networking_approach: {
    label: "Podejście do networkingu",
    prompt: "Jakie masz podejście do budowania sieci kontaktów zawodowych?"
  }
};

/**
 * Inicjalizuje pustą strukturę rozszerzeń profilu
 * @returns {Object} Pusta struktura profilu
 */
export const initializeProfileExtensions = () => {
  const profileExtensions = {};
  
  Object.keys(PROFILE_EXTENSION_FIELDS).forEach(key => {
    profileExtensions[key] = {
      items: [],
      last_updated: null
    };
  });
  
  return {
    profile_extensions: profileExtensions,
    meta: {
      version: "1.0",
      created_at: new Date().toISOString(),
      completion_rate: 0
    }
  };
};

/**
 * Sprawdza czy użytkownik ma inicjalizowaną strukturę profilu, jeśli nie - tworzy ją
 * @param {Object} userData - Dane użytkownika
 * @returns {Object} Zaktualizowane dane użytkownika z inicjalizowaną strukturą profilu
 */
export const ensureProfileStructure = (userData) => {
  // Brak additional - inicjalizuj całą strukturę
  if (!userData.additional) {
    console.log("No additional data found - initializing structure");
    userData.additional = JSON.stringify(initializeProfileExtensions());
    return userData;
  }
  
  // Parsowanie jeśli jest stringiem
  if (typeof userData.additional === 'string') {
    try {
      const parsedAdditional = JSON.parse(userData.additional);
      
      // Brak profile_extensions - inicjalizuj strukturę ale zachowaj inne pola
      if (!parsedAdditional.profile_extensions) {
        console.log("No profile_extensions in additional data - adding it");
        const newStructure = initializeProfileExtensions();
        // Zachowaj inne pola, które mogą być w additional
        userData.additional = JSON.stringify({
          ...parsedAdditional,
          ...newStructure
        });
      } else {
        // Struktura już istnieje, nic nie zmieniaj
        console.log("profile_extensions structure already exists");
      }
    } catch (e) {
      console.error("Error parsing additional data:", e);
      // Nie można sparsować - inicjalizuj całą strukturę
      userData.additional = JSON.stringify(initializeProfileExtensions());
    }
  } else if (typeof userData.additional === 'object') {
    // Jeśli to już obiekt, ale brak profile_extensions
    if (!userData.additional.profile_extensions) {
      console.log("additional is object but no profile_extensions - adding it");
      const newStructure = initializeProfileExtensions();
      userData.additional = {
        ...userData.additional,
        ...newStructure
      };
    }
  }
  
  return userData;
};

/**
 * Pobiera strukturę profilu z danych użytkownika
 * @param {Object} userData - Dane użytkownika
 * @returns {Object} Struktura rozszerzeń profilu
 */
export const getProfileExtensions = (userData) => {
  if (!userData || !userData.additional) {
    console.log("No userData or userData.additional - returning initialized structure");
    return initializeProfileExtensions();
  }
  
  try {
    // Jeśli additional jest stringiem, sparsuj go
    if (typeof userData.additional === 'string') {
      const parsed = JSON.parse(userData.additional);
      
      // Sprawdź czy istnieje profile_extensions
      if (!parsed.profile_extensions) {
        console.log("No profile_extensions in parsed additional - merging with initialized structure");
        // Dodaj profile_extensions zachowując resztę pól
        const initialized = initializeProfileExtensions();
        return {
          ...parsed,
          ...initialized
        };
      }
      
      return parsed;
    }
    
    // Jeśli additional jest już obiektem
    if (!userData.additional.profile_extensions) {
      console.log("additional is object but no profile_extensions - merging with initialized structure");
      // Dodaj profile_extensions zachowując resztę pól
      const initialized = initializeProfileExtensions();
      return {
        ...userData.additional,
        ...initialized
      };
    }
    
    return userData.additional;
  } catch (e) {
    console.error("Error parsing profile extensions:", e);
    return initializeProfileExtensions();
  }
};

/**
 * Dodaje nowy element do określonego pola profilu
 * @param {string} userId - ID użytkownika
 * @param {string} fieldKey - Klucz pola profilu
 * @param {string} content - Treść do dodania
 * @param {string} source - Źródło informacji (np. ID funkcji)
 * @returns {Promise<Object>} Zaktualizowane dane użytkownika
 */
export const addProfileItem = async (userId, fieldKey, content, source) => {
  try {
    console.log(`Adding profile item for user: ${userId}, field: ${fieldKey}, content: ${content}`);
    
    // Pobranie aktualnych danych użytkownika
    const userData = await getUserData(userId);
    if (!userData) {
      throw new Error(`User data not found for ID: ${userId}`);
    }
    
    // Zapewnienie poprawnej struktury profilu
    ensureProfileStructure(userData);
    
    // Pobranie aktualnej struktury profilu
    const profileData = getProfileExtensions(userData);
    console.log("Current profile data:", profileData);
    
    // Sprawdzenie czy pole istnieje
    if (!profileData.profile_extensions[fieldKey]) {
      throw new Error(`Field ${fieldKey} does not exist in profile structure`);
    }
    
    // Dodanie nowego elementu
    const newItem = {
      id: uuidv4(),
      content,
      source,
      added_at: new Date().toISOString()
    };
    
    console.log(`Adding new item to ${fieldKey}:`, newItem);
    profileData.profile_extensions[fieldKey].items.push(newItem);
    profileData.profile_extensions[fieldKey].last_updated = new Date().toISOString();
    
    // Aktualizacja completion_rate
    profileData.meta.completion_rate = calculateCompletionRate(profileData);
    
    // Użyj specjalnej funkcji do aktualizacji profilu
    const { updateExtendedProfile } = await import('./airtableService');
    console.log("Calling updateExtendedProfile with profile data");
    const updatedRecord = await updateExtendedProfile(userId, profileData);
    console.log("Profile updated successfully");
    
    return updatedRecord;
  } catch (error) {
    console.error("Error adding profile item:", error);
    throw error;
  }
};

/**
 * Oblicza stopień wypełnienia profilu
 * @param {Object} profileData - Dane profilu
 * @returns {number} Stopień wypełnienia profilu (0-1)
 */
const calculateCompletionRate = (profileData) => {
  const fields = Object.keys(profileData.profile_extensions);
  let filledFields = 0;
  
  fields.forEach(field => {
    if (profileData.profile_extensions[field].items.length > 0) {
      filledFields++;
    }
  });
  
  return filledFields / fields.length;
};

/**
 * Pobiera dane użytkownika
 * @param {string} userId - ID użytkownika
 * @returns {Promise<Object>} Dane użytkownika
 */
const getUserData = async (userId) => {
  try {
    // Importuj funkcję z airtableService.js
    const { getUserById } = await import('./airtableService');
    console.log("Getting user data for ID:", userId);
    const userData = await getUserById(userId);
    console.log("Retrieved user data:", !!userData);
    return userData;
  } catch (error) {
    console.error("Error in getUserData:", error);
    throw error;
  }
};

/**
 * Aktualizuje strukturę profilu w Airtable
 * @param {string} userId - ID użytkownika
 * @param {Object} profileData - Nowa struktura profilu
 * @returns {Promise<Object>} Zaktualizowane dane użytkownika
 */
export const updateProfileExtensions = async (userId, profileData) => {
  try {
    const additionalField = JSON.stringify(profileData);
    
    // Aktualizacja w Airtable
    return await updateUserData(userId, {
      'Dodatkowe': additionalField
    });
  } catch (error) {
    console.error("Error updating profile extensions:", error);
    throw error;
  }
};