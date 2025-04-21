import * as THREE from "three";
import {useRef} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";

export default function FaceCamera({children}) {

    const raycaster = useRef(new THREE.Raycaster())
    const pointer = useRef(new THREE.Vector2())

    const camera = useThree(state => state.camera)

    const groupRef = useRef()

    useFrame( (state, delta, frame) => {
        groupRef.current.lookAt(state.camera.position)
    })


    return <group ref={groupRef}>

        {children}
    </group>
}