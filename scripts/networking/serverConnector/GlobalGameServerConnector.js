class GlobalGameServerConnector {
    listeners = {};
    users = [];

    constructor(host, port) {
        var reference = this;
        this.server = io.connect(host + ":" + port, {
            secure: true,
            port: port
        });

        this.server.on("who are you", function () {
            reference.id = btoa(Math.floor(Math.random() * 99999) + Date.now());
            this.emit("login", { id: reference.id });
        });
        

        this.server.on("room joined", function (users) {
            reference.users.forEach(user => reference.removeUser(user));
            users.forEach(user => reference.addUser(user));
        })

        this.server.on("message", event => {
            var localUser = this.users.filter(x => x.id == event.data.user.id)[0];
            if(localUser) {
                localUser.trigger(event.name, event.data.message)
            }
        });
        this.server.on("user data", users => users.forEach(user => reference.updateUser(user)));
        this.server.on("user joined", user => reference.addUser(user));
        this.server.on("user gone", user => reference.removeUser(user));
        this.server.on("login success", (user) => {
            reference.trigger("login sucesss", user)
        });
    }

    addUser(user) {
        var localUser = this.users.filter(x => x.id == user.id)[0];
        if (localUser) {
            this.updateUser(user);
        } else {
            var client = new RemoteClient(user);
            this.users.push(client);
            if(user.id != this.id) {
                this.trigger("user joined", client);
            }
        }
    }

    enterRoom(roomId) {
        this.server.emit("enter room", roomId);
    }

    sendMessage(eventName, data) {
        this.server.emit("message", eventName, data);
    }

    sendMessageTo(userId, eventName, data) {
        this.server.emit("user message", userId, eventName, data);
    }

    updateUser(user) {
        var localUser = this.users.filter(x => x.id == user.id)[0];
        if (localUser) {
            for (var property in user) {
                localUser[property] = user[property];
            }
            localUser.trigger("update", {});
            this.trigger("user data", localUser);
        } else {
            this.addUser(user);
        }
    }

    removeUser(user) {
        var localUser = this.users.filter(x => x.id == user.id)[0];
        if (localUser) {
            this.users.splice(this.users.indexOf(localUser), 1);
            this.trigger("user gone", localUser);
        }
    }

    trigger(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(x => x.apply(this, [data]));
        }
    }

    updateProperty(property, data) {
        console.log(property, data);
        this.server.emit("update property", property, data);
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