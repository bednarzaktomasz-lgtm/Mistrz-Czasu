# **Mistrz Czasu: Techniczny Plan Działania**

Ten dokument określa kroki niezbędne do przekształcenia obecnego kodu w pełnoprawną aplikację progresywną.

## **ETAP 1: Fundamenty Danych (State Management)**

Obecna aplikacja zapisuje proste ustawienia w localStorage. Musimy to rozbudować o złożony system profilu użytkownika.

**Najważniejsze zadania:**

* Zdefiniowanie obiektu userProgress (poziom, PD, sekundy, odblokowane przedmioty, postęp węzłów).  
* Stworzenie funkcji saveGame() i loadGame().  
* Migracja obecnych ustawień wizualnych do systemu nagród (zablokowanie tła *Tech* i *Spiral* na start).

**Trudności:**

* **Synchronizacja:** Zapewnienie, że localStorage nie zostanie wyczyszczone przez przeglądarkę.  
* **Spójność:** Obsługa błędów przy ładowaniu starych wersji zapisu po aktualizacji aplikacji.

## **ETAP 2: Przebudowa UI (Pionowa Lista Przygód)**

Zgodnie z ustaleniami, rezygnujemy tymczasowo z mapy 2D na rzecz responsywnej listy pionowej.

**Najważniejsze zadania:**

* Implementacja systemu nawigacji (Widoki: Lista Przygód, Gra, Sklep, Profil).  
* **Budowa Listy Przygód:** Stworzenie komponentu przewijanej listy kart (Vertical Cards). Każda karta reprezentuje "Wyspę" i zawiera:  
  * Nazwę etapu i ikonę emoji.  
  * Licznik gwiazdek (np. 4/12).  
  * Pasek postępu specyficzny dla danego tematu.  
* Stworzenie paska statusu (Top Bar) z XP i Sekundami widocznego nad listą.

**Trudności:**

* **UX Przewijania:** Zapewnienie płynnego scrollowania listy na urządzeniach mobilnych.  
* **Zarządzanie Stanem:** Dynamiczne aktualizowanie wyglądu kart (odblokowanie/zablokowanie) po zakończeniu zadania.

## **ETAP 3: Logika Węzłów (Level Logic)**

Wprowadzenie struktury ⭐⭐⭐ (Wybierz, Ustaw, Wpisz) dla każdego etapu na liście.

**Najważniejsze zadania:**

* Napisanie "silnika zadań", który na podstawie wybranej karty i poziomu gwiazdki dobiera tryb interakcji.  
* System walidacji: funkcja sprawdzająca odpowiedź i przyznająca odpowiednią ilość "Sekund".

**Trudności:**

* **Precyzja w trybie "Ustaw":** Mechanika przeciągania wskazówek musi mieć odpowiednią tolerancję błędów (+/- 2-3 minuty).  
* **Walidacja tekstu:** Obsługa różnych separatorów (kropka, dwukropek) przy wpisywaniu godziny.

## **ETAP 4: System Nagród i "Anty-rdza"**

Aktywacja mechanik retencyjnych.

**Najważniejsze zadania:**

* Stworzenie "Garderoby": interfejsu do kupowania stylów i teł za "Sekundy".  
* Implementacja logiki "Oliwienia": filtr CSS (sepia/grayscale) nakładany na listę i zegar przy braku aktywności.

**Trudności:**

* **Zarządzanie czasem:** Poprawne obliczanie czasu między sesjami (lastVisit).  
* **Assety SVG:** Generowanie nowych stylów wskazówek bezpośrednio w kodzie.

## **Podsumowanie Zmian (Szybka Ścieżka)**

Zastosowanie **Pionowej Listy Przygód** redukuje czas wdrożenia UI o około 60%, pozwalając na natychmiastowe skupienie się na mechanizmach "Garderoby" i "Struktury Gwiazdkowej". Mapa 2D zostaje przesunięta do backlogu jako opcjonalna aktualizacja wizualna.

to prosta mapa strony dla Twojej koncepcji aplikacji, z podziałem na sekcje:

### **POZIOM 0: EKRAN STARTOWY (LOGOWANIE/WYBÓR PROFILU)**

### **POZIOM 1: STRONA GŁÓWNA (CENTRUM DOWODZENIA)**

* **Pasek Statusu** (Avatar, XP, Sekundy)  
* **Główna Mapa Drogi** (Interaktywna ścieżka z węzłami)  
* **Przycisk "Wyzwanie Dnia"**

### **POZIOM 2: TRYBY NAUKI (ZADANIA)**

* **Wyspa Pełnych Godzin**  
* **Zatoka Kwadransów**  
* **Góry "Wpół do"**  
* **Pustynia Cyfr Rzymskich**  
* **Labirynt Formatu 24h**

### **POZIOM 3: ZARZĄDZANIE I NAGRODY**

* **Garderoba "Mistrza Czasu"** (Personalizacja zegara i avatara)  
* **Kolekcja Odznak** (Trofea i osiągnięcia)  
* **Kalendarz Postępu** (Historia i Streaki)  
* **Ustawienia** (Dźwięk, trudność, reset progresu)

