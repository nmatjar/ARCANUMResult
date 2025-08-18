import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' },
    { code: 'zh', name: '中文' },
  ];

  const style = {
    button: {
      backgroundColor: 'transparent',
      border: '1px solid #D4AF37',
      color: '#D4AF37',
      padding: '5px 10px',
      margin: '0 5px',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    activeButton: {
      backgroundColor: '#D4AF37',
      color: '#1B2951',
    },
  };

  return (
    <div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          style={{
            ...style.button,
            ...(i18n.language === lang.code ? style.activeButton : {}),
          }}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
