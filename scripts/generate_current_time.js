
const fs = require('fs');

fs.writeFileSync(
  './docs/_src/last_commit.js',
  `
  (function () {
    last_commit_date = ${Date.now()};
  }());
  `,
);