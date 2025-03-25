import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const label: string = core.getInput('label')

    const octokit = github.getOctokit(token)
    const context = github.context

    const prs = await octokit.rest.pulls.list({
      ...context.repo,
      state: 'open'
    })

    core.info(`found ${prs.data.length} open prs`)

    for (const pr of prs.data) {
      core.debug(`checking ${pr.title} (${pr.number})`)
      if (
        pr.author_association === 'OWNER' &&
        pr.labels.find(({ name }) => name == label) !== undefined
      ) {
        core.info(`merging ${pr.title} (${pr.number})`)
        octokit.rest.pulls.merge({
          ...context.repo,
          pull_number: pr.number,
          merge_method: 'squash'
        })
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
