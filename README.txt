
1. W StreamElements wejdź:
   Streaming Tools -> Overlays -> New Overlay
2. Dodaj:
   Custom Widget
3. Wklej:
   index.html -> zakładka HTML
   style.css -> zakładka CSS
   script.js -> zakładka JS
4. Ustaw rozdzielczość overlayu na 1920x1080.
5. Kamerę dodaj jako osobne źródło/element w tym samym overlayu i ustaw ją POD ramką.
6. Zmień "YOUR NAME" oraz teksty sociali w index.html.

CZAT:
- wiadomość może mieć maksymalnie 2 linie,
- dłuższa wiadomość jest automatycznie zawijana,
- po drugiej linii reszta jest ucinana,
- nowe wiadomości pojawiają się na dole,
- starsze wiadomości znikają automatycznie.

Jeżeli chcesz całkowicie wyłączyć automatyczne znikanie:
w script.js ustaw MESSAGE_LIFETIME = 0 i usuń/zmień setTimeout.

WAŻNE:
Sam Custom Widget nie nakłada tej ramki na kamerę. Ramka jest elementem overlayu, a obraz kamery powinien być dodany pod nią jako osobne źródło w StreamElements.
