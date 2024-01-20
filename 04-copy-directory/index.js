const fsPromises = require('fs').promises;
const path = require('path');

const checkFunc = async () => {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'new-folder'));
    for (let file of files) {
      //console.log('lets delete this!');
      await fsPromises.unlink(path.join(__dirname, 'new-folder', file));
    }

    console.log('Files deleted successfully.');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Folder does not exist. Nothing to delete.');
    } else {
      console.error('Error occurred while deleting files:', err.message);
    }
  }
};

const actionFunc = async () => {
  await fsPromises.mkdir(path.join(__dirname, 'new-folder'), {
    recursive: true,
  });
  await checkFunc();

  const files = await fsPromises.readdir(path.join(__dirname, 'files'));
  for (let file of files) {
    await fsPromises.copyFile(
      path.join(__dirname, 'files', file),
      path.join(__dirname, 'new-folder', file),
    );
  }
};

actionFunc();
