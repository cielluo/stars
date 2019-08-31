
const fs = require('fs');

fs.writeFileSync(
  './docs/last_commit.js',
  `
  (function () {
    last_commit_date = ${Date.now()};
  }());
  `,
);