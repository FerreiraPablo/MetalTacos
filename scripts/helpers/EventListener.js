class EventListener {
    listeners = {};

    addEventListener(event, action) {
        if(!this.listeners[event])
            this.listeners[event] = [] 

        this.listeners[event].push(action);
        return action;
    }

    trigger(event, data) {
        if(!this.listeners[event])
            return;

        var reference = this;
        this.listeners[event].forEach(x => x.call(reference, data));
    }
}