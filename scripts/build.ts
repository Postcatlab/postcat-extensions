import { execa } from 'execa'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { pkgs } from './utils'

const rootDir = path.resolve(__dirname, '..')
/** 需要拷贝到每个插件包dist目录下的项目根目录的文件 */
const FILES_COPY_ROOT = ['LICENSE']
/** 需要拷贝到插件包dist目录下的静态文件 */
const FILES_COPY_LOCAL = ['README.md', '*.cjs', '*.mjs', '*.d.ts']

console.log('pkgs', pkgs)

async function buildMetaFiles() {
  for (const name of pkgs) {
    /** 插件的路径 */
    const packageRoot = path.resolve(__dirname, '..', 'packages', name)
    /** 插件打包后的dist目录 */
    const packageDist = path.resolve(packageRoot, 'dist')
    /** 确保要操作的文件夹存在 */
    await fs.ensureDir(packageDist)
    /** 将一些公共的资源文件拷贝到dist，如：LICENSE */
    for (const file of FILES_COPY_ROOT) {
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))
    }
    /** 将插件下的一些描述相关的静态文件拷贝到dist，如：插件单独的README.md */
    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files)
      await fs.copyFile(
        path.join(packageRoot, file),
        path.join(packageDist, file)
      )

    const packageJSON = await fs.readJSON(
      path.join(packageRoot, 'package.json')
    )
    /** 将插件的package.json拷贝一份到dist */
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, {
      spaces: 2
    })
  }
}
/**
 * 并行打包插件
 * @param {string[]} targets 需要打包的目标插件
 * @param buildFn 执行具体打包逻辑的函数
 * @returns {Promise<any[]>}
 */
const runParallel = (targets, buildFn) => {
  const res = []

  for (const target of targets) {
    res.push(buildFn(target))
  }
  return Promise.all(res)
}
/**
 * 打包单个插件
 * @param pkg 需要打包的目标插件目录名称
 */
async function build(pkg: string) {
  execSync('pnpm run clean', { stdio: 'inherit' })

  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], {
    stdio: 'inherit'
  })

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
