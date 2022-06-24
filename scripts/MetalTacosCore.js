class MetalTacosCore {
    characters = [];

    constructor(element, physicsAdapter) {
        this.physicsAdapter = physicsAdapter;
        this.element = element || document.body;
        this.setupGraphics();
        this.illuminate();
        this.addEvents();
        this.setCameraLocation();
    }

    setCameraLocation(location) {
        switch(location) {
            case "right" :
                this.setCameraPosition({
                    x : 5,
                    y : 3,
                    z : -5
                });
            case "left" :
                this.setCameraPosition({
                    x : -5,
                    y : 3,
                    z : 5
                });
                break;   
            case "back" :
                this.setCameraPosition({
                    x : -5,
                    y : 3,
                    z : -5
                });
                break;            
            default:
            case "front" :
                this.setCameraPosition({
                    x : 5,
                    y : 3,
                    z : 5
                });
                break;
        }
    }


    addEvents() {
        window.addEventListener("resize", x => this.resize(this.element.clientWidth, this.element.clientHeight));
    }

    illuminate() {
        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        this.scene.add(this.ambientLight);
    }

    setupGraphics() {
        this.element.style.backgroundColor = "#014E7A";
        this.element.style.margin = 0;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 9999);

        this.renderer = new THREE.WebGLRenderer({
            antialias : true,
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.display = "block";
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShawdowMap;
        this.renderer.setClearColor(0x000000, 0)
        
        this.clock = new THREE.Clock();

        this.element.append(this.renderer.domElement);
        
        this.update();
    }


    getSpawnPoint() {
        if(core.building) {
            var spawnBlocks = core.building.blocks.filter(x => x.isSpawn);
            if(spawnBlocks.length) {
                var spawnPoint = spawnBlocks[Math.floor(Math.random() * spawnBlocks.length)].position;
                return spawnPoint;
            }
        }
        return new THREE.Vector3(0,0,0);
    }


    setBuilding(building) {
        if(this.building) {
            // The previous building must be destroyed.
        }
        this.building = building;
        this.scene.add(building);
    }

    addCharacter(character, data) {
        if(character && character.isCharacter) {
            if(data) {
                for(var property in data) {
                    character[property] = data[property];
                }
            }
            
            character.position.y = 1;

            if(data.isMe) {
                //core.cameraTarget = character;
                var spawnPoint = this.getSpawnPoint();
                character.position.x = spawnPoint.x;
                character.position.z = spawnPoint.z;
                character.position.y = spawnPoint.y + 1;
                this.character = character;
            }   

            character.setPhysicBody(physics.addRigidBody(character, character.weight));
            this.characters.push(character);
            this.scene.add(character);        
            return character;
        }
    }

    update() {
        var reference = this;
        requestAnimationFrame(x => this.update());
        this.physicsAdapter?.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);

        this.characters.forEach(x => {
            if(x.position.y < -2) {
                x.kill();
                x.body.sleep();
                var spawnPoint = reference.getSpawnPoint();
                gsap.to(x.body.position, {
                    x : spawnPoint.x,
                    y : spawnPoint.y + 0.5,
                    z : spawnPoint.z,
                    ease: Expo.easeInOut
                })


                x.body.quaternion.set(0,0,0,1);
                x.body.wakeUp();
                x.body.velocity.setZero();
                x.body.angularVelocity.setZero();
                x.body.force.setZero();
                x.body.inertia.setZero();
            }
            x.update()
        })
        
        this.camera.lookAt((this.cameraTarget || this.scene).position) 
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.width, this.height);
    }

    setCameraPosition(position) {
        var reference = this;
        
        gsap.to(reference.camera.position, {
            duration : 2,
            x : position.x,
            y : position.y,
            z : position.z,
            ease : Expo.easeInOut
        })
    }
}