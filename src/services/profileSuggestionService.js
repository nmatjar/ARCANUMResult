import { PROFILE_EXTENSION_FIELDS } from './profileExtensionsService';
import { callOpenRouterAPI } from '../utils/openRouterApi';

/**
 * Analizuje odpowiedź AI w poszukiwaniu informacji pasujących do pól profilu
 * @param {string} aiResponse - Odpowiedź AI do analizy
 * @param {Object} userData - Dane użytkownika z kontekstu
 * @returns {Promise<Array>} Tablica sugestii do profilu
 */
export const analyzeResponseForProfileData = async (aiResponse, userData) => {
  try {
    // Przygotowanie promptu dla LLM
    const prompt = createAnalysisPrompt(aiResponse, userData);
    
    // Wywołanie LLM do analizy treści
    const llmResponse = await callOpenRouterAPI(
      prompt, 
      'google/gemini-2.0-flash-lite-001', 
      'Jesteś ekspertem od analizy tekstów i wydobywania informacji. Twoim zadaniem jest przeanalizować tekst odpowiedzi AI i znaleźć informacje pasujące do pól profilu użytkownika.'
    );
    
    try {
      // Parsowanie odpowiedzi LLM jako JSON
      const parsedResponse = JSON.parse(
        llmResponse.replace(/```json/g, '').replace(/```/g, '').trim()
      );
      
      if (parsedResponse && parsedResponse.suggestions) {
        return parsedResponse.suggestions.filter(s => s.confidence > 0.7);
      }
      console.error("Invalid LLM response format:", llmResponse);
      return [];
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError, "Raw response:", llmResponse);
      return [];
    }
  } catch (error) {
    console.error("Error analyzing response for profile data:", error);
    return [];
  }
};

/**
 * Tworzy prompt dla LLM do analizy odpowiedzi
 * @param {string} aiResponse - Odpowiedź AI do analizy
 * @param {Object} userData - Dane użytkownika
 * @returns {string} Prompt dla LLM
 */
const createAnalysisPrompt = (aiResponse, userData) => {
  // Pobranie aktualnego stanu profilu
  const profileExtensions = userData.additional ? 
    (typeof userData.additional === 'string' ? 
      JSON.parse(userData.additional) : 
      userData.additional) : 
    { profile_extensions: {} };

  // Lista dostępnych pól profilu
  const fieldsInfo = Object.entries(PROFILE_EXTENSION_FIELDS).map(([key, field]) => {
    const currentItems = profileExtensions?.profile_extensions?.[key]?.items || [];
    const itemsDescription = currentItems.length > 0 
      ? `zawiera ${currentItems.length} elementów: [${currentItems.map(item => `"${item.content}"`).join(', ')}]`
      : 'jest puste';
    
    return `- ${key} (${field.label}): obecnie ${itemsDescription}
    Prompt dla tego pola: "${field.prompt}"`;
  }).join('\n');

  return `Twoim zadaniem jest przeanalizowanie odpowiedzi AI i znalezienie informacji, które mogłyby uzupełnić profil użytkownika.

ODPOWIEDŹ AI DO PRZEANALIZOWANIA:
"""
${aiResponse}
"""

DOSTĘPNE POLA PROFILU UŻYTKOWNIKA:
${fieldsInfo}

INSTRUKCJE:
1. Przeanalizuj dokładnie treść odpowiedzi AI.
2. Zidentyfikuj konkretne informacje, które mogą uzupełnić któreś z powyższych pól profilu.
3. Dla każdej znalezionej informacji utwórz sugestię, zawierającą:
   - Klucz pola (np. "dream_job")
   - Konkretną wartość (zwięzłą, nie całe akapity)
   - Stopień pewności (0.0-1.0)
   - Uzasadnienie, dlaczego ta informacja pasuje do danego pola

TWOJA ODPOWIEDŹ MUSI BYĆ W FORMACIE JSON:
{
  "suggestions": [
    {
      "field": "klucz_pola",
      "value": "konkretna, zwięzła wartość (nie cały akapit!)",
      "confidence": 0.0-1.0,
      "reasoning": "uzasadnienie dlaczego ta informacja pasuje do tego pola"
    }
  ]
}

WAŻNE:
- Podaj tylko sugestie o confidence > 0.7
- Wyciągaj konkretne, zwięzłe wartości, nie całe akapity
- Jeśli nie znajdziesz żadnych pasujących informacji, zwróć pustą tablicę suggestions
- Upewnij się, że Twoja odpowiedź jest poprawnym JSON
- Nie dodawaj żadnego tekstu przed ani po JSON`;
};

/**
 * Mock funkcji analizującej treść z LLM (do zastąpienia faktycznym wywołaniem API)
 * @param {string} aiResponse - Odpowiedź AI do analizy
 * @returns {Promise<Object>} Wynik analizy
 */
const mockLLMAnalysis = async (aiResponse) => {
  // Ta funkcja symuluje odpowiedź z LLM
  // W rzeczywistej aplikacji zastąpić faktycznym wywołaniem API LLM

  // Szukamy kilku kluczowych fraz, które mogłyby wskazywać na potencjalne dane do profilu
  const suggestions = [];
  
  // Przykładowe wyszukiwanie wzorców w tekście
  if (aiResponse.includes('ideal') && aiResponse.includes('company')) {
    suggestions.push({
      field: 'ideal_company',
      value: 'A company with strong values and room for growth',
      confidence: 0.8,
      reasoning: 'Text mentions ideal company characteristics'
    });
  }
  
  if (aiResponse.includes('skill') && (aiResponse.includes('learn') || aiResponse.includes('develop'))) {
    suggestions.push({
      field: 'skills_to_develop',
      value: 'Data analysis and visualization',
      confidence: 0.85,
      reasoning: 'Text mentions skills that the user wants to develop'
    });
  }
  
  if (aiResponse.includes('work') && aiResponse.includes('environment')) {
    suggestions.push({
      field: 'work_environment',
      value: 'Collaborative environment with creative freedom',
      confidence: 0.9,
      reasoning: 'Text explicitly describes preferred work environment'
    });
  }
  
  // W prawdziwej implementacji LLM będzie znacznie lepiej wykrywał te informacje
  return { suggestions };
};

/**
 * Wywołuje LLM dla analizy tekstu
 * @param {string} prompt - Prompt dla LLM
 * @returns {Promise<string>} Odpowiedź LLM
 */
const callLLMForAnalysis = async (prompt) => {
  return await callOpenRouterAPI(
    prompt,
    'google/gemini-2.0-flash-lite-001',
    'Jesteś ekspertem od analizy tekstów i wydobywania informacji. Twoja odpowiedź musi być w formacie JSON.'
  );
};