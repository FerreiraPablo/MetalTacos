class Character extends THREE.Group {
    money = 0;
    velocity = 1;
    jumpForce = 5;
    weight = 5;
    enabled = true;
    isCharacter = true;

    constructor() {
        super();
        this.recieveShadow = true;
        this.castShadow = true;
        THREE.GroupUtilities.extendObject(this);
        this.createBody();
    }

    setCore(core) {
        this.core = core;
    }

    get survivalTime() {
        if (!this.startTime) {
            return 0;
        }

        return (this.endTime || Date.now()) - this.startTime;
    }

    respawn() {
        if (this.core) {
            this.body.sleep();
            var respawnPoint = this.core.getSpawnPoint();
            this.body.position.set(respawnPoint.x, 1, respawnPoint.z);
            this.body.quaternion.set(0, 0, 0, 1);
            this.sendUpdate();
            this.body.wakeUp();
        }
    }

    kill() {
        this.respawn();
    }

    update() {
        if (this.isMe) {
            if (this.body.position.y < -5) {
                this.kill();
            }
        }
    }

    start() {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
    }

    getBodyState() {
        return {
            velocity : this.body.velocity,
            position : this.body.position,
            quaternion : this.body.quaternion,
            angularVelocity : this.body.angularVelocity,
            wlambda : this.body.wlambda,
            vlambda : this.body.vlambda
        }
    }

    jump() {
        if (this.enabled && this.body && !this.flying) {
            this.dispatchEvent({
                type: "jump"
            });

            if(this.server) {
                this.server.sendMessage("jump", )
            }

            this.body.velocity.y = this.jumpForce
            this.flying = true;
            this.sendUpdate()
        }
    }

    move(direction) {
        if (this.enabled && this.body) {
            this.dispatchEvent({
                type: "move",
                direction: direction.toLowerCase()
            });

            switch (direction.toLowerCase()) {
                case "nw":
                    this.body.velocity.x = -this.velocity;
                    break;
                case "w":
                    this.body.velocity.x = -this.velocity;
                    this.body.velocity.z = this.velocity;
                    break;
                case "sw":
                    this.body.velocity.z = this.velocity;
                    break;
                case "s":
                    this.body.velocity.x = this.velocity;
                    this.body.velocity.z = this.velocity;
                    break;
                case "se":
                    this.body.velocity.x = this.velocity;
                    break;
                case "e":
                    this.body.velocity.x = this.velocity;
                    this.body.velocity.z = -this.velocity;
                    break;
                case "ne":
                    this.body.velocity.z = -this.velocity;
                    break;
                case "n":
                    this.body.velocity.x = -this.velocity;
                    this.body.velocity.z = -this.velocity;
                    break;
                    
            }
            this.sendUpdate()
        }
    }

    reset() {
        this.endTime = this.startTime = null;
    }

    end() {
        if (!this.endTime) {
            this.endTime = Date.now();
        }
    }

    createBody() {
        var height = 0.2;
        var body = new THREE.Mesh(new THREE.BoxGeometry(height / 2, height, height / 2), new THREE.MeshPhongMaterial({
            color: 0x666666
        }));
        body.castShadow = true;
        body.receiveShadow = true;
        var head = new THREE.Mesh(new THREE.BoxGeometry(height / 2, height / 2, height / 2), new THREE.MeshPhongMaterial({
            color: 0xFFBB8E
        }));
        head.position.y = height / 2 + 0.05;
        head.castShadow = true;
        head.receiveShadow = true;
        body.originalposition = body.position.clone();
        head.originalposition = head.position.clone();
        head.name = "head";

        this.add(head);
        this.add(body);
    }

    setPhysicBody(body) {
        var reference = this;
        reference.body = body;
        // body.fixedRotation = true;
        // body.updateMassProperties();
        body.addEventListener("collide", function (event) {
            reference.flying = false;
            reference.start();
        })
    }

    sendUpdate() {
        if(this.server) {
            var bodyState = this.getBodyState();
            for(var property in bodyState) {
                this.server.updateProperty(property, bodyState[property]);
            }
        }
    }

    setServer(server) {
        this.server = server;
        this.sendUpdate();
    }

    destroy() {
        this.enabled = false;
        THREE.GroupUtilities.dispose(this);
    }
}