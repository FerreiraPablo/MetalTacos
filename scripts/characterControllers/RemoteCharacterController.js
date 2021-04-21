class RemoteCharacterController {
    
    bodyProperties = ["velocity", "position", "quaternion", "angularVelocity", "wlambda", "vlambda"];
    constructor(character, client) {    
        this.character = character;
        this.client = client;
        this.updateCharacter();
        this.addClientListeners();
    }
    
    addClientListeners() {
        this.client.addEventListener("update", () => this.updateCharacter());
    }

    apply(property) {
        if(this.client[property]) {
            if(!this.client[property].w) {
                this.character.body[property].set(this.client[property].x, this.client[property].y, this.client[property].z);
            } else {
                this.character.body[property].set(this.client[property].x, this.client[property].y, this.client[property].z, this.client[property].w);
            }
        }
    }

    updateCharacter() {
        this.character.body.sleep();
        this.bodyProperties.forEach(prop => this.apply(prop));
        this.character.body.wakeUp();
    }
}