# NEXT.js

## Eksempler

- [Nextjs-eksempler](https://github.com/vercel/next.js/tree/canary/examples)

### Sentry

- [Nextjs-eksempel](https://github.com/vercel/next.js/tree/canary/examples/with-sentry)

For å sette opp i NAV-repoer:

```
npx @sentry/wizard -i nextjs -u https://sentry.gc.nav.no/
```

For at Sentry skal lage deploys ved bygg i GitHub Actions må du også legge ved secret i action. `SENTRY_AUTH_TOKEN` er definert på org-nivå, så du trenger ikke å legge til denne som egen egen secret i repoet.

```
env:
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
```
