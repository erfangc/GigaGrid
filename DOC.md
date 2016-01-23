# Basic Usage

```js
ReactDOM.render(<GigaGrid
    data={data}
    columnDefs={columnDefs}
    ... />, document.getElementById("grid-container"))
```

# High Level Structure of the Code

**React** components written in **JSX** are located under `components/`

**State Management** is exclusively handled by the **Flux** store under `store/GigaStore.ts`
 
Data processing heavy lifting code is typically located under `static/`, these classes only expose static methods mainly because they are stateless

**POJO** like composite types are defined under `models/`, for example `Row` `Column`

# Public Usage

Please find t he Public API under [index.ts](modules/_index_.html)

# Generate TypeScript Documentation

Install [typedoc](http://typedoc.io/) Then Run

```bash
typedoc --module commonjs --excludeExternals --jsx react --out doc/ --readme DOC.md --name GigaGrid src/
```