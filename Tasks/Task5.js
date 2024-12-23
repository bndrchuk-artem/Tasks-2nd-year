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

