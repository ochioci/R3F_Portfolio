import * as THREE from "three";
import {useRef} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";

export default function LookAtPointer({children, yOffset = 10}) {

    const raycaster = useRef(new THREE.Raycaster())
    const pointer = useRef(new THREE.Vector2())

    const camera = useThree(state => state.camera)

    const groupRef = useRef()

    useFrame( (state, delta, frame) => {
        raycaster.current.setFromCamera(state.pointer, camera)
        const v =raycaster.current.ray.direction
        v.y -= yOffset
        v.y *= -1
        v.x *= -1
        groupRef.current.lookAt(raycaster.current.ray.direction)
    })


    return <group position={[0,yOffset, 0]} scale={[-1,1,1]} ref={groupRef}>

        {children}
    </group>
}