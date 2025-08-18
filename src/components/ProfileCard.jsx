import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { PROFILE_EXTENSION_FIELDS } from '../services/profileExtensionsService';
import { generateAvatarWithStyle } from '../services/avatarService';
import '../assets/styles/ProfileCard.css';

const ProfileCard = () => {
  const { userData, updateUserData } = useUserContext();
  const [profileExtensions, setProfileExtensions] = useState({});
  const [hasExtensions, setHasExtensions] = useState(false);
  const [showExtensionSection, setShowExtensionSection] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState('realistic');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState('');
  
  // Parsowanie dodatkowych danych profilu przy ładowaniu komponentu
  useEffect(() => {
    if (userData?.additional) {
      try {
        console.log("Parsing additional data:", userData.additional);
        
        const additionalData = typeof userData.additional === 'string' 
          ? JSON.parse(userData.additional) 
          : userData.additional;
          
        console.log("Parsed additional data:", additionalData);
          
        if (additionalData?.profile_extensions) {
          setProfileExtensions(additionalData.profile_extensions);
          
          // Sprawdź czy są jakiekolwiek wypełnione pola
          const hasAnyData = Object.values(additionalData.profile_extensions).some(
            field => field.items && field.items.length > 0
          );
          console.log("Has any extension data:", hasAnyData);
          setHasExtensions(hasAnyData);
        } else {
          console.log("No profile_extensions found in additionalData");
        }
      } catch (error) {
        console.error("Error parsing profile extensions:", error);
      }
    } else {
      console.log("No additional data in userData:", userData);
    }
  }, [userData]);

  // Default avatar if no image is available
  const defaultAvatar = userData?.name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=indigo&color=fff&bold=true`
    : 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png';
  
  // Funkcja do obsługi błędów ładowania obrazu
  const handleImageError = (e) => {
    e.target.onerror = null; // Zapobiega zapętleniu błędów
    if (userData?.name) {
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=indigo&color=fff&bold=true`;
    } else {
      e.target.src = 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png';
    }
  };
  
  // Avatar style options
  const avatarStyles = [
    { id: 'realistic', name: 'Realistyczny' },
    { id: 'anime', name: 'Anime' },
    { id: 'cartoon', name: 'Kreskówkowy' },
    { id: 'pixar', name: 'Pixar' },
    { id: 'minecraft', name: 'Minecraft/Low-Poly' }, // Added Minecraft style
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'steampunk', name: 'Steampunk' },
    { id: 'watercolor', name: 'Akwarela' },
    { id: 'oil-painting', name: 'Obraz olejny' },
    { id: 'comic', name: 'Komiks' }
  ];
  
  // Function to generate avatar with selected style
  const handleGenerateAvatar = async () => {
    if (!userData?.id || isGeneratingAvatar) return;
    
    try {
      setIsGeneratingAvatar(true);
      setAvatarStatus('Generowanie awatara...');
      
      // Build a comprehensive profile description for better avatar generation
      const profileDescription = `${userData.gender || 'Osoba'}, ${userData.age || '30'} lat, 
        typ osobowości ${userData.personality_type || 'nieznany'}, 
        pracuje jako ${userData.current_job || 'specjalista'}, 
        interesuje się ${userData.interests || 'różnymi tematami'},
        wykształcenie: ${userData.education || 'wyższe'},
        styl pracy: ${userData.work_style || 'niezdefiniowany'}`;
        
      // Generate avatar and update in Airtable
      const result = await generateAvatarWithStyle(
        userData.id, 
        selectedAvatarStyle, 
        profileDescription
      );
      
      if (result.success) {
        setAvatarStatus('Avatar wygenerowany pomyślnie!');
        updateUserData(); // Refresh user data to get the new avatar URL
      } else {
        setAvatarStatus(`Błąd: ${result.message || 'Nie udało się wygenerować avatara'}`);
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      setAvatarStatus('Wystąpił błąd podczas generowania awatara');
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Function to render attribute with icon
  const renderAttribute = (icon, label, value, colorClass) => {
    return (
      <div className={`profile-attribute ${colorClass}`}>
        <div className="attribute-icon">
          <i className={icon}></i>
        </div>
        <div className="attribute-content">
          <span className="attribute-label">{label}</span>
          <span className="attribute-value">{value || 'Nie określono'}</span>
        </div>
      </div>
    );
  };
  
  // Function to render extension attribute
  const renderExtensionAttribute = (fieldKey) => {
    if (!profileExtensions[fieldKey] || !profileExtensions[fieldKey].items || profileExtensions[fieldKey].items.length === 0) {
      return null;
    }
    
    const field = PROFILE_EXTENSION_FIELDS[fieldKey];
    const items = profileExtensions[fieldKey].items;
    
    return (
      <div className={`profile-attribute extension-attribute color-${fieldKey}`}>
        <div className="attribute-icon">
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="attribute-content">
          <span className="attribute-label">{field.label}</span>
          <div className="attribute-value extension-items">
            {items.map((item, index) => (
              <div key={item.id || index} className="extension-item">
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Function to capitalize first letter of each word
  const capitalize = (text) => {
    if (!text) return '';
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (!userData) {
    return <div className="profile-card-empty">Brak danych profilu</div>;
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-name">{userData.name || 'Użytkownik'}</h2>
        <div className="profile-tokens">
          <i className="fa-solid fa-bolt"></i>
          <span>{userData.tokens || 0} jednostek energii</span>
        </div>
      </div>
      
      <div className="profile-content-wrapper">
        <div className="profile-left-column">
          <div className="profile-section">
            <h3 className="section-title">Profil osobisty</h3>
            {renderAttribute("fa-solid fa-fingerprint", "Typ osobowości", userData.personality_type, "color-personality")}
            {renderAttribute("fa-solid fa-venus-mars", "Płeć", capitalize(userData.gender), "color-gender")}
            {renderAttribute("fa-solid fa-calendar", "Wiek", userData.age, "color-age")}
          </div>
          
          <div className="profile-section">
            <h3 className="section-title">Kariera i umiejętności</h3>
            {renderAttribute("fa-solid fa-building", "Obecna praca", userData.current_job, "color-job")}
            {renderAttribute("fa-solid fa-briefcase", "Docelowa praca", userData.target_job, "color-target")}
            {renderAttribute("fa-solid fa-graduation-cap", "Wykształcenie", userData.education, "color-education")}
          </div>
        </div>
        
        <div className="profile-center-column">
          <div className="profile-avatar">
            <img 
              src={userData.image || defaultAvatar} 
              alt="Avatar użytkownika" 
              onError={handleImageError} 
            />
          </div>
          
          <div className="avatar-style-selector">
            <label className="avatar-style-label">Styl awatara</label>
            <select 
              className="avatar-style-select"
              value={selectedAvatarStyle}
              onChange={(e) => setSelectedAvatarStyle(e.target.value)}
            >
              {avatarStyles.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
            
            <button 
              className="avatar-generate-btn"
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar || !userData?.id}
            >
              {isGeneratingAvatar ? (
                <>
                  <span className="avatar-generation-spinner"></span>
                  Generowanie...
                </>
              ) : 'Wygeneruj awatar'}
            </button>
            
            {avatarStatus && (
              <div className="avatar-generation-status">
                {avatarStatus}
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-right-column">
          <div className="profile-section">
            <h3 className="section-title">Predyspozycje</h3>
            {renderAttribute("fa-solid fa-heart", "Zainteresowania", userData.interests, "color-interests")}
            {renderAttribute("fa-solid fa-brain", "Umiejętności", userData.skills, "color-skills")}
            {renderAttribute("fa-solid fa-lightbulb", "Styl pracy", userData.work_style, "color-work-style")}
          </div>
          
          {/* Przycisk do rozwijania sekcji dodatkowych informacji */}
          <div className="profile-section">
            <div 
              className="extended-profile-toggle"
              onClick={() => {
                setShowExtensionSection(!showExtensionSection);
                // Odśwież dane profilu przy pierwszym otwarciu
                if (!showExtensionSection && !hasExtensions) {
                  updateUserData();
                }
              }}
            >
              <h3 className="section-title">
                Dodatkowe informacje
                <i className={`fa-solid ${showExtensionSection ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </h3>
            </div>
            
            {/* Sekcja rozszerzonego profilu, wyświetlana po kliknięciu */}
            {showExtensionSection && (
              <div className="extended-profile-section">
                {hasExtensions ? (
                  <>
                    {renderExtensionAttribute('dream_job')}
                    {renderExtensionAttribute('career_values')}
                    {renderExtensionAttribute('work_environment')}
                    {renderExtensionAttribute('skills_to_develop')}
                    {renderExtensionAttribute('career_goals')}
                    {renderExtensionAttribute('leadership_style')}
                    {renderExtensionAttribute('ideal_company')}
                    {renderExtensionAttribute('work_challenges')}
                    {renderExtensionAttribute('motivation_factors')}
                    {renderExtensionAttribute('preferred_tasks')}
                  </>
                ) : (
                  <div className="no-extensions-message">
                    Brak dodatkowych informacji. Dodaj je, akceptując sugestie pojawiające się pod wynikami analiz.
                    <button className="refresh-extensions-btn" onClick={updateUserData}>
                      <i className="fa-solid fa-rotate"></i> Odśwież
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <div className="profile-code">
          <i className="fa-solid fa-key"></i>
          <span>Kod dostępu: {userData.code}</span>
        </div>
        <div className="profile-date">
          <i className="fa-solid fa-clock"></i>
          <span>Data rejestracji: {userData.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;