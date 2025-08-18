import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import ChatLLM from './ChatLLM';

export const AIAssistantResult = ({ feature, onBackClick }) => {
  const { userData } = useUserContext(); // Pobieramy dane użytkownika z kontekstu
  
  const [personData, setPersonData] = useState({
    name: 'Użytkownik', // Domyślna wartość
    wiek: '',
    plec: '',
    etapKariery: '',
    zainteresowania: '',
    obecnaPraca: '',
    docelowaPraca: '',
    edukacja: '',
    umiejetnosci: '',
    sektor: '',
    pracaLudzie: '',
    miejscePracy: '',
    opisTypu: '',
    czynniki: '',
    czynnikiPelne: ''
  });

  const [stats, setStats] = useState({
    podstawowePozytywne: [],
    podstawoweNegatywne: [],
    dodatkowePozytywne: [],
    dodatkoweNegatywne: []
  });

  // Pobierz dane użytkownika z kontekstu i przekształć je do formatu oczekiwanego przez ChatLLM
  useEffect(() => {
    try {
      if (userData) {
        console.log('Dostępne dane użytkownika z Airtable:', userData);
        
        // Aktualizacja danych na podstawie userData z Airtable
        setPersonData({
          name: userData.name || 'Użytkownik',
          wiek: userData.age || '',
          plec: userData.gender || '', 
          etapKariery: userData.career_stage || '',
          zainteresowania: userData.interests || '',
          obecnaPraca: userData.current_job || '',
          docelowaPraca: userData.target_job || '',
          edukacja: userData.education || '',
          umiejetnosci: userData.skills || '',
          sektor: userData.sector || '',
          pracaLudzie: userData.work_style || '',
          miejscePracy: userData.work_environment_features || '',
          opisTypu: userData.personality_traits || userData.personality_type || '',
          czynniki: userData.personality_type || '',
          czynnikiPelne: userData.complete_factors || ''
        });
        
        // Możemy też zbudować podstawowe dane statystyczne na podstawie dostępnych informacji
        // TODO: W przyszłości możemy dodać prawdziwe dane analizy z BBT
      }
    } catch (error) {
      console.error('Błąd podczas ładowania danych użytkownika:', error);
    }
  }, [userData]);

  return (
    <ChatLLM 
      personData={personData} 
      analysisData={stats} 
      onClose={onBackClick} 
    />
  );
};