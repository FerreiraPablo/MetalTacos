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

    get survivalTime() {
        if(!this.startTime) {
            return 0;
        }

        return (this.endTime || Date.now()) - this.startTime;
    }


    kill() {
        
    }

    update() {

    }

    start() {
        if(!this.startTime) {
            this.startTime = Date.now();
        }
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
        var bodyGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.1);
        var bodyMaterial = new THREE.MeshPhongMaterial({ 
            color : 0x4C7A99
        });
        var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        this.add(bodyMesh);
    }

    setPhysicBody(body) {
        var reference = this;
        reference.body = body;
        // body.fixedRotation = true;
        // body.updateMassProperties();
        body.addEventListener("collide", function(event) {
            reference.flying = false;
            reference.start();
        })
    }
}