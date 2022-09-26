## Logging i browser og server med NEXT.js og pino

### Konsept

Dette er et eksempel på en logger som kan brukes i både browser og server. Denne loggeren er basert
på [pino](https://github.com/pinojs/pino).

Når det logges fra nettleseren, så vil log-statementen bli sendt til en API-route på samme Next-serveren. Denne
API-routen vil logge til stdout med et JSON-format som Kibana er fornøyd med.

Dette gjør at log statements fra både server og nettleser vil havne i kibana, og du kan sjekke loggene, med korrekt log
level, i Kibana sånn:

`+envclass:p +application:din-app`

For lokal utvikling brukes `pino-pretty` for å formatere loggene litt hyggeligere. Outputten fra dev-serveren pipes
gjennom pino-logger, eksempel på dette finner du i [package.json](package.json)

### Interessante filer

- [pages/api/logger.ts](pages/api/logger.ts) - API-route som logger til stdout med pino
- [utils/logger.ts](utils/logger.ts) - Logger som kan brukes i både browser og server

### Mindre interessante filer

- [pages/index.tsx](pages/index.tsx) - Eksempel på logging fra frontenden
- [pages/api/hello.ts](pages/api/hello.ts) - Eksempel på logging fra frontenden

### Eksempel

#### Eksempel på utvikling i dev modus:

```plain
WARN (1404398): I'm the backend. I'm logging before I reply to the client.
INFO (1404398): I'm a browser! I got a response from the server, it was: Kari Normann.
x_timestamp: 1663852258751
x_isFrontend: true
x_userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0"
x_request_id: "not-set"
```

#### Eksempel på utvikling i produksjon (hva som blir sendt til kibana):

```json
{
  "level": "warn",
  "pid": 1212278,
  "hostname": "pop-os",
  "msg": "I'm the backend. I'm logging before I reply to the client."
}
{
  "level": "info",
  "pid": 1212278,
  "hostname": "pop-os",
  "x_timestamp": 1663852090989,
  "x_isFrontend": true,
  "x_userAgent": "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
  "x_request_id": "not-set",
  "msg": "I'm a browser! I got a response from the server, it was: Kari Normann."
}
```
