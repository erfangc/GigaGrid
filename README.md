# Demo

See the Grid in Action [Here](http://erfangc.github.io/GigaGrid/)

![GigaGrd](https://raw.githubusercontent.com/erfangc/GigaGrid/master/giga-grid.png)

# GigaGrid (Under Development) [![Build Status](https://travis-ci.org/erfangc/GigaGrid.svg?branch=master)](https://travis-ci.org/erfangc/GigaGrid)

High performance, React.js table widget with Subtotals (Written in TypeScript)

# Running the Examples

```bash
npm install && jspm install

# this should compile build and call webpack to bundle the project 
npm run serve
```

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
npm install phantomjs karma-phantomjs-launcher karma karma-jasmine karma-jspm -g

# then at the project root run
karma start karma2.conf.js
```

Alternatively, you can try to run

```bash
# this will clean the build directory and re-compile all the source files
npm run test
```
