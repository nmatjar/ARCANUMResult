/**
 * Centralna konfiguracja funkcji aplikacji
 * 
 * Aby dodać nową funkcję, wystarczy dodać nowy obiekt do tej tablicy i
 * skonfigurować odpowiedni webhook w Make.com
 */

// Test mode for free content generation (no token deduction)
export const APP_CONFIG = {
  TEST_MODE: true, // Set to false in production
  TEST_MODE_LABEL: 'Tryb testowy (bez płatności)'
};

/**
 * Template formatters to ensure consistent styling in all responses
 */
export const responseFormatters = {
  // Format for section headings
  heading: (text) => `## ${text}`,
  
  // Format for subsection headings
  subheading: (text) => `### ${text}`,
  
  // Format for bold important text
  important: (text) => `**${text}**`,
  
  // Format for lists (items should be an array of strings)
  list: (items) => items.map(item => `- ${item}`).join('\n'),
  
  // Format for numbered lists (items should be an array of strings)
  numberedList: (items) => items.map((item, index) => `${index + 1}. ${item}`).join('\n'),
  
  // Format for a section with heading and content
  section: (heading, content) => `## ${heading}\n\n${content}`,
  
  // Format for highlighting quotes
  highlight: (text) => `> ${text}`
};

// Koszty energii dla każdej funkcji - zróżnicowane dla większej interesowności
export const TOKEN_COSTS = {
  'ai-assistant': 300, // Asystent AI kosztuje więcej energii
  'job-search': 150, // Strategia szukania pracy - kompleksowe rozwiązanie
  'future': 200, // Zawód przyszłości - generuje też obraz, więc droższy
  'studies': 120, // Najlepsze studia - zawiera szczegółowe badanie dopasowania
  'activities': 80, // Czynności zawodowe - podstawowa analiza
  'workplace': 180, // Wymarzone miejsce pracy - generuje obraz, więc droższy
  'creative': 160, // Kreatywne podpowiedzi - niestandardowe, więc wyższa cena
  'skills-gap': 110, // Luka kompetencyjna - analiza umiejętności
  'work-life-balance': 90, // Równowaga praca-życie - porada życiowa
  'networking': 100, // Strategia networkingu - standardowa cena
  'personal-brand': 140 // Marka osobista - ważna dla kariery, więc premium
};

// Pakiety energii dostępne do zakupu
export const TOKEN_PACKAGES = [
  { id: 'basic', name: 'Podstawowy', amount: 500, price: 19.99 },
  { id: 'standard', name: 'Standardowy', amount: 1200, price: 39.99 },
  { id: 'premium', name: 'Premium', amount: 3000, price: 79.99 }
];

export const featuresConfig = [
  {
    id: 'ai-assistant',
    title: 'Asystent kariery AI',
    description: 'Porozmawiaj z asystentem AI w dowolnym momencie. Możesz zadawać pytania dotyczące kariery i uzyskać spersonalizowane odpowiedzi.',
    icon: 'fa-solid fa-robot',
    iconClass: 'icon-ai-assistant',
    resultTitle: 'Asystent kariery AI',
    useAIAssistant: true,
    isPremium: true, // Oznaczenie jako funkcja premium
    cost: TOKEN_COSTS['ai-assistant'] // Koszt energii wyższy niż standardowe funkcje
  },
  {
    id: 'job-search',
    title: 'Strategia szukania pracy',
    description: 'Otrzymaj spersonalizowaną strategię poszukiwania pracy dopasowaną do Twojego profilu.',
    icon: 'fa-solid fa-magnifying-glass-dollar',
    iconClass: 'icon-job-search',
    resultTitle: 'Twoja strategia szukania pracy',
    makeHook: 'careerJobSearch',
    promptTemplate: `Na podstawie profilu użytkownika {name}, stwórz kompleksową i spersonalizowaną strategię poszukiwania pracy.

Zacznij od krótkiego podsumowania typu osobowości ({personality_type}) i jak wpływa on na proces poszukiwania pracy.

## ANALIZA KANAŁÓW POSZUKIWANIA PRACY

Przeanalizuj, które kanały poszukiwania pracy będą najskuteczniejsze dla użytkownika, biorąc pod uwagę jego styl komunikacji ({communication_style}), sektor ({sector}) i docelową pracę ({target_job}):
- Portale rekrutacyjne (które konkretnie?)
- Agencje rekrutacyjne
- Networking (online i offline)
- Bezpośredni kontakt z firmami
- Media społecznościowe (LinkedIn, inne?)
- Targi pracy
- Serwisy branżowe

## OPTYMALIZACJA CV I LISTU MOTYWACYJNEGO

Na podstawie umiejętności ({skills}), mocnych stron ({strengths}) i dotychczasowego doświadczenia, zaproponuj:
1. Kluczowe elementy, które powinny znaleźć się w CV
2. Jak dopasować CV do docelowych stanowisk
3. Jak efektywnie podkreślić najważniejsze osiągnięcia
4. Wskazówki do pisania listów motywacyjnych zgodne ze stylem komunikacji użytkownika

## PRZYGOTOWANIE DO ROZMÓW KWALIFIKACYJNYCH

Zaproponuj spersonalizowane podejście do rozmów kwalifikacyjnych, uwzględniając typ osobowości i styl komunikacji:
1. Jak przygotować się do typowych pytań
2. Jak zaprezentować swoje umiejętności w sposób zgodny z typem osobowości
3. Techniki radzenia sobie ze stresem podczas rozmowy
4. Wskazówki dotyczące mowy ciała i komunikacji niewerbalnej

## HARMONOGRAM DZIAŁAŃ

Utwórz 30-dniowy plan działania z konkretnymi zadaniami do wykonania każdego tygodnia, który pomoże uporządkować proces poszukiwania pracy.

## DODATKOWE WSKAZÓWKI

Przedstaw 3-5 unikalnych wskazówek, które szczególnie pasują do profilu użytkownika i mogą dać mu przewagę konkurencyjną w procesie rekrutacji.

Zakończ jednym konkretnym, inspirującym przesłaniem, które będzie motywować użytkownika do działania.

FORMAT: Użyj nagłówków (##) dla głównych sekcji, punktów dla list, pogrubienia dla kluczowych terminów, i dobrze ustrukturyzowanego tekstu dla lepszej czytelności.`,
    useImageGeneration: false,
    imagePrompt: 'job search strategy career planning job interview professional recruitment hiring'
  },
  {
    id: 'future',
    title: 'Zawód przyszłości',
    description: 'Odkryj zawody, które będą idealnie pasować do Twoich umiejętności w przyszłości.',
    icon: 'fa-solid fa-rocket',
    iconClass: 'icon-future',
    resultTitle: 'Twój zawód przyszłości',
    makeHook: 'careerFutureJob',
    promptTemplate: 'Na podstawie analizy umiejętności, zainteresowań, wartości i cech osobowości użytkownika {name}, zaproponuj najlepiej dopasowany zawód przyszłości. Uwzględnij w analizie: {skills}, {interests}, {communication_style}, {personality_type}. Dodatkowo uwzględnij: etap kariery: {career_stage}, obecna praca: {current_job}, docelowa praca: {target_job}. Opisz szczegółowo dlaczego ten zawód jest idealnym dopasowaniem, jakie umiejętności użytkownik może wykorzystać, i jakie korzyści osiągnie wykonując tę pracę. Zwróć uwagę na trendy rynkowe i przewidywany wzrost zapotrzebowania na ten zawód w przyszłości.',
    useImageGeneration: true,
    imagePrompt: 'A detailed visualization of {name}, a {gender} professional in a futuristic {target_job} role. The workspace includes elements related to {interests} and reflects their {personality_type} personality. Include high-tech equipment, innovative technology, and a {work_style} atmosphere. 4K, detailed, professional lighting, cinematic quality.'
  },
  {
    id: 'studies',
    title: 'Najlepsze studia',
    description: 'Poznaj kierunki studiów, które najlepiej przygotują Cię do wymarzonej kariery.',
    icon: 'fa-solid fa-graduation-cap',
    iconClass: 'icon-studies',
    resultTitle: 'Najlepsze studia dla Ciebie',
    makeHook: 'careerStudies',
    promptTemplate: 'Na podstawie profilu użytkownika {name}, zaproponuj 3 najlepsze kierunki studiów, które pomogą mu rozwinąć karierę zgodnie z jego predyspozycjami. Uwzględnij: mocne strony ({strengths}), zainteresowania ({interests}), typ osobowości ({personality_type}), edukacja ({education}), kierunek edukacji ({education_field}). Dla każdego kierunku studiów podaj nazwy konkretnych uczelni w Polsce, które oferują wysoką jakość kształcenia w danej dziedzinie.',
    useImageGeneration: false,
    imagePrompt: 'university campus students education graduation college academic learning'
  },
  {
    id: 'activities',
    title: 'Czynności zawodowe',
    description: 'Zobacz, jakimi zadaniami będziesz się zajmować w swojej idealnej pracy.',
    icon: 'fa-solid fa-list-check',
    iconClass: 'icon-activities',
    resultTitle: 'Twoje czynności zawodowe',
    makeHook: 'careerActivities',
    promptTemplate: 'Opisz szczegółowo typowy dzień pracy i konkretne czynności zawodowe dla osoby o profilu użytkownika {name}. Na podstawie jego umiejętności ({skills}), stylu pracy ({work_style}), stylu komunikacji ({communication_style}) i zainteresowań ({interests}), opisz 7-10 głównych zadań, które będzie wykonywać w swojej idealnej pracy. Uwzględnij sektor ({sector}) i docelową pracę ({target_job}). Wyjaśnij, z kim będzie współpracować, jakich narzędzi używać i jakie rezultaty osiągać.',
    useImageGeneration: false,
    imagePrompt: 'professional work activities business tasks collaboration teamwork project'
  },
  {
    id: 'workplace',
    title: 'Wymarzone miejsce pracy',
    description: 'Wygeneruj obraz swojego idealnego miejsca pracy dopasowanego do Twojej osobowości.',
    icon: 'fa-solid fa-building',
    iconClass: 'icon-workplace',
    resultTitle: 'Twoje wymarzone miejsce pracy',
    makeHook: 'careerWorkplace',
    promptTemplate: 'Utwórz szczegółowy opis idealnego miejsca pracy dla użytkownika {name}, na podstawie jego typu osobowości ({personality_type}), preferowanego stylu pracy ({work_style}), stylu komunikacji ({communication_style}) i cech miejsca pracy ({work_environment_features}). Opis powinien zawierać szczegóły dotyczące fizycznego środowiska pracy, kultury organizacyjnej, stylu zarządzania, atmosfery, lokalizacji i udogodnień. Uwzględnij również aspekt wysiłku fizycznego ({physical_effort}) i zdolności cyfrowe ({digital_skills}). Ten opis będzie wykorzystany do wygenerowania obrazu idealnego miejsca pracy.',
    useImageGeneration: true,
    imagePrompt: 'A personalized ideal workspace for {name}, a {gender} {age}-year-old professional. The office environment is designed for someone who values {work_environment_features} and has a {work_style} working style. The space reflects their interests in {interests} and accommodates their {personality_type} personality. Physical effort required: {physical_effort}. Digital tools: {digital_skills}. Professional, warm lighting, attention to ergonomic details, stylish interior design, 4K quality.'
  },
  {
    id: 'creative',
    title: 'Kreatywne podpowiedzi',
    description: 'Odkryj nieoczywiste ścieżki rozwoju dopasowane do Twojego profilu.',
    icon: 'fa-solid fa-wand-magic-sparkles',
    iconClass: 'icon-creative',
    resultTitle: 'Kreatywne podpowiedzi kariery',
    makeHook: 'careerCreative',
    promptTemplate: 'Zaproponuj 4 nieoczywiste, kreatywne ścieżki rozwoju kariery dla użytkownika {name}, które wykraczają poza standardowe zawody związane z jego profilem. Uwzględnij jego unikalne połączenie umiejętności ({skills}), zainteresowań ({interests}), stylu komunikacji ({communication_style}) i mocnych stron ({strengths}). Uwzględnij również pełne czynniki osobowości ({complete_factors}) i kariery według umiejętności ({career_by_skills}). Dla każdej ścieżki opisz: 1) na czym polega, 2) dlaczego pasuje do profilu użytkownika, 3) konkretny pierwszy krok, jaki może podjąć, aby eksplorować tę możliwość.',
    useImageGeneration: false,
    imagePrompt: 'creative career path innovation inspiration artistic professional unique'
  },
  {
    id: 'skills-gap',
    title: 'Luka kompetencyjna',
    description: 'Dowiedz się, jakich umiejętności potrzebujesz, aby osiągnąć swoje cele zawodowe.',
    icon: 'fa-solid fa-stairs',
    iconClass: 'icon-skills-gap',
    resultTitle: 'Twoja luka kompetencyjna',
    makeHook: 'careerSkillsGap',
    promptTemplate: 'Przeprowadź analizę luki kompetencyjnej dla użytkownika {name}, biorąc pod uwagę jego obecne umiejętności ({skills}) oraz docelową pracę ({target_job}). Zidentyfikuj 5-7 kluczowych umiejętności, których obecnie brakuje użytkownikowi, a które są niezbędne do osiągnięcia jego celu zawodowego. Dla każdej umiejętności: 1) wyjaśnij, dlaczego jest ona ważna w kontekście docelowej pracy, 2) zaproponuj konkretny sposób jej rozwijania (kurs, certyfikat, praktyka), 3) określ realny czas potrzebny na zdobycie tej umiejętności. Weź pod uwagę typ osobowości użytkownika ({personality_type}) i jego styl uczenia się w swoich rekomendacjach.',
    useImageGeneration: false,
    imagePrompt: 'skills development learning gap analysis professional growth education training'
  },
  {
    id: 'work-life-balance',
    title: 'Równowaga praca-życie',
    description: 'Otrzymaj spersonalizowane strategie utrzymania zdrowej równowagi między pracą a życiem prywatnym.',
    icon: 'fa-solid fa-scale-balanced',
    iconClass: 'icon-balance',
    resultTitle: 'Twoja strategia równowagi',
    makeHook: 'careerWorkLifeBalance',
    promptTemplate: 'Opracuj kompleksową strategię równowagi między pracą a życiem prywatnym dla użytkownika {name}, uwzględniając jego typ osobowości ({personality_type}), styl pracy ({work_style}) i styl komunikacji ({communication_style}). Weź pod uwagę jego obecną pracę ({current_job}) i pożądaną pracę ({target_job}) przy tworzeniu rekomendacji. Strategia powinna obejmować: 1) konkretne techniki zarządzania czasem dopasowane do jego stylu pracy, 2) praktyczne sposoby wyznaczania granic w pracy, 3) zdrowe nawyki, które pomagają w regeneracji po pracy, 4) metody efektywnego odpoczynku, które pasują do jego typu osobowości. Dodatkowo, zaproponuj 3-5 specyficznych zmian, które może wprowadzić już od jutra, aby poprawić swoją równowagę.',
    useImageGeneration: false,
    imagePrompt: 'work life balance harmony meditation relaxation healthy lifestyle wellbeing'
  },
  {
    id: 'networking',
    title: 'Strategia networkingu',
    description: 'Poznaj efektywne metody budowania sieci kontaktów zawodowych dopasowane do Twojej osobowości.',
    icon: 'fa-solid fa-people-group',
    iconClass: 'icon-networking',
    resultTitle: 'Twoja strategia networkingu',
    makeHook: 'careerNetworking',
    promptTemplate: 'Stwórz spersonalizowaną strategię networkingu dla użytkownika {name}, uwzględniając jego typ osobowości ({personality_type}), styl komunikacji ({communication_style}) i branżę ({sector}). Strategia powinna zawierać: 1) najlepsze platformy i miejsca do nawiązywania kontaktów zawodowych w jego branży, 2) techniki nawiązywania rozmowy dopasowane do jego stylu komunikacji, 3) metody utrzymywania relacji, które będą dla niego naturalne, 4) propozycje konkretnych grup, wydarzeń lub społeczności, do których powinien dołączyć. Jeśli użytkownik jest introwertykiem, skup się na mniej intensywnych społecznie metodach networkingu. Jeśli jest ekstrawertykiem, zaproponuj bardziej dynamiczne i bezpośrednie podejścia. Zakończ listą 5 konkretnych kroków, które może podjąć w ciągu najbliższego miesiąca.',
    useImageGeneration: false,
    imagePrompt: 'professional networking business connections conference meeting collaboration community'
  },
  {
    id: 'personal-brand',
    title: 'Marka osobista',
    description: 'Otrzymaj wskazówki jak budować silną markę osobistą w Twojej branży.',
    icon: 'fa-solid fa-fingerprint',
    iconClass: 'icon-personal-brand',
    resultTitle: 'Twoja marka osobista',
    makeHook: 'careerPersonalBrand',
    promptTemplate: 'Opracuj kompleksową strategię budowania marki osobistej dla użytkownika {name}, opartą na jego unikalnych umiejętnościach ({skills}), mocnych stronach ({strengths}), stylu komunikacji ({communication_style}) i branży ({sector}). Strategia powinna obejmować: 1) propozycję unikalnego pozycjonowania zawodowego - co powinno wyróżniać go na rynku pracy, 2) rekomendacje dotyczące profesjonalnej obecności online (LinkedIn, portfolio, blog, media społecznościowe), 3) sugestie dotyczące tworzenia i udostępniania treści związanych z branżą, 4) możliwości wystąpień publicznych lub publikacji pasujące do jego typu osobowości ({personality_type}), 5) metody budowania autentyczności i spójności wizerunku. Uwzględnij jego docelową pracę ({target_job}) przy tworzeniu tych rekomendacji. Zakończ planem działania na najbliższe 3 miesiące z konkretnymi krokami do wykonania.',
    useImageGeneration: false,
    imagePrompt: 'personal branding professional image career success online presence social media'
  }
];

/**
 * Funkcja pomocnicza do znajdowania konfiguracji funkcji po ID
 */
export const getFeatureById = (featureId) => {
  return featuresConfig.find(feature => feature.id === featureId);
};