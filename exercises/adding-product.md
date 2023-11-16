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



Ćwiczenie 1.
Stwórzenie produktu:
- kod - wymagany
- nazwa - wymagana
- opis - opcjonalny
- cena - wymagana

Uwagi:
- brak dodatkowej walidacji. Zakładamy, że jeżeli dane są przekazane, to są poprawne
- kod, nazwa, opis są stringami
- cena jest wartością numeryczną