# eoapi-extensions
eoapi official extensions

## Install

```bash
pnpm install
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


