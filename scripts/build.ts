import fs from 'fs'
import { execa } from 'execa'

const pkgs = fs.readdirSync('packages').filter((p) => {
  return fs.statSync(`packages/${p}`).isDirectory()
})

console.log(pkgs)

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
