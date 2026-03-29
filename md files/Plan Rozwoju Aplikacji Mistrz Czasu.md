# **Mistrz Czasu: Plan Rozwoju Aplikacji**

## **1\. Wizja Projektu**

Przekształcenie obecnego generatora zadań w angażującą przygodę edukacyjną. Celem jest zastąpienie modelu „piaskownicy” systemem progresywnym, który buduje motywację poprzez poczucie celu, system nagród i wizualizację postępów.

## **2\. Nowy Interfejs (Centrum Dowodzenia)**

Strona główna przestaje być prostym menu, a staje się dynamicznym panelem gracza.

### **Hero Section: Status Mistrza**

* **Ewoluujący Avatar:** Ikona zegara, która zmienia wygląd wraz z poziomem (np. dodanie okularów, profesorskiej czapki, aż po złotą koronę).  
* **Pasek XP (Doświadczenie):** Wizualny postęp do kolejnego poziomu ogólnego.  
* **Waluta "Sekundy":** Zarobione punkty, które można wydać w Garderobie.

### **Mapa Drogi (The Journey)**

Centralny element strony głównej – interaktywna ścieżka z węzłami reprezentującymi tematy (np. Wyspa Pełnych Godzin, Zatoka Kwadransów). Każdy węzeł posiada wskaźnik gwiazdek (0/3).

## **3\. Mechanika Nauki: Struktura Gwiazdkowa**

Każdy etap nauki (węzeł na mapie) realizowany jest w trzech krokach o rosnącym poziomie trudności. Dopiero zaliczenie kroku niższego odblokowuje wyzwania wyższe.

| Poziom | Tryb Zadania | Cel Edukacyjny |
| :---- | :---- | :---- |
| **⭐** | **Wybierz** | **Rozpoznawanie:** Uczeń wybiera właściwą godzinę spośród kilku podanych opcji. |
| **⭐⭐** | **Ustaw** | **Manipulacja:** Uczeń musi fizycznie przesunąć wskazówki zegara na zadaną godzinę. |
| **⭐⭐⭐** | **Wpisz** | **Samodzielność:** Uczeń wpisuje godzinę z klawiatury (brak podpowiedzi wizualnych). |

## **4\. Grywalizacja i Retencja**

### **System "Pielęgnacji" (Anty-rdza)**

Mechanizm zegara na stronie głównej, który zaczyna "rdzewieć" (filtr wizualny sepia/grayscale), jeśli użytkownik nie ćwiczył przez 48 godzin. Codzienna sesja "oliwi" mechanizm, przywracając mu blask i kolory.

### **Garderoba i Sklep**

Wykorzystanie istniejących zasobów wizualnych kodu (tła, kolory wskazówek) jako nagród:

* **Personalizacja:** Kupowanie nowych stylów wskazówek (miecze, błyskawice) za zdobyte "Sekundy".  
* **Tła premium:** Odblokowywanie tła *Tech* lub *Spiral* po osiągnięciu konkretnych kamieni milowych.

### **Inteligentne Powtórki (Spaced Repetition)**

Aplikacja monitoruje błędy. Jeśli uczeń radzi sobie świetnie z kwadransami, ale myli "wpół do", system automatycznie częściej "wstrzykuje" te zadania do codziennych wyzwań.

## **5\. Mapa Aplikacji (Sitemap)**

### **POZIOM 0: START**

* Ekran powitalny / Wybór profilu

### **POZIOM 1: CENTRUM DOWODZENIA (Dashboard)**

* **Panel Statusu** (Avatar, Poziom XP, Licznik Sekund)  
* **Interaktywna Mapa Drogi** (Węzły postępu)  
* **Przycisk "Wyzwanie Dnia"** (Szybka sesja Time Attack)

### **POZIOM 2: STREFY NAUKI (Węzły Mapy)**

* **Wyspa Pełnych Godzin** (Tryby: Wybierz \-\> Ustaw \-\> Wpisz)  
* **Zatoka Kwadransów**  
* **Góry "Wpół do"**  
* **Pustynia Cyfr Rzymskich**  
* **Labirynt Formatu 24h**

### **POZIOM 3: SKARBIEC I USTAWIENIA**

* **Garderoba Mistrza** (Sklep z kosmetyką zegara)  
* **Kolekcja Odznak** (Galeria zdobytych trofeów)  
* **Kalendarz Progresu** (Historia aktywności i Streaki)  
* **Panel Opcji** (Dźwięki, format czasu, resetowanie postępów)