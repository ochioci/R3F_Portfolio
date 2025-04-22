
import {Canvas, extend} from "@react-three/fiber";
import {Center, OrbitControls, Text3D} from "@react-three/drei"
import BoxButton from "./components/BoxButton.jsx";
import {Suspense, useRef} from "react";
import './style.css'
import SphereButton from "./components/SphereButton.jsx";
import FaceCamera from "./components/FaceCamera.jsx";
import MouseMoveControls from "./components/MouseMoveControls.jsx";
// import BoxButton from "./components/BoxButton.jsx"




function App() {


    return <div id="canvas-container">
        <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 5, 10] }}>

            <ambientLight intensity={5}/>
            <Suspense fallback={null}>


                {/*center tag must be inside of FaceCamera*/}
                    <FaceCamera>
                        <Center>
                            <Text3D font={"/src/assets/Roboto_Bold.json"} scale={[1, 1, 1]} position={[0, 5, 0]} rotation={[-0.25, -0.1, 0]} bevelEnabled={true}
                                    bevelSize={0}
                                    bevelOffset={0}
                                    size={5}>
                                Hello, World
                                <meshNormalMaterial/>
                            </Text3D>
                        </Center>
                    </FaceCamera>



            </Suspense>
            <gridHelper args={[100,10]}/>
            <OrbitControls/>
            {/*<MouseMoveControls></MouseMoveControls>*/}
        </Canvas>
    </div>
}


export default App
