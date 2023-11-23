## Dodawania produktu
**Wymagania**

Stwórz funkcjonalność, która na podstawie przekazanych informacji:
- kod
- nazwa
- opis
- cena
- ilość
  Doda do asortymentu danego sprzedawcy Produkt (kod, nazwa, opis, cena) o ilość: ilość.

W przypadku gdy uda się dodać produkt do asortymentu:
- zamknij formularz dodawania
- wyświetl informację o dodaniu produktu w odpowiednim komponencie
- zaktualizuj ilość produktów weryfikowanych
- zaktualizuj komponent wyświetlający listę produktów i dodaj nowy produkt

W przypadku gdy nie uda się dodać produktu do asortymentu:
- wyświetl informację o nieudanej operacji
- zaznacz wszystkie pola, które mają nieprawidłowe informacje


### Ćwiczenia
**Ćwiczenie 1.**

Stwórzenie produktu:
- kod - wymagany
- nazwa - wymagana
- opis - opcjonalny
- cena - wymagana

Uwagi:
- brak dodatkowej walidacji. Zakładamy, że jeżeli dane są przekazane, to są poprawne
- kod, nazwa, opis są stringami
- cena jest wartością numeryczną

**Ćwiczenie 2.**

Walidacja Kodu:
- 30 znaków
- akceptowane znaki numeryczne i "-"

**Ćwiczenie 3.**

Walidacja Nazwy:
- 5-50 znaków

**Ćwiczenie 4.**

Walidacja Ceny:
- większa niż 0

**Ćwiczenie 5.**

Walidacja Ilości:
- większa niż 0

**Ćwiczenie 7.**

- Dodanie produktu do asortymentu.
- wyrzucenie wyjątku gdy źle

**Ćwiczenie 8.**

W przypadku gdy uda się dodać produkt do asortymentu:
- zamknij formularz dodawania
- wyświetl informację o dodaniu produktu w odpowiednim komponencie
- zaktualizuj ilość produktów weryfikowanych
- zaktualizuj komponent wyświetlający listę produktów i dodaj nowy produkt

**Ćwiczenie 9.**

W przypadku gdy nie uda się dodać produktu do asortymentu:
- wyświetl informację o nieudanej operacji
- zaznacz wszystkie pola, które mają nieprawidłowe informacje

**Ćwiczenie 10.**

Zmień kontrakt ShopClient tak, aby otrzymywał jeden obiekt ze wszystkimi niezbędnymi informacjami:
- nazwa produtku
- kod produtku
- cena produtku
- opis produtku
- ilość
- id asortymentu

**Ćwiczenie 11.**

Zamień wyrzucane Errory dotyczące walidacji na informację zwrotną dla formularza.

**Ćwiczenie 12.**

Zagreguj wyrzucane Errory dotyczące walidacji na informację zwrotną dla formularza. Nie failuj przy pierwszym błędzie.E

**Ćwiczenie 13.**

Zmiana wymagań.
Kod powinien być generowany automatycznie, a nie przekazywany:
- 30 znaków
- akceptowane znaki alfanumeryczne i "-"
- wzór
  - pierwsze max 15 znaków: nazwa produktu gdzie:
    - zostają tylko znaki alfanumeryczne
    - spacje zamienione na "-"
  - ostatnie min 15 znaków: znaki alfanumeryczne

**Ćwiczenie 14.**

Podczas dodawania można określić listę kategorii, do których należy produkt:
- lista nie może być pusta

**Ćwiczenie 15.**

Zweryfikuj czy przekazane kategorie są dopuszczalne. Lista kategorii istnieje w innym komponencie (`CategoryRepository`) - wykorzystaj go w `AssortmentService`.
Usuń nieprawidłowe kategorie jeżeli zostały przekazane:
- Jeżeli po ich usunięciu lista nie jest pusta - dodaj produkt, .
- Jeżeli po ich usunięciu lista jest pusta - poinformuj o błędzie walidacji.

**Ćwiczenie 16.**

Dodaj funkcjonalność, która niezależnie od rezultatu operacji pozwoli zapisywać (do analiz i ze względu na zbierane statystyki) informacje nt. interakcji z komponentem:
- parametry wejściowe
- status operacji
- informacje nt. błędów
- identyfikator stworzonego produktu

**Ćwiczenie 17.**

Dodaj funkcjonalność zapewniającą, że nowo dodany produkt zawiera czas stworzenia