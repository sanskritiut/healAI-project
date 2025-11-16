// This file intentionally only exports the raw firebase configuration object.
// It does NOT initialize Firebase. The canonical initializer is `src/firebaseconf.ts`.

// This file previously contained Firebase web config. That data has been
// moved into `app/firebase/firebaseconf.ts`. Keep this file empty to avoid
// accidental initialization from the old path. Import from
// `@/app/firebase/firebaseconf` instead.

const _deprecated = true;
export default _deprecated;
