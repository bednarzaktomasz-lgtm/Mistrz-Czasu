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

## 12. Okna dialogowe — NIGDY nie używaj `confirm()` / `alert()` / `prompt()`

Natywne okna przeglądarki mają inny wygląd niż aplikacja i blokują wątek JS. Zamiast nich używaj wzorca poniżej opartego na istniejącej klasie `.modal` z `layout.css`.

### HTML — dodać raz na stronę (przed `</body>`, przed skryptami):

```html
<!-- Confirm dialog modal -->
<div class="modal" id="confirmModal" aria-modal="true" role="dialog">
  <div class="modal-content" style="max-width: 380px; gap: clamp(16px, 2.5vmin, 28px);">
    <p class="confirm-msg" id="confirmMsg"></p>
    <div class="confirm-actions">
      <button class="confirm-btn confirm-cancel" id="confirmCancel">Anuluj</button>
      <button class="confirm-btn confirm-ok" id="confirmOk">Potwierdź</button>
    </div>
  </div>
</div>
```

### CSS — dodać do lokalnego `<style>` strony:

```css
.confirm-msg {
  font-size: clamp(1rem, 2.2vmin, 1.5rem);
  color: #f0f0f0;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}
.confirm-actions {
  display: flex;
  gap: clamp(10px, 1.5vmin, 16px);
  justify-content: center;
}
.confirm-btn {
  background: #111;
  border: 2px solid #222;
  border-radius: var(--btn-radius);
  color: #f0f0f0;
  font-size: clamp(0.9rem, 2vmin, 1.3rem);
  font-weight: 600;
  padding: clamp(10px, 1.8vmin, 18px) clamp(20px, 3vmin, 36px);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.confirm-btn:hover            { background: #1a1a1a; border-color: #444; }
.confirm-btn.confirm-ok       { background: #dc2626; border-color: #dc2626; color: #fff; }
.confirm-btn.confirm-ok:hover { background: #b91c1c; border-color: #b91c1c; }
```

**Warianty przycisku OK:** dla destruktywnej akcji (usuń) — czerwony jak wyżej. Dla potwierdzenia pozytywnego (zapisz, wyślij) — zmień na `#2563eb` / `#1d4ed8` hover.

### JS — gotowa funkcja (wkleić do `<script>` strony):

```javascript
function showConfirm(message, okLabel = 'Potwierdź', cancelLabel = 'Anuluj') {
  return new Promise(resolve => {
    const modal     = document.getElementById('confirmModal');
    const msgEl     = document.getElementById('confirmMsg');
    const okBtn     = document.getElementById('confirmOk');
    const cancelBtn = document.getElementById('confirmCancel');
    msgEl.textContent     = message;
    okBtn.textContent     = okLabel;
    cancelBtn.textContent = cancelLabel;
    modal.classList.add('active');
    function cleanup(result) {
      modal.classList.remove('active');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onBackdrop);
      resolve(result);
    }
    function onOk()        { cleanup(true); }
    function onCancel()    { cleanup(false); }
    function onBackdrop(e) { if (e.target === modal) cleanup(false); }
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    modal.addEventListener('click', onBackdrop);
  });
}
```

### Użycie — zawsze przez `.then()`:

```javascript
// zamiast: if (confirm('Usunąć?')) { ... }
showConfirm('Usunąć profil "Zuzia"?', 'Usuń', 'Anuluj').then(confirmed => {
  if (confirmed) {
    // wykonaj akcję
  }
});
```

**Kliknięcie tła modalu** zamyka dialog (= Anuluj). Nie trzeba dodawać osobnego event listenera.

---

## 13. Popup węzła mapy (`.star-popup`) — wzorzec dla `mapa.html`

Popup pojawia się po kliknięciu kafelka na ścieżce przygody. Wyświetla 3 gwiazdki (tryby gry) dla danego węzła.

### Kluczowe wymiary

- **Szerokość:** `min(440px, 92vw)` — prawie na całą szerokość na telefonie, max 440px na desktopie.  
  ⚠️ Nie używaj `var(--tile-w)` dla popupu — kafelki są węższe, popup powinien być szerszy.
- **Animacja wejścia:** `scale(0.95) translateY(8px)` → `scale(1) translateY(0)` (centrowanie, nie slide-up z dołu ekranu)
- **Overlay:** `align-items: center` (wyśrodkowany pionowo i poziomo)

### CSS

```css
.star-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  transition: background 0.22s ease, visibility 0s 0.22s;
  padding: clamp(16px, 3vmin, 32px) 20px;
}
.star-popup-overlay.active {
  background: rgba(0,0,0,0.7);
  visibility: visible;
  transition: background 0.22s ease, visibility 0s 0s;
}

.star-popup {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: clamp(16px, 3vmin, 28px);   /* jednolite, nie asymetryczne */
  padding: clamp(20px, 3.5vmin, 36px);
  width: min(440px, 92vw);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vmin, 20px);
  opacity: 0;
  transform: scale(0.95) translateY(8px);
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.star-popup-overlay.active .star-popup {
  opacity: 1;
  transform: scale(1) translateY(0);
}
```

### Przyciski gwiazdek — układ elementów (lewo → prawo)

```
[ikona gry]  [nazwa trybu ...............]  [⭐⭐⭐]  [✓ / ▶ / 🔒]
```

- Lewa ikona gry: `font-size: clamp(1.2rem, 2.5vmin, 1.6rem)` — stała, `flex-shrink: 0`
- Nazwa: `flex: 1`, `font-weight: 600`
- Gwiazdki po prawej: `white-space: nowrap`, `letter-spacing: 2px`, `flex-shrink: 0`
- Status (`✓` zielony / `▶` fioletowy / `🔒`): `flex-shrink: 0` — zawsze na skraju prawym
- Status `▶` — sama strzałka **bez tekstu** (nie "▶ Graj")

**Ikony gier wg gwiazdki:**
```javascript
const GAME_ICONS  = ['🔵', '✏️', '⚙️'];  // Wybierz / Wpisz / Ustaw
const STAR_LABELS = ['⭐', '⭐⭐', '⭐⭐⭐'];
```

### Nagłówek popupu

Ikona wyspy + tytuł wyśrodkowane pionowo (w kolumnie), nie w rzędzie:

```css
.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.popup-icon  { font-size: clamp(2rem, 5vmin, 3rem); }
.popup-title { font-size: clamp(1rem, 2.2vmin, 1.4rem); font-weight: 700; }
```

### Zamknięcie popupu

**Nie dodawaj przycisku „Anuluj"** — użytkownik zamyka klikając poza okno (backdrop). Dodaj handler na overlay:

```javascript
document.getElementById('starPopup').addEventListener('click', e => {
  if (e.target === e.currentTarget) closePopup();
});
```

**Status done:** tylko `✓` (zielony) — bez tekstu "Zdobyte".

```css
.star-opt-game-icon { font-size: clamp(1.2rem, 2.5vmin, 1.6rem); flex-shrink: 0; }
.star-opt-stars     { font-size: clamp(0.85rem, 1.6vmin, 1.05rem); flex-shrink: 0; white-space: nowrap; letter-spacing: 2px; }
.star-opt-body      { flex: 1; min-width: 0; }
.star-opt-name      { font-size: clamp(0.9rem, 1.8vmin, 1.1rem); font-weight: 600; }
.star-opt-status    { font-size: clamp(0.75rem, 1.4vmin, 0.9rem); flex-shrink: 0; }
.status-done        { color: var(--success); font-weight: 700; }
.status-play        { color: var(--accent);  font-weight: 700; }
.status-locked      { color: var(--very-muted); }
```

## 14. Podpowiedzi — wzorzec FAB + Toast (nowy standard)

Każda strona aplikacji powinna udostępniać kontekstową podpowiedź przez **pływający przycisk `?`** (FAB) w prawym dolnym rogu + **toast** wyskakujący od dołu.

> ⚠️ **Stary wzorzec (`help-btn` + `feedback-bar` w topbarze) jest przestarzały.** Istniejące strony gry (`godziny.html`, `wpisz.html`, `ustaw.html`, `nauka.html`) korzystają ze starego wzorca — zostaną zmigrowane przy każdej przebudowie w kolejnych fazach.

### Kiedy używać

- Każda nowa strona (mapa, gra, hub) — FAB+Toast zamiast `.help-btn` w topbarze
- Treść toastu dobierana kontekstowo per strona (`HINT_MSG` w JS)
- Nie dodawaj stałego tekstu podpowiedzi do HTML strony — trafia wyłącznie do toastu

### HTML — dodać przed `</body>`, przed skryptami:

```html
<!-- FAB ? -->
<button class="fab-hint" id="fabHint" onclick="toggleHint()">?</button>

<!-- Hint Toast -->
<div class="hint-toast" id="hintToast">
  <span class="hint-toast-icon">💡</span>
  <div class="hint-toast-body">
    <div class="hint-toast-title">Jak to działa?</div>
    <div class="hint-toast-msg"><!-- treść kontekstowa --></div>
  </div>
  <div class="hint-toast-bar" id="hintBar"></div>
</div>
```

### CSS — dodać do lokalnego `<style>` strony:

```css
.fab-hint {
  position: fixed;
  bottom: 24px; right: 20px;
  z-index: 300;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: #111;
  border: 2px solid #333;
  color: #555;
  font-size: 1.3rem; font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.fab-hint:hover { color: #f0f0f0; border-color: #555; }
.fab-hint.active { border-color: var(--accent); color: var(--accent); transform: rotate(15deg); }

.hint-toast {
  position: fixed;
  bottom: 84px; left: 50%;
  transform: translateX(-50%) translateY(10px);
  z-index: 299;
  width: min(360px, calc(100vw - 40px));
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex; align-items: flex-start; gap: 12px;
  overflow: hidden;
  opacity: 0; pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.hint-toast.visible { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
.hint-toast-icon  { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
.hint-toast-body  { flex: 1; }
.hint-toast-title { font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.hint-toast-msg   { font-size: 0.88rem; color: #ccc; line-height: 1.5; }
.hint-toast-bar   {
  position: absolute; bottom: 0; left: 0;
  height: 3px; background: var(--accent); border-radius: 0 0 16px 16px;
  width: 100%; transform-origin: left; transform: scaleX(0);
}
.hint-toast.auto-close .hint-toast-bar { transform: scaleX(1); transition: transform 5s linear; }
```

### JS — wkleić do `<script>` strony:

```javascript
let _hintOpen = false;
let _hintTimer = null;

function toggleHint() { _hintOpen ? closeHint() : openHint(); }

function openHint() {
  _hintOpen = true;
  const fab   = document.getElementById('fabHint');
  const toast = document.getElementById('hintToast');
  const bar   = document.getElementById('hintBar');
  fab.classList.add('active');
  toast.classList.remove('auto-close');
  toast.classList.add('visible');
  bar.style.transition = 'none';
  bar.style.transform  = 'scaleX(0)';
  void bar.offsetWidth;           // wymuś reflow przed animacją
  toast.classList.add('auto-close');
  clearTimeout(_hintTimer);
  _hintTimer = setTimeout(closeHint, 5000);
}

function closeHint() {
  _hintOpen = false;
  clearTimeout(_hintTimer);
  document.getElementById('fabHint').classList.remove('active');
  const toast = document.getElementById('hintToast');
  toast.classList.remove('visible', 'auto-close');
}
```

### Zachowanie

- Toast wysuwa się od dołu (ponad FAB), znika automatycznie po 5s
- Pasek na dole toastu odlicza czas — feedback wizualny autohide
- Ponowne kliknięcie `?` zamyka toast przed czasem
- `?` obraca się o 15° gdy aktywny
- Toast **nie blokuje** scrollowania ani klikania innych elementów

## 15. Responsywność — checklist przed oddaniem strony

- [ ] Testuj przy 360px szerokości (mobile minimum)
- [ ] Testuj przy 768px (tablet)
- [ ] Testuj przy 1200px (desktop)
- [ ] Żadne elementy nie wychodzą poza viewport
- [ ] Przyciski mają min. 48px wysokości na dotykowym (zapewnione przez `var(--btn-height)`)
- [ ] Fonty czytelne: minimum 14px w trybie mobile (zapewnione przez `clamp`)
- [ ] `-webkit-tap-highlight-color: transparent` na wszystkich klikalnych elementach
