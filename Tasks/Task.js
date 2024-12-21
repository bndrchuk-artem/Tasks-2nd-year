'use strict';

const asyncFilter = (array, asyncCallback, finalCallback) => {
  const results = [];
  let counter = 0;

  array.forEach((item, index) => {
    asyncCallback(item, (err, include) => {
      if (err) {
        finalCallback(err, null);
        return;
      }

      if (include) {
        results.push(item);
      }

      counter--;
      if (counter === 0) {
        finalCallback(null, results);
      }
    });
  });
};

// Use case

asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (number, cb) => {
    setTimeout(() => {
      cb(null, number % 2 === 0);
    }, 1000);
  },
  (err, result) => {
    console.log(err, result);
  }
);
