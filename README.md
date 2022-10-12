# eoapi-extensions
- examples: show how to contribute feature by extension 
- packages: official extension code
## Install

```bash
pnpm install
```

## Generate CHANGELOG
1. 执行 changeset，开始交互式填写变更集，这个命令会将你的包全部列出来，然后选择你要更改发布的包

```bash
pnpm changeset
```

2. 执行 changeset version，修改发布包的版本
```bash
pnpm version-packages
```
## Release

```bash
pnpm release
```

If you want to configure automatic publishing, please configure `github/workflows`,like:

```yml
  publish-npm-import:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
          registry-url: https://registry.npmjs.org/
      - run: pnpm install
      - run: pnpm build
        working-directory: ${extension directory}

      - run: npm publish
        working-directory: ${extension directory}
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```


## Publish

```bash
pnpm publish:ci [pkgName,...]


