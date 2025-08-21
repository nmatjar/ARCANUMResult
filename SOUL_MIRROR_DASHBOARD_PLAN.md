# Lustro Duszy - Plan Implementacji Futurystycznego Dashboardu BBT/OTK

## Przegląd Projektu

**Nazwa**: "Lustro Duszy: Twój Portal Rozwoju Osobistego" (Soul Mirror: Your Personal Development Portal)

**Cel**: Stworzenie futurystycznego, interaktywnego dashboardu do prezentacji wyników analizy BBT/OTK w stylu "chińskiego centrum misji" - zaawansowanego, estetycznego i głęboko analitycznego interfejsu.

## Struktura Danych BBT/OTK

### 1. Czynniki Prymalne (10 głównych)
- **Oznaczenia**: W, K, SH, SE, Z, V, G, M, OR, ON
- **Zakres danych**: 
  - `+` (liczba wyborów pozytywnych)
  - `–` (liczba wyborów negatywnych)  
  - `wektor = (+) – (–)`
- **Znaczenie**: Główne kierunki energii psychicznej

**Każdy czynnik ma 3 stany:**
- `+` = przyciąganie (potrzeba, dążenie)
- `–` = odpychanie (awersja, cień)
- `0` = obojętność / równowaga

#### Szczegółowe Opisy Czynników Prymalnych

| Kod | Nazwa | Znaczenie (+) | Znaczenie (–) |
|-----|-------|---------------|---------------|
| **W** | Ciepło / Bliskość | potrzeba czułości, więzi, bezpieczeństwa emocjonalnego | dystans, chłód emocjonalny |
| **K** | Siła / Walka | odwaga, obrona, gotowość do konfrontacji | unikanie przemocy, niechęć do siłowych rozwiązań |
| **SH** | Pomoc / Opieka | troska o innych, altruizm, wsparcie | niechęć do opieki, brak potrzeby bycia pomocnym |
| **SE** | Ruch / Energia | aktywność, dynamizm, ryzyko | pasywność, unikanie nadmiaru bodźców |
| **Z** | Urok / Estetyka | estetyka, wygląd, prezentacja siebie | lekceważenie wyglądu i formy |
| **V** | Rozum / Logika | intelekt, analiza, porządek, wiedza | odrzucenie chłodnej logiki, niechęć do analizy |
| **G** | Duchowość / Twórczość | sens, idea, inspiracja, wyobraźnia | brak potrzeby metafizyki, unikanie wizjonerstwa |
| **M** | Materia / Trwałość | stabilność, struktura, własność, organizacja | ucieczka od obowiązków i trwałych struktur |
| **OR** | Mowa / Kontakty | komunikacja, dialog, społeczność | dystans, niechęć do rozmów, zamknięcie |
| **ON** | Zmysły / Konsumpcja | jedzenie, przyjemności cielesne, sensualność | wstrzemięźliwość, brak potrzeby cielesnych doznań |

### 2. Czynniki Sekundarne (10, małe litery)
- **Oznaczenia**: w, k, sh, se, z, v, g, m, or, on (małe litery)
- **Zakres**: –12 … +12
- **Znaczenie**: Sposób realizacji czynników prymalnych - w którą stronę „ciągnie" energia

**Interpretacja wartości:**
- **dodatnie** = ekspansja, aktywność, otwarcie
- **ujemne** = introwersja, zachowawczość, wycofanie

#### Szczegółowe Opisy Czynników Sekundarnych

| Kod | Znaczenie wysokich wartości (+) | Znaczenie niskich wartości (–) |
|-----|--------------------------------|--------------------------------|
| **w** | otwartość uczuciowa, łatwość wchodzenia w relacje | potrzeba prywatności emocjonalnej |
| **k** | aktywna siła, waleczność, ochrona innych | unikanie konfrontacji, defensywność |
| **sh** | opieka ekspansywna, wspólnotowość | troska selektywna, introwertyczna, dla „swoich" |
| **se** | energia społeczna, ruch ku światu | energia wewnętrzna, skupiona na sobie |
| **z** | ekspresja estetyczna, autoprezentacja | skromność, prostota, brak znaczenia wyglądu |
| **v** | logika komunikatywna, racjonalizacja świata zewnętrznego | refleksyjność, logika wewnętrzna |
| **g** | twórczość ekspansywna, wizjonerstwo publiczne | twórczość introwertyczna, indywidualna |
| **m** | stabilizacja zewnętrzna, organizacja otoczenia | wewnętrzny porządek, osobista dyscyplina |
| **or** | komunikacja otwarta, towarzyskość | komunikacja introwertyczna, pisemna, wewnętrzna |
| **on** | otwarte korzystanie z doznań zmysłowych | asceza, skupienie na wrażeniach wewnętrznych |

### 3. Warstwa Kombinacyjna (pary i układy)
- **Obliczane**: Na podstawie par czynników
- **Znaczenie**: Synergie i konflikty między czynnikami

#### Typy Kombinacji

**Synergie** - gdy dwa czynniki są równolegle wysokie:
- **G+V** → twórcza logika
- **W+SH** → empatyczna opieka  
- **SE+OR** → aktywna komunikacja

**Konflikty** - gdy jeden jest bardzo dodatni, drugi bardzo ujemny:
- **M+G–** → rozdźwięk między stabilnością a twórczą wolnością
- **K+W–** → napięcie między walką a potrzebą bliskości

**👉 System 3 warstw:**
1. **prymalne** – główne „słupy konstrukcyjne"
2. **sekundarne** – wektory dynamiki  
3. **kombinacyjne** – mosty i napięcia

### Przykład Struktury Danych JSON
```json
{
  "prymalne": {
    "G": {"plus": 10, "minus": 1, "wektor": 9},
    "V": {"plus": 9, "minus": 2, "wektor": 7},
    "W": {"plus": 8, "minus": 2, "wektor": 6},
    "M": {"plus": 4, "minus": 6, "wektor": -2},
    "K": {"plus": 3, "minus": 7, "wektor": -4}
  },
  "sekundarne": {
    "g": 7, "v": 5, "w": 3, "m": -3, "k": -6
  },
  "kombinacyjne": {
    "G+V": 16, "W+SH": 9, "M–K": -6
  }
}
```

## Architektura Dashboardu

### Centralny "Rdzeń Esencji" - Interaktywna Wizualizacja 3D

**Kryształ Potencjału**: 3D struktura z 10 płaszczyznami reprezentującymi czynniki prymalne
- **Kolory**: Wartości dodatnie = ciepłe (złoty, niebieski), ujemne = chłodne (fiolet, szary)
- **Animacje**: Pulsowanie zgodne z siłą wektorów, rotacja
- **Interakcja**: Kliknięcie rozwija szczegółową analizę

### Moduły Dashboardu

#### 1. Górny Panel KPI - "Centrum Kontroli Misji"
- **Wskaźniki Supermocy**: Gauge charts dla najsilniejszych kombinacji
- **Współczynnik Napięcia Rewersyjnego**: Dynamiczny wskaźnik konfliktów
- **Energia Życiowa**: Animowany puls bazujący na SE
- **Status Wektorów**: 4 mini-wykresy dla dialektyk M/O, Z/S, V/G, K/W

#### 2. Lewy Panel - "Analiza Głęboka"
- **Wykres Pająka BBT**: Interaktywny radar chart z 10 czynnikami
- **Mapa Konfliktów**: Sieciowa wizualizacja napięć rewersyjnych
- **Hierarchia Potrzeb**: Piramida Maslowa adaptowana do profilu
- **Analiza Wektorów**: Zgrupowane wykresy słupkowe

#### 3. Prawy Panel - "Centrum Transformacji"
- **Supermoce**: Karty z nazwami i opisami talentów
- **Ścieżki Rozwoju**: Interaktywna mapa rozwoju
- **Rekomendacje AI**: Dynamicznie generowane sugestie
- **Zasoby Rozwoju**: Kursy, książki, praktyki

#### 4. Dolny Panel - "Centrum Akcji"
- **Profil Komunikacyjny**: Styl komunikacji
- **Archetypy Zawodowe**: Rekomendowane role
- **Mantra Osobista**: Wyświetlana afirmacja

### Specjalne Moduły Interpretacyjne

#### Moduł "System Operacyjny Duszy" (prompt 1_1)
- Metaforyczna reprezentacja jako futurystyczny interfejs
- Animowane "programy" reprezentujące dominujące czynniki
- "Błędy systemowe" jako alerty dla awersji

#### Moduł "Deklaracja Misji" (prompt 1_2)
- Elegancko wyświetlona misja osobista
- Tło zmieniające się zgodnie z wektorami

#### Moduł "Profil Przywództwa" (prompt 8_1)
- Wizualizacja stylu przywództwa jako konstelacja
- Interaktywne scenariusze decyzyjne

## Implementacja Techniczna

### Struktura Komponentów

#### Główne Komponenty
```
src/components/soul-mirror/
├── SoulMirrorDashboard.jsx          # Główny kontener
├── CoreEssence.jsx                  # Centralny kryształ 3D
├── KPIPanel.jsx                     # Górny panel wskaźników
├── DeepAnalysisPanel.jsx            # Lewy panel analizy
├── TransformationPanel.jsx          # Prawy panel transformacji
├── ActionCenter.jsx                 # Dolny panel akcji
└── visualizations/
    ├── SpiderChart.jsx              # Wykres pająka
    ├── ConflictNetwork.jsx          # Sieć konfliktów
    ├── DevelopmentPaths.jsx         # Ścieżki rozwoju
    ├── AnimatedGauges.jsx           # Animowane wskaźniki
    └── Crystal3D.jsx                # Komponent 3D
```

#### Serwisy i Utilities
```
src/services/soul-mirror/
├── bbtDataTransformer.js            # Transformacja danych BBT
├── visualizationEngine.js          # Silnik wizualizacji
├── recommendationEngine.js         # Generator rekomendacji
└── promptIntegration.js             # Integracja z prompt-definitions
```

### Biblioteki Techniczne

#### Wizualizacja Danych
- **React Three Fiber** - centralny kryształ 3D
- **Recharts** - wykresy radarowe, słupkowe, gauge
- **D3.js** - zaawansowane wizualizacje sieciowe
- **Framer Motion** - płynne animacje i przejścia
- **React Flow** - mapy ścieżek rozwoju

#### Routing i Stan
- **React Router** - routing do `/soul-mirror`
- **Zustand** lub **Context API** - zarządzanie stanem dashboardu

### Parsowanie i Transformacja Danych

#### Funkcje Transformacji
```javascript
// Przykładowe funkcje transformacji
const transformBBTData = (rawData) => {
  return {
    radarData: generateRadarData(rawData.prymalne),
    conflictData: calculateConflicts(rawData),
    superpowers: extractSuperpowers(rawData),
    tensions: calculateTensions(rawData)
  };
};

const calculateConflicts = (data) => {
  // Algorytm identyfikacji konfliktów rewersyjnych
  // Bazujący na prompt 7_3
};

const extractSuperpowers = (data) => {
  // Identyfikacja supermocy z prompt 2_1
  // Na podstawie najwyższych kombinacji
};
```

### Estetyka "Chińskiego Dashboardu"

#### Paleta Kolorów
```css
:root {
  --bg-primary: #0f172a;      /* slate-900 */
  --bg-secondary: #1e293b;    /* slate-800 */
  --accent-cyan: #06b6d4;     /* cyan-500 */
  --accent-gold: #f59e0b;     /* amber-500 */
  --accent-purple: #8b5cf6;   /* violet-500 */
  --text-primary: #f8fafc;    /* slate-50 */
  --text-secondary: #cbd5e1;  /* slate-300 */
}
```

#### Animacje i Efekty
- Subtelne świecenie (glow effects)
- Pulsowanie elementów aktywnych
- Płynne przejścia między stanami
- Efekty hover z neonowymi akcentami

#### Typografia
- Futurystyczne fonty (Inter, Orbitron dla akcentów)
- Hierarchia typograficzna z chińskimi inspiracjami
- Czytelność w ciemnym motywie

## Integracja z Istniejącym Systemem

### Routing
```javascript
// Modyfikacja ArcanumLayout.jsx
const ArcanumLayout = () => {
  // ... existing code
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PromptCatalogPage />} />
        <Route path="/soul-mirror" element={<SoulMirrorDashboard />} />
      </Routes>
    </Router>
  );
};
```

### Nawigacja
- Dodanie przycisku "Dashboard" w ArcanumHeader
- Breadcrumb navigation między katalogiem a dashboardem
- Zachowanie stanu klienta między widokami

### Wykorzystanie Prompt Definitions
Dashboard będzie wykorzystywał istniejące definicje promptów do:
- Generowania opisów supermocy (prompt 2_1)
- Analizy konfliktów (prompt 3_1, 7_3)
- Tworzenia rekomendacji rozwoju (prompt 6_1-6_10)
- Wizualizacji danych (prompt 7_1-7_4)

## Plan Implementacji

### Faza 1: Fundament (Tydzień 1)
- [ ] Konfiguracja React Router
- [ ] Stworzenie podstawowej struktury komponentów
- [ ] Implementacja transformacji danych BBT
- [ ] Podstawowe stylowanie (ciemny motyw)

### Faza 2: Wizualizacje (Tydzień 2)
- [ ] Implementacja wykresu pająka (SpiderChart)
- [ ] Animowane wskaźniki KPI (AnimatedGauges)
- [ ] Podstawowa wersja centralnego kryształu
- [ ] Integracja z Recharts

### Faza 3: Interaktywność (Tydzień 3)
- [ ] Implementacja React Three Fiber dla 3D
- [ ] Interaktywne elementy dashboardu
- [ ] Sidebary z szczegółowymi analizami
- [ ] Animacje Framer Motion

### Faza 4: Integracja AI (Tydzień 4)
- [ ] Generator rekomendacji oparty na prompt definitions
- [ ] Dynamiczne generowanie opisów
- [ ] Integracja z aiEngine
- [ ] System powiadomień i alertów

### Faza 5: Optymalizacja (Tydzień 5)
- [ ] Optymalizacja wydajności
- [ ] Responsywność
- [ ] Testy użyteczności
- [ ] Finalne poprawki estetyczne

## Metryki Sukcesu

### Funkcjonalne
- [ ] Wszystkie dane BBT są poprawnie wizualizowane
- [ ] Interaktywne elementy działają płynnie
- [ ] Rekomendacje są generowane dynamicznie
- [ ] Dashboard ładuje się w <3 sekundy

### Estetyczne
- [ ] Futurystyczny wygląd zgodny z wizją
- [ ] Płynne animacje (60fps)
- [ ] Czytelność w ciemnym motywie
- [ ] Spójność z resztą aplikacji

### Użyteczność
- [ ] Intuicyjna nawigacja
- [ ] Dostępność informacji w 2-3 kliknięciach
- [ ] Responsywność na różnych urządzeniach
- [ ] Pozytywny feedback użytkowników

## Uwagi Techniczne

### Wydajność
- Lazy loading komponentów wizualizacji
- Memoizacja ciężkich obliczeń
- Optymalizacja renderowania 3D
- Debouncing interakcji użytkownika

### Dostępność
- Alternatywne teksty dla wizualizacji
- Nawigacja klawiaturą
- Wysokie kontrasty w ciemnym motywie
- Screen reader compatibility

### Bezpieczeństwo
- Walidacja danych wejściowych
- Sanityzacja treści generowanych przez AI
- Ochrona przed XSS w dynamicznych treściach

---

**Data utworzenia**: 21.08.2025  
**Autor**: Cline AI Assistant  
**Status**: Plan gotowy do implementacji
