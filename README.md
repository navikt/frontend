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

- [Flexbox Froggy](https://flexboxfroggy.com/): Interaktiv læring om CSS flexbox
- [Grid garden](https://cssgridgarden.com/): Interaktiv læring om CSS grid

## Github npm registry

Vi publiserer interne npm-pakker på Github sitt npm registry. Grunnen til det er at tilgangskontroll på npmjs er et herk. Om du allikevel trenger å publisere under navikt-orgen på npmjs kan du ta kontakt med @npm-admins på Slack.

### Installere pakker lokalt

For å installere pakker fra Github lokalt trenger du en `.npmrc`-fil med følgende:

```
//npm.pkg.github.com/:_authToken=TOKEN
@navikt:registry=https://npm.pkg.github.com
```

Token gerenderer du under [developer settings på Github](https://github.com/settings/tokens). Den trenger kun `read:packages`. Husk å enable SSO for navikt-orgen!

### Installere pakker i Github workflow

For å slippe å bruke din egen token til å installere pakker fra en Github workflow har vi definert en org-wide token (`READER_TOKEN`) som har `read:packages`.

I en yml kan det se sånn ut (merk at `registry-url` må defineres for at `NODE_AUTH_TOKEN` skal funke):

```
- uses: actions/setup-node@v3
	with:
		node-version: 16
		registry-url: 'https://npm.pkg.github.com'
- run: npm ci
	env:
		NODE_AUTH_TOKEN: ${{ secrets.READER_TOKEN }}
```

### Publisere pakker

For å publisere pakker kan man bruke `GITHUB_TOKEN` på denne måten (se npm-publish-workflow for komplett eksempel.yml):

```
- run: npm publish
	env:
		NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
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
