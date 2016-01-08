# GigaGrid
Massively performant, multi-layered React.js table widget Written in TypeScript

# Developing

Perform the following steps

```bash
git clone https://github.com/erfangc/GigaGrid.git

cd GigaGrid

npm install && jspm_install
```

If you are using a IDE that does not come with TypeScript bundled, install TypeScript globally

```bash
npm install typescript
```

To compile, simply run

```bash
# this will automatically read configuration from tsconfig.json
tsc
```

# Testing

Make sure you install `karma` any plugins and `phantomjs` globally [More Info](http://phantomjs.org/)

```bash
npm instal phantomjs karma-phantomjs-launcher karma karma-jasmine karma-jspm -g

# then at the project root run
karma start karma2.conf.js
```
