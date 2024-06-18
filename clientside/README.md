
## Programm starten

First, run the development server:

```bash
npm run dev
```

Öffne [http://localhost:3001](http://localhost:3001) um auf die lokale Webseite zugreifen zu können.

## Ordnerstruktur
### app
Im app Ordner ist jede Seite ein Ordner. Die page.tsx gibt für jeden dieser Ordner eine Seite zurück.
Weitere Funktionen, die für eine einzelne Seite notwendig sind werden auch in den Ordnern gespeichert.
### components
Komponenten die mehrmals und auf verschiedenen Seiten benötigt werden, werden im Komponenten Ordner gespeichert. (z.B. Navbar)
### lib
Funktionen, die auf mehreren Seiten benötigt werden (z.B Login, fetch)
### public 
Bilder

## Backend Requests
Um einen Backend Request abzuschicken muss im fetch "/api/<path>" verwendet werden.

## Komponenten Libary
Die [NextUI](https://nextui.org/docs/components) Komponenten Libary verwendet für die UI.

## Sonstige Informationen
Weitere Informationen zur Entwicklung bietet die [Next.js Dokumentation](https://nextjs.org/docs)
