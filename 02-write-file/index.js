const fs = require('fs');
const path = require('path');

const pathName = path.join(__dirname, './text2.txt');
console.log('Hi! Please enter the text for input\n');
process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('bye bye');
    process.exit();
  }
  fs.appendFile(pathName, data.toString(), (err) => {
    if (err) throw err;
  });
});
