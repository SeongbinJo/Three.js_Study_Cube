import { useRef } from "react"
import { TransformControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

function SidePageModel2({ orbitRef }) {
  const transformRef = useRef(null)
  const { scene } = useThree()

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <TransformControls
        ref={transformRef}
        mode="rotate"
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      >
        <mesh position={[0, -1, 0]}>
          <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <mesh position={[0, -1.95, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      </TransformControls>

    </>
  )
}

export default SidePageModel2