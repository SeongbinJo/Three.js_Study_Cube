
import { useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { TransformControls, OrbitControls } from "@react-three/drei"

function SidePageModel2({ orbitRef }) {
  const capsuleRef = useRef()

  return (
    <>
      <mesh position={[0,0,0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <TransformControls
        object={capsuleRef.current}
        mode="rotate"
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      >
        <mesh ref={capsuleRef} position={[0, -1.75, 0]}>
          <capsuleGeometry args={[0.5, 2, 10, 20]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </TransformControls>
    </>
  )
}

export default SidePageModel2
