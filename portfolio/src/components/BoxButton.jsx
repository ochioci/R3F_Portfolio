import {extend, useFrame, useLoader} from '@react-three/fiber'
import {Mesh, AmbientLight , BoxGeometry, MeshStandardMaterial} from "three";
import {TextureLoader} from 'three'
import {useRef, useState} from "react";
extend({Mesh, AmbientLight, BoxGeometry, MeshStandardMaterial})


export default function BoxButton (
    {
        texturePath,
        bobbingRange = 0.5,
        bobbingIncrement = 0.005,
        rotationIncrementActive = 0.02,
        rotationIncrementInactive = 0.005,
        maxScaleHover = 1.25,
        scaleIncrement = 0.01,
        pos = {x: 0, y: 0, z: 0}
    }) {
    
    const t = useLoader(TextureLoader, texturePath)
    const [rotationState, setRotationState] = useState(0)
    const [hoverState, setHoverState] = useState(false)
    const [bobbingState, setBobbingState] = useState(false)
    const [scaleState, setScaleState] = useState(1)
    const [yPos, setYPos] = useState(pos.y)
    
    
    const out = <mesh
        scale={scaleState}
        position={[pos.x, yPos, pos.y]}
        rotation={[rotationState, rotationState, rotationState]}
        onPointerEnter={(e) => setHoverState(true)}
        onPointerLeave={(e) => setHoverState(false)}

    >
        <boxGeometry args={[2, 2, 2]}/>
        <meshBasicMaterial map={t}/>
    </mesh>

    
    const handleBobbing = () => {
        if (bobbingState) {
            setYPos(yPos + bobbingIncrement)
            if (yPos > bobbingRange) {setBobbingState(false)}
        } else {
            setYPos(yPos - bobbingIncrement)
            if (yPos < -bobbingRange) {setBobbingState(true)}
        }
    }
    
    const handleRotation = () => {
        if (hoverState) {
            setRotationState(rotationState+ rotationIncrementActive)
        } else {
            setRotationState(rotationState+ rotationIncrementInactive)
        }
    }
    
    const handleHoverResizing = () => {
        if (hoverState && scaleState <= maxScaleHover) {
            setScaleState(scaleState + scaleIncrement)
        } else if (scaleState >= 1) {
            setScaleState(scaleState - scaleIncrement)
        }
    }

    const handleClickResizing = () => {}
    
    useFrame(() => {
        handleBobbing()
        handleRotation()
        handleHoverResizing()

        
        

    })
    return out
}

