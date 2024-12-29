'use strict';

const asyncFilter = (array, asyncCallback, resultCallback) => {
  const arrayLength = array.length;
  const arrayOfResults = new Array(arrayLength).fill(null);
  let counter = 0;
  let errorExist = false;

  array.forEach((item, index) => {
    asyncCallback(item, (err, include) => {
      if (errorExist) return;
      if (err) {
        errorExist = true;
        return resultCallback(err, null);
      }

      if (include) {
        arrayOfResults[index] = item;
        console.log(item);
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
  [2, 2, 3, 4, 5, 6],
  (number, cb) => {
    setTimeout(() => {
      if (number <= 3) cb(new Error('Some error'), null);
      else cb(null, number % 2 === 0);
    }, 1000 - 100 * i);
    i++;
  },
  (err, result) => {
    console.log(err, result); // null [2, 4, 6]
  }
);
