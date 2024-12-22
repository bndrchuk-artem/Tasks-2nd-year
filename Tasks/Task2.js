'use strict';

const asyncFilter = (array, asyncChecker) => {
  const promises = array.map((item) =>
    asyncChecker(item)
      .then((include) => {
        if (!include) {
          return null;
        }
        return item;
      }));
  return Promise.all(promises)
    .then((results) => results.filter((item) => item !== null));
};

// Use case

asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (item) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(item % 2 === 0), 1000);
    })
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err.message);
  });

asyncFilter(
  [1, 2, 3],
  (item) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (item === 2) {
          reject(new Error('Some error'));
        } else {
          resolve(item >= 1);
        }
      }, 2000);
    })
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err.message);
  });
