'use strict';

const asyncFilter = (array, asyncChecker) => {
  const promises = array.map((item) => {
    asyncChecker(item)
      .then((include) => {
        if (!include) {
          return null;
        }
        return item;
      });
  });
  return Promise.all(promises)
    .then((results) => results.filter((item) => item !== null));
};

// Use case
let i = 0;
asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (item) =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(item % 2 === 0), 1000);
    })
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err.message);
  });
