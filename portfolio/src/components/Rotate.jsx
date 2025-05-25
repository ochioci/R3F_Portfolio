import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function Rotate({children, x=0,y=0.25,z=0}) {

    const groupRef = useRef();

    useFrame((state,delta, frame) => {
        groupRef.current.rotation.x += delta * x;
        groupRef.current.rotation.y += delta * y;
        groupRef.current.rotation.z += delta * z;
    })

    return <group ref={groupRef}>
        {children}
    </group>
}