import fs from 'fs'
import { execa } from 'execa'

const argvs = process.argv.slice(2)
console.log('process.argv', argvs)

// 如果通过命令行传递了参数，则认为是指定打包，否则默认打包packages下所有包
const pkgs = (argvs.length ? argvs : fs.readdirSync('packages')).filter((p) => {
  return fs.statSync(`packages/${p}`).isDirectory()
})

console.log('pkgs', pkgs)

const runParallel = (targets, buildFn) => {
  const res = []

  for (const target of targets) {
    res.push(buildFn(target))
  }
  return Promise.all(res)
}

const build = async (pkg) => {
  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], {
    stdio: 'inherit'
  })
}

runParallel(pkgs, build)
