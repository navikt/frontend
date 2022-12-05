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
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: '14'
  - run: npm ci
  - run: npm run build
  - run: npm run package
  - run: npm run package
  - name: Deploy SPA
    uses: navikt/frontend/actions/spa-deploy/v1@main
    with:
      app-name: myapp
      team-name: myteam
      source: ./build
      env: prod
      ingress: myapp.nav.no/myapp
      nais-deploy-key: ${{ secrets.NAIS_DEPLOY_KEY }}
```

## Inputs

| Name | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| `app-name` | Name of the application | Yes | |
| `team-name` | Name of the team | Yes | |
| `source` | Path to the directory containing the SPA | Yes | |
| `env` | Environment to deploy to | Yes | |
| `ingress` | Ingress to use for the application | Yes | |
| `nais-deploy-key` | NAIS Deploy Key | Yes | |