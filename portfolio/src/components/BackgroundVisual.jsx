import {useEffect, useRef, useState} from "react";
import {
    BufferGeometry, LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Raycaster,
    SphereGeometry,
    Vector3
} from "three";
import {Instance, Instances, Line} from "@react-three/drei";
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
    // useEffect(() => {
    //     ref.current.children.forEach(child => {
    //         console.log(child.children)
    //     })
    // })

    const dataRef = useRef(data)
    const ref = useRef()

    useEffect( () => {
        let vcount = 0;
        let ecount = 0;
        ref.current.children.forEach((child) => {
            if (child.isLine2 == undefined) {
                console.log("vertex", vcount, child.position)
                vcount++
            } else {
                console.log("edge", ecount, child.geometry.attributes.instanceStart.data.array)
                ecount++
            }
        })

        //the edges that follow the Ith vertex of ref.current.children correspond to the lines
        //which go from vertex I to vertex I+1, then  from vertex I to vertex I+2, then from vertex I to vertex I+3 respectively
        //We go through the vertices first, applying our desired deltas to each one
        //Then, go through the entire list of children
            //for each of the lines we encounter we simply use setPosition or setFromPoints on the line's geometry to update it to the new deltas

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
        out.push(i < data.length-1 ? <Line key={i*4+1} points={ [data[i], data[i + 1]]} color={"black"} lineWidth={5}></Line> : null)
        out.push(i < data.length-2 ? <Line key={i*4+2} points={[data[i], data[i + 2]]} color={"black"} lineWidth={5}></Line> : null)
        out.push(i < data.length-3 ? <Line key={i*4+3} points={[data[i], data[i + 3]]} color={"black"} lineWidth={5}></Line> : null)
    }
    return out

}
