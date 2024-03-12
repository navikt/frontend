import * as core from '@actions/core'
import {spaSetupTask, validateInputs} from './spa'

function run(): void {
  const teamName: string = core.getInput('team-name')
  const appName: string = core.getInput('app-name')
  // const source: string = core.getInput('source')
  const ingresses: string[] = core.getInput('ingress').split(',')
  const environment: string = core.getInput('environment')

  const err = validateInputs(teamName, appName, ingresses, environment)
  if (err) {
    core.setFailed(err.message)
    return
  }

  const {cdnDest, naisCluster, naisResources} = spaSetupTask(
    teamName,
    appName,
    ingresses,
    environment
  )

  core.setOutput('cdn-destination', cdnDest)
  core.setOutput('nais-cluster', naisCluster)
  core.setOutput('nais-resource', naisResources)
  core.setOutput('nais-vars', '')
}

run()
