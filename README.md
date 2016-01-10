# GigaGrid (Under Development) [![Build Status](https://travis-ci.org/erfangc/GigaGrid.svg?branch=master)](https://travis-ci.org/erfangc/GigaGrid)

Massively performant, multi-layered React.js table widget Written in TypeScript

# Developing

Perform the following steps

```bash
git clone https://github.com/erfangc/GigaGrid.git

cd GigaGrid

npm install && jspm install
```

If you are using an IDE that does not come with TypeScript bundled, install TypeScript globally

```bash
npm install typescript -g
```

To compile, simply run `tsc` (TypeScript compiler)

```bash
# this will automatically read configuration from tsconfig.json
tsc

# or watch for file changes with -w
tsc -w
```

If you are importing a `CommonJS` library, make sure you understand the difference between ES6 and `cjs` module specs

See:

[Stackoverflow Explanation 1](http://stackoverflow.com/questions/34622598/typescript-importing-from-libraries-written-in-es5-vs-es6)

[Stackoverflow Explanation 2](http://stackoverflow.com/questions/29596714/new-es6-syntax-for-importing-commonjs-amd-modules-i-e-import-foo-require)

# Testing

Make sure you install `karma` any plugins and `phantomjs` globally [More Info](http://phantomjs.org/)

```bash
npm instal phantomjs karma-phantomjs-launcher karma karma-jasmine karma-jspm -g

# then at the project root run
karma start karma2.conf.js
```
