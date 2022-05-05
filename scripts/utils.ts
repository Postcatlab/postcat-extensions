import fs from 'fs'

const argvs = process.argv.slice(2)
console.log('process.argv', argvs)

// 如果通过命令行传递了参数，则认为是指定打包，否则默认打包packages下所有包
export const pkgs = (argvs.length ? argvs : fs.readdirSync('packages')).filter(
  (p) => {
    return fs.statSync(`packages/${p}`).isDirectory()
  }
)
