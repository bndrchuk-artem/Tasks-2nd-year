'use strict';

const EventEmitter = require('events');
const ee = new EventEmitter();

class DataProducer {
  constructor() {
    this.counter = 0;
  }

  async produceData() {
    setInterval(() => {
      const data = { id: ++this.counter, value: Math.random() * 100 };
      console.log('Generated data:', data);
      ee.emit('newData', data);
    }, 1000); // Generates and sends data every 1000 ms
  }
}

class DataProcessor {
  constructor(abortController) {
    this.abortController = abortController;
    ee.on('newData', async (data) => {
      if (this.abortController.signal.aborted) {
        console.log('Processing aborted');
        return;
      }
      console.log('Processing data:', data);
      const processedData = await this.processData(data);
      ee.emit('processedData', processedData);
    });
  }

  async processData(data) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate async processing
    return { ...data, processedValue: data.value.toFixed(2) };
  }
}

// Example usage
(async () => {
  const abortController = new AbortController();

  const producer = new DataProducer();
  const processor = new DataProducer(abortController);
  const consumer = new DataProducer(abortController);

  console.log('Start');
  producer.produceData();

  setTimeout(() => {
    console.log('Aborting...');
    abortController.abort();
  }, 10000);

})();
