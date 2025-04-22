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

        raycaster.current.setFromCamera(state.pointer, camera)
        // console.log(state.pointer.x, state.pointer.y, state.camera.position.z)
        groupRef.current.lookAt(raycaster.current.ray.direction)
        console.log(raycaster.current.ray.direction)
    })


    return <group ref={groupRef}>

        {children}
    </group>
}