'use strict';

const asyncFilter = (array, asyncCallback, resultCallback) => {
  const arrayLength = array.length;
  const arrayOfResults = new Array(arrayLength).fill(null);
  let counter = 0;

  array.forEach((item, index) => {
    asyncCallback(item, (err, include) => {
      if (err) {
        return resultCallback(err, null);
      }

      if (include) {
        arrayOfResults[index] = item;
      }

      if (++counter === arrayLength) {
        resultCallback(null, arrayOfResults.filter((item) => item !== null));
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
    console.log(err, result); // null [2, 4, 6]
  }
);
