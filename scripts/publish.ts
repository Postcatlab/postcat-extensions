import { execSync } from 'child_process'
import path from 'path'
import { version } from '../package.json'
import { pkgs } from './utils'

execSync('npm run build', { stdio: 'inherit' })

let command = 'npm publish --access public'

if (version.includes('beta')) command += ' --tag beta'

/** 需要发布的插件集合 */
for (const name of pkgs) {
  execSync(command, {
    stdio: 'inherit',
    cwd: path.join('packages', name, 'dist')
  })
}
