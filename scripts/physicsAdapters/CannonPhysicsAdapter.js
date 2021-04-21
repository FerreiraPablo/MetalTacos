class CannonPhysicsAdapter {
    constructor(gravity) {
        this.gravity = gravity || 9.81;
        this.bodies = [];
        this.setup();
    }

    setup() {
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -this.gravity, 0);
    }

    convertVector3(threeVector3) {
        return new CANNON.Vec3(threeVector3.x, threeVector3.y, threeVector3.z);
    }

    convertQuaternion(threeQuaternion) {
        return new CANNON.Quaternion(threeQuaternion.x, threeQuaternion.y, threeQuaternion.z, threeQuaternion.w)
    }


    areEqual(first, second, props) {
        for (var prop of props) {
            if (first[prop] != second[prop]) {
                return false;
            }
        }
        return true;
    }

    update(time) {
        this.physicsWorld.step(1 / 60);
        for (var bodyReference of this.bodies) {
            if(!bodyReference.mesh.uuid) {
                this.remove(bodyReference);
            }
            if (bodyReference.mesh.children.length != bodyReference.shapesLength) {
                this.addShapes(bodyReference);
            }
            var position = bodyReference.body.position;
            var quaternion = bodyReference.body.quaternion;
            var actualPosition = bodyReference.mesh.position;
            var actualQuaternion = bodyReference.mesh.quaternion;
            actualPosition.set(position.x, position.y, position.z);
            actualQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
    }

    remove(bodyReference) {
        this.physicsWorld.remove(bodyReference.body)
        this.bodies.splice(this.bodies.indexOf(bodyReference), 1);
    }

    getAllMeshes(threeObject, meshArray) {
        meshArray = meshArray || [];
        if (threeObject.type == "Mesh") {
            meshArray.push(threeObject);
        }
        for (var child of threeObject.children) {
            if (child.type == "Mesh") {
                meshArray.push(child);
            }

            if (child.children.length) {
                this.getAllMeshes(child, meshArray);
            }
        }
        return meshArray;
    }

    addShapes(bodyReference) {
        var meshes = this.getAllMeshes(bodyReference.mesh);
        for (var mesh of meshes) {
            var parameters = {};
            var shape;
            if(mesh.geometry) {
                if(mesh.geometry.type == "SphereGeometry") {
                    shape = new CANNON.Sphere(mesh.geometry.parameters.radius);
                } else {
                    shape = threeToCannon(mesh, parameters);
                }
            }
            
            bodyReference.body.addShape(shape);
        }
        bodyReference.shapesLength = bodyReference.mesh.children?.length || 0;
    }


    getBodyByThreeObject(threeObject) {
        return this.bodies.filter(x => x.mesh == threeObject)[0]?.body;
    }

    getThreeObjectByBody(body) {
        return this.bodies.filter(x => x.body == body)[0]?.mesh;
    }

    addRigidBody(threeObject, mass) {

        var bodyReference = {};

        bodyReference.mass = mass || 0;

        bodyReference.mesh = threeObject;

        bodyReference.body = new CANNON.Body({
            mass: mass,
            position: this.convertVector3(threeObject.position),
            quaternion: this.convertQuaternion(threeObject.rotation)
        });


        bodyReference.mesh.body = bodyReference.body;
        bodyReference.body.mesh = bodyReference.mesh;

        this.addShapes(bodyReference);
        
        this.physicsWorld.add(bodyReference.body);
        this.bodies.push(bodyReference);
        return bodyReference.body;
    }
}