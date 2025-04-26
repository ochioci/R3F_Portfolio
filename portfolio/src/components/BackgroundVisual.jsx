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

export default function BackgroundVisual({
    clusterRadius=100,
    numVertices = 10,
    vertexRadius = 1,
    color = "red",
}) {


    const randSigned = () => Math.random() - 0.5




    //We will create 100 random vertices, each of which will have connections to up to three other vertices
    //connected vertices will have edges drawn to eachother
    //and will try to keep a certain distance from eachother
    //We will generate our vertices into an array
    //And assume there is an edge from each vertex to the next 3 vertices


    const vertices = Array(numVertices).fill(0).map(() => new Vector3(randSigned() * clusterRadius, randSigned() * clusterRadius, randSigned() * clusterRadius));

    return <Vertices data={vertices} r={vertexRadius}></Vertices>

}

function Vertices({data, r}) {
    const dataRef = useRef(data)
    const ref = useRef()

    //the edges that follow the Ith vertex of ref.current.children correspond to the lines
    //which go from vertex I to vertex I+1, then  from vertex I to vertex I+2, then from vertex I to vertex I+3 respectively
    //We go through the vertices first, applying our desired deltas to each one
    //Then, go through the entire list of children
        //for each of the lines we encounter we simply use setPosition or setFromPoints on the line's geometry to update it to the new deltas

    const signedRand = () => Math.random() - 0.5

    useFrame( (state, delta, frame) => {
        let vertices = []
        let edges=[]
        ref.current.children.forEach((child) => {
            if (child.geometry.type == "SphereGeometry") {
                // console.log( child.position)
                child.position.x += signedRand() * delta * 10
                child.position.y += signedRand() * delta* 10
                child.position.z += signedRand() * delta * 10
                vertices.push(child)
                // console.log("vert: ", child)
            } else {
                // console.log("edge", ecount, child.geometry.attributes.instanceStart.data.array)
                // console.log("edge: ", child)
                edges.push(child)

            }
        })
        console.log(edges)
        //adjust edges to match changed vertices

        // const a = vertices[vert].position
        // const b = vertices[vert + 1 + (i % 3)].position
        // edges[i].geometry.setAttribute('position', new BufferAttribute(new Float32Array([a.x,a.y,a.z,b.x,b.y,b.z]), 3))

        let edge = 0
        for (let v = 0; v < vertices.length && edge < edges.length; v++) {
            //vertex v has an edge w the next three vertices

            const a = vertices[v].position
            //
                for (let n = 1; n < 4 && v+n < vertices.length; n++) {
                    const b = vertices[v+n].position


                    // console.log("edge:", edge+n-1, "a:", v, "b:", v+n)
                    const position = new Float32Array([a.x,a.y,a.z,b.x,b.y,b.z])
                    const br =  new BufferAttribute(position, 3)
                    br.needsUpdate = true
                    // br.onUploadCallback = () => {console.log('how')}
                    edges[edge+n-1].geometry.setAttribute('position', br)
                    // edges[edge+n-1].geometry.setIndex(indices)
                    // edges[edge+n-1].geometry.attributes.position.needsUpdate = true
                }
            edge+=3;
        }

        // state.invalidate()
    })

    return <group ref={ref}>
        <GetGeometry data={data} r={r}></GetGeometry>
    </group>
}

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
            <primitive object={new LineBasicMaterial()} attach={"material"}/>
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
            <primitive object={new LineBasicMaterial()} attach={"material"}/>
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
            <primitive object={new LineBasicMaterial()} attach={"material"}/>
        </line> : null)

    }
    return out

}
