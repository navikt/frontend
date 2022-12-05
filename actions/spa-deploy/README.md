# SPA Deploy Action

This action deploys a Single Page Application (SPA) to NAV CDN and NAIS.

## Prerequisites

* Registered team in NAV with NAIS Deploy Key
* Registered team in NAV CDN with repo access
* The SPA must be built and packaged as a directory containing a `index.html` file and all other static files.

## Limitations

* Versioning is not supported
* Cleanup of old versions is not supported
* Renaming of the SPA is not supported
* Only one ingress per application is supported

## Usage

```yaml
name: Deploy SPA

on:
  push:
    branches:
      - main

jobs:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
    with:
      node-version: '16'
  - run: npm ci
  - run: npm run build
  - run: npm run package
  - run: npm run package
  - name: Deploy
    uses: navikt/frontend/actions/spa-deploy/v1@main
    with:
      app-name: myapp
      team-name: myteam
      source: ./build
      ingress: myapp.nav.no/myapp
      nais-deploy-key: ${{ secrets.NAIS_DEPLOY_KEY }}
```

## Inputs

| Name | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| `app-name` | Name of the application | Yes | |
| `team-name` | Name of the team | Yes | |
| `source` | Path to the directory containing the SPA | Yes | |
| `environment` | Application environment (`dev`, `prod`, etc.) | Yes | |
| `ingress` | Ingress to use for the application | Yes | |
| `nais-deploy-key` | NAIS Deploy Key | Yes | |

Static files will be uploaded to the following path in NAV CDN:

```text
https://cdn.nav.no/<team-name>/<app-name>/<env>/
```
