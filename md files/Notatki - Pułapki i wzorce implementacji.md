# Notatki — Pułapki i wzorce implementacji

Plik do zbierania wniosków z naprawionych błędów i sprawdzonych rozwiązań.

---

## 1. Blokowanie interakcji przy opóźnionym feedbacku (setTimeout)

**Kontekst:** Ćwiczenie parowania kart (`roman-pairs.html`) — po wyborze dwóch kart
następuje 1000ms opóźnienie przed sprawdzeniem pary.

**Problem:** `locked = true` było ustawione dopiero **wewnątrz** callbacka `checkPair()`.
Przez cały czas opóźnienia gracz mógł kliknąć trzecią kartę, co powodowało błędny stan
i trwałe zablokowanie gry (żaden element nie reagował).

**Poprawny wzorzec:**
```javascript
if (selectedArabic && selectedRoman) {
  locked = true;               // ← ZAWSZE przed setTimeout
  setTimeout(checkPair, 1000);
}
```

**Zasada ogólna:** Wszędzie gdzie jest `setTimeout` przed sprawdzeniem odpowiedzi —
`locked = true` musi wyprzedzać `setTimeout`, nie być wewnątrz callbacka.

---

## 2. Efekt hover przyklejający się na urządzeniach dotykowych

**Kontekst:** Przyciski odpowiedzi w `godziny.html` — na tablecie po tapnięciu przycisku
stan `:hover` pozostawał widoczny w kolejnym pytaniu, sugerując dziecku poprawną odpowiedź.

**Problem:** CSS `:hover` na urządzeniach dotykowych (tablet, telefon) jest wyzwalany przez
dotknięcie i nie znika automatycznie po podniesieniu palca. Przeglądarka traktuje ostatni
dotknięty element jako "hovered" do czasu kolejnej interakcji.

**Poprawny wzorzec:**
```css
/* ŹLE — hover działa też na urządzeniach dotykowych */
.answer-btn:hover { background: #1a1a1a; border-color: #444; }

/* DOBRZE — hover tylko gdy urządzenie ma prawdziwy kursor (mysz/touchpad) */
@media (hover: hover) {
  .answer-btn:hover { background: #1a1a1a; border-color: #444; }
}
```

**Zasada ogólna:** Każdy styl `:hover` na elementach interaktywnych (przyciski, karty)
należy owijać w `@media (hover: hover)`. Dotyczy wszystkich stron, na których grają dzieci
na tabletach.

---
