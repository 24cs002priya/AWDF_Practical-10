const { EventEmitter } = require('node:events');
class CarEvents extends EventEmitter {
}
module.exports = new CarEvents();
