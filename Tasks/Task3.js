'use strict';

const asyncFilter = (array, asyncChecker, { signal }) => {
  const abortError = new Error('Operation aborted');

  const promises = array.map((item) =>
    new Promise((resolve, reject) => {
      if (signal.aborted) reject(abortError);

      const listener = () => reject(abortError);
      signal.addEventListener('abort', listener);

      asyncChecker(item)
        .then((result) => resolve(result ? item : null))
        .catch((err) => reject(err))
        .finally(() => signal.removeEventListener('abort', listener));
    })
  );

  return Promise.all(promises).then((results) =>
    results.filter((item) => item !== null)
  );
};

// Use case
const controller = new AbortController();

asyncFilter(
  [1, 2, 3, 4, 5, 6],
  (item) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(item % 2 === 0), 1400);
    }),
  controller
)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log('Error caught: ', err.message);
  });

asyncFilter(
  [1, 2, 3],
  (item) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (item === 2) reject(new Error('Intentional failure'));
        else resolve(item % 2 === 0);
      }, 1200);
    }),
  controller
);

setTimeout(() => {
  controller.abort();
}, 1500);
