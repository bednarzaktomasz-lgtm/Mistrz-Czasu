# Plan Budowy: Mistrz Czasu

## TL;DR
Przekształcenie aplikacji "piaskownicy" do nauki zegara w progresywną grę edukacyjną z systemem profili użytkowników (bez logowania), progresem, nagrodami i grywalizacją. Każda faza jest niezależnie weryfikowalna. Plan aktualizowany po każdej ukończonej fazie.

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
- `layout.css` — responsywny layout (CSS vars z clamp/vmin), modal, topbar, feedback-bar, answer-btn, toggle-switch
- `transitions.js` — fade-in/fade-out między stronami (220ms, klasa `page-loaded`)
- `start.html` — menu główne (4 przyciski emoji + ustawienia + pomoc z hintami)
- `ustawienia.html` — hub konfiguracji (tła, kolory, style cyfr, tryby minut, format 12/24h, dźwięk, hint)

### localStorage (tylko preferencje wizualne, BRAK progresu):
- `zegar_handColor` ('white'|'blue'|'red'), `zegar_clockBg` ('solid'|'spiral'|'grid'|'tech')
- `zegar_numberStyle` ('arabic'|'roman'|'none'), `zegar_activeModes` (JSON array)
- `zegar_soundEnabled`, `zegar_showTimeHint`, `zegar_hourFormat` ('12'|'24')

### Prototyp UI (niezintegrowany):
- `Untitled-1.html` — 3 mockupy: Karty Przygód (pionowa lista `.adventure-card`), Drzewo Odblokowań (grid 3×3 `.grid-item`), Pasek Postępu (roadmap `.milestone`). Style CSS gotowe do reużycia.

---

## FAZA 1: Profile Użytkowników + Fundamenty Danych
> Cel: Multi-profil bez logowania (imię + avatar), trwały zapis progresu, eksport/import danych.

### Kroki:

- [ ] **1.1** Utworzyć plik `game-state.js` z systemem wielu profili. Struktura localStorage:
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
      "full-hours":    { star1: {completed: false, score: 0}, star2: {...}, star3: {...} },
      "quarters":      { star1: {...}, star2: {...}, star3: {...} },
      "half-past":     { star1: {...}, star2: {...}, star3: {...} },
      "roman":         { star1: {...}, star2: {...}, star3: {...} },
      "twenty-four-h": { star1: {...}, star2: {...}, star3: {...} }
    },
    wardrobe: {
      unlockedBgs: ["solid"],
      unlockedHandColors: ["white"],
      activeBg: "solid",
      activeHandColor: "white"
    },
    stats: {
      totalCorrect: 0,
      totalAttempts: 0,
      errorLog: {}
    },
    activityCalendar: {},
    achievements: []
  }
  ```
- [ ] **1.2** Napisać funkcje zarządzania profilami:
  - `getProfiles()` — zwraca listę profili
  - `createProfile(name, avatar)` — generuje ID (crypto.randomUUID lub fallback), tworzy profil + pusty save
  - `switchProfile(id)` — zmienia `activeProfileId`
  - `deleteProfile(id)` — usuwa profil i jego save z localStorage
  - `getActiveProfile()` — zwraca aktywny profil lub null
- [ ] **1.3** Napisać funkcje zapisu/odczytu:
  - `saveGame(state)` — zapisuje do `mistrzCzasu_save_{activeId}`
  - `loadGame()` — ładuje save aktywnego profilu, waliduje wersję
  - `resetGame()` — czyści save aktywnego profilu (zachowuje profil)
  - `createDefaultState(profileId)` — zwraca czysty obiekt stanu
- [ ] **1.4** Napisać eksport/import danych profilu:
  - `exportProfile(id)` — zbiera profil + save, generuje Blob JSON, pobiera plik `MistrzCzasu_[imię]_[data].json`
  - `importProfile(file)` — czyta JSON (FileReader), waliduje strukturę (version, profileId, nodes), jeśli ID istnieje → generuje nowe, dodaje profil + save
  - Walidacja: odrzucenie > 1MB, sprawdzenie version, obecność kluczowych pól
- [ ] **1.5** Napisać `migrateFromLegacy()` — stare klucze `zegar_*` bez `mistrzCzasu_profiles` → tworzy profil "Gracz" z domyślnym avatarem, przenosi preferencje do wardrobe
- [ ] **1.6** Utworzyć ekran wyboru/tworzenia profilu (`profil.html`):
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
- [ ] **1.7** Integracja z `start.html`:
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
- [ ] Pierwsze wejście → ekran tworzenia profilu
- [ ] Imię + avatar → profil w localStorage (`mistrzCzasu_profiles` + `mistrzCzasu_save_[id]`)
- [ ] Drugi profil → oba na liście
- [ ] Kliknięcie profilu → aktywacja → dashboard
- [ ] Eksport → plik JSON z poprawnymi danymi
- [ ] Import → profil na liście
- [ ] Import duplikatu ID → nowe ID, brak kolizji
- [ ] Import złego pliku → komunikat błędu
- [ ] Usunięcie → potwierdzenie → profil i save usunięte
- [ ] Migracja legacy → profil "Gracz" z przeniesionymi preferencjami
- [ ] `loadGame()` graceful fallback przy brakujących danych

---

## FAZA 2: Nowe UI — Dashboard (Centrum Dowodzenia)
> Cel: Zastąpić `start.html` interaktywnym dashboardem z mapą przygód i paskiem statusu.

### Kroki:

- [ ] **2.1** Przebudowa `start.html`:
  - **Top Bar**: Avatar profilu (emoji) + imię, pasek XP, licznik Sekund, przycisk "Zmień gracza" → profil.html
  - **Mapa Przygód**: Pionowa lista kart (wzór z `Untitled-1.html`)
  - **Dolny pasek**: Przyciski Garderoba + Trofea (placeholder)
- [ ] **2.2** Komponent `AdventureCard` — dynamiczne generowanie z `userProgress.nodes`:
  - Ikona emoji, nazwa, gwiazdki (0-3), pasek postępu, "Graj"/"Zablokowane"
  - Odblokowanie: węzeł N+1 gdy N ma ≥1 gwiazdkę
- [ ] **2.3** Pasek statusu (XP + Sekundy) z `userProgress`
- [ ] **2.4** Kliknięcie karty → popup z gwiazdkami (⭐ Wybierz / ⭐⭐ Ustaw / ⭐⭐⭐ Wpisz) → nawigacja URL (np. `godziny.html?node=quarters&star=1`)

### Wzorce do reużycia:
- CSS z `Untitled-1.html`: `.adventure-card`, `.adventure-list`, `.adventure-progress`
- Layout z `layout.css`: CSS variables, `clamp()`, `--gap`
- `transitions.js` fade

### Pliki do modyfikacji:
- `start.html` — przebudowa HTML + JS
- `layout.css` — style dashboardu

### Weryfikacja Fazy 2:
- [ ] Avatar + imię w topbar
- [ ] 5 kart z poprawnymi stanami (1 odblokowana przy nowym profilu)
- [ ] XP i Sekundy z userProgress
- [ ] Karta → popup gwiazdek → nawigacja URL
- [ ] "Zmień gracza" → profil.html
- [ ] Responsywność 360px–1200px
- [ ] Fade transitions

---

## FAZA 3: Integracja Trybów z Systemem Progresu
> Cel: Tryby gry raportują wyniki do systemu progresu.

### Kroki:

- [ ] **3.1** Odczyt URL params w godziny/ustaw/wpisz.html: `?node=X&star=Y`. Brak → sandbox
- [ ] **3.2** Import `game-state.js` we wszystkich trybach
- [ ] **3.3** `reportResult(node, star, isCorrect, timeSpent)`:
  - Aktualizuje score węzła, +10 XP, +5 Sekund za poprawną
  - Aktualizuje stats, errorLog, activityCalendar
  - Wywołuje saveGame
- [ ] **3.4** Warunki gwiazdki: 10 poprawnych odpowiedzi → gwiazdka zdobyta
- [ ] **3.5** Hook w istniejących `checkAnswer()` / `handleCheck()`
- [ ] **3.6** Overlay "Zdobyłeś ⭐! +50 Sekund" → powrót do mapy
- [ ] **3.7** NODE_CONFIG:
  ```
  NODE_CONFIG = {
    "full-hours":    { minutes: [0], dialType: "arabic", label: "Wyspa Pełnych Godzin", icon: "🏝️" },
    "quarters":      { minutes: [0, 15, 30, 45], dialType: "arabic", label: "Zatoka Kwadransów", icon: "🌊" },
    "half-past":     { minutes: [0, 30], dialType: "arabic", label: "Góry Wpół do", icon: "🏔️" },
    "roman":         { minutes: [0, 15, 30, 45], dialType: "roman", label: "Pustynia Cyfr Rzymskich", icon: "🏛️" },
    "twenty-four-h": { minutes: [0,5,10,15,20,25,30,35,40,45,50,55], hourFormat: "24", label: "Labirynt 24h", icon: "🌃" }
  }
  ```

### Pliki do modyfikacji:
- `game-state.js`, `godziny.html`, `ustaw.html`, `wpisz.html`

### Weryfikacja Fazy 3:
- [ ] Dashboard → karta → gwiazdka → 10 poprawnych → gwiazdka zdobyta
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
- [ ] **7.1** Algorytm: 70% aktualny węzeł, 30% powtórki z errorLog
- [ ] **7.2** Wyzwanie Dnia: 10 zadań mix, bonus za bezbłędne
- [ ] **7.3** Oznaczenie "zrobione/do zrobienia" na dashboardzie

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
| `garderoba.html` | 4 | Sklep z kosmetyką zegara |
| `trofea.html` | 6 | Galeria osiągnięć |
| `wyzwanie.html` | 7 | Wyzwanie Dnia |

---

## Status Realizacji

| Faza | Status | Data ukończenia | Uwagi |
|------|--------|-----------------|-------|
| 1. Profile + Dane | ⬜ Nie rozpoczęta | — | — |
| 2. Dashboard UI | ⬜ Nie rozpoczęta | — | Prototyp CSS w Untitled-1.html |
| 3. Integracja Trybów | ⬜ Nie rozpoczęta | — | — |
| 4. Garderoba | ⬜ Nie rozpoczęta | — | — |
| 5. Streak/Kalendarz | ⬜ Nie rozpoczęta | — | — |
| 6. Odznaki | ⬜ Nie rozpoczęta | — | — |
| 7. Spaced Repetition | ⬜ Nie rozpoczęta | — | — |

---

*Plan utworzony: 29.03.2026*
*Ostatnia aktualizacja: 29.03.2026*
