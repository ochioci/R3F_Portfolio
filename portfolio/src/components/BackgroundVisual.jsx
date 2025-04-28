import {useRef} from "react";
import {
    BufferAttribute, MathUtils, Object3D, Vector3
} from "three";
import {useFrame} from "@react-three/fiber";
const signedRand = () => Math.random() - 0.5
const pointDistance  = (p1, p2) => (((p1.x - p2.x) ** 2) + ((p1.y - p2.y) ** 2) + ((p1.z - p2.z) ** 2)) ** 0.5
class spherePoint {
    constructor(theta, phi, rho) {
        this.theta = theta
        this.phi = phi
        this.rho = rho
        this.vTheta = 0;
        this.vPhi = 0;
        this.efficiency = 0.99;
    }

    getCartesian() {
        // return {
        //     x: this.rho * Math.cos(this.theta) * Math.sin(this.phi),
        //     y: this.rho * Math.sin(this.theta) * Math.sin(this.phi),
        //     z: this.rho * Math.cos(this.phi)
        // }
        return [
            this.rho * Math.cos(this.theta) * Math.sin(this.phi),
            this.rho * Math.sin(this.theta) * Math.sin(this.phi),
            this.rho * Math.cos(this.phi)
        ]
    }

    accelerate(theta_, phi_, delta) {
        this.vTheta += theta_ * delta * 10;
        this.vPhi += phi_ * delta * 10;
    }

    tick(delta) {
        this.theta %= Math.PI * 2
        this.phi %= Math.PI * 2
        this.vTheta %= Math.PI * 2
        this.vPhi %= Math.PI * 2


        this.theta += this.vTheta * delta;
        this.phi += this.vPhi * delta;
        this.vTheta *= this.efficiency;
        this.vPhi *= this.efficiency;
    }
}
class sphereVisual {
    constructor(radius=10,
                numVertices = 10,
                edgeDistance = 1,
                groupRef,
                edgesRef
    ) {
        this.vertices = Array(numVertices).fill(0).map((_) => new spherePoint(Math.random() * 2 * Math.PI,Math.random() * Math.PI,radius))
        this.groupRef = groupRef;
        this.edgesRef = edgesRef;
        this.numVertices = numVertices;
        this.numEdges = numVertices ** 2;
        this.radius = radius
    }

    handleMotion(delta) {

        if (this.vertices.length != this.groupRef.current.children.length) {return;}

        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].accelerate(signedRand(), signedRand(), delta)
            this.vertices[i].tick(delta)

            const cartesian = this.vertices[i].getCartesian()
            this.groupRef.current.children[i].position.setX(cartesian.x)
            this.groupRef.current.children[i].position.setY(cartesian.y)
            this.groupRef.current.children[i].position.setZ(cartesian.z)
        }
        // console.log("num vertices: ", this.vertices.length)
        // console.log("num children: ", this.groupRef.current.children.length);
    }

    updateEdges() {
        if (this.numEdges != this.edgesRef.current.children.length) {
            return;
        }
        let p1
        let p2
        for (let i = 0; i < this.numVertices; i++) {
            p1 = this.vertices[i].getCartesian();
            for (let n = 0; n < this.numVertices; n++) {
                if (i != n) { //update edge from i to n

                    p2 = this.vertices[n].getCartesian();
                    const position = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z])
                    const temp = new BufferAttribute(position, 3)
                    this.edgesRef.current.children[(i * this.numVertices) + n].geometry.setAttribute('position', temp)
                    this.edgesRef.current.children[(i * this.numVertices) + n].material.opacity = Math.min(1, Math.max(0, this.radius - pointDistance(p1,p2)))
                }
            }
        }
    }
}
export default function BackgroundVisual({
    radius = 50,
    numVertices = 50,
    edgeDistance = 1
}) {

    const tempObject = new Object3D()
    const tempObjectEdge = new Object3D()
    const verticesRef = useRef(Array(numVertices).fill(0).map((_) => {
        return new spherePoint(Math.random() * 2 * Math.PI,Math.random() * Math.PI, radius)
    }))
    const edgeRef = useRef()
    const meshRef = useRef()

    useFrame( (state, delta, frame) => {


        //UPDATE VERTICES
        let tempPos;
        for (let i = 0; i < numVertices; i++) {
            verticesRef.current[i].accelerate(signedRand(), signedRand(), delta * 0.1)
            verticesRef.current[i].tick(delta )
            tempPos = verticesRef.current[i].getCartesian()
            tempObject.position.set(...tempPos)
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true //ABSOLUTELY ESSENTIAL
        //END UPDATE VERTICES


        //UPDATE EDGES
        for (let i = 0; i < numVertices; i++) {
            for (let n = i+1; n < numVertices; n++) {
                // edge (i * numVertices) + n represents the edge from vertex i to vertex n
                const pos_i = verticesRef.current[i].getCartesian()
                const pos_n = verticesRef.current[n].getCartesian()

                const dist = pointDistance(new Vector3(...pos_i), new Vector3(...pos_n))

                tempObjectEdge.position.setX(MathUtils.lerp(pos_i[0], pos_n[0], 0.5))
                tempObjectEdge.position.setY(MathUtils.lerp(pos_i[1], pos_n[1], 0.5))
                tempObjectEdge.position.setZ(MathUtils.lerp(pos_i[2], pos_n[2], 0.5))


                if (dist > 15) {
                    tempObjectEdge.scale.setX(0)
                    tempObjectEdge.scale.setY(0)
                    tempObjectEdge.scale.setZ(0)
                } else {
                    tempObjectEdge.scale.setX(dist /100)
                    tempObjectEdge.scale.setY(dist/ 100)
                    tempObjectEdge.scale.setZ(dist)
                    tempObjectEdge.lookAt(...pos_n)
                }
                //what if we put edge at the midpoint between i and n


                tempObjectEdge.updateMatrix();

                edgeRef.current.setMatrixAt((i * numVertices) + n, tempObjectEdge.matrix)
            }
        }
        edgeRef.current.instanceMatrix.needsUpdate = true;

        //END UPDATE EDGES
    })

    return <group>
        <instancedMesh
            args={[null, null, numVertices]}
            ref={meshRef}
        >
            <sphereGeometry args={[1]}/>
            <meshBasicMaterial color={"red"}/>
        </instancedMesh>

        <instancedMesh
            args={[null, null, numVertices * numVertices]}
            ref={edgeRef}
        >
            <boxGeometry args={[1,1,1]}/>
            <meshBasicMaterial color={"blue"}/>

        </instancedMesh>
    </group>

}


