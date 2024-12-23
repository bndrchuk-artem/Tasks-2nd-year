'use strict';

const EventEmitter = require('events');
const ee = new EventEmitter();

class DataProducer {
  constructor(abortController) {
    this.counter = 0;
    this.timer = null;
    this.abortController = abortController;

    this.abortController.signal.addEventListener('abort', () => {
      this.stopProducing(); // Reuse the method to stop the interval
    });
  }

  async produceData() {
    if (this.abortController.signal.aborted) {
      console.log('[DataProducer] Aborted before starting');
      return;
    }

    this.timer = setInterval(() => {
      const data = { id: ++this.counter, value: Math.random() * 100 };
      console.log('[DataProducer] Generated data:', data);
      ee.emit('newData', data);
    }, 1000); // Generates and sends data every 1000 ms
  }

  stopProducing() {
    if (this.timer) {
      clearInterval(this.timer); // Clear the interval
      this.timer = null; // Reset the timer reference
      console.log('[DataProducer] Stopped producing data');
    }
  }
}

class DataProcessor {
  constructor(abortController) {
    this.abortController = abortController;
    ee.on('newData', async (data) => {
      if (this.abortController.signal.aborted) {
        console.log('[DataProcessor] Processing aborted');
        return;
      }
      console.log('[DataProcessor] Processing data:', data);
      const processedData = await this.processData(data);
      ee.emit('processedData', processedData);
    });
  }

  async processData(data) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate async processing
    return { ...data, processedValue: data.value.toFixed(2) };
  }
}

class DataConsumer {
  constructor(abortController) {
    this.abortController = abortController;
    ee.on('processedData', (data) => {
      if (this.abortController.signal.aborted) {
        console.log('[DataConsumer] Consuming aborted');
        return;
      }
      console.log('[DataConsumer] Consumed processed data:', data);
    });
  }
}

// Example usage
(async () => {
  const abortController = new AbortController();

  const producer = new DataProducer(abortController);
  const processor = new DataProcessor(abortController);
  const consumer = new DataConsumer(abortController);

  console.log('Start');
  producer.produceData();

  setTimeout(() => {
    console.log('Aborting...');
    abortController.abort();
  }, 10000);

})();
