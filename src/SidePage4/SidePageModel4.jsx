import { Canvas } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import * as THREE from 'three'


function SidePageModel4({ orbitRef }) {

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <mesh>
        <Box>
          <meshStandardMaterial args={[1,1,1]}></meshStandardMaterial>
        </Box>
      </mesh>
    </Canvas>
  )
}

export default SidePageModel4
