import {useRef} from "react";
import {
    MathUtils, Object3D, Raycaster, Vector3,
} from "three";
import {useFrame, useThree} from "@react-three/fiber";
const pointDistance  = (p1, p2) => Math.sqrt(((p1[0] - p2[0]) ** 2) + ((p1[1] - p2[1]) ** 2) + ((p1[2] - p2[2]) ** 2))
class spherePoint {
    constructor(theta, phi, rho) {
        this.theta = theta
        this.phi = phi
        this.rho = rho
        this.vTheta = 0;
        this.vPhi = 0;
        this.efficiency = 0.99;
    }

    getCartesian() {
        return [
            this.rho * Math.cos(this.theta) * Math.sin(this.phi),
            this.rho * Math.sin(this.theta) * Math.sin(this.phi),
            this.rho * Math.cos(this.phi)
        ]
    }

    accelerate(theta_, phi_, delta) {
        this.vTheta += theta_ * delta * 10;
        this.vPhi += phi_ * delta * 10;
    }

    tick(delta) {
        this.theta %= Math.PI * 2
        this.phi %= Math.PI * 2
        this.vTheta %= Math.PI * 2
        this.vPhi %= Math.PI * 2
        this.theta += this.vTheta * delta;
        this.phi += this.vPhi * delta;
        this.vTheta *= this.efficiency;
        this.vPhi *= this.efficiency;
    }
}

export default function BackgroundVisual({
        radius = 50,
        numVertices = 250,
        edgeDistance = 1,
        maxEdgeLen = 25,
    }) {

    const tempObject = new Object3D()
    const tempObjectEdge = new Object3D()
    const verticesRef = useRef(Array(numVertices).fill(0).map((_) => {
        return new spherePoint(MathUtils.randFloat(0, 2)  * Math.PI,MathUtils.randFloat(0, 1) * Math.PI, radius )
    }))
    const edgeRef = useRef()
    const meshRef = useRef()
    const helperRef = useRef()
    const raycaster = useRef(new Raycaster())
    const lastHoverRef = useRef(new Vector3(0,0,0))


    const camera = useThree(state => state.camera)
    const cartesianToSpherical = ({x, y, z}) => {
        let phi = Math.acos(z / Math.sqrt( (x*x) + (y*y) + (z*z) ))
        let theta;
        if ( x > 0) { theta = Math.atan(y/x)}
        else if (x < 0 && y >= 0) { theta = Math.atan(y/x) + Math.PI}
        else if (x < 0 && y < 0) {theta = Math.atan(y/x) - Math.PI}
        else if (x == 0 && y > 0) {theta = Math.PI / 2}
        else if (x == 0 && y < 0) {theta = -Math.PI / 2}
        else {theta = 0}
        return [theta, phi]
    }
    useFrame( (state, delta, frame) => {



        helperRef.current.position.x = lastHoverRef.current.x
        helperRef.current.position.y = lastHoverRef.current.y
        helperRef.current.position.z = lastHoverRef.current.z
        //we now have a way of detecting hovers using vertices and edges
        //maybe we can with transparent sphere instead
        //now, for each vertex, we get the direction from vertex to hover point
        //convert hover point to spherical
        //convert vertex to spherical
        //simply subtract the hover phi,theta from vertex, then apply that delta to acceleration



            //UPDATE VERTICES
        let tempPos;
        for (let i = 0; i < numVertices; i++) {
            verticesRef.current[i].accelerate(MathUtils.randFloatSpread(0.5 ), MathUtils.randFloatSpread(0.5 ), delta )
            verticesRef.current[i].tick(delta )
            tempPos = verticesRef.current[i].getCartesian()
            tempObject.position.set(...tempPos)
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true //ABSOLUTELY ESSENTIAL
        //END UPDATE VERTICES


        //UPDATE EDGES
        for (let i = 0; i < numVertices; i++) {
            for (let n = 0; n < numVertices; n++) {
                // edge i * numVertices + n represents the edge from vertex i to vertex n
                let pos_i
                let pos_n
                let dist;
                if (n > i) {
                    pos_i = verticesRef.current[i].getCartesian()
                    pos_n = verticesRef.current[n].getCartesian()

                    dist = pointDistance(pos_i, pos_n)

                    tempObjectEdge.position.setX(MathUtils.lerp(pos_i[0], pos_n[0], 0.5))
                    tempObjectEdge.position.setY(MathUtils.lerp(pos_i[1], pos_n[1], 0.5))
                    tempObjectEdge.position.setZ(MathUtils.lerp(pos_i[2], pos_n[2], 0.5))
                }

                if (n <= i || dist > 25) {
                    tempObjectEdge.scale.setX(0)
                    tempObjectEdge.scale.setY(0)
                    tempObjectEdge.scale.setZ(0)
                } else {
                    tempObjectEdge.scale.setX((dist-maxEdgeLen) / 200)
                    tempObjectEdge.scale.setY((dist-maxEdgeLen)/ 200)
                    tempObjectEdge.scale.setZ(dist)
                    tempObjectEdge.lookAt(...pos_n)
                }
                tempObjectEdge.updateMatrix();
                edgeRef.current.setMatrixAt((i * numVertices) + n, tempObjectEdge.matrix)
            }
        }
        edgeRef.current.instanceMatrix.needsUpdate = true;

        //END UPDATE EDGES
    })

    return <group>
        <instancedMesh
            args={[null, null, numVertices]}
            ref={meshRef}
            onPointerMove={
                (e) => {lastHoverRef.current = e.point}
            }
        >

            <sphereGeometry args={[0.25]}/>
            <meshBasicMaterial color={"red"}/>
        </instancedMesh>

        <instancedMesh
            args={[null, null, (numVertices * numVertices) - 1]}
            ref={edgeRef}
            onPointerMove={
                (e) => {lastHoverRef.current = e.point}
            }
        >
            <boxGeometry args={[1,1,1]}/>
            <meshBasicMaterial color={"blue"}/>

        </instancedMesh>

        <mesh ref={helperRef}>
            <boxGeometry args={[2,2,2]}/>
            <meshNormalMaterial/>
        </mesh>
    </group>

}


