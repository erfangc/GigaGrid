# Demo

(This project is currently in active development - Some features are not working and I am happy to accept all helpful pull requests!)

A central aim is that this project will completely be free. However, I do have limited time to work on it.

See the Grid in Action [Here](http://erfangc.github.io/GigaGrid/)

## Default Theme
![GigaGrd](https://raw.githubusercontent.com/erfangc/GigaGrid/master/giga-grid.png)

## Retro Theme
![GigaGrd](https://raw.githubusercontent.com/erfangc/GigaGrid/master/giga-grid-retro.png)

# GigaGrid [![Build Status](https://travis-ci.org/erfangc/GigaGrid.svg?branch=master)](https://travis-ci.org/erfangc/GigaGrid)

High performance, React.js table widget with Subtotals (Written in TypeScript)

# Running

```bash
npm install giga-grid
```

# Developing

Perform the following steps

```bash
git clone https://github.com/erfangc/GigaGrid.git

cd GigaGrid

npm install

npm start

```

If you are importing a `CommonJS` library, make sure you understand the difference between ES6 and `cjs` module specs

See:

[Stackoverflow Explanation 1](http://stackoverflow.com/questions/34622598/typescript-importing-from-libraries-written-in-es5-vs-es6)
[Stackoverflow Explanation 2](http://stackoverflow.com/questions/29596714/new-es6-syntax-for-importing-commonjs-amd-modules-i-e-import-foo-require)

# Testing

Make sure you install `karma` any plugins and `phantomjs` globally [More Info](http://phantomjs.org/)

```bash
npm install phantomjs karma -g

# then at the project root run
karma start karma2.conf.js
```
