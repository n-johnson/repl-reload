const fs = require('fs');
const child_process = require('child_process');

function debounce(n, fn) {
  let lastCalled = 0;
  return (...args) => {
    if ((Date.now() - n) > lastCalled) {
      lastCalled = Date.now();
      fn.call(null, ...args);
    }
  }
}

function clearRequireCache() {
  Object.keys(require.cache).forEach((k) => { delete require.cache[k]; });
}

function reloadModule(varName, srcWaitTime = 1000, distWaitTime = 2000) {
  if (!varName) {
    throw new Error('varName missing: Must specify a target variable for the watched module');
  }

  const cwd = process.cwd();
  if (!fs.existsSync(`${cwd}/src`) || !fs.existsSync(`${cwd}/dist`)) {
    throw new Error('Unknown module directory structure, src and dist directories expected');
  }

  const pkg = require(`${cwd}/package.json`);
  if (!pkg || !pkg.scripts || !pkg.scripts.build) {
    throw new Error('No build script found in package.json');
  }

  // Debounce the watches to prevent a rebuild from triggering a reload for
  // every file that is built.
  fs.watch(`${cwd}/src`, { recursive: true }, debounce(srcWaitTime, () => {
    console.log('[repl-reload] Running build script');
    child_process.execSync('npm run build');
  }));

  fs.watch(`${cwd}/dist`, { recursive: true }, debounce(distWaitTime, () => {
    console.log(`[repl-reload] Reloading module: ${varName}`);
    clearRequireCache();
    global[varName] = require(`${cwd}/dist`);
  }));
}

module.exports = reloadModule;
