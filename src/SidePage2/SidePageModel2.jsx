import { useRef } from "react"
import { TransformControls } from "@react-three/drei"

function SidePageModel2({ orbitRef }) {
  const transformRef = useRef(null)

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* TransformControls의 위치를 sphere의 중심으로 변경 */}
      <TransformControls
        ref={transformRef}
        mode="rotate"
        position={[0, 0, 1]}  // TransformControls의 위치
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      >
        // TransformControls의 position을 기준으로 mesh의 position이 정해진다~
          <mesh position={[0, 0, 0]}> // TransformControls의 위치를 기준으로 0,0,0
            <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <mesh position={[0, -0.95, 0]}> // TransformControls의 위치를 기준으로 0,-0.95,0
            <cylinderGeometry args={[0.5, 0.5, 2]} />
            <meshStandardMaterial color="blue" />
          </mesh>
      </TransformControls>
    </>
  )
}

export default SidePageModel2