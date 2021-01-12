import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import scss from 'rollup-plugin-scss'
import * as packageJson from "./package.json";

const info = `/*
 * ${packageJson.library}
 * Version ${packageJson.version}
 * ${packageJson.homepage}
 */
`;

const config = (options = {}) => ({
  input: "src/Tooltip.js",
  output: options.output.map((type) => ({
    name: "TooltipJs",
    file: `dist/${type}/tooltip${options.minify ? ".min" : ""}.js`,
    format: type,
    exports: "default",
    banner: info,
  })),
  plugins: [
    ...(options.plugins || []),
    options.minify ? terser() : false,
    options.minify ? scss({outputStyle: "compressed"}): scss(),
  ].filter(Boolean),
});

const plugins = [
  resolve({ mainFields: ["module", "main"], browser: true }),
  babel({
    plugins: ["@babel/plugin-proposal-class-properties"],
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
  commonjs(),
];

export default [
  config({ output: ["umd", "amd", "cjs"], plugins }),
  config({ output: ["umd", "amd", "cjs"], plugins, minify: true }),
];
