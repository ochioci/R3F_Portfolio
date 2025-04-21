import {extend, useFrame, useLoader} from '@react-three/fiber'
import {MathUtils, TextureLoader} from 'three'
import {useRef, useState} from "react";
import {FontLoader} from "three-stdlib";
import {Center, Text3D} from "@react-three/drei";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// extend({TextGeometry})

export default function BoxButton (
    {
        texturePath,
        bobbingRange = 1,
        bobbingIncrement = 1,
        rotationIncrementActive = 0.5,
        rotationIncrementInactive = 0.1,
        maxHoverScale = 1.25,
        maxClickScale = 1.5,
        pos: position = {x: 0, y: 0, z: 0},
        label = "Hello, World!",
        size = 5
    }) {

    const t = useLoader(TextureLoader, texturePath)
    const f = useLoader(FontLoader, "/src/assets/Roboto_Bold.json")

    const bobbingState = useRef(false)

    const meshRef = useRef();
    const clickTimeout = useRef(0)

    const isHovered = useRef(false)


    const handleBobbing = (delta) => {
        if (bobbingState.current) {
            meshRef.current.position.y += bobbingIncrement*delta;
            if (meshRef.current.position.y > bobbingRange) {
                bobbingState.current = false
            }
        } else {
            meshRef.current.position.y -= bobbingIncrement*delta;
            if (meshRef.current.position.y < -bobbingRange) {
                bobbingState.current = true;
            }
        }
    }

    const handleRotation = (delta) => {
        meshRef.current.rotation.y += delta * (isHovered.current ? rotationIncrementActive : rotationIncrementInactive)
    }

    const handleResizing = (delta) => {
        //We need a cool ahh way to resize the thingy
        //When our scale is less than the max, we grow it
        //When our scale is greater than the max, we shrink it
        if (clickTimeout.current > 0) {clickTimeout.current = Math.max(clickTimeout.current-delta, 0)}
        const newscale = MathUtils.damp(
            meshRef.current.scale.x,
            clickTimeout.current > 0 ? maxClickScale : isHovered.current ? maxHoverScale : 1,
            0.1,
            delta * 100
        )
        meshRef.current.scale.x = newscale;
        meshRef.current.scale.y = newscale;
        meshRef.current.scale.z = newscale;
    }

    useFrame((state, delta, frame) => {
        handleBobbing(delta)
        handleRotation(delta)
        handleResizing(delta)
    })

    const sz = size;



    return <group
        ref={meshRef}
        position={[position.x, position.y, position.z]}
        onPointerEnter={() => {isHovered.current = true;}}
        onPointerLeave={() => {isHovered.current = false;}}
        onClick={() => {clickTimeout.current=0.25}}
    >
        <mesh>
            <boxGeometry args={[sz, sz, sz]}/>
            <meshBasicMaterial map={t}/>
        </mesh>

        <group position={[0, 0, sz / 2]}>
            <Center>
                <Text3D font={"/src/assets/Roboto_Bold.json"} scale={[1, 1, 1]} position={[0, 0, 0]} bevelEnabled={true}
                        bevelSize={0}
                        bevelOffset={0}
                        size={sz / 10}>
                    {label}
                    <meshNormalMaterial/>
                </Text3D>
            </Center>

        </group>

        <group position={[0, 0, -sz / 2]} scale={[-1, 1, 1]}>
            <Center>
                <Text3D font={"/src/assets/Roboto_Bold.json"} scale={[1, 1, 1]} position={[0, 0, 0]} bevelEnabled={true}
                        size={sz / 10}>
                    {label}
                    <meshNormalMaterial/>
                </Text3D>
            </Center>

        </group>

        <group position={[sz / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Center>
                <Text3D font={"/src/assets/Roboto_Bold.json"} scale={[1, 1, 1]} position={[0, 0, 0]} bevelEnabled={true}
                        size={sz / 10}>
                    {label}
                    <meshNormalMaterial/>
                </Text3D>
            </Center>

        </group>

        <group position={[-sz / 2, 0, 0]} scale={[-1, 1, 1]} rotation={[0, Math.PI / 2, 0]}>
            <Center>
                <Text3D font={"/src/assets/Roboto_Bold.json"} scale={[1, 1, 1]} position={[0, 0, 0]} bevelEnabled={true}
                        size={sz / 10}>
                    {label}
                    <meshNormalMaterial/>
                </Text3D>
            </Center>

        </group>
    </group>
}

