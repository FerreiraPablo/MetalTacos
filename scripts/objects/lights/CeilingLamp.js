class CeilingLamp extends Light {

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
        this.addBody();
        this.addLight();

    }

    addLight() {
        this.bulbGeometry = new THREE.SphereGeometry(0.05);
        this.bulbMaterial = new THREE.MeshPhongMaterial({
            color : 0xFFFFFF
        })
        this.bulb = new THREE.Mesh(this.bulbGeometry, this.bulbMaterial);

        this.light = new THREE.SpotLight( 0xffffff, 0.4, undefined, undefined, 1);
        this.light.castShadow = true;
        this.light.position.y = 0;

        this.bulb.add(this.light);
        THREE.GroupUtilities.extendObject(this.bulb);
        this.add(this.bulb.alignBottom(this.firstChild(), "start"));
    }

    addBody() {
        this.lampGeometry = new THREE.ConeGeometry( 0.1, 0.1, 32 );
        this.lampCableGeometry = new THREE.CylinderGeometry( 0.01, 0.01, 0.3, 32 );
        this.add(THREE.GroupUtilities.Mesh(this.lampCableGeometry, this.metalMaterial));
        this.add(THREE.GroupUtilities.Mesh(this.lampGeometry, this.metalMaterial).alignBottom(this));
    }
}