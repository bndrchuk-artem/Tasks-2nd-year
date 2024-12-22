'use strict';

const fs = require('fs');
const readline = require('readline');

function sumColumn(filePath, columnName) {
  return new Promise((resolve, reject) => {
    let total = 0;
    let header = [];

    const stream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      const columns = line.split('\t');
      if (header.length === 0) {
        header = columns;
      } else {
        const columnIndex = header.indexOf(columnName);
        const value = parseFloat(columns[columnIndex]);
        total += value;
      }
    });

    rl.on('close', () => {
      resolve(total);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

// Use case

const filePath = './Tasks/Salary.txt';
const columnName = 'Salary'; // Column name to sum

sumColumn(filePath, columnName)
  .then((total) => {
    console.log(`The total sum of the "${columnName}" column is ${total}`);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
