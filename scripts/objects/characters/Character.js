class Character extends THREE.Group {
    score = 0;
    money = 0;
    velocity = 2;
    jumpForce = 2;
    weight = 50;
    enabled = true;
    isCharacter = true;

    constructor() {
        super();
        this.recieveShadow = true;
        this.name = "Ball#" + Math.floor(Math.random() * 9999);
        this.color = this.getRandomColor();
        this.castShadow = true;
        THREE.GroupUtilities.extendObject(this);
        this.createBody();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return parseInt(color);
    }

    get survivalTime() {
        if(!this.startTime) {
            return 0;
        }

        return (this.endTime || Date.now()) - this.startTime;
    }


    kill() {
        if(this.pushedBy) {
            this.pushedBy.gain(this.score);
            this.pushedBy.pushedBy = null;
        }

        this.score = 0;
    }

    gain(gainedPoints) {
        this.score += gainedPoints || 1;
    }

    update() {

    }

    jump() {
        if(this.enabled && this.body && !this.flying) {
            this.body.velocity.y = this.jumpForce
            this.flying = true;
        }
    }

    hardFall() {
        if(this.enabled && this.body && this.flying) {
            this.body.velocity.y = -this.jumpForce
        }
    }

    move(direction) {
        if(this.enabled && this.body) {
            switch(direction.toLowerCase()) {
                case "nw" : 
                    this.body.velocity.x = -this.velocity;
                    break;
                case "w" : 
                    this.body.velocity.x = -this.velocity;
                    this.body.velocity.z = this.velocity;
                    break;
                case "sw" : 
                    this.body.velocity.z = this.velocity;
                    break;
                case "s" : 
                    this.body.velocity.x = this.velocity;
                    this.body.velocity.z = this.velocity;
                    break;
                case "se" : 
                    this.body.velocity.x = this.velocity;
                    break;
                case "e" : 
                    this.body.velocity.x = this.velocity;
                    this.body.velocity.z = -this.velocity;
                    break;
                case "ne" : 
                    this.body.velocity.z = -this.velocity;
                    break;
                case "n" : 
                    this.body.velocity.x = -this.velocity;
                    this.body.velocity.z = -this.velocity;
                    break;
            }
        }
    }

    reset() {
        this.endTime = this.startTime = null;
    }

    end() {
        if(!this.endTime) {
            this.endTime = Date.now();
        }
    }

    createBody() {
        var bodyGeometry = new THREE.SphereGeometry(0.1,24,24);
        var bodyMaterial = new THREE.MeshPhongMaterial({ 
            color : this.color
        });
        var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

        bodyMesh.castShadow = true;
        bodyMesh.recieveShadow = true;
        this.add(bodyMesh);
    }

    setPhysicBody(body) {
        var reference = this;
        reference.body = body;
        body.updateMassProperties();
        body.addEventListener("collide", function(event) {
            var collidedBody = event.body;
            if(collidedBody.mesh.isCharacter) {
                reference.pushedBy = collidedBody.mesh;
            }
        })
    }
}