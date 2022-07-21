class Sun extends Light {
    set color(value) {
        return this.metalMaterial.color = value;
    }

    get color() {
        return this.metalMaterial.color;
    }

    constructor() {
        super();
        this.metalMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess : 50
        });
        THREE.GroupUtilities.extendObject(this);
        this.m = 0;
        this.movementRatio = 0.3;
        this.addLight();
        setInterval(function(reference) {
            reference.star.position.y = Math.cos(reference.m) * reference.movementRatio;
            // reference.star.position.x = -(Math.sin(reference.m) * reference.movementRatio);
            // reference.star.position.z = (Math.sin(reference.m) * reference.movementRatio);
            reference.m += 0.1;
            if(reference.m > Math.PI * 2) {
                reference.m = 0;
            }
        }, 1000 / 60, this)
    }

    addLight() {
        this.starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        this.starMaterial = new THREE.MeshBasicMaterial({
            color : 0xFFFFFF
        })
        this.star = new THREE.Mesh(this.starGeometry, this.starMaterial);
        this.light = new THREE.SpotLight( 0xffffff, 0.05, undefined, undefined, 1);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 10;
        this.light.shadow.camera.fov = 30;
        this.add(this.light);
        //this.add(this.star);
    }    
}