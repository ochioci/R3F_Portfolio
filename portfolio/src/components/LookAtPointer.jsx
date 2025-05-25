import * as THREE from "three";
import {useRef} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";
import {Center, Line} from "@react-three/drei";
import {LineGeometry} from "three-stdlib";

export default function LookAtPointer({children, yOffset = 10}) {

    const raycaster = useRef(new THREE.Raycaster())
    const pointer = useRef(new THREE.Vector2())

    const camera = useThree(state => state.camera)

    const groupRef = useRef()
    const lineRef = useRef()


    //what if we get position of child as vector and normalize
    //also get raycaster.current.ray.direction and normalize
    //add these two up

    //make it look at that direction
    useFrame( (state, delta, frame) => {
        raycaster.current.setFromCamera(state.pointer, camera)
        groupRef.current.lookAt(camera.position)
    })


    return <Center><group position={[0,0, 0]} scale={[1,1,1]} ref={groupRef}>

        {children}


        <Line lineWidth={10} color={"blue"} points={[[0,0,0], [10,10,10]]} ref={lineRef}>

        </Line>

    </group>
</Center>
}