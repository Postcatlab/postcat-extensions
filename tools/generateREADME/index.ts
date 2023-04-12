//Get README.md
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs'
const enReadme = readFileSync('./import.en.md', 'utf-8')
const reademe = readFileSync('./import.md', 'utf-8')

const extPaths = readdirSync('../../packages').filter((val) =>
  val.includes('postcat-import')
)
//* Generate at every extension Dir
extPaths.forEach((extension) => {
  const packageJson = require('../../packages/' + extension + '/package.json')
  const variables: { [key: string]: string } = {
    title: packageJson.features.importAPI.label.split('(.')[0],
    importImg: ''
  }
  //Parse en
  if (packageJson.name === 'postcat-import-apipost') {
    variables.importImg =
      '![import-en.png](https://data.eolink.com/KNQjJ5Uc9d29a40f864631230741270152f61a01b8ad717)'
  } else {
    variables.importImg = `![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/${packageJson.name}/assets/images/import_dialog.png) `
  }

  let enResult = enReadme
  Object.keys(variables).forEach((key: string) => {
    const reg = new RegExp(`\\$\\{${key}\\}`, 'g')
    //Repalce Image
    enResult = enResult.replace(reg, variables[key])
  })

  //Parse zh
  if (packageJson.name === 'postcat-import-apipost') {
    variables.importImg =
      '![import-zh.png](https://data.eolink.com/F4SQdjYe1ec49aa9c1e21f22f6251dcdb4f2000ab8db5e9)'
  } else {
    const checkExist = existsSync(
      `../../packages/${extension}/assets/images/import_dialog_zh.png`
    )
    variables.importImg = `![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/${
      packageJson.name
    }/assets/images/${checkExist ? 'import_dialog_zh' : 'import_dialog'}.png)`
  }
  let zhResult = reademe
  Object.keys(variables).forEach((key: string) => {
    const reg = new RegExp(`\\$\\{${key}\\}`, 'g')
    //Repalce Image
    zhResult = zhResult.replace(reg, variables[key])
  })

  //Write README.md at every extension dir
  writeFileSync(`../../packages/${extension}/README.md`, enResult)
  writeFileSync(`../../packages/${extension}/README.zh-Hans.md`, zhResult)
})

//Change package.json version
//Use pxec to publish extension
