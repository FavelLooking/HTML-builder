const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  console.error(err);
});

(async () => {
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'));
  for (let file of files) {
    if (file.includes('css')) {
      let fileContent = await fsPromises.readFile(
        path.join(__dirname, 'styles', file),
      );
      await fs.appendFile(
        path.join(__dirname, 'project-dist', 'bundle.css'),
        fileContent,
        (err) => {
          console.error(err);
        },
      );
    }
  }
})();
