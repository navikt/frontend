# SPA Deploy

En GitHub Action som publiserer en Single Page Application (SPA) til NAV CDN og NAIS uten å måtte bygge og deploye et Docker image.

## Forutsetninger

* Teamet må være registrert i NAV (se [nais/teams](https://github.com/nais/teams)) med NAIS Deploy Key (se [nais/deploy](https://deploy.nais.io))
* Teamet må være registrert i NAV CDN (se [nais/frontend-plattform](https://github.com/nais/frontend-plattform)) med tilgang til repoet
* Applikasjonen må bygges og pakkes som en mappe som inneholder en `index.html` fil og alle andre statiske filer.

## Begrensninger

* Versjonering støttes ikke
* Opprydding av gamle statiske filer støttes ikke
* Navneendring av applikasjonen støttes ikke

## Bruk

```yaml
name: Deploy SPA

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: navikt/frontend/actions/spa-deploy/v1@main
        with:
          app-name: min-frontend
          team-name: mitt-team
          source: ./build
          ingress: https://team.nav.no/min-frontend
          environment: dev
          nais-deploy-apikey: ${{ secrets.NAIS_DEPLOY_APIKEY }}
```

## Input parametere

| Navn                 | Beskrivelse                                    | Påkrevd  | Default |
| ----                 | -----------                                    | -------- | ------- |
| `app-name`           | Applikasjonsnavn                               | Yes      |         |
| `team-name`          | Teamnavn                                       | Yes      |         |
| `source`             | Mappe med kompilert kildekode                  | Yes      |         |
| `environment`        | Miljø (kan være hvilken som helst streng)      | Yes      |         |
| `ingress`            | Adresse applikasjonen skal være tilgjenglig på | Yes      |         |
| `nais-deploy-apikey` | NAIS Deploy ApiKey                             | Yes      |         |

Statiske filer vil bli lastet opp til følgende adresse i NAV CDN:

```text
https://cdn.nav.no/<team-name>/<app-name>/<env>/
```

### Flere ingresser

For å få applikasjonen tilgjengelig over flere ingresser kan du sette `ingress` til en kommaseparert liste av ingresser:

```yaml
      - uses: navikt/frontend/actions/spa-deploy/v1@main
        with:
          ...
          ingress: https://team.nav.no/min-frontend,https://team.nav.no/andre-ingress
```

## App Konfigurasjon

### Create React App

For å få riktige lenker til statiske filer på CDN i en Create React App må du sette `PUBLIC_URL`. Det kan gjøres på en av to måter:

1. `.env` fil:

```text
PUBLIC_URL=https://cdn.nav.no/<team-name>/<app-name>/<env>/
```

2. `env` i GitHub Actions når du bygger applikasjonen:

```yaml
    steps:
      - run: npm run build
        env:
          PUBLIC_URL: https://cdn.nav.no/<team-name>/<app-name>/<env>
      - uses: navikt/frontend/actions/spa-deploy/v1@main
        with:
          app-name: <app-name>
          team-name: <team-name>
          environment: <env>
```

* https://create-react-app.dev/docs/advanced-configuration/
* https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env

### Next.js

For å bygge en statisk Next.js applikasjon må kjøre `next export` og sette `assetPrefix` i `next.config.js`:

```js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? 'https://cdn.nav.no/<team-name>/<app-name>/<env>' : undefined,
}
```

* https://nextjs.org/docs/api-reference/next.config.js/environment-variables
* https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
* https://nextjs.org/docs/advanced-features/static-html-export
