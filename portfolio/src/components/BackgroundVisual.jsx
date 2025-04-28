import {useEffect, useRef, useState} from "react";
import {
    BufferAttribute, BufferGeometry,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Raycaster,
    SphereGeometry,
    Vector3
} from "three";
import {Helper, Instance, Instances, Line} from "@react-three/drei";
import {LineGeometry} from "three-stdlib";
import {invalidate, useFrame} from "@react-three/fiber";

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
        return new Vector3(
            this.rho * Math.cos(this.theta) * Math.sin(this.phi),
            this.rho * Math.sin(this.theta) * Math.sin(this.phi),
            this.rho * Math.cos(this.phi)
        )
    }

    accelerate(theta_, phi_, delta) {
        this.vTheta += theta_ * delta * 10;
        this.vPhi += phi_ * delta * 10;
    }

    tick(delta) {
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
        //meshRef should be a ref to the object which has the vertex meshes as children
        this.vertices = Array(numVertices).fill(0).map((_) => new spherePoint(Math.random() * 2 * Math.PI,Math.random() * Math.PI,radius))
        this.groupRef = groupRef;
        this.edgesRef = edgesRef;
        this.numVertices = numVertices;
        this.numEdges = numVertices ** 2;
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

    //to mutate buffer geometry
// const position = new Float32Array([a.x,a.y,a.z,b.x,b.y,b.z])
// const br =  new BufferAttribute(position, 3)
// br.needsUpdate = true
// mesh.geometry.setAttribute('position', br)
    updateEdges() {
        // console.log("nominal edges:", this.vertices.length ** 2)
        // console.log("real edges: ", this.edgesRef.current.children.length)
        if (this.numEdges != this.edgesRef.current.children.length) {
            return;
        }

        for (let i = 0; i < this.numVertices; i++) {
            for (let n = 0; n < this.numVertices; n++) {

                if (i != n) { //update edge from i to n
                    const p1 = this.vertices[i].getCartesian();
                    const p2 = this.vertices[n].getCartesian();
                    const position = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z])
                    const temp = new BufferAttribute(position, 3)
                    temp.needsUpdate = true;
                    this.edgesRef.current.children[(i * this.numVertices) + n].geometry.setAttribute('position', temp)

                    // const mat = new LineBasicMaterial({color: 0x00FF00, transparent: true})
                    // mat.opacity = 0.1
                    this.edgesRef.current.children[(i * this.numVertices) + n].material.opacity = Math.min(1, Math.max(0, 10 - pointDistance(p1,p2)))
                    this.edgesRef.current.children[(i * this.numVertices) + n].needsUpdate = true
                    // console.log(this.edgesRef.current.children[(i * this.numVertices) + n].material)
                }

            }
        }
    }
}

export default function BackgroundVisual({
    radius = 10,
    numVertices = 25,
    edgeDistance = 1
}) {

    //Goal: Facilitate a visual where a given number of vertices move around the surface of a sphere in a natural motion
    //Edges will be drawn between vertices with opacity greater as the distance is closer to edgeDistance
    //Points will be processed in spherical coordinates and converted into cartesian when necessary

    const groupRef = useRef();
    const edgesRef = useRef();
    const controllerRef = useRef(new sphereVisual(radius, numVertices, edgeDistance, groupRef, edgesRef));

    useFrame((state, delta, frame) => {
        controllerRef.current.handleMotion(delta)

        if (Math.random() > 0.5){
            controllerRef.current.updateEdges()

        }
    })

    //We need to handle the edges. How will we do this?
        //the first numVertices children will correspond to vertex 1
        //then the next numVertices will be for vertex 2
        //and so on
    return <group>
        <group ref={groupRef}>
            {Array(numVertices).fill(0).map((_, index) => {
                return <mesh key={index}>
                    <sphereGeometry args={[0.1]}/>
                    <meshNormalMaterial/>
                </mesh>
            })}
        </group>
        {/*<mesh>*/}
        {/*    <sphereGeometry args={[radius]}/>*/}
        {/*    <meshNormalMaterial/>*/}
        {/*</mesh>*/}
        <group ref={edgesRef}>
            {Array(numVertices ** 2).fill(0).map((_, index) => {
                return <line key={index}>
                    <lineBasicMaterial color={0xFF0000} transparent={true}/>
                    <bufferGeometry>
                        <bufferAttribute
                            needsUpdate
                            attach={"position"}
                            array={new Float32Array(6).fill(0)}
                            itemSize={3}
                        />
                    </bufferGeometry>
                </line>
            })}
        </group>
    </group>
}


//to mutate buffer geometry
// const position = new Float32Array([a.x,a.y,a.z,b.x,b.y,b.z])
// const br =  new BufferAttribute(position, 3)
// br.needsUpdate = true
// mesh.geometry.setAttribute('position', br)
function GetGeometry({data, r}) {

    const out = []
    for (let i = 0; i < data.length; i++) {
        out.push(<mesh position={data[i]} key={i*4}>
            <meshBasicMaterial color={"red"}/>
            <sphereGeometry args={[r]}/>
        </mesh>)
        // out.push(i < data.length-1 ? <Line key={i*4+1} points={ [data[i], data[i + 1]]} color={"black"} lineWidth={5}></Line> : null)
        // out.push(i < data.length-2 ? <Line key={i*4+2} points={[data[i], data[i + 2]]} color={"black"} lineWidth={5}></Line> : null)
        // out.push(i < data.length-3 ? <Line key={i*4+3} points={[data[i], data[i + 3]]} color={"black"} lineWidth={5}></Line> : null)

        out.push(i < data.length - 1 ? <line key={i*4+1}>
            {/*<Helper ></Helper>*/}
            <bufferGeometry>
                <bufferAttribute
                    needsUpdate
                    attach={"position"}
                    array = {new Float32Array(6).fill(0)}
                    itemSize = {3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={"red"}/>
        </line> : null)
        out.push(i < data.length - 2 ? <line key={i * 4 + 2}>
            <bufferGeometry>
                <bufferAttribute
                    needsUpdate
                    attach={"position"}
                    array={new Float32Array(6).fill(0)}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={"red"}/>
        </line> : null)
        out.push(i < data.length - 3 ? <line key={i * 4 + 3}>
            <bufferGeometry>
                <bufferAttribute
                    needsUpdate
                    attach={"position"}
                    array={new Float32Array(6).fill(0)}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={"red"}/>
        </line> : null)

    }
    return out

}
