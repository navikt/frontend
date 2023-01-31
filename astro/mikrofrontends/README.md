# Mikrofrontends med Astro

Dette eksempelet bruker EcmaScript Moduler (ESM) og url-imports for å kjøre client side composition av mikrofrontends. Express brukes for å serve assets, men ideelt burde man bruke [frontend-plattformen](https://github.com/nais/frontend-plattform).

## Kom i gang

- Bygg hver mikrofrontend med `npm run build`
- Start hver mikrofrontend med `node server.js`
- Start shell appen med `npm run dev`

## Shared dependencies

Appene kan kjøre på forskjellige react tversjoner, men disse kan ikke deles på tvers. Andre dependencies kan deles ved å bruke import maps, enten ved byggetid eller i klienten. 
