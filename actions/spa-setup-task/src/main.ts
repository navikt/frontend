import * as core from '@actions/core'
import {spaSetupTask, validateInputs} from './spa'

function run(): void {
  const teamName: string = core.getInput('team-name')
  const appName: string = core.getInput('app-name')
  // const source: string = core.getInput('source')
  const ingress: string = core.getInput('ingress')
  const environment: string = core.getInput('environment')

  const err = validateInputs(teamName, appName, ingress)
  if (err) {
    core.setFailed(err.message)
    return
  }

  const {cdnHost, cdnDest, naisCluster, naisResources, naisVars} = spaSetupTask(
    teamName,
    appName,
    ingress,
    environment
  )

  core.setOutput('cdn-environment', cdnHost)
  core.setOutput('cdn-destination', cdnDest)
  core.setOutput('nais-cluster', naisCluster)
  core.setOutput('nais-resources', naisResources)
  core.setOutput('nais-vars', naisVars)
}

run()
