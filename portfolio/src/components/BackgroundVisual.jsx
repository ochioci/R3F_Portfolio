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
    const ref = useRef()
    useEffect(() => {
        console.log(ref.current)
    })

    const getGeometry = (data) => {
        const out = []
        for (let i = 0; i < data.length-1; i++) {
            const temp = <group  key={i}>
                <mesh position={data[i]}>
                    <meshBasicMaterial color={"red"}/>
                    <sphereGeometry args={[r]}/>

                </mesh>
                <Line points={[data[i], data[i+1]]} color={"black"} lineWidth={5}></Line>
            </group>

            out.push(temp)
        }
        return out
    }

    return <group ref={ref}>
        {getGeometry(data)}
    </group>
}

