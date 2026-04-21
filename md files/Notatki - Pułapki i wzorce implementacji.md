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
