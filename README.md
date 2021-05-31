# yarn2-parcel-dedupe-repro

This repository contains code to reproduce the difference in `yarn v1` and `yarn v2` with `nodeLinkers: node-modules`.

## Deduplication behaviour differences

Running `yarn why` shows that `@parcel/fs` is not correctly deduplicated.

<details>
    <summary><code>node ./run-yarn-why.js</code></summary>

```sh
========================================
[yarn 1] installing node_modules
========================================

========================================
[yarn 1] running "$ yarn why @parcel/fs"
========================================

yarn why v1.22.10
[1/4] 🤔 Why do we have the module "@parcel/fs"...?
[2/4] 🚚 Initialising dependency graph...
[3/4] 🔍 Finding dependency...
[4/4] 🚡 Calculating file sizes...
=> Found "@parcel/fs@2.0.0-beta.2"
info Reasons this module exists

-   "_project_#@repro1#parcel-app#parcel" depends on it
-   Hoisted from "_project_#@repro1#parcel-app#parcel#@parcel#fs"
-   Hoisted from "_project_#@repro1#parcel-app#parcel#@parcel#core#@parcel#fs"
-   Hoisted from "_project_#@repro1#parcel-app#parcel#@parcel#package-manager#@parcel#fs"
    info Disk size without dependencies: "144KB"
    info Disk size with unique dependencies: "5.15MB"
    info Disk size with transitive dependencies: "16.57MB"
    info Number of shared dependencies: 42
    ✨ Done in 0.78s.

========================================
[yarn 1] script completed
========================================

========================================
[yarn 2] installing node_modules
========================================

========================================
[yarn 2] running "$ yarn why @parcel/fs"
========================================

├─ @parcel/core@npm:2.0.0-beta.2
│ └─ @parcel/fs@npm:2.0.0-beta.2 [e36f7] (via npm:2.0.0-beta.2 [e36f7])
│
├─ @parcel/package-manager@npm:2.0.0-beta.2
│ └─ @parcel/fs@npm:2.0.0-beta.2 (via npm:2.0.0-beta.2)
│
├─ @parcel/package-manager@npm:2.0.0-beta.2 [e36f7]
│ └─ @parcel/fs@npm:2.0.0-beta.2 [e36f7] (via npm:2.0.0-beta.2 [e36f7])
│
└─ parcel@npm:2.0.0-beta.2
└─ @parcel/fs@npm:2.0.0-beta.2 [e36f7] (via npm:2.0.0-beta.2 [e36f7])

========================================
[yarn 2] script completed
========================================
```

</details>

## Reproducing

Running `parcel` with `yarn v1` (no-error):

1. `cd using-yarn1`
2. `yarn install`
3. `yarn workspace @repro1/parcel-app start`  
   The bundler is running without error
4. `cd ..`

Running `parcel` with `yarn v2` (reports error):

1. `cd using-yarn2`
2. `yarn install`
3. `yarn workspace @repro2/parcel-app start`  
   The bundler is not started and reports the error mentioned below

## Problem

I tried upgrading a monorepo with `yarn v1` and the package containing `parcel` no longer builds.

The issue is narrowed down to `parcel` requiring a single copy of its dependencies to be present (i.e. transitive dependencies should be deduplicated). For example, if there are two copies of `@parcel/fs` inside `node_modules`, `parcel` would report an error despite both copies of `@parcel/fs` are the same version, since `parcel` identifies them by their filepath.

Running `parcel` will result in the following error:

```sh
Error: Name already registered with serializer
    at registerSerializableClass (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/@parcel/core/lib/serializer.js:30:11)
    at Object.<anonymous> (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/@parcel/core/node_modules/@parcel/fs/lib/NodeFS.js:229:39)
    at Module._compile (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/v8-compile-cache/v8-compile-cache.js:192:30)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1121:10)
    at Module.load (node:internal/modules/cjs/loader:972:32)
    at Function.Module._load (node:internal/modules/cjs/loader:813:14)
    at Module.require (node:internal/modules/cjs/loader:996:19)
    at require (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)
    at Object.<anonymous> (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/@parcel/core/node_modules/@parcel/fs/lib/index.js:21:15)
    at Module._compile (/Users/lshung/yarn2-parcel-dedupe-repro/using-yarn2/node_modules/v8-compile-cache/v8-compile-cache.js:192:30)
```
