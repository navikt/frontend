# wonderwall med nextjs

Dette er et eksempel på hvordan man kan bruke [jose](https://www.npmjs.com/package/jose) og [openid-client](https://www.npmjs.com/package/openid-client) til å verifisere tokens man får fra [wonderwall](https://doc.nais.io/appendix/wonderwall/) i en NextJS-app.

**Viktige detaljer:**

- Dette eksempelet er for idporten-enabled apps, ikke for apps som bruker Azure AD.
- Dette er ikke nødvendigvis kode som er 100% korrekt svar på denne problemstillingen. Ta koden med en klype salt og tilpass det til dine behov.
- Koden er skrevet "enkel" med vilje, spesielt mtp. feilhåndtering. Det er ikke nødvendigvis en god idé å gjøre det slik i en produksjonsapp.

### Interessante filer

Det ligger noen "considerations" rundt om kring i koden som kommentarer. Disse kan være verdt å ta stilling til dersom du copy-paster noe kode.

- [pages/index.tsx](pages/index.tsx) - En page som er autentisert og henter data fra et API med tokenx.
- [pages/api/api-example-route.ts](pages/api/api-example-route.ts) - En API route som er autentisert og henter data fra et API med tokenx.
- [auth/withAuthentication.ts](auth/withAuthentication.ts) - Higher order functions for autentisering av pages og API-routes.
- [auth/idporten.ts](auth/idporten.ts) - Validering av idporten-tokenet fra wonderwall
- [auth/tokenx.ts](auth/tokenx.ts) - Bytting av idporten-tokenet til et tokenx-token mot tokendings.
