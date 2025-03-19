import { useRef, useEffect } from "react"
import { TransformControls } from "@react-three/drei"
import * as THREE from 'three'

function SidePageModel3({ orbitRef }) {


  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

    </>
  )
}

export default SidePageModel3
