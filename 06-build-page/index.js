const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

let assetsPath = path.join(__dirname, 'assets');

async function createFunc() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
  await checkFunc();
  await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });
  await fsPromises.appendFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    '',
  );
  await fsPromises.appendFile(
    path.join(__dirname, 'project-dist', 'style.css'),
    '',
  );
}

async function recursiveCopy(srcPath, destPath) {
  const assetsFiles = await fsPromises.readdir(srcPath);
  for (let file of assetsFiles) {
    const srcFilePath = path.join(srcPath, file);
    const destFilePath = path.join(destPath, file);
    const stat = await fsPromises.stat(srcFilePath);
    if (stat.isDirectory()) {
      await fsPromises.mkdir(destFilePath, { recursive: true });
      await recursiveCopy(srcFilePath, destFilePath);
    } else {
      await fsPromises.copyFile(srcFilePath, destFilePath);
    }
  }
}

async function htmlFillingFunc() {
  let templateText = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  const articles = await fsPromises.readFile(
    path.join(__dirname, 'components', 'articles.html'),
    'utf-8',
  );
  const footer = await fsPromises.readFile(
    path.join(__dirname, 'components', 'footer.html'),
    'utf-8',
  );
  const header = await fsPromises.readFile(
    path.join(__dirname, 'components', 'header.html'),
    'utf-8',
  );
  templateText = await templateText.replace('{{header}}', header.trim());
  templateText = await templateText.replace('{{articles}}', articles.trim());
  templateText = await templateText.replace('{{footer}}', footer.trim());
  if (templateText.includes('{{about}}')) {
    const about = await fsPromises.readFile(
      path.join(__dirname, 'components', 'about.html'),
      'utf-8',
    );
    templateText = await templateText.replace('{{about}}', about.trim());
  }
  // console.log(templateText);
  await fsPromises.appendFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    templateText,
  );
}

async function copyCss() {
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'));
  for (let file of files) {
    if (file.includes('css')) {
      let fileContent = await fsPromises.readFile(
        path.join(__dirname, 'styles', file),
      );
      await fsPromises.appendFile(
        path.join(__dirname, 'project-dist', 'style.css'),
        fileContent,
      );
    }
  }
}

async function checkFunc() {
  try {
    await fsPromises.rm(path.join(__dirname, 'project-dist'), {
      recursive: true,
      force: true,
    });
    console.log('Files deleted successfully.');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Folder does not exist. Nothing to delete.');
    } else {
      console.error('Error occurred while deleting files:', err.message);
    }
  }
}

createFunc()
  .then(() =>
    recursiveCopy(assetsPath, path.join(__dirname, 'project-dist', 'assets')),
  )
  .then(() => htmlFillingFunc())
  .then(() => copyCss());
