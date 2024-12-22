'use strict';

const asyncFilter = (array, asyncChecker, signal) => {
  const promises = array.map((item) =>
    new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject('Aborted');
        return;
      }
      signal.addEventListener('abort', () => {
        reject('Aborted');
      });
      asyncChecker(item)
        .then((result) => {
          resolve(result ? item : null);
        })
        .catch((err) => {
          reject(err);
        });
    })
  );
  return Promise.all(promises).then((results) =>
    results.filter((item) => item !== null)
  );
};

// Use case
const controller = new AbortController();
const { signal } = controller;

asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (item) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(item % 2 === 0), 1600);
    }),
  signal
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log('Error caught: ', err.message);
  });

setTimeout(() => {
  controller.abort();
}, 1500);
