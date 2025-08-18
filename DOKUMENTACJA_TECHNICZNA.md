# ARCĀNUM Results Portal - Dokumentacja Techniczna

## 📋 Spis Treści
1. [Przegląd Systemu](#przegląd-systemu)
2. [Architektura](#architektura)
3. [Struktura Projektu](#struktura-projektu)
4. [Komponenty](#komponenty)
5. [Serwisy](#serwisy)
6. [Design System](#design-system)
7. [Konfiguracja](#konfiguracja)
8. [Deployment](#deployment)
9. [Rozwój](#rozwój)

---

## 🎯 Przegląd Systemu

**ARCĀNUM Results Portal** to zaawansowana aplikacja React do wyświetlania wyników analiz psychometrycznych. Implementuje 5-poziomową architekturę **Progressive Disclosure** z integracją AI (Gemini) i bazą danych (Airtable).

### Kluczowe Funkcjonalności:
- ✅ 5-poziomowa analiza psychometryczna
- ✅ Progressive loading (lazy loading poziomów)
- ✅ Integracja z Gemini AI
- ✅ Baza danych klientów w Airtable
- ✅ Responsywny design z animacjami
- ✅ Wielojęzyczność (PL/EN/CN)
- ✅ Elegancki design system ARCĀNUM

---

## 🏗️ Architektura

### Wzorzec Progressive Disclosure
```
Poziom 1: Hero Dashboard     → Ładuje natychmiast
Poziom 2: Strategic Dims     → Ładuje w tle (2s delay)
Poziom 3: Advanced Analytics → Ładuje na żądanie
Poziom 4: Hidden Gems        → Ładuje na żądanie  
Poziom 5: Academic Compass   → Ładuje na żądanie
```

### Flow Danych
```
URL (?client=ID) → ClientDataService → Airtable → GeminiEngine → UI Components
```

### Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: CSS Custom Properties + Framer Motion
- **AI**: Google Gemini API
- **Database**: Airtable
- **Build**: Vite + ESLint
- **Deployment**: Netlify ready

---

## 📁 Struktura Projektu

```
ARCANUMTest/nowypanel/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── arcanum/           # Komponenty UI
│   │       ├── ArcanumLayout.jsx      # 🏠 Główny layout
│   │       ├── HeroDashboard.jsx      # 📊 Poziom 1
│   │       ├── StrategicDimensions.jsx # 🎯 Poziom 2
│   │       ├── AdvancedAnalytics.jsx  # 📈 Poziom 3
│   │       ├── HiddenGems.jsx         # 💎 Poziom 4
│   │       ├── AcademicCompass.jsx    # 🧭 Poziom 5
│   │       ├── ArcanumHeader.jsx      # 🔝 Nagłówek
│   │       ├── ArcanumFooter.jsx      # 🔻 Stopka
│   │       ├── ArcanumLoader.jsx      # ⏳ Loading
│   │       ├── ErrorPage.jsx          # ❌ Błędy
│   │       └── index.js               # 📦 Eksporty
│   ├── services/
│   │   ├── client-data-service.js     # 🗄️ Airtable API
│   │   ├── gemini-engine.js           # 🤖 Gemini AI
│   │   └── arcanum-prompts.js         # 📝 AI Prompts
│   ├── contexts/
│   │   └── ArcanumContext.jsx         # 🔄 State Management
│   ├── assets/
│   │   └── styles/
│   │       ├── arcanum-theme.css      # 🎨 Design System
│   │       └── arcanum-levels.css     # 📐 Level Styles
│   ├── App.jsx                        # 🚀 Root Component
│   ├── main.jsx                       # 🎬 Entry Point
│   └── index.css                      # 🎨 Global Styles
├── .env                               # 🔐 Environment Variables
├── package.json                       # 📦 Dependencies
├── vite.config.js                     # ⚙️ Vite Config
└── DOKUMENTACJA_TECHNICZNA.md         # 📚 Ta dokumentacja
```

---

## 🧩 Komponenty

### 1. ArcanumLayout.jsx - Główny Orchestrator
**Odpowiedzialność:**
- Zarządzanie stanem aplikacji
- Inicjalizacja serwisów (Airtable + Gemini)
- Nawigacja między poziomami
- Obsługa błędów i loading states

**Kluczowe funkcje:**
```javascript
initializeClient()     // Inicjalizacja klienta
loadLevel(number)      // Ładowanie poziomu analizy
navigateToLevel(level) // Nawigacja między poziomami
retryLevel(number)     // Ponowne ładowanie poziomu
```

**Stan:**
```javascript
const [clientData, setClientData] = useState(null);
const [analysisResults, setAnalysisResults] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [currentLevel, setCurrentLevel] = useState(1);
const [levelLoadingStates, setLevelLoadingStates] = useState({...});
```

### 2. Komponenty Poziomów (1-5)

#### HeroDashboard.jsx - Poziom 1
- **Cel**: Pierwszy kontakt, przegląd główny
- **Zawartość**: Metryki kluczowe, profil klienta
- **Loading**: Natychmiastowy

#### StrategicDimensions.jsx - Poziom 2  
- **Cel**: Wymiary strategiczne osobowości
- **Zawartość**: Analiza wymiarów, wykresy
- **Loading**: W tle po 2s

#### AdvancedAnalytics.jsx - Poziom 3
- **Cel**: Zaawansowane analizy statystyczne
- **Zawartość**: Korelacje, predykcje
- **Loading**: Na żądanie

#### HiddenGems.jsx - Poziom 4
- **Cel**: Ukryte talenty i potencjały
- **Zawartość**: Niestandardowe insights
- **Loading**: Na żądanie

#### AcademicCompass.jsx - Poziom 5
- **Cel**: Rekomendacje akademickie/zawodowe
- **Zawartość**: Ścieżki rozwoju, kierunki
- **Loading**: Na żądanie

### 3. Komponenty Pomocnicze

#### ArcanumHeader.jsx
- Logo ARCĀNUM
- Informacje o kliencie
- Nawigacja poziomów

#### ArcanumFooter.jsx
- Informacje prawne
- Linki kontaktowe
- Wersja aplikacji

#### ArcanumLoader.jsx
- Elegancki spinner
- Komunikaty ładowania
- Animacje CSS

#### ErrorPage.jsx
- Obsługa błędów
- Retry functionality
- User-friendly messages

---

## 🔧 Serwisy

### 1. ClientDataService (client-data-service.js)

**Odpowiedzialność:** Komunikacja z Airtable

**Kluczowe metody:**
```javascript
// Pobierz dane wektorów psychometrycznych
getClientVectors(clientId)

// Sprawdź dostęp klienta
validateClientAccess(clientId)

// Pobierz podstawowe info
getClientBasicInfo(clientId)

// Zaloguj dostęp
logAccess(clientId, accessInfo)

// Pobierz statystyki (opcjonalne)
getClientStats(clientId)
```

**Konfiguracja:**
```javascript
// Wymagane zmienne środowiskowe
VITE_AIRTABLE_API_KEY=your_key
VITE_AIRTABLE_BASE_ID=your_base
VITE_AIRTABLE_TABLE_NAME=Clients
```

**Format danych klienta:**
```javascript
{
  profileId: "client123",
  timestamp: "2024-01-01T00:00:00.000Z",
  clientInfo: {
    name: "Jan Kowalski",
    email: "jan@example.com",
    company: "ACME Corp",
    position: "Manager",
    testDate: "2024-01-01"
  },
  data: {
    primary_positive: [...],
    primary_negative: [...],
    secondary_positive: [...],
    secondary_negative: [...]
  },
  metadata: {
    testVersion: "1.0",
    language: "pl",
    completionRate: 100,
    validityScore: 95
  }
}
```

### 2. GeminiEngine (gemini-engine.js)

**Odpowiedzialność:** Generowanie analiz AI

**Kluczowe metody:**
```javascript
// Inicjalizacja sesji
initializeSession(clientData)

// Generowanie poziomu analizy
generateLevel(levelNumber)

// Generowanie analizy z kontekstem
generateLevelAnalysis(level, clientData, previousLevels)
```

**Konfiguracja:**
```javascript
// Wymagane zmienne środowiskowe
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GEMINI_MODEL=gemini-1.5-pro

// Alternatywnie OpenRouter
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 3. ArcanumPrompts (arcanum-prompts.js)

**Odpowiedzialność:** Szablony promptów dla AI

**Struktura:**
```javascript
export const LEVEL_PROMPTS = {
  1: { // Hero Dashboard
    systemPrompt: "...",
    userPrompt: "...",
    outputFormat: {...}
  },
  2: { // Strategic Dimensions
    systemPrompt: "...",
    userPrompt: "...",
    outputFormat: {...}
  },
  // ... poziomy 3-5
};
```

---

## 🎨 Design System

### Kolorystyka ARCĀNUM
```css
:root {
  /* Kolory główne */
  --arcanum-swiss-gold: #D4AF37;      /* Złoty akcent */
  --arcanum-deep-navy: #1B2951;       /* Granatowe tło */
  --arcanum-premium-silver: #C0C0C0;   /* Srebrne elementy */
  --arcanum-forest-green: #2D5016;     /* Zielone akcenty */
  --arcanum-charcoal: #36454F;         /* Ciemne elementy */
  --arcanum-authority-blue: #003366;    /* Niebieski autorytet */
  --arcanum-pearl-white: #F8F8FF;      /* Białe teksty */
  --arcanum-midnight: #0F1419;         /* Czarne teksty */
}
```

### Gradienty
```css
/* Główny gradient hero */
--arcanum-gradient-hero: linear-gradient(135deg, 
  var(--arcanum-authority-blue), 
  var(--arcanum-deep-navy)
);

/* Gradient akcentowy */
--arcanum-gradient-accent: linear-gradient(90deg, 
  var(--arcanum-swiss-gold), 
  var(--arcanum-premium-silver)
);

/* Gradient strategiczny */
--arcanum-gradient-strategic: linear-gradient(180deg, 
  var(--arcanum-forest-green), 
  var(--arcanum-deep-navy)
);
```

### Typografia
```css
/* Fonty */
--arcanum-font-display: 'Inter', 'Noto Sans', 'Noto Sans SC', sans-serif;
--arcanum-font-body: 'Inter', 'Noto Sans', 'Noto Sans SC', sans-serif;
--arcanum-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Spacing System
```css
--arcanum-spacing-xs: 0.5rem;   /* 8px */
--arcanum-spacing-sm: 1rem;     /* 16px */
--arcanum-spacing-md: 1.5rem;   /* 24px */
--arcanum-spacing-lg: 2rem;     /* 32px */
--arcanum-spacing-xl: 3rem;     /* 48px */
--arcanum-spacing-2xl: 4rem;    /* 64px */
```

### Komponenty UI

#### Karty (Cards)
```css
.metric-card {
  background: var(--arcanum-gradient-card);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: var(--arcanum-radius-lg);
  backdrop-filter: blur(10px);
  transition: all var(--arcanum-transition-normal);
}
```

#### Przyciski
```css
.cta-button {
  background: linear-gradient(135deg, var(--arcanum-swiss-gold), #B8860B);
  border-radius: var(--arcanum-radius-md);
  color: var(--arcanum-midnight);
  transition: all var(--arcanum-transition-normal);
}
```

#### Progress Indicator
```css
.progress-dot {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(212,175,55,0.3);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}
```

---

## ⚙️ Konfiguracja

### 1. Zmienne Środowiskowe (.env)
```bash
# Gemini AI API
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-pro

# Airtable Configuration
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_AIRTABLE_TABLE_NAME=Clients

# Development Mode
VITE_DEMO_MODE=true

# OpenRouter API (alternatywa)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Application Settings
VITE_APP_NAME=ARCĀNUM Results Portal
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=true
```

### 2. Struktura Airtable

**Tabela: Clients**
```
Pola wymagane:
- client_id (Text) - unikalny identyfikator
- name (Text) - imię i nazwisko
- email (Email) - adres email
- company (Text) - firma
- position (Text) - stanowisko
- test_date (Date) - data testu
- access_granted (Checkbox) - czy ma dostęp
- expiry_date (Date) - data wygaśnięcia dostępu
- primary_positive (Long text) - dane wektora
- primary_negative (Long text) - dane wektora
- secondary_positive (Long text) - dane wektora
- secondary_negative (Long text) - dane wektora
- test_version (Text) - wersja testu
- language (Single select: pl/en/cn) - język
- completion_rate (Number) - % ukończenia
- validity_score (Number) - wynik ważności
```

**Tabela: Access_Logs (opcjonalna)**
```
- client_id (Text)
- access_timestamp (Date)
- ip_address (Text)
- user_agent (Long text)
- session_duration (Number)
```

### 3. Package.json - Kluczowe Zależności
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.4",
    "airtable": "^0.12.2",
    "prop-types": "^15.8.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "eslint": "^8.45.0"
  }
}
```

---

## 🚀 Deployment

### 1. Netlify (Zalecane)
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Dodaj wszystkie VITE_* zmienne w Netlify dashboard
```

### 2. Vercel
```bash
# vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ]
}
```

### 3. Manual Deploy
```bash
# Build
npm run build

# Upload dist/ folder to hosting
```

---

## 🔄 Rozwój

### 1. Uruchomienie Lokalne
```bash
# Instalacja zależności
npm install

# Konfiguracja .env
cp .env.example .env
# Uzupełnij klucze API

# Uruchomienie dev server
npm run dev

# Aplikacja dostępna na http://localhost:5173
```

### 2. Testowanie
```bash
# URL testowy
http://localhost:5173/?client=test123

# Sprawdź konsole browser dla logów
```

### 3. Dodawanie Nowego Poziomu

**Krok 1: Utwórz komponent**
```javascript
// src/components/arcanum/NewLevel.jsx
export const NewLevel = ({ data, loading, onRetry }) => {
  // Implementacja komponentu
};
```

**Krok 2: Dodaj do ArcanumLayout**
```javascript
// W ArcanumLayout.jsx
import { NewLevel } from './NewLevel.jsx';

// Dodaj do levelLoadingStates
const [levelLoadingStates, setLevelLoadingStates] = useState({
  // ... istniejące poziomy
  6: false  // Nowy poziom
});

// Dodaj do AnimatePresence
{currentLevel === 6 && (
  <motion.div key="level6">
    <NewLevel 
      data={analysisResults.level6} 
      loading={levelLoadingStates[6]}
      onRetry={() => retryLevel(6)}
    />
  </motion.div>
)}
```

**Krok 3: Dodaj prompt**
```javascript
// W arcanum-prompts.js
export const LEVEL_PROMPTS = {
  // ... istniejące poziomy
  6: {
    systemPrompt: "Jesteś ekspertem...",
    userPrompt: "Przeanalizuj...",
    outputFormat: {
      // Struktura odpowiedzi
    }
  }
};
```

### 4. Customizacja Design System

**Dodawanie nowych kolorów:**
```css
/* W arcanum-theme.css */
:root {
  --arcanum-new-color: #FF6B6B;
}
```

**Nowe komponenty:**
```css
.new-component {
  background: var(--arcanum-gradient-card);
  border: 1px solid var(--arcanum-new-color);
  /* ... style */
}
```

### 5. Integracja z Nową Stroną

**Opcja 1: Standalone**
- Deploy jako osobna aplikacja
- Link z głównej strony

**Opcja 2: Embedded**
- Import komponentów do głównej aplikacji
- Shared design system

**Opcja 3: Micro-frontend**
- Module federation
- Niezależne deployment

---

## 🐛 Debugging

### 1. Częste Problemy

**Problem: Błąd 404 Airtable**
```javascript
// Sprawdź .env
VITE_AIRTABLE_API_KEY=correct_key
VITE_AIRTABLE_BASE_ID=correct_base

// Sprawdź konsole
console.log('API Key:', import.meta.env.VITE_AIRTABLE_API_KEY);
```

**Problem: Gemini API Error**
```javascript
// Sprawdź klucz API
VITE_GEMINI_API_KEY=correct_key

// Sprawdź model
VITE_GEMINI_MODEL=gemini-1.5-pro
```

**Problem: CSS nie ładuje się**
```javascript
// Sprawdź import w App.jsx
import './assets/styles/arcanum-theme.css';
import './assets/styles/arcanum-levels.css';
```

### 2. Logi Debug
```javascript
// Włącz debug mode w .env
VITE_DEBUG_MODE=true

// Sprawdź konsole browser dla szczegółowych logów
```

### 3. Network Tab
- Sprawdź requests do Airtable
- Sprawdź requests do Gemini API
- Sprawdź response codes i errors

---

## 📚 Dodatkowe Zasoby

### Dokumentacja API:
- [Airtable API](https://airtable.com/developers/web/api/introduction)
- [Google Gemini API](https://ai.google.dev/docs)
- [OpenRouter API](https://openrouter.ai/docs)

### React/Vite:
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

### Design:
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Glassmorphism](https://css.glass/)

---

## 👥 Kontynuacja Pracy

### Dla Nowych Developerów:

1. **Zacznij od:** Przeczytania tej dokumentacji
2. **Następnie:** Uruchom lokalnie z `npm run dev`
3. **Potem:** Przejrzyj komponenty w kolejności: App.jsx → ArcanumLayout.jsx → HeroDashboard.jsx
4. **Na koniec:** Eksperymentuj z design system w arcanum-theme.css

### Dla Designerów:

1. **Design System:** `src/assets/styles/arcanum-theme.css`
2. **Kolory:** Sekcja `:root` z CSS variables
3. **Komponenty:** Każdy poziom ma własny plik .jsx
4. **Animacje:** Framer Motion w ArcanumLayout.jsx

### Dla Product Managerów:

1. **Flow użytkownika:** URL → Airtable → Gemini → 5 poziomów
2. **Metryki:** Logi w Airtable Access_Logs
3. **Konfiguracja:** Zmienne środowiskowe w .env
4. **Deployment:** Netlify/Vercel ready

---

**Ostatnia aktualizacja:** 17.08.2025  
**Wersja dokumentacji:** 1.0  
**Autor:** Cline AI Assistant  
**Status:** ✅ Gotowe do produkcji
