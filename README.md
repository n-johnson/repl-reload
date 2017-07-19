# repl-reload

## Usage

Inside of a node.js REPL, repl-reload will watch a `src` and `dist` directory and automatically build and reload a module when files are updated.

```js
require('repl-reload')(varName, srcWaitTime = 1000, distWaitTime = 2000)
```

Where `varName` will be the global variable that is set to `require('./dist')`

`srcWaitTime` and `distWaitTime` are optional arguments that specify how long their respective watch functions should be debounced for. (To prevent a rebuild from triggering a reload for every single file that is changed)

