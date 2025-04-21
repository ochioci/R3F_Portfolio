import {useFrame, useThree} from "@react-three/fiber";
import {useRef} from "react";
import {Vector2, Vector3} from "three";

export default function MouseMoveControls({children}) {
    const camera =  useThree((state) => state.camera)

    const pointerState = useRef({x: null, y: null})

    const velocityState = useRef(new Vector3(0, 0,0))

    const handleMove = (mx, my, camera, delta) => {
        if (!pointerState.current.x || !pointerState.current.y) {
            pointerState.current.x = mx
            pointerState.current.y = my
        } else {
            const dx = pointerState.current.x - mx;
            const dy = pointerState.current.y - my;
            pointerState.current.x = mx;
            pointerState.current.y = my;


            //instead of rotating on the y axis, we instead want to rotate on the y axis mapped according to the camera's orbital angle





            camera.rotation.y += dx * delta * 100
            // camera.rotation.x += dy * delta * 100

        }
    }

    useFrame((state, delta, frame) => {
        handleMove(state.pointer.x, state.pointer.y, state.camera, delta)
    })

    return <group>
    </group>
}