/**
 * BBT Data Transformer - Transformacja danych BBT/OTK do formatów wizualizacji
 */

// Definicje czynników BBT z opisami
export const BBT_FACTORS = {
  // Czynniki prymalne
  W: { name: 'Ciepło / Bliskość', positive: 'potrzeba czułości, więzi, bezpieczeństwa emocjonalnego', negative: 'dystans, chłód emocjonalny' },
  K: { name: 'Siła / Walka', positive: 'odwaga, obrona, gotowość do konfrontacji', negative: 'unikanie przemocy, niechęć do siłowych rozwiązań' },
  SH: { name: 'Pomoc / Opieka', positive: 'troska o innych, altruizm, wsparcie', negative: 'niechęć do opieki, brak potrzeby bycia pomocnym' },
  SE: { name: 'Ruch / Energia', positive: 'aktywność, dynamizm, ryzyko', negative: 'pasywność, unikanie nadmiaru bodźców' },
  Z: { name: 'Urok / Estetyka', positive: 'estetyka, wygląd, prezentacja siebie', negative: 'lekceważenie wyglądu i formy' },
  V: { name: 'Rozum / Logika', positive: 'intelekt, analiza, porządek, wiedza', negative: 'odrzucenie chłodnej logiki, niechęć do analizy' },
  G: { name: 'Duchowość / Twórczość', positive: 'sens, idea, inspiracja, wyobraźnia', negative: 'brak potrzeby metafizyki, unikanie wizjonerstwa' },
  M: { name: 'Materia / Trwałość', positive: 'stabilność, struktura, własność, organizacja', negative: 'ucieczka od obowiązków i trwałych struktur' },
  OR: { name: 'Mowa / Kontakty', positive: 'komunikacja, dialog, społeczność', negative: 'dystans, niechęć do rozmów, zamknięcie' },
  ON: { name: 'Zmysły / Konsumpcja', positive: 'jedzenie, przyjemności cielesne, sensualność', negative: 'wstrzemięźliwość, brak potrzeby cielesnych doznań' }
};

// Kolory dla wizualizacji
export const FACTOR_COLORS = {
  W: { positive: '#f59e0b', negative: '#6b7280' }, // amber/gray
  K: { positive: '#dc2626', negative: '#9ca3af' }, // red/gray
  SH: { positive: '#10b981', negative: '#6b7280' }, // emerald/gray
  SE: { positive: '#f97316', negative: '#9ca3af' }, // orange/gray
  Z: { positive: '#8b5cf6', negative: '#6b7280' }, // violet/gray
  V: { positive: '#06b6d4', negative: '#9ca3af' }, // cyan/gray
  G: { positive: '#eab308', negative: '#6b7280' }, // yellow/gray
  M: { positive: '#059669', negative: '#9ca3af' }, // emerald/gray
  OR: { positive: '#3b82f6', negative: '#6b7280' }, // blue/gray
  ON: { positive: '#ec4899', negative: '#9ca3af' }  // pink/gray
};

class BBTDataTransformer {
  /**
   * Główna funkcja transformacji danych BBT
   */
  async transformBBTData(clientData) {
    try {
      // Symulacja danych BBT - w rzeczywistości pobrane z clientData
      const mockBBTData = this.generateMockBBTData();
      
      return {
        radarData: this.generateRadarData(mockBBTData.prymalne),
        conflictData: this.calculateConflicts(mockBBTData),
        superpowers: this.extractSuperpowers(mockBBTData),
        tensions: this.calculateTensions(mockBBTData),
        kpiData: this.generateKPIData(mockBBTData),
        factorDetails: this.generateFactorDetails(mockBBTData),
        recommendations: this.generateRecommendations(mockBBTData),
        rawData: mockBBTData
      };
    } catch (error) {
      console.error('Błąd transformacji danych BBT:', error);
      throw error;
    }
  }

  /**
   * Generuje mock danych BBT dla celów demonstracyjnych
   */
  generateMockBBTData() {
    return {
      prymalne: {
        G: { plus: 10, minus: 1, wektor: 9 },
        V: { plus: 9, minus: 2, wektor: 7 },
        W: { plus: 8, minus: 2, wektor: 6 },
        Z: { plus: 7, minus: 3, wektor: 4 },
        OR: { plus: 6, minus: 3, wektor: 3 },
        SH: { plus: 5, minus: 4, wektor: 1 },
        SE: { plus: 4, minus: 5, wektor: -1 },
        M: { plus: 4, minus: 6, wektor: -2 },
        K: { plus: 3, minus: 7, wektor: -4 },
        ON: { plus: 2, minus: 8, wektor: -6 }
      },
      sekundarne: {
        g: 7, v: 5, w: 3, z: 2, or: 1,
        sh: -1, se: -2, m: -3, k: -6, on: -8
      },
      kombinacyjne: {
        'G+V': 16, 'W+SH': 7, 'SE+OR': 2,
        'M-K': -6, 'G-M': 11, 'V-K': 11
      }
    };
  }

  /**
   * Generuje dane dla wykresu radarowego
   */
  generateRadarData(prymalneData) {
    const factors = Object.keys(BBT_FACTORS);
    
    return {
      labels: factors.map(f => BBT_FACTORS[f].name),
      datasets: [
        {
          label: 'Dążenia (+)',
          data: factors.map(f => prymalneData[f]?.plus || 0),
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderColor: 'rgba(6, 182, 212, 1)',
          borderWidth: 2
        },
        {
          label: 'Awersje (-)',
          data: factors.map(f => -(prymalneData[f]?.minus || 0)),
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  /**
   * Oblicza konflikty rewersyjne
   */
  calculateConflicts(data) {
    const conflicts = [];
    
    // Identyfikacja konfliktów między czynnikami prymalnymi i sekundarnymi
    Object.keys(data.prymalne).forEach(factor => {
      const prymalny = data.prymalne[factor];
      const sekundarny = data.sekundarne[factor.toLowerCase()];
      
      // Konflikt rewersyjny: silna awersja prymalna vs. silne dążenie sekundarne
      if (prymalny.wektor < -3 && sekundarny > 3) {
        conflicts.push({
          type: 'rewersyjny',
          factors: [factor, factor.toLowerCase()],
          intensity: Math.abs(prymalny.wektor) + Math.abs(sekundarny),
          description: `Konflikt między awersją do ${BBT_FACTORS[factor].name} a ${sekundarny > 0 ? 'ekspansywną' : 'introwertyczną'} realizacją`
        });
      }
    });

    return conflicts;
  }

  /**
   * Identyfikuje supermoce na podstawie najwyższych kombinacji
   */
  extractSuperpowers(data) {
    const superpowers = [];
    
    // Sortowanie czynników prymalnych według siły
    const sortedFactors = Object.entries(data.prymalne)
      .sort(([,a], [,b]) => b.wektor - a.wektor)
      .slice(0, 3);

    sortedFactors.forEach(([factor, values], index) => {
      if (values.wektor > 3) {
        superpowers.push({
          id: `superpower_${index + 1}`,
          name: this.generateSuperpowerName(factor, values.wektor),
          description: BBT_FACTORS[factor].positive,
          strength: values.wektor,
          components: [factor],
          color: FACTOR_COLORS[factor].positive
        });
      }
    });

    // Dodanie synergii kombinacyjnych
    Object.entries(data.kombinacyjne).forEach(([combo, value]) => {
      if (value > 10) {
        superpowers.push({
          id: `synergy_${combo}`,
          name: this.generateSynergyName(combo),
          description: `Potężna synergia między czynnikami`,
          strength: value,
          components: combo.split(/[+\-]/),
          color: '#8b5cf6'
        });
      }
    });

    return superpowers;
  }

  /**
   * Oblicza współczynniki napięć
   */
  calculateTensions(data) {
    let totalTension = 0;
    const tensions = [];

    // Napięcia z konfliktów rewersyjnych
    Object.keys(data.prymalne).forEach(factor => {
      const prymalny = data.prymalne[factor];
      const sekundarny = data.sekundarne[factor.toLowerCase()];
      
      if (prymalny.wektor < 0 && sekundarny > 0) {
        const tension = Math.abs(prymalny.wektor) + Math.abs(sekundarny);
        totalTension += tension;
        tensions.push({
          factors: [factor],
          value: tension,
          type: 'rewersyjny'
        });
      }
    });

    return {
      total: totalTension,
      individual: tensions,
      level: this.getTensionLevel(totalTension)
    };
  }

  /**
   * Generuje dane KPI
   */
  generateKPIData(data) {
    const topFactors = Object.entries(data.prymalne)
      .sort(([,a], [,b]) => b.wektor - a.wektor)
      .slice(0, 3);

    return {
      energyLevel: this.calculateEnergyLevel(data),
      creativePotential: data.prymalne.G?.wektor || 0,
      socialHarmony: this.calculateSocialHarmony(data),
      stabilityIndex: data.prymalne.M?.wektor || 0,
      topStrengths: topFactors.map(([factor, values]) => ({
        factor,
        name: BBT_FACTORS[factor].name,
        value: values.wektor
      }))
    };
  }

  /**
   * Generuje szczegóły czynników
   */
  generateFactorDetails(data) {
    const details = {};
    
    Object.keys(BBT_FACTORS).forEach(factor => {
      const prymalny = data.prymalne[factor] || { plus: 0, minus: 0, wektor: 0 };
      const sekundarny = data.sekundarne[factor.toLowerCase()] || 0;
      
      details[factor] = {
        name: BBT_FACTORS[factor].name,
        primary: prymalny,
        secondary: sekundarny,
        interpretation: this.interpretFactor(factor, prymalny, sekundarny),
        color: prymalny.wektor >= 0 ? FACTOR_COLORS[factor].positive : FACTOR_COLORS[factor].negative
      };
    });

    return details;
  }

  /**
   * Generuje rekomendacje rozwoju
   */
  generateRecommendations(data) {
    const recommendations = [];
    
    // Rekomendacje dla najsilniejszych czynników
    const topFactors = Object.entries(data.prymalne)
      .sort(([,a], [,b]) => b.wektor - a.wektor)
      .slice(0, 2);

    topFactors.forEach(([factor, values]) => {
      recommendations.push({
        type: 'strength',
        title: `Rozwijaj ${BBT_FACTORS[factor].name}`,
        description: `Twoja naturalna siła w obszarze ${BBT_FACTORS[factor].positive}`,
        actions: this.getStrengthActions(factor)
      });
    });

    // Rekomendacje dla największych wyzwań
    const challenges = Object.entries(data.prymalne)
      .sort(([,a], [,b]) => a.wektor - b.wektor)
      .slice(0, 1);

    challenges.forEach(([factor, values]) => {
      if (values.wektor < -2) {
        recommendations.push({
          type: 'challenge',
          title: `Zarządzaj ${BBT_FACTORS[factor].name}`,
          description: `Obszar wymagający uwagi: ${BBT_FACTORS[factor].negative}`,
          actions: this.getChallengeActions(factor)
        });
      }
    });

    return recommendations;
  }

  // Funkcje pomocnicze
  generateSuperpowerName(factor, strength) {
    const names = {
      G: 'Wizjoner Przyszłości',
      V: 'Mistrz Analizy',
      W: 'Strażnik Harmonii',
      Z: 'Artysta Prezentacji',
      OR: 'Łącznik Społeczny',
      SH: 'Opiekun Wspólnoty',
      SE: 'Dynamo Energii',
      M: 'Architekt Stabilności',
      K: 'Wojownik Sprawiedliwości',
      ON: 'Mistrz Doznań'
    };
    return names[factor] || `Talent ${factor}`;
  }

  generateSynergyName(combo) {
    const synergies = {
      'G+V': 'Twórcza Logika',
      'W+SH': 'Empatyczna Opieka',
      'SE+OR': 'Aktywna Komunikacja',
      'Z+G': 'Estetyczna Wizja'
    };
    return synergies[combo] || `Synergia ${combo}`;
  }

  getTensionLevel(total) {
    if (total < 10) return 'Niski';
    if (total < 20) return 'Umiarkowany';
    if (total < 30) return 'Wysoki';
    return 'Krytyczny';
  }

  calculateEnergyLevel(data) {
    const se = data.prymalne.SE?.wektor || 0;
    const conflicts = Object.keys(data.prymalne).filter(f => 
      data.prymalne[f].wektor < -3
    ).length;
    
    return Math.max(0, se - conflicts * 2);
  }

  calculateSocialHarmony(data) {
    const w = data.prymalne.W?.wektor || 0;
    const sh = data.prymalne.SH?.wektor || 0;
    const or = data.prymalne.OR?.wektor || 0;
    
    return Math.round((w + sh + or) / 3);
  }

  interpretFactor(factor, primary, secondary) {
    if (primary.wektor > 3) {
      return `Silne dążenie: ${BBT_FACTORS[factor].positive}`;
    } else if (primary.wektor < -3) {
      return `Silna awersja: ${BBT_FACTORS[factor].negative}`;
    } else {
      return `Neutralny stosunek do ${BBT_FACTORS[factor].name}`;
    }
  }

  getStrengthActions(factor) {
    const actions = {
      G: ['Rozwijaj projekty twórcze', 'Praktykuj mindfulness', 'Czytaj o filozofii'],
      V: ['Ucz się nowych umiejętności analitycznych', 'Rozwiązuj problemy logiczne', 'Studiuj dane'],
      W: ['Buduj głębokie relacje', 'Praktykuj empatię', 'Twórz bezpieczne przestrzenie']
    };
    return actions[factor] || ['Rozwijaj ten talent dalej'];
  }

  getChallengeActions(factor) {
    const actions = {
      K: ['Ćwicz asertywność w małych krokach', 'Znajdź bezpieczne sposoby wyrażania siły'],
      M: ['Wprowadź małe rutyny', 'Zacznij od prostych systemów organizacji']
    };
    return actions[factor] || ['Pracuj nad tym obszarem stopniowo'];
  }
}

export const bbtDataTransformer = new BBTDataTransformer();
