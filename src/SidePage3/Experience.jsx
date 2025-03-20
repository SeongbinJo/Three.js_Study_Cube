import { Box, OrbitControls, Sphere, Torus } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Scene } from "three/src/Three.Core.js";
import { AxesHelper } from "three/src/Three.Core.js";


export const Experience = () => {
    const { camera, scene } = useThree()

    camera.position.set(20, 12, 10)

    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)

    return (
        <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-10, 10, 0]} intensity={0.4}/>
        <OrbitControls />

        <RigidBody position={[-3, 5, 0]} colliders="ball">
            <Sphere>
                <meshStandardMaterial color="hotpink" />
            </Sphere>
        </RigidBody>

        <RigidBody position={[3, 5, 0]}>
            <Box>
                <meshStandardMaterial color="royalblue" />
            </Box>
        </RigidBody>

        <RigidBody position={[3, 5, 3]} colliders="trimesh">
            <Torus>
                <meshStandardMaterial color="orange" />
            </Torus>
        </RigidBody>
        
        <RigidBody type="fixed" position={[0, -1, 0]} restitution={0.5}>
            <Box  args={[10, 1, 10]}>
                <meshStandardMaterial color="springgreen" />
            </Box>
        </RigidBody>
        </>
    )
}