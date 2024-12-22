'use strict';

const asyncFilter = (array, asyncChecker) => {

};

// Use case
let i = 0;
asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (number) =>
    new Promise((resolve, reject) => {
      setTimeout();
    })
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err.message);
  });
