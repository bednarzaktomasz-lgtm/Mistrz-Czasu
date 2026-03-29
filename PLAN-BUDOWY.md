# Plan Budowy: Mistrz Czasu

## TL;DR
Przekształcenie aplikacji "piaskownicy" do nauki zegara w progresywną grę edukacyjną z systemem profili użytkowników (bez logowania), progresem, nagrodami i grywalizacją. Każda faza jest niezależnie weryfikowalna. Plan aktualizowany po każdej ukończonej fazie.

### System nagród — tabela referencyjna

| Tryb | XP | Sekundy | Uwagi |
|------|----|---------|-------|
| **Wyprawa** (`mapa.html`) | +10 za poprawną | +5 za poprawną | Pełne nagrody; +50 Sekund za zdobytą gwiazdkę |
| **Wyzwanie Dnia** (`wyzwanie.html`) | +10 za poprawną | +8 za poprawną (x1.5) | Bonus Streak po ukończeniu; jedyne źródło bonusu Streak |
| **Szybka Gra** (`szybka-gra.html`) | — | +5 za poprawną (limit 20/dzień) | Brak XP; Wolna Nauka bez nagród w ogóle; limit dzienny zapobiega farmowaniu |

---

## Stan Obecny (co już istnieje)

### Działające tryby gry (4 ekrany):
- `nauka.html` — interaktywne przesuwanie wskazówek, podgląd czasu cyfrowego (brak scoringu)
- `godziny.html` — quiz wielokrotnego wyboru (3 opcje), scoring, 2-strike system, Web Audio beep
- `ustaw.html` — ustaw wskazówki na zadany czas, tolerancja ±2-5 min, ghost hands przy błędzie
- `wpisz.html` — wpisz godzinę klawiaturą wirtualną/fizyczną, format HHMM, 2-strike system

### Infrastruktura:
- `clock-renderer.js` — klasa `ClockRenderer`: renderowanie SVG, drag wskazówek, ghost hands, 3 rozmiary (sm/normal/lg), 4 tła (solid/spiral/grid/tech), 3 kolory wskazówek (white/blue/red), 3 style cyfr (arabic/roman/none), wsparcie touch+mouse
- `clock-styles.css` — stylowanie zegara SVG, animacje wskazówek (cubic-bezier), tła conic/linear-gradient
- `layout.css` — responsywny layout (CSS vars z clamp/vmin), modal, topbar, feedback-bar *(legacy)*, answer-btn, toggle-switch
- `transitions.js` — fade-in/fade-out między stronami (220ms, klasa `page-loaded`)
- `start.html` — menu główne (4 przyciski emoji + ustawienia + pomoc z hintami)
- `ustawienia.html` — hub konfiguracji (tła, kolory, style cyfr, tryby minut, format 12/24h, dźwięk, hint)

### localStorage (tylko preferencje wizualne, BRAK progresu):
- `zegar_handColor` ('white'|'blue'|'red'), `zegar_clockBg` ('solid'|'spiral'|'grid'|'tech')
- `zegar_numberStyle` ('arabic'|'roman'|'none'), `zegar_activeModes` (JSON array)
- `zegar_soundEnabled`, `zegar_showTimeHint`, `zegar_hourFormat` ('12'|'24')

### Prototyp UI (niezintegrowany):
- `Untitled-1.html` — 3 mockupy: Karty Przygód (pionowa lista `.adventure-card`), Drzewo Odblokowań (grid 3×3 `.grid-item`), Pasek Postępu (roadmap `.milestone`). Style CSS gotowe do reużycia.
- `page draft/Untitled-3.html` — **docelowy prototyp `mapa.html`** (patrz Faza 2). Zatwierdzone wzorce UI:
  - Pionowa ścieżka z kwadratowymi kafelkami (`aspect-ratio: 1`, `min(280px, 80vw)`)
  - Segmenty linii przez CSS `::after` (bez elementu DOM): szara/gradient zielony→fiolet/gradient fiolet→szary — zależnie od stanów sąsiednich węzłów
  - Popup gwiazdek: `min(440px, 92vw)`, header wyśrodkowany kolumnowo, przycisk ▶ bez tekstu, zamknięcie przez backdrop
  - FAB `?` + Toast podpowiedź (5s autoclose, pasek postępu)
  - Brak górnej kropki pierwszego kafelka
- `page draft/hint-demo.html` — demo wzorca FAB+Toast (mapa vs. gra), zadokumentowany w page-standards sekcja 14

---

## FAZA 1: Profile Użytkowników + Fundamenty Danych
> Cel: Multi-profil bez logowania (imię + avatar), trwały zapis progresu, eksport/import danych.

### Kroki:

- [x] **1.1** Utworzyć plik `game-state.js` z systemem wielu profili. Struktura localStorage:
  ```
  klucz: "mistrzCzasu_profiles"
  wartość: {
    version: 1,
    activeProfileId: "abc123",
    profiles: [
      { id: "abc123", name: "Zuzia", avatar: "girl-1", createdAt: timestamp },
      { id: "def456", name: "Kuba", avatar: "boy-2", createdAt: timestamp }
    ]
  }

  klucz: "mistrzCzasu_save_abc123"   // osobny zapis per profil
  wartość: {
    version: 1,
    profileId: "abc123",
    lastVisit: timestamp,
    xp: 0,
    seconds: 0,
    level: 1,
    streak: { current: 0, best: 0, lastDate: null },
    nodes: {
      // 20 węzłów — 4 pętle po 5 wysp (arabic, roman, no-digits, 24h)
      // każdy: { star1: {completed, score, streak}, star2: {...}, star3: {...} }
      "full-hours":     { star1: {completed: false, score: 0, streak: 0}, star2: {...}, star3: {...} },
      "quarters":       { ... },
      "half-past":      { ... },
      "every-five":     { ... },
      "every-minute":   { ... },
      // pętla 2 — cyfry rzymskie
      "roman-full":     { ... },
      "roman-quarters": { ... },
      "roman-half":     { ... },
      "roman-five":     { ... },
      "roman-minute":   { ... },
      // pętla 3 — bez cyfr
      "blank-full":     { ... },
      "blank-quarters": { ... },
      "blank-half":     { ... },
      "blank-five":     { ... },
      "blank-minute":   { ... },
      // pętla 4 — format 24h
      "24h-full":       { ... },
      "24h-quarters":   { ... },
      "24h-half":       { ... },
      "24h-five":       { ... },
      "24h-minute":     { ... },
    },
    wardrobe: {
      unlockedBgs: ["solid"],
      unlockedHandColors: ["white"],
      activeBg: "solid",
      activeHandColor: "white"
    },
    stats: {
      totalCorrect:  0,
      totalAttempts: 0,
      errorLog:      {},
      quickGameTodayCount: 0,
      quickGameLastDate:   null
    },
    activityCalendar: {},
    achievements: []
  }
  ```
- [x] **1.2** Napisać funkcje zarządzania profilami:
  - `getProfiles()` — zwraca listę profili
  - `createProfile(name, avatar)` — generuje ID (crypto.randomUUID lub fallback), tworzy profil + pusty save
  - `switchProfile(id)` — zmienia `activeProfileId`
  - `deleteProfile(id)` — usuwa profil i jego save z localStorage
  - `getActiveProfile()` — zwraca aktywny profil lub null
- [x] **1.3** Napisać funkcje zapisu/odczytu:
  - `saveGame(state)` — zapisuje do `mistrzCzasu_save_{activeId}`
  - `loadGame()` — ładuje save aktywnego profilu, waliduje wersję
  - `resetGame()` — czyści save aktywnego profilu (zachowuje profil)
  - `createDefaultState(profileId)` — zwraca czysty obiekt stanu
- [x] **1.4** Napisać eksport/import danych profilu:
  - `exportProfile(id)` — zbiera profil + save, generuje Blob JSON, pobiera plik `MistrzCzasu_[imię]_[data].json`
  - `importProfile(file)` — czyta JSON (FileReader), waliduje strukturę (version, profileId, nodes), jeśli ID istnieje → generuje nowe, dodaje profil + save
  - Walidacja: odrzucenie > 1MB, sprawdzenie version, obecność kluczowych pól
- [x] **1.5** Napisać `migrateFromLegacy()` — stare klucze `zegar_*` bez `mistrzCzasu_profiles` → tworzy profil "Gracz" z domyślnym avatarem, przenosi preferencje do wardrobe
- [x] **1.6** Utworzyć ekran wyboru/tworzenia profilu (`profil.html`):
  - **Tworzenie nowego profilu:**
    - Pole na imię (max 20 znaków, walidacja: niepuste, trim)
    - 6 awatarów w 2 rzędach:
      - Chłopcy: 🧑‍🚀 (boy-1 Astronauta), 🧙‍♂️ (boy-2 Czarodziej), 🦸‍♂️ (boy-3 Superbohater)
      - Dziewczyny: 👩‍🔬 (girl-1 Naukowiec), 🧚‍♀️ (girl-2 Wróżka), 🦸‍♀️ (girl-3 Superbohaterka)
    - Przycisk "Zacznij przygodę!" (aktywny gdy imię + avatar wybrane)
  - **Lista istniejących profili** (jeśli są):
    - Karty: avatar, imię, poziom, data ostatniej gry
    - Kliknięcie → aktywacja → przejście do dashboardu
    - Przycisk "Eksport 📥" per karta → pobiera JSON
    - Przycisk "Usuń 🗑️" z potwierdzeniem (confirm)
  - **Przycisk "Importuj profil 📤"** → input type=file (.json) → importProfile()
  - Styl: ciemne tło, karty w stylu `.adventure-card`
- [x] **1.7** Integracja z `start.html`:
  - Przy starcie: sprawdź aktywny profil → brak → przekieruj na profil.html
  - Jest → załaduj save, przejdź do dashboardu
  - Przycisk "Zmień gracza" w topbar → profil.html

### Definicja awatarów:
```
AVATARS = {
  "boy-1":  { emoji: "🧑‍🚀", label: "Astronauta" },
  "boy-2":  { emoji: "🧙‍♂️", label: "Czarodziej" },
  "boy-3":  { emoji: "🦸‍♂️", label: "Superbohater" },
  "girl-1": { emoji: "👩‍🔬", label: "Naukowiec" },
  "girl-2": { emoji: "🧚‍♀️", label: "Wróżka" },
  "girl-3": { emoji: "🦸‍♀️", label: "Superbohaterka" }
}
```

### Pliki do utworzenia:
- `game-state.js` (nowy)
- `profil.html` (nowy)

### Pliki do modyfikacji:
- `start.html` — import game-state.js, sprawdzenie profilu, przycisk "Zmień gracza"

### Weryfikacja Fazy 1:
- [x] Pierwsze wejście → ekran tworzenia profilu
- [x] Imię + avatar → profil w localStorage (`mistrzCzasu_profiles` + `mistrzCzasu_save_[id]`)
- [x] Drugi profil → oba na liście
- [x] Kliknięcie profilu → aktywacja → dashboard
- [x] Eksport → plik JSON z poprawnymi danymi
- [x] Import → profil na liście
- [x] Import duplikatu ID → nowe ID, brak kolizji
- [x] Import złego pliku → komunikat błędu
- [x] Usunięcie → potwierdzenie → profil i save usunięte
- [x] Migracja legacy → profil "Gracz" z przeniesionymi preferencjami
- [x] `loadGame()` graceful fallback przy brakujących danych

---

## FAZA 2: Nowe UI — Dashboard (Centrum Dowodzenia)
> Cel: Zastąpić `start.html` interaktywnym dashboardem z mapą przygód i paskiem statusu.

### Kroki:

- [ ] **2.1** Przebudowa `start.html` — Hub z trzema kartami wyboru:
  - **Top Bar**: Avatar profilu (emoji) + imię, pasek XP, licznik Sekund, przycisk "Zmień gracza" → profil.html
  - **Centrum strony**: Trzy duże karty nawigacyjne w pionie:
    - 🗺️ **Wyprawa** — opis: "Podążaj ścieżką i zdobywaj gwiazdki" → `mapa.html`
    - ⚡ **Wyzwanie Dnia** — opis: "Codzienne zadanie, wyjątkowe nagrody" → `wyzwanie.html` (z oznaczeniem ✓ jeśli dziś ukończone)
    - 🎮 **Szybka Gra** — opis: "Wybierz dowolny tryb i ćwicz" → `szybka-gra.html`
  - **Dolny pasek**: Przyciski Garderoba + Trofea (placeholder)
- [ ] **2.2** Nowa strona `szybka-gra.html` — wybór trybu gry (4 opcje, od najswobodniejszej):
  - 🕐 **Wolna Nauka** (`nauka.html`) — ruszaj wskazówkami, patrz co się dzieje — bez nagród, czysta zabawa
  - 🔵 **Wybierz Godzinę** (`godziny.html`) — kliknij właściwą odpowiedź
  - ✏️ **Wpisz Godzinę** (`wpisz.html`) — wpisz co widzisz
  - ⚙️ **Ustaw Wskazówki** (`ustaw.html`) — ustaw dokładny czas
  - Styl jak obecna strona `start.html` (karty z emoji), topbar ze strzałką wstecz → start.html
  - Nagroda za Wybierz/Wpisz/Ustaw: +5 Sekund za poprawną, **limit 20 poprawnych dziennie** (`stats.quickGameTodayCount` + `stats.quickGameLastDate`); po limicie gra działa bez nagród
  - Wolna Nauka: brak nagród w ogóle (brak scoringu w `nauka.html`)
  - Brak XP we wszystkich czterech opcjach
- [ ] **2.2b** Placeholder `wyzwanie.html` — karta z komunikatem "Wkrótce... 🔧" i przyciskiem powrotu → start.html; bez logiki, bez game-state; zastąpiona pełną wersją w **Fazie 7**
- [ ] **2.3** Nowa strona `mapa.html` — Mapa Przygód:
  - **Podstawa:** `page draft/Untitled-3.html` — skopiować CSS i strukturę HTML, zastąpić hardkodowane dane dynamicznym generowaniem z `NODE_CONFIG` + `game-state.js`
  - Topbar: strzałka wstecz → start.html, avatar + imię + XP bar + Sekundy badge (jak w prototypie)
  - Węzły dynamicznie z `NODE_CONFIG` (kolejność tablicy = kolejność na ścieżce)
  - Stany węzłów: `.done` (wszystkie 3 gwiazdki), `.current` (pierwszy z ≥0 gwiazdek ≤2), `.locked` (poprzedni nie ma żadnej gwiazdki)
  - Linia między węzłami przez `::after` — CSS `has()` selector (patrz prototyp)
  - Popup gwiazdek generowany z `NODE_CONFIG[id].stars` → nawigacja `godziny|wpisz|ustaw.html?node=X&star=Y`
  - FAB+Toast z kontekstową podpowiedzią (sekcja 14 page-standards)

  #### NODE_CONFIG — definicja węzłów (wkleić do `mapa.html`):
  ```javascript
  const NODE_CONFIG = [
    { id: 'full-hours',    icon: '🏝️', name: 'Wyspa Pełnych Godzin',       minutes: [0]           },
    { id: 'quarters',      icon: '🌊', name: 'Zatoka Kwadransów',           minutes: [0,15,30,45]  },
    { id: 'half-past',     icon: '🏔️', name: 'Góry "Wpół do"',             minutes: [0,30]        },
    { id: 'roman',         icon: '🏛️', name: 'Pustynia Cyfr Rzymskich',     minutes: [0]           },
    { id: 'twenty-four-h', icon: '🌃', name: 'Labirynt 24h',                minutes: null          },
  ];
  // gwiazdki per węzeł: 1→godziny.html, 2→wpisz.html, 3→ustaw.html (stałe)
  ```

  #### Logika stanów węzłów:
  ```javascript
  function getNodeStatus(nodeId, idx, nodes, gameState) {
    const node = gameState.nodes[nodeId];
    const anyStars = node.star1.completed || node.star2.completed || node.star3.completed;
    const allStars = node.star1.completed && node.star2.completed && node.star3.completed;
    if (allStars) return 'done';
    if (idx === 0 || anyStars) return 'current';
    const prevId = nodes[idx - 1].id;
    const prev   = gameState.nodes[prevId];
    if (prev.star1.completed || prev.star2.completed || prev.star3.completed) return 'current';
    return 'locked';
  }
  ```
- [ ] **2.4** Pasek statusu (XP + Sekundy) na `start.html` z `userProgress`

### Wzorce do reużycia:
- CSS z `Untitled-1.html`: `.adventure-card`, `.adventure-list`, `.adventure-progress`
- Layout z `layout.css`: CSS variables, `clamp()`, `--gap`
- `transitions.js` fade

### Pliki do modyfikacji:
- `start.html` — przebudowa HTML + JS (hub z 3 kartami)
- `layout.css` — style dashboardu

### Pliki do utworzenia:
- `mapa.html` — Mapa Przygód (na podstawie prototypu `page draft/Untitled-3.html`)
- `szybka-gra.html` — wybór trybu gry
- `wyzwanie.html` — placeholder (pełna wersja w Fazie 7)

> 📌 **Podpowiedzi (FAB + Toast):** `mapa.html` i `szybka-gra.html` korzystają z nowego wzorca FAB+Toast (sekcja 14 w page-standards). Istniejące strony gier (`godziny.html`, `wpisz.html`, `ustaw.html`, `nauka.html`) na razie pozostają ze starym wzorcem `.help-btn` + `.feedback-bar`; migracja następuje przy ich przebudowie w **Fazie 3**.

### Weryfikacja Fazy 2:
- [ ] Avatar + imię w topbar na start.html
- [ ] 3 karty (Wyprawa, Wyzwanie Dnia, Szybka Gra) prowadzą do właściwych stron
- [ ] Szybka Gra → 4 przyciski trybów działają
- [ ] Wyzwanie Dnia → placeholder z komunikatem
- [ ] Mapa → 5 pierwszych kąrt węzłów z poprawnymi stanami (1 odblokowana przy nowym profilu)
- [ ] Karta węzła → popup gwiazdek (⭐ Wybierz / ⭐⭐ Wpisz / ⭐⭐⭐ Ustaw) → nawigacja URL
- [ ] XP i Sekundy odczytane z userProgress
- [ ] "Zmień gracza" → profil.html
- [ ] Responsywność 360px–1200px
- [ ] Fade transitions

---

## FAZA 3: Integracja Trybów z Systemem Progresu
> Cel: Tryby gry raportują wyniki do systemu progresu. **Przy okazji: migracja podpowiedzi** z `.help-btn`+`.feedback-bar` na FAB+Toast (sekcja 14 page-standards) w każdym przebudowywanym pliku gry.

### Warunek zdobycia gwiazdki

**8 poprawnych odpowiedzi ORAZ co najmniej 6 poprawnych pod rząd.** Sesja gry trwa aż waru-
nki zostaną spełnione równocześnie — pytania generują się dalej jeśli seria urywa się.

```
stan sesji: { total: 0, streak: 0, bestStreak: 0 }
po poprawnej: total++, streak++, bestStreak = max(bestStreak, streak)
po błędnej: streak = 0  // total nie jest resetowany
gwiazdka: total >= 8 && bestStreak >= 6
```

**Pasek postępu w grze** (nowy element UI w każdym trybie):
- Dwa wskaźniki: `X/8 poprawnych` + `seria: Y/6`
- Seria resetuje się wizualnie przy błędzie
- Gdy oba warunki spełnione → animacja zdobycia gwiazdki

### question-logic.js — osobny plik logiki pytań

Cel: izolacja mechanizmu generowania pytań od trób gry, łatwa wymiana na zaawansowany system (spaced repetition z innej aplikacji) w Fazie 7 bez ruszania HTML/CSS gier.

```javascript
// question-logic.js — interfejs późniejszy może być wymieniony:
function generateQuestion(nodeConfig, attemptHistory) { ... }
// zwraca: { hour, minute, correctAnswer, distractors[] }
// attemptHistory: tablica ostatnich odpowiedzi — używana do unikania powtórek
// nodeConfig: { minutes: [], dialType, hourFormat } z NODE_CONFIG
```

Na etapie Fazy 3: prosta implementacja (losowy z puli, bez powtórki ostatnich 3).
W Fazie 7: wymiana wnętrzności `question-logic.js` na system z powtali-
kami, celowymi błędami z errorLog itp. — interfejs zewnętrzny bez zmian.

### Protokół nawigacyjny po grze

URL wejścia: `godziny.html?node=quarters&star=1` (wywołane z `mapa.html`).

**Po zdobyciu gwiazdki ⭐ / ⭐⭐** — overlay z dwoma akcjami:
- Przycisk ▶ **"Zagraj dalej"** → od razu otwiera tę samą grę z `?node=quarters&star=2` (lub `star=3`)
- Link **"← Mapa"** → `mapa.html` (mały, tekstowy, poniżej przycisku)

**Po zdobyciu gwiazdki ⭐⭐⭐** (ostatnia na wyspie) — overlay bez ▶:
- Tylko przycisk **"← Wróć do Mapy"** → `mapa.html`
- Gracz samodzielnie wybiera kolejną wyspę na mapie (wizualna konfrontacja postępów)

**Modal ⚙️ (filtry minut) w trybie Wyprawa:** ukryty — tryb jest narzucony przez URL, gracz nie zmienia ustawień mid-session.

**Sandbox (brak URL params):** tryb wolny, modal ⚙️ widoczny, topbar ← prowadzi do `start.html`, brak zapisu gwiazdek.

### Mapowanie URL → activeModes

Każdy węzeł narzuca konkretną pulę minut (kumulatywnie — trudniejszy węzeł zawiera łatwiejsze):

```
node=full-hours    → minutes: [0]
node=quarters      → minutes: [0, 15, 30, 45]
node=half-past     → minutes: [0, 30]
node=every-five    → minutes: [0,5,10,...,55]
node=every-minute  → minutes: [0..59]
(analogicznie roman-*, blank-*, 24h-*)
```

Implementacja: na starcie gry `?node` odczytany z URL → `activeModes` ustawione programatycznie (z pominięciem localStorage). Modal ⚙️ schowany przez CSS klasę `.expedition-mode` na `<body>`.

### Kroki:

- [ ] **3.0** Migracja podpowiedzi w `godziny.html`, `wpisz.html`, `ustaw.html`, `nauka.html`: usunąć `.help-btn` z topbaru, `.feedback-bar` z HTML; dodać FAB+Toast ze page-standards sekcja 14
- [ ] **3.1** Odczyt URL params w godziny/ustaw/wpisz.html: `?node=X&star=Y`. Brak → sandbox (modal ⚙️ widoczny, ← do start.html)
- [ ] **3.2** Import `game-state.js` we wszystkich trybach
- [ ] **3.3** `reportResult(node, star, isCorrect, timeSpent)`:
  - Wyprawa: +10 XP, +5 Sekund za poprawną odpowiedź
  - Aktualizuje score węzła, stats, errorLog, activityCalendar
  - Wywołuje saveGame
- [ ] **3.3b** `reportQuickGameResult(isCorrect)` — osobna funkcja dla Szybkiej Gry:
  - Sprawdza `stats.quickGameLastDate` — jeśli inny dzień niż dziś, resetuje `stats.quickGameTodayCount = 0`
  - Jeśli `quickGameTodayCount < 20` i `isCorrect`: +5 Sekund, `quickGameTodayCount++`
  - Brak XP, nie dotyka węzłów ani gwiazdek
- [ ] **3.4** Warunek gwiazdki: **8 poprawnych + 6 pod rząd** (patrz definicja powyżej). Stan sesji `{ total, streak, bestStreak }` trzymany w pamięci (nie w localStorage) przez czas trwania sesji gry
- [ ] **3.5** Pasek postępu w grze: dwa wskaźniki `X/8` i `seria Y/6` (CSS + HTML w każdym trybie)
- [ ] **3.6** Hook w istniejących `checkAnswer()` / `handleCheck()`
- [ ] **3.7** Overlay po gwiazdce (patrz protokół nawigacyjny):
  - ⭐ / ⭐⭐: komunikat + przycisk ▶ "Zagraj dalej" (`?node=X&star=N+1`) + link "← Mapa"
  - ⭐⭐⭐: komunikat + przycisk "← Wróć do Mapy" (tylko ten jeden)
  - `reportResult()` wywoływany przed pokazaniem overlaya
- [ ] **3.8** NODE_CONFIG (kolejność trudności w każdym węźle: ⭐ Wybierz → ⭐⭐ Wpisz → ⭐⭐⭐ Ustaw):
  ```javascript
  const NODE_CONFIG = {
    // Pętla 1 — arabskie
    'full-hours':     { minutes: [0],                    dialType: 'arabic', label: 'Wyspa Pełnych Godzin',      icon: '🏝️' },
    'quarters':       { minutes: [0,15,30,45],           dialType: 'arabic', label: 'Zatoka Kwadransów',         icon: '🌊' },
    'half-past':      { minutes: [0,30],                 dialType: 'arabic', label: 'Góry Wpół do',              icon: '🏔️' },
    'every-five':     { minutes: [0,5,10,15,20,25,30,35,40,45,50,55], dialType: 'arabic', label: 'Dolina Co Pięć Minut', icon: '🌿' },
    'every-minute':   { minutes: Array.from({length:60},(_,i)=>i),    dialType: 'arabic', label: 'Morze Każdej Minuty',  icon: '🌊' },
    // Pętla 2 — rzymskie
    'roman-full':     { minutes: [0],                    dialType: 'roman',  label: 'Wyspa Cyfr Rzymskich',      icon: '🏛️' },
    'roman-quarters': { minutes: [0,15,30,45],           dialType: 'roman',  label: 'Forum Kwadransów',          icon: '🗿' },
    'roman-half':     { minutes: [0,30],                 dialType: 'roman',  label: 'Koloseum Wpół do',          icon: '⚔️' },
    'roman-five':     { minutes: [0,5,10,15,20,25,30,35,40,45,50,55], dialType: 'roman', label: 'Akwedukt Minut',   icon: '🌁' },
    'roman-minute':   { minutes: Array.from({length:60},(_,i)=>i),    dialType: 'roman', label: 'Labirynt Caesara', icon: '🔱' },
    // Pętla 3 — bez cyfr
    'blank-full':     { minutes: [0],                    dialType: 'blank',  label: 'Wyspa Ciszy',               icon: '🌑' },
    'blank-quarters': { minutes: [0,15,30,45],           dialType: 'blank',  label: 'Mglisty Przylądek',         icon: '🌫️' },
    'blank-half':     { minutes: [0,30],                 dialType: 'blank',  label: 'Dolina Cienia',             icon: '🌒' },
    'blank-five':     { minutes: [0,5,10,15,20,25,30,35,40,45,50,55], dialType: 'blank', label: 'Pustynia Bez Znaków', icon: '🏜️' },
    'blank-minute':   { minutes: Array.from({length:60},(_,i)=>i),    dialType: 'blank', label: 'Mroczne Bezdroża',    icon: '🌑' },
    // Pętla 4 — 24h
    '24h-full':       { minutes: [0],                    hourFormat: '24',   label: 'Brama Południa',            icon: '🌃' },
    '24h-quarters':   { minutes: [0,15,30,45],           hourFormat: '24',   label: 'Wieża Zegarowa',            icon: '🗼' },
    '24h-half':       { minutes: [0,30],                 hourFormat: '24',   label: 'Kanał Wpół do',             icon: '🌉' },
    '24h-five':       { minutes: [0,5,10,15,20,25,30,35,40,45,50,55], hourFormat: '24', label: 'Metro Nocne',     icon: '🚇' },
    '24h-minute':     { minutes: Array.from({length:60},(_,i)=>i),    hourFormat: '24', label: 'Labirynt 24h',   icon: '🌐' },
  };
  // stars zawsze: { 1: 'godziny.html', 2: 'wpisz.html', 3: 'ustaw.html' }
  ```

### Pliki do modyfikacji:
- `game-state.js` (20 węzłów w `createDefaultState`, `quickGameTodayCount` w stats), `godziny.html`, `ustaw.html`, `wpisz.html`

### Nowe pliki:
- `question-logic.js` — logika generowania pytań (interfejs do wymiany w Fazie 7)

### Weryfikacja Fazy 3:
- [ ] Dashboard → karta → gwiazdka ⭐ → gra → 8+6 → overlay z ▶ i ← Mapa
- [ ] Kliknięcie ▶ otwiera tę samą wyspę z star=2
- [ ] Po gwiazdce ⭐⭐⭐ overlay ma tylko "← Wróć do Mapy" (brak ▶)
- [ ] Modal ⚙️ ukryty w trybie Wyprawa (klasa `.expedition-mode`)
- [ ] Modal ⚙️ widoczny w trybie sandbox (brak URL params)
- [ ] Seria resetuje się przy błędzie (total nie)
- [ ] Pasek postępu odzwierciedla oba wskaźniki w czasie rzeczywistym
- [ ] localStorage odzwierciedla progres
- [ ] Dashboard aktualizuje gwiazdki po powrocie
- [ ] Następna karta odblokowana przy ≥1 gwiazdce
- [ ] Sandbox bez params działa jak dotąd
- [ ] Progres per profil

---

## FAZA 4: System Nagród — Garderoba
> *Równolegle z Fazą 5*

### Kroki:
- [ ] **4.1** `garderoba.html`: siatka stylów (4 tła + 3 kolory), locked/unlocked, podgląd ClockRenderer
- [ ] **4.2** SHOP_ITEMS: solid=0, spiral=500, grid=1000, tech=2000; white=0, blue=300, red=800
- [ ] **4.3** `purchaseItem(category, itemId)` — sprawdza Sekundy, odblokuje, odejmuje
- [ ] **4.4** `equipItem(category, itemId)` — zmienia aktywny styl
- [ ] **4.5** Tryby czytają z wardrobe zamiast `zegar_*`
- [ ] **4.6** `ustawienia.html` — usunąć tła/kolory (przeniesione)

### Pliki: nowy `garderoba.html`; modyfikacja `game-state.js`, `ustawienia.html`, `start.html`, tryby gry

### Weryfikacja:
- [ ] Poprawne stany locked/unlocked
- [ ] Zakup zmniejsza Sekundy
- [ ] Brak zakupu bez funduszy
- [ ] Styl widoczny we wszystkich trybach
- [ ] Per profil

---

## FAZA 5: Streak, Kalendarz, Anty-rdza
> *Równolegle z Fazą 4*

### Kroki:
- [ ] **5.1** Streak: wczoraj → streak++, dziś → nic, starsza → reset do 1
- [ ] **5.2** Kalendarz 28 dni na dashboardzie, zielone aktywne dni, "Dzień X podróży"
- [ ] **5.3** Anty-rdza: >48h → `filter: sepia(0.5) saturate(0.5)`, komunikat, 1 poprawna → zdejmij
- [ ] **5.4** Streak counter na dashboardzie

### Pliki: modyfikacja `game-state.js`, `start.html`

### Weryfikacja:
- [ ] Streak rośnie/resetuje poprawnie
- [ ] Kalendarz podświetla aktywne dni
- [ ] Sepia po 48h, znika po zadaniu
- [ ] Per profil

---

## FAZA 6: Odznaki i Trofea
> *Wymaga Faz 4+5*

### Kroki:
- [ ] **6.1** 9 odznak: Pierwsze Kroki, Wyspiarz, Kwadransowy Król, Rzymski Ekspert, Mistrz Czasu, Seria 7, Seria 30, Koneser, Setka
- [ ] **6.2** `checkAchievements(state)` po każdym reportResult
- [ ] **6.3** Toast/popup przy zdobyciu
- [ ] **6.4** Galeria trofeów (`trofea.html` lub sekcja dashboardu)

### Pliki: nowy `trofea.html`; modyfikacja `game-state.js`, `start.html`

### Weryfikacja:
- [ ] Popup odznaki przy zdobyciu
- [ ] Galeria z poprawnymi statusami
- [ ] Per profil

---

## FAZA 7: Spaced Repetition i Wyzwanie Dnia

### Kroki:
- [ ] **7.1** Rozbudowa `question-logic.js` (zastąpienie Fazy 3 prostą implementacją):
  - Port systemu generowania pytań z zewnętrznej aplikacji
  - Unikanie powtórzonych pytań (okno ostatnich N pytań)
  - Celowe powtórki błędów z `errorLog` (spaced repetition)
  - Cykle z pytaniami: 70% aktualny węzeł, 30% powtórki
  - Interfejs zewnętrzny bez zmian: `generateQuestion(nodeConfig, attemptHistory)` — gry nie wymagają modyfikacji
- [ ] **7.2** `wyzwanie.html` — Wyzwanie Dnia:
  - 10 zadań (mix z algorytmu 7.1), jeden tryb na całe wyzwanie (losowany lub wynikający z progresu)
  - Nagroda za ukończenie: +10 XP za każdą poprawną (normalnie), Sekundy x1.5 zamiast x1 (+8 zamiast +5)
  - Bonus Streak: ukończenie Wyzwania (≥7/10 poprawnych) = +1 do passy; brak ukończenia = streak nie rośnie nawet jeśli grało się w Szybkiej Grze
  - Tylko 1 wyzwanie dziennie — po ukończeniu karta na `start.html` pokazuje ✓ i wynik; jutro nowe
  - Jeśli >48h przerwy → reset Streak do 0 (logika Fazy 5 `anty-rdza`)
- [ ] **7.3** Oznaczenie "zrobione/do zrobienia" na `start.html` (karta Wyzwanie Dnia: stan ⏳/✓ + info o nagrodzie)

### Pliki: nowy `wyzwanie.html`; modyfikacja `game-state.js`, `start.html`

### Weryfikacja:
- [ ] Mix zadań z progresu
- [ ] Bonus po ukończeniu
- [ ] Częstsze powtórki trudnych godzin

---

## Kolejność i Zależności

```
FAZA 1 (profile + dane) ──► FAZA 2 (dashboard) ──► FAZA 3 (integracja trybów)
                                                          │
                                                          ├──► FAZA 4 (garderoba)  [równolegle z 5]
                                                          ├──► FAZA 5 (streak)     [równolegle z 4]
                                                          │
                                                          └──► FAZA 6 (odznaki)    [po 4 i 5]
                                                                    │
                                                                    └──► FAZA 7 (spaced repetition)
```

---

## Nowe pliki do utworzenia (wszystkie fazy)

| Plik | Faza | Opis |
|------|------|------|
| `game-state.js` | 1 | System danych, profili, eksportu/importu, progresu |
| `profil.html` | 1 | Ekran tworzenia/wyboru profilu |
| `mapa.html` | 2 | Mapa Przygód — węzły postępu z gwiazdkami |
| `szybka-gra.html` | 2 | Wybór trybu gry: Wolna Nauka + 3 tryby z nagrodami (Sekundy, limit 20/dzień) |
| `garderoba.html` | 4 | Sklep z kosmetyką zegara |
| `trofea.html` | 6 | Galeria osiągnięć |
| `wyzwanie.html` | 7 | Wyzwanie Dnia |

---

## Status Realizacji

| Faza | Status | Data ukończenia | Uwagi |
|------|--------|-----------------|-------|
| 1. Profile + Dane | ✅ Ukończona | 29.03.2026 | — |
| 2. Dashboard UI | ⬜ Nie rozpoczęta | — | Hub 3 kart + mapa.html + szybka-gra.html; prototyp CSS w Untitled-1.html |
| 3. Integracja Trybów | ⬜ Nie rozpoczęta | — | — |
| 4. Garderoba | ⬜ Nie rozpoczęta | — | — |
| 5. Streak/Kalendarz | ⬜ Nie rozpoczęta | — | — |
| 6. Odznaki | ⬜ Nie rozpoczęta | — | — |
| 7. Spaced Repetition | ⬜ Nie rozpoczęta | — | — |

---

*Plan utworzony: 29.03.2026*
*Ostatnia aktualizacja: 29.03.2026 — Faza 1 ukończona; Faza 2 przeprojektowana (hub 3 kart, mapa.html, szybka-gra.html); kolejność trudności zmieniona na Wybierz→Wpisz→Ustaw*
