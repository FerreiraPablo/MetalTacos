class Light extends THREE.Group {
    constructor() {
        super();
    }

    on() {
        this.light.visible = true;
    }

    off() {
        this.light.visible = false;
    }

    toggle() {
        if(this.light.visible) {
            this.off()
        } else { 
            this.on();
        }
    }

}