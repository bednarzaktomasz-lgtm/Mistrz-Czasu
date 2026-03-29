---
mode: agent
description: "Utwórz nową stronę trybu gry lub ekranu aplikacji Mistrz Czasu zgodnie ze standardami projektu."
---

# Utwórz nową stronę Mistrz Czasu

Tworzysz nowy plik HTML dla aplikacji **Mistrz Czasu**. Zanim napiszesz jakikolwiek kod, odpowiedz sobie na poniższe pytania i wyjaśnij plan użytkownikowi.

## Krok 1 — Ustal wymagania (zapytaj użytkownika jeśli brakuje odpowiedzi)

1. **Nazwa pliku** — jak ma się nazywać nowy plik? (np. `garderoba.html`)
2. **Typ strony** — wybierz jeden:
   - `tryb-gry` — strona z zegarem, scoringiem, feedbackiem (jak `godziny.html`, `ustaw.html`)
   - `ekran-ui` — strona bez zegara, np. lista, karty, profil (jak `profil.html`, `trofea.html`)
   - `hub` — strona nawigacyjna z kafelkami (jak `start.html`)
3. **Czy używa ClockRenderer?** — tak / nie
4. **Czy używa game-state.js?** — tak / nie (tylko tryby gry i ekrany z progresem)
5. **Co robi strona** — 1-2 zdania opisu mechaniki

## Krok 2 — Sprawdź plan

Przeczytaj `PLAN-BUDOWY.md` i upewnij się, że ta strona jest w aktualnej lub niedalekiej fazie. Zaktualizuj checklist po stworzeniu pliku.

## Krok 3 — Wygeneruj plik zgodnie ze standardami

Użyj poniższego szablonu jako bazy. **Nie odchodź od struktury** zdefiniowanej w `.github/instructions/page-standards.instructions.md`.

### Szablon dla `tryb-gry`:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAZWA TRYBU — Mistrz Czasu</title>
  <link rel="stylesheet" href="clock-styles.css" />
  <link rel="stylesheet" href="layout.css" />
  <style>
    /* ===== NAZWA TRYBU — page-specific styles ===== */
  </style>
</head>
<body>

  <div class="topbar">
    <a href="start.html" title="Wróć do menu">
      <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </a>
    <div class="topbar-right">
      <button class="help-btn" id="helpBtn">?</button>
      <svg class="icon-btn settings-icon" id="settingsIcon" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <line x1="4" y1="6" x2="20" y2="6"></line><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"></circle>
        <line x1="4" y1="12" x2="20" y2="12"></line><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"></circle>
        <line x1="4" y1="18" x2="20" y2="18"></line><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"></circle>
      </svg>
    </div>
  </div>

  <div class="feedback-bar" id="hintArea">Treść podpowiedzi dla tego trybu.</div>

  <div class="result-bar">
    <div class="feedback" id="feedback"></div>
    <div class="score" id="score">0 / 0</div>
  </div>

  <div class="clock-wrap" id="clockContainer"></div>

  <div class="content-area">
    <!-- główna zawartość trybu -->
  </div>

  <div class="modal" id="settingsModal">
    <div class="modal-content">
      <!-- ustawienia trybu -->
    </div>
  </div>

  <script src="clock-renderer.js"></script>
  <script src="game-state.js"></script>
  <script>
    // ===== PAGE INIT =====
    const STORAGE_KEYS = {
      activeModes:  'zegar_activeModes',
      soundEnabled: 'zegar_soundEnabled',
      clockBg:      'zegar_clockBg',
      handColor:    'zegar_handColor',
      numberStyle:  'zegar_numberStyle',
      hourFormat:   'zegar_hourFormat',
    };

    function loadGlobalSettings() {
      return {
        activeModes:  JSON.parse(localStorage.getItem(STORAGE_KEYS.activeModes)) || ['full'],
        soundEnabled: localStorage.getItem(STORAGE_KEYS.soundEnabled) !== 'false',
        clockBg:      localStorage.getItem(STORAGE_KEYS.clockBg) || 'solid',
        handColor:    localStorage.getItem(STORAGE_KEYS.handColor) || 'white',
        numberStyle:  localStorage.getItem(STORAGE_KEYS.numberStyle) || 'arabic',
        hourFormat:   localStorage.getItem(STORAGE_KEYS.hourFormat) || '12',
      };
    }

    const globalSettings = loadGlobalSettings();

    // ===== CLOCK SETUP =====
    const clockContainer = document.getElementById('clockContainer');
    const clock = new ClockRenderer(clockContainer, {
      size: 'normal',
      interactive: false,
      showBrand: true,
      showDigital: globalSettings.showTimeHint,
      showDate: false,
      showSecondHand: false,
      showBgControls: false,
      handColor: globalSettings.handColor,
    });
    clock.setBackground(globalSettings.clockBg);
    clock.setNumberStyle(globalSettings.numberStyle);

    // ===== GAME STATE =====
    let score = 0;
    let total = 0;

    const feedbackEl = document.getElementById('feedback');
    const scoreEl    = document.getElementById('score');
    const hintArea   = document.getElementById('hintArea');

    // ===== GAME LOGIC =====
    function nextQuestion() {
      // TODO: implement
    }

    function checkAnswer(answer) {
      total++;
      if (/* correct */ false) {
        feedbackEl.textContent = '✓ Brawo!';
        feedbackEl.className   = 'feedback ok';
        score++;
      } else {
        feedbackEl.textContent = '✗ Błąd';
        feedbackEl.className   = 'feedback bad';
      }
      scoreEl.textContent = `${score} / ${total}`;
    }

    // ===== HELP BUTTON =====
    document.getElementById('helpBtn').addEventListener('click', () => {
      hintArea.classList.toggle('active');
    });

    // ===== SETTINGS MODAL =====
    const settingsModal = document.getElementById('settingsModal');
    document.getElementById('settingsIcon').addEventListener('click', () => {
      settingsModal.classList.toggle('open');
    });
    settingsModal.addEventListener('click', e => {
      if (e.target === settingsModal) settingsModal.classList.remove('open');
    });

    // ===== START =====
    nextQuestion();
  </script>
  <script src="transitions.js"></script>
</body>
</html>
```

### Szablon dla `ekran-ui` (bez zegara):

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAZWA EKRANU — Mistrz Czasu</title>
  <link rel="stylesheet" href="layout.css" />
  <style>
    /* ===== NAZWA EKRANU — page-specific styles ===== */
  </style>
</head>
<body>

  <div class="topbar">
    <a href="start.html" title="Wróć do menu">
      <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </a>
    <div class="topbar-right">
      <!-- opcjonalne ikony -->
    </div>
  </div>

  <div class="feedback-bar" id="hintArea"><!-- opcjonalnie --></div>

  <div class="content-area">
    <!-- zawartość ekranu -->
  </div>

  <script src="game-state.js"></script>
  <script>
    // ===== PAGE INIT =====
    // TODO: implement
  </script>
  <script src="transitions.js"></script>
</body>
</html>
```

## Krok 4 — Wymogi obowiązkowe przy każdej nowej stronie

- [ ] `transitions.js` jako **ostatni** `<script>`
- [ ] `clock-styles.css` importowany **przed** `layout.css`
- [ ] Brak CDN, brak npm — tylko pliki lokalne
- [ ] `-webkit-tap-highlight-color: transparent` na każdym klikalnym elemencie
- [ ] Nowe rozmiary tylko przez `clamp()` lub CSS variables z `layout.css`
- [ ] Kolory wyłącznie z zatwierdzonej palety (patrz `page-standards.instructions.md`)
- [ ] Po ukończeniu: zaktualizuj `PLAN-BUDOWY.md` (zmień `- [ ]` na `- [x]`)

## Krok 5 — Weryfikacja w przeglądarce

Po stworzeniu pliku podaj użytkownikowi:
1. Ścieżkę do pliku do otwarcia w przeglądarce
2. Co konkretnie kliknąć/zrobić żeby sprawdzić czy działa
3. Co powinno się stać (oczekiwany rezultat)
