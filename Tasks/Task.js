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
