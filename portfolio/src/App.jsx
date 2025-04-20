
import {Canvas, extend} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import BoxButton from "./components/BoxButton.jsx";
import {Suspense} from "react";
import './style.css'
// import BoxButton from "./components/BoxButton.jsx"
// extend({OrbitControls})

function App() {
    return <div id="canvas-container">
        <Canvas>
            <perspectiveCamera args={[90, window.innerWidth/window.innerHeight, 1, 100]}>
            </perspectiveCamera>
            <Suspense fallback={null}>
                <BoxButton texturePath={"src/assets/img.png"}></BoxButton>

            </Suspense>
            <OrbitControls/>

        </Canvas>
    </div>
}


export default App
