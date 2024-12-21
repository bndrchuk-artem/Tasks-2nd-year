'use strict';

const asyncFilter = (array, asyncCallback, finalCallback) => {
  const arrayLength = array.length;
  const arrayOfResults = new Array(arrayLength).fill(null);
  let counter = 0;

  array.forEach((item, index) => {
    asyncCallback(item, (err, include) => {
      if (err) {
        finalCallback(err, null);
        return;
      }

      if (include) {
        arrayOfResults[index] = item;
      }

      counter++;
      if (counter === arrayLength) {
        finalCallback(null, arrayOfResults);
      }
    });
  });
};

// Use case
let i = 0;
asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (number, cb) => {
    setTimeout(() => {
      cb(null, number % 2 === 0);
    }, 1000 - i * 100);
    i++;
  },
  (err, result) => {
    console.log(err, result);
  }
);
