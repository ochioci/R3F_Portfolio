
import {Canvas, extend, useThree} from "@react-three/fiber";
import {Center, OrbitControls, Text3D, Text, Html} from "@react-three/drei"
import BoxButton from "./components/BoxButton.jsx";
import {Suspense, useRef} from "react";
import './style.css'
import SphereButton from "./components/SphereButton.jsx";
import LookAtPointer from "./components/LookAtPointer.jsx";
import MouseMoveControls from "./components/MouseMoveControls.jsx";
import BackgroundVisual from "./components/BackgroundVisual.jsx";
// import BoxButton from "./components/BoxButton.jsx"
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import {BufferAttribute, BufferGeometry, Color, LineBasicMaterial, Vector3} from "three";
import Rotate from "./components/Rotate.jsx";


import {EffectComposer} from '@react-three/postprocessing'
import {Fluid} from '@whatisjery/react-fluid-distortion'


function App() {

    // const scene = useThree()


    return <div id="canvas-container">

        <Canvas  camera={{fov: 75, near: 0.1, far: 1000, position: [0, 5, 100]}}>


                <ambientLight intensity={5}/>
                <Rotate>
                    <BackgroundVisual></BackgroundVisual>
                </Rotate>

                <Html center>
                    <div style={{color: "red", fontSize: "4vh"}}>beckettrandlett.com</div>
                </Html>

                <OrbitControls/>

                <EffectComposer>
                    <Fluid/>
                </EffectComposer>



        </Canvas>
    </div>
}


export default App
