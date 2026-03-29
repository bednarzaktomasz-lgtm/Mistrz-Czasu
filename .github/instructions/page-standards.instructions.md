---
applyTo: "**/*.html"
---

# Standardy Nowych Stron — Mistrz Czasu

Każda nowa strona HTML musi ściśle przestrzegać poniższych zasad, aby zachować spójność wizualną i techniczną z istniejącymi plikami.

---

## 1. Struktura `<head>` — kolejność obowiązkowa

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nazwa Strony</title>
  <!-- 1. clock-styles.css TYLKO jeśli strona używa ClockRenderer -->
  <link rel="stylesheet" href="clock-styles.css" />
  <!-- 2. layout.css — ZAWSZE -->
  <link rel="stylesheet" href="layout.css" />
  <!-- 3. Lokalne style strony — ZAWSZE na końcu, nigdy inline w body -->
  <style>
    /* style specyficzne dla tej strony */
  </style>
</head>
```

**Zasady:**
- `clock-styles.css` tylko gdy strona renderuje zegar przez `ClockRenderer`
- `layout.css` jest **zawsze** wymagany — zawiera reset CSS, body layout, topbar, feedback-bar, modal i wszystkie CSS variables
- Lokalne `<style>` wyłącznie w `<head>`, nigdy w `<body>`
- Żadnych zewnętrznych CDN ani importów npm

---

## 2. Koniec `<body>` — kolejność skryptów

```html
  <!-- 1. clock-renderer.js TYLKO jeśli strona używa ClockRenderer -->
  <script src="clock-renderer.js"></script>
  <!-- 2. game-state.js TYLKO jeśli strona czyta/zapisuje postęp gracza -->
  <script src="game-state.js"></script>
  <!-- 3. Logika strony — inline <script> -->
  <script>
    // logika strony
  </script>
  <!-- 4. transitions.js — ZAWSZE jako ostatni -->
  <script src="transitions.js"></script>
</body>
</html>
```

**Zasada:** `transitions.js` jest **zawsze ostatni** — musi zarejestrować event listener po tym jak DOM jest gotowy.

---

## 3. Schemat kolorów — używaj wyłącznie tych wartości

| Rola | Wartość | Gdzie używać |
|------|---------|--------------|
| Tło strony | `#000` | `body` (z layout.css) |
| Tło kart / paneli | `#111` | `.panel-box`, przyciski, inputy |
| Tło hover / raised | `#1a1a1a` | Stan hover przycisków |
| Obramowania | `#222` | Domyślne obramowania |
| Obramowania modal | `#333` | W modalach i toggle-ach |
| Tekst główny | `#f0f0f0` | Treść, przyciski |
| Tekst wyciszony | `#888` | Opisy, labels, `score` |
| Tekst nieaktywny | `#555` | Ikony `.icon-btn`, `.score` |
| Akcent dynamiczny | `var(--accent-color)` | Hover na nav-btn, aktywne elementy |
| Sukces (zielony) | `#16a34a` | Poprawna odpowiedź, aktywny toggle |
| Błąd (czerwony) | `#dc2626` | Zła odpowiedź |
| Akcent niebieski | `#2563eb` | Aktywny `mode-toggle` |
| Akcent fioletowy | `#bb86fc` | Elementy nowego UI (dashboard, karty przygód) |

**Nie używaj** hardkodowanych kolorów tam gdzie istnieje CSS variable. Nie wprowadzaj nowych wartości hex bez uzasadnienia.

---

## 4. CSS Variables z layout.css — używaj, nie przedefiniowuj

```css
/* Dostępne zmienne — nigdy nie nadpisuj w :root lokalnej strony */
var(--clock-size)       /* clamp(280px, 60vmin, 700px) — rozmiar zegara */
var(--content-width)    /* 80% clock-size — szerokość contentu pod/nad zegarem */
var(--nav-width)        /* min(1100px, 96vw) — max szerokość elementów topbar */
var(--gap)              /* clamp(16px, 3vmin, 48px) — odstępy ogólne */
var(--btn-height)       /* clamp(72px, 9vmin, 140px) — wysokość przycisków */
var(--btn-radius)       /* clamp(14px, 2vmin, 24px) — zaokrąglenie przycisków */
var(--btn-font)         /* clamp(1.1rem, 2.5vmin, 2.4rem) — font przycisków */
var(--icon-size)        /* clamp(36px, 5vmin, 56px) — ikony w topbar */
var(--feedback-font)    /* clamp(1rem, 2vmin, 1.8rem) — font feedbacku */
var(--accent-color)     /* #f0f0f0 domyślnie, nadpisywany przez JS z localStorage */
```

**Nowe rozmiary responsywne** — zawsze używaj `clamp(min, preferred, max)` z jednostkami `vmin`/`vw`, nie `px` na stałe.

---

## 5. Szkielet HTML — struktura body

Każda strona powinna trzymać się tej kolejności elementów:

```html
<body>

  <!-- A. Topbar — zawsze pierwszy -->
  <div class="topbar">
    <!-- Strony podrzędne: strzałka wstecz po lewej -->
    <a href="start.html" title="Wróć do menu">
      <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </a>
    <!-- Po prawej: help + settings lub inne ikony -->
    <div class="topbar-right">
      <button class="help-btn" id="helpBtn">?</button>
      <!-- opcjonalnie ikona ustawień -->
    </div>
  </div>

  <!-- B. Feedback bar — kontekstowy hint, zawsze pod topbarem -->
  <div class="feedback-bar" id="hintArea">Treść podpowiedzi.</div>

  <!-- C. Result bar — TYLKO w trybach z scoringiem -->
  <div class="result-bar">
    <div class="feedback" id="feedback"></div>
    <div class="score" id="score">0 / 0</div>
  </div>

  <!-- D. Zegar — TYLKO jeśli strona używa ClockRenderer -->
  <div class="clock-wrap" id="clockContainer"></div>

  <!-- E. Główna zawartość strony -->
  <div class="content-area">
    <!-- przyciski, formularze, karty, lista, itp. -->
  </div>

  <!-- F. Modal — na końcu body, przed skryptami -->
  <div class="modal" id="settingsModal">
    <div class="modal-content">
      <!-- zawartość modalu -->
    </div>
  </div>

</body>
```

**Strona bez zegara** (profil, garderoba, trofea): pomija `.clock-wrap` i `.result-bar`. Zachowuje topbar i feedback-bar.

---

## 6. Topbar — warianty

**Strona główna / hub** (np. `start.html`, `profil.html`):
```html
<div class="topbar">
  <div class="topbar-spacer" style="width: var(--icon-size)"></div>
  <div class="topbar-right">
    <button class="help-btn" id="helpBtn">?</button>
    <a href="ustawienia.html" class="icon-btn settings-icon" title="Ustawienia"><!-- SVG --></a>
  </div>
</div>
```

**Strona podrzędna** (tryb gry, garderoba, trofea):
```html
<div class="topbar">
  <a href="start.html" title="Wróć do menu">
    <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </a>
  <div class="topbar-right">
    <!-- opcjonalne ikony po prawej -->
  </div>
</div>
```

**SVG ikony** — zawsze `stroke="currentColor"`, `fill="none"`, `stroke-width="1.8"`, `stroke-linecap="round"`. Rozmiar przez klasę `.icon-btn` (= `var(--icon-size)`).

---

## 7. Przyciski — standardy

```css
/* Przycisk akcji (główny) */
background: #111;
border: 2px solid #222;
border-radius: var(--btn-radius);
color: #f0f0f0;
font-size: var(--btn-font);
font-weight: 600;
cursor: pointer;
transition: background 0.2s, border-color 0.2s;
-webkit-tap-highlight-color: transparent;  /* wymagane na mobile */

/* Hover */
background: #1a1a1a;
border-color: #444;

/* Stan aktywny/wybrany */
background: #2563eb;
border-color: #2563eb;
color: white;

/* Stan sukcesu */
background: #16a34a;
border-color: #16a34a;

/* Stan błędu */
background: #dc2626;
border-color: #dc2626;
```

**Każdy klikalny element** musi mieć `transition: 0.2s` i `-webkit-tap-highlight-color: transparent`.

---

## 8. Karty przygód (nowy UI) — wzorzec z Untitled-1.html

Dla stron dashboardu i list (nie trybów gry) używaj tego wzorca:

```css
/* Dostępne w Untitled-1.html — kopiuj klasę adventure-card */
--bg-dark: #121212;   /* tło ciała w nowym UI */
--card-bg: #1e1e1e;   /* tło kart */
--accent: #bb86fc;    /* fioletowy akcent nowego UI */
--gold: #ffd700;      /* gwiazdki, XP */
--text-main: #e0e0e0;
--text-dim: #a0a0a0;
--locked: #333333;    /* zablokowane elementy */
```

Karty: `border-radius: 16px`, `padding: 20px`, `border: 1px solid #333`, `transition: transform 0.2s`.

---

## 9. Inicjalizacja JS — wzorzec dla każdej strony z localStorage

```javascript
// Na początku bloku <script> — odczyt ustawień
const STORAGE_KEYS = {
  activeModes:   'zegar_activeModes',
  soundEnabled:  'zegar_soundEnabled',
  showTimeHint:  'zegar_showTimeHint',
  clockBg:       'zegar_clockBg',
  handColor:     'zegar_handColor',
  numberStyle:   'zegar_numberStyle',
  hourFormat:    'zegar_hourFormat',
};

function loadGlobalSettings() {
  return {
    activeModes:  JSON.parse(localStorage.getItem(STORAGE_KEYS.activeModes)) || ['full'],
    soundEnabled: localStorage.getItem(STORAGE_KEYS.soundEnabled) !== 'false',
    showTimeHint: localStorage.getItem(STORAGE_KEYS.showTimeHint) !== 'false',
    clockBg:      localStorage.getItem(STORAGE_KEYS.clockBg) || 'solid',
    handColor:    localStorage.getItem(STORAGE_KEYS.handColor) || 'white',
    numberStyle:  localStorage.getItem(STORAGE_KEYS.numberStyle) || 'arabic',
    hourFormat:   localStorage.getItem(STORAGE_KEYS.hourFormat) || '12',
  };
}
```

Strony z nowym systemem profili (`game-state.js`) używają `loadGame()` zamiast powyższego — nie mieszaj obu podejść.

---

## 10. Inicjalizacja ClockRenderer — standardowe opcje

```javascript
const clock = new ClockRenderer(document.getElementById('clockContainer'), {
  size: 'normal',          // 'sm' | 'normal' | 'lg'
  interactive: false,      // true tylko gdy użytkownik przeciąga wskazówki
  showBrand: true,
  showDigital: true,
  showDate: true,
  showSecondHand: false,   // true tylko w trybie nauki
  showBgControls: false,   // true tylko w ustawienia.html
  handColor: globalSettings.handColor,
});
clock.setBackground(globalSettings.clockBg);
clock.setNumberStyle(globalSettings.numberStyle);
```

**Nie modyfikuj** `ClockRenderer` — tylko używaj jego publicznego API.

---

## 11. Animacje i przejścia — dozwolone wartości

```css
transition: background 0.2s, border-color 0.2s;   /* przyciski */
transition: opacity 0.2s;                           /* show/hide elementów */
transition: opacity 0.22s ease, transform 0.22s ease;  /* modal */
transition: color 0.2s;                            /* ikony */

/* Animacja feedbacku */
@keyframes feedbackIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: none; }
}
/* Użycie: animation: feedbackIn 0.25s ease forwards; */
```

Nie dodawaj nowych keyframe animations bez uzasadnienia. Czas transycji: `0.2s` (elementy UI) lub `0.22s` (modals, page fade).

---

## 12. Responsywność — checklist przed oddaniem strony

- [ ] Testuj przy 360px szerokości (mobile minimum)
- [ ] Testuj przy 768px (tablet)
- [ ] Testuj przy 1200px (desktop)
- [ ] Żadne elementy nie wychodzą poza viewport
- [ ] Przyciski mają min. 48px wysokości na dotykowym (zapewnione przez `var(--btn-height)`)
- [ ] Fonty czytelne: minimum 14px w trybie mobile (zapewnione przez `clamp`)
- [ ] `-webkit-tap-highlight-color: transparent` na wszystkich klikalnych elementach
