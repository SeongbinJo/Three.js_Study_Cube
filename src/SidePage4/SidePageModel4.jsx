import { Canvas } from "@react-three/fiber"
import { Box, useGLTF } from "@react-three/drei"
import * as THREE from 'three'
import { Suspense } from "react"
import { DirectionalLight } from "three/src/Three.Core.js"
import { OrbitControls } from "@react-three/drei"


function SidePageModel4({ orbitRef }) {

  const BoltModel = () => {
    const { scene } = useGLTF('/GLTFModels/bolt&nut/bolt/scene.gltf')
    return <primitive object={scene} scale={[3, 3, 3]} rotation={[0, 5.5, -1.5]} />
  }

  const NutModel = () => {
    const { scene } = useGLTF('/GLTFModels/bolt&nut/nut/scene.gltf')
    return <primitive object={scene} scale={[0.0015, 0.0015, 0.0015]} rotation={[0, 0, 0]}/>
  }

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <ambientLight intensity={0.5} /> 
      <directionalLight position={[10, 15, -30]} intensity={1} /> 
      <directionalLight position={[-10, -15, 10]} intensity={1} /> 
      <directionalLight position={[20, 30, 30]} intensity={0.7} /> 
      <directionalLight position={[-20, -30, -30]} intensity={0.7} /> 

      <OrbitControls />

      <Suspense fallback={null}>
        <BoltModel />
        <NutModel />
      </Suspense>

    </Canvas>
  )
}

export default SidePageModel4
