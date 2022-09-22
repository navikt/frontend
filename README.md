<h1 align="center">
    <img src="https://avatars.githubusercontent.com/u/11848947?s=164&v=4" />
    <br/>Frontend
</h1>

<div align="center">
    Samling gode frontend-ressurser, løsninger og eksempler fra NAV sitt frontend-felleskap.
</div>
<br/>
<br/>

## Læring

### Lesestoff

- [Skrive seg bort fra LESS.js](https://aksel.nav.no/blogg/bli-kvitt-less-pa-1-2-3)
- [Publisere og bruke pakker fra Github Package Registry](https://github.com/navikt/gpr-how-to)
- [Patterns.dev](https://www.patterns.dev/posts/): Design og component-patterns for React og web-utvikling generelt.

### Kurs

- [https://epicreact.dev/](https://epicreact.dev/) Confidently Ship Well-Architected Production Ready React Apps Like a Pro.
- [Typescript](https://www.executeprogram.com/courses/typescript) Interaktivt Typescript-kurs

### Ressurser

- [Can i use](https://caniuse.com/): Usikker på om nettleserene støtter en js/css feature?
- [Storybook showcase](https://storybook.js.org/showcase/projects): Storybook for tusenvis av løsninger fra hele verden.
- [Gitmoji](https://gitmoji.dev/): Freshere commit-meldinger med git emojies.

### CSS

- [Grid garden](https://cssgridgarden.com/): Interaktiv læring for CSS grid

## Publisering av NPM pakker

### Github package registry

Vi bruker Github sitt package registry for npm pakker (GPR).

- Flere av Nav sine pakker kun blir publisert her, noe som gjør det vanskelig å bruke to registries samtidig under samme scope `@navikt`.
- Tilgangskontroll blir da styrt av Github-orgen vår vs manuelt for npm.

For å kunne kjøre `npm install` lokalt må du logge inn mot Github package registry:

- Lag/forny access token med repo og read:packages rettigheter i github (under developer settings). Husk enable SSO!
- Login på npm med `npm login --scope=@navikt --registry=https://npm.pkg.github.com` og benytt github brukernavn, epost og tokenet du nettopp generert.

Hvis du heller foretrekker en egen `.npmrc`-fil, kan man også legge til auth der:

```
//npm.pkg.github.com/:_authToken=TOKEN
@navikt:registry=https://npm.pkg.github.com
```

## TODO

- Deploy av app
- Amplitude med proxy
- Wonderwall
- CMS (komme i gang med Sanity / Enonic)
- Testing (Cypress / Jest / Testing Library / Axe)
- Prettier / husky / eslint ++++
- Sitemap for nav.no
- Monitorering (frontendlogger / Sentry ++)
- Tailwind / StyledComponents ++
- Søk på nav.no
- Microfrontends / komponenter til MinSide
- Sikkerhet (lenke til security playbook? Annet?)
- Performance (bundle analyzer i Nextjs, eventuelt annet)

## Kontakt

[#frontend](https://nav-it.slack.com/archives/C6HJFRRMY) på slack

## Bidrag

<a href="https://github.com/navikt/frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=navikt/frontend" />
</a>
