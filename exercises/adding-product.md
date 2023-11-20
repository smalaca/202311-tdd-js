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