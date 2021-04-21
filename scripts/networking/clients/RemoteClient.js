class RemoteClient extends Client {
    constructor(data, server) {
        super();
        this.server = server;
        for(var property in data) {
            this[property] = data[property];
        }
    }

    
    
    sendMessage(event, data) {
        this.server.sendMessageTo(this.id, event, data);
    }
}