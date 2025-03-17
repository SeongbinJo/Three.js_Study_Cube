import { useRef, useEffect } from "react"
import { TransformControls } from "@react-three/drei"
import * as THREE from 'three'

function SidePageModel2({ orbitRef }) {
  const transformRef = useRef(null)
  const boxRef = useRef(null)
  const sphereRef = useRef(null)
  const cylinderRef = useRef(null)

  const box = new THREE.Box3()  // 충돌 감지용 box
  const sphereCenter = new THREE.Vector3()  // Sphere의 중심
  const cylinderBox = new THREE.Box3()  // 원기둥의 bounding box

  // 충돌 감지
  const detectCollision = () => {
    if (boxRef.current && sphereRef.current && cylinderRef.current) {
      // bounding box 계산
      box.setFromObject(boxRef.current)

      // Sphere의 위치와 반지름 계산
      const sphere = sphereRef.current
      sphereCenter.setFromMatrixPosition(sphere.matrixWorld)  // 구체의 중심 위치 계산
      const radius = 0.5  // 구체의 반지름

      // 원기둥의 bounding box 계산
      cylinderBox.setFromObject(cylinderRef.current)

      // 충돌 여부 체크 (Box와 Sphere 간의 충돌)
      const distance = box.distanceToPoint(sphereCenter)
      if (distance < radius) {
        console.log("Box와 Sphere가 충돌했습니다.")
      }

      // 충돌 여부 체크 (Box와 Cylinder 간의 충돌)
      if (box.intersectsBox(cylinderBox)) {
        console.log("Box와 Cylinder가 충돌했습니다.")
      } else {
        console.log("충돌 없음")
      }
    }
  }

  useEffect(() => {
    // 매 프레임마다 충돌 체크
    const interval = setInterval(detectCollision, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <mesh ref={boxRef} position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <TransformControls
        ref={transformRef}
        mode="rotate"
        position={[0, -0.85, 0]}  // TransformControls의 위치
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      >
        <mesh ref={sphereRef} position={[0, 0, 0]}> 
          <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <mesh ref={cylinderRef} position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 2]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </TransformControls>
    </>
  )
}

export default SidePageModel2