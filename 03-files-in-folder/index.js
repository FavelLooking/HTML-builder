const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const pathFolder = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const names = await fsPromises.readdir(pathFolder, { withFileTypes: true });
    for (const name of names) {
      if (name.isFile()) {
        const fileName = path.join(pathFolder, name.name);
        const stats = await fsPromises.stat(fileName);
        const ext = path.extname(name.name);
        console.log(
          `${name.name.split('.')[0]} - ${ext.slice(1)} - ${stats.size}b`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
