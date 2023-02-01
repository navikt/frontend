# Mikrofrontends med Astro

Dette eksempelet bruker EcmaScript Moduler (ESM) og url-imports for å kjøre client side composition av mikrofrontends. Express brukes for å serve assets, men ideelt burde man bruke [frontend-plattformen](https://github.com/nais/frontend-plattform).

## Kom i gang

- Bygg hver mikrofrontend med `npm run build`
- Start hver mikrofrontend med `node server.js`
- Start shell appen med `npm run dev`

## Shared dependencies

Dependencies som hentes fra CDN kan deles på tvers av mikrofrontends og caches i browseren. For å aligne versjoner på dependencies så kan man bruke importmaps i Layout.astro og sette dem som external ved byggetid.

Mikrofrontendene i dette eksempelet kan kjøre på forskjellige react versjoner.
