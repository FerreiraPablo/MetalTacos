class Client {
    listeners = {};
    constructor() {

    }

    trigger(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(x => x.apply(this, [data]));
        }
    }

    addEventListener(eventName, action) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        if(typeof action === 'function') {
            this.listeners[eventName].push(action);
        }
    }
}