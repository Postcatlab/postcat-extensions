import { execa } from 'execa'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { pkgs } from './utils'

const rootDir = path.resolve(__dirname, '..')
// const watch = process.argv.includes('--watch')

const FILES_COPY_ROOT = ['LICENSE']

const FILES_COPY_LOCAL = ['README.md', 'index.json', '*.cjs', '*.mjs', '*.d.ts']

console.log('pkgs', pkgs)

async function buildMetaFiles() {
  for (const name of pkgs) {
    const packageRoot = path.resolve(__dirname, '..', 'packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))

    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files)
      await fs.copyFile(
        path.join(packageRoot, file),
        path.join(packageDist, file)
      )

    const packageJSON = await fs.readJSON(
      path.join(packageRoot, 'package.json')
    )

    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, {
      spaces: 2
    })
  }
}

const runParallel = (targets, buildFn) => {
  const res = []

  for (const target of targets) {
    res.push(buildFn(target))
  }
  return Promise.all(res)
}

async function build(pkg: string) {
  execSync('pnpm run clean', { stdio: 'inherit' })

  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], {
    stdio: 'inherit'
  })
  // execSync(
  //   `pnpm run build:rollup ${
  //     watch ? ' -- --watch' : ''
  //   }`,
  //   { stdio: 'inherit' }
  // )

  await buildMetaFiles()
}

async function cli() {
  try {
    await runParallel(pkgs, build)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { build }

if (require.main === module) cli()
