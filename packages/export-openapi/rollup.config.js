import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-node-polyfills";

const sourcemap = "inline";
const input = "./src/index.ts";

const commonOptions = {
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: "ES2017",
          module: "ES2015"
        }
      }
    }),
    terser(),
    resolve(),
    commonjs(),
    nodePolyfills(),
    json(),
    replace({
      preventAssignment: true
    })
  ],
  input
};

/** @type import('rollup').RollupOptions */
const nodeCjs = {
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap
    }
  ],
  ...commonOptions
};

const bundles = [nodeCjs];

export default bundles;
