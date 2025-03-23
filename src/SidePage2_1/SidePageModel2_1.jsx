import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"

function SidePageModel2_1({ orbitRef }) {
  const capsuleRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [capsulePosition] = useState(new THREE.Vector3(0, -1, 0)) // 캡슐의 상수 위치
  const { camera } = useThree()

  const isDraggingRef = useRef(isDragging) // isDragging 상태를 계속 추적할 수 있는 ref

  useEffect(() => {
    isDraggingRef.current = isDragging; // isDragging 상태를 ref에 동기화
  }, [isDragging])

  useEffect(() => {
    if (!capsuleRef.current) return

    const geometry = capsuleRef.current.geometry
    geometry.translate(0, -1, 0)
  }, [])

  useEffect(() => {
    if (!capsuleRef.current) return

    // 마우스 클릭 해제 감지
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        setIsDragging(false)
        orbitRef.current.enabled = true
        console.log("드래그 멈춤! (캡슐 외부에서 클릭 해제됨)")
      }
    }

    // document에서 mouseup 이벤트를 감지하여 드래그 멈춤 처리
    document.addEventListener("mouseup", handleMouseUp)

    // 컴포넌트가 unmount되거나 업데이트 될 때 이벤트 리스너를 제거
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, orbitRef])

  const handlePointerDown = () => {
    setIsDragging(true)
    orbitRef.current.enabled = false
    console.log("클릭 상태 유지! (pointerdown 발생)")

    // pointerdown 이후 document에서 마우스 이동을 추적
    document.addEventListener("mousemove", handleMouseMove)
  }
  // console.log(`마우스 좌표 : ${mouseX}, ${mouseY}`)

  const handleMouseMove = (event) => {
    if (isDraggingRef.current) {
      const capsuleCenter = capsulePosition // 캡슐의 NDC 좌표
  
      // 마우스 좌표 계산 (캔버스 좌표에서 NDC로 변환)
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  
      console.log(`마우스 좌표 : ${mouseX}, ${mouseY}`)
      console.log(`캡슐의 좌표 : ${capsulePosition.x}, ${capsulePosition.y}`)
  
      // 1번 벡터 (캡슐 NDC와 (0, -1) 잇는 선)
      const vectorA = new THREE.Vector2(capsuleCenter.x, capsuleCenter.y - 1)
  
      // 2번 벡터 (캡슐 NDC와 마우스 좌표 잇는 선)
      const vectorB = new THREE.Vector2(mouseX, mouseY)
  
      // 벡터 내적 구하기
      const dotProduct = vectorA.dot(vectorB)
  
      // 각도 구하기 (벡터의 크기 계산)
      const magnitudeA = vectorA.length()
      const magnitudeB = vectorB.length()
  
      // cos(θ) 계산
      let cosTheta = dotProduct / (magnitudeA * magnitudeB)
  
      // cos(θ)가 -1과 1 사이에 있도록 보정
      cosTheta = Math.min(Math.max(cosTheta, -1), 1)
  
      // cos(θ)를 기준으로 각도 계산
      let angle = Math.acos(cosTheta)
  
      // 각도를 70도 이하로 제한 (70도를 라디안 값으로 변환)
      const maxAngle = THREE.MathUtils.degToRad(70) // 70도 -> 라디안
      angle = Math.min(angle, maxAngle) // 각도가 70도보다 크면 70도로 제한
  
      // 벡터 외적을 이용한 회전 방향 확인
      const crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x
  
      // 외적의 부호에 따라 회전 방향 결정
      const rotationDirection = crossProduct > 0 ? 1 : -1
  
      // Z축 회전 각도 계산
      capsuleRef.current.rotation.z = rotationDirection * angle
  
      // 각도를 도(degree)로 변환
      console.log(`각도: ${THREE.MathUtils.radToDeg(angle)}도`)
    } else {
      // console.log("드래그 중 아님..")
    }
  }

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh
        ref={capsuleRef}
        position={capsulePosition} // 상수 위치를 사용
        onPointerDown={handlePointerDown}
      >
        <capsuleGeometry args={[0.5, 2, 32, 100]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  )
}

export default SidePageModel2_1

// import { useRef, useEffect, useState } from "react"
// import * as THREE from "three"

// function SidePageModel2_1() {
//   const capsuleRef = useRef()
//   const animationRef = useRef()
//   const [direction, setDirection] = useState(1)

//   useEffect(() => {
//     if (!capsuleRef.current) return
    
//     const geometry = capsuleRef.current.geometry
//     geometry.translate(0, -1, 0)
//   }, [])

//   useEffect(() => {
//     const rotate = () => {
//       if (capsuleRef.current) {
//         // 현재 회전 각도 (라디안 → 도)
//         let currentAngle = THREE.MathUtils.radToDeg(capsuleRef.current.rotation.z)

//         // 방향 변경 로직
//         if (currentAngle >= 40) setDirection(-1)
//         if (currentAngle <= -40) setDirection(1)

//         // 회전 값 증가 또는 감소
//         capsuleRef.current.rotation.z += THREE.MathUtils.degToRad(1) * direction

//         console.log(`현재 각도: ${currentAngle}°`)
//       }
//       animationRef.current = requestAnimationFrame(rotate)
//     }

//     animationRef.current = requestAnimationFrame(rotate)

//     return () => cancelAnimationFrame(animationRef.current)
//   }, [direction])

//   return (
//     <>
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[6, 0.5, 1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       <mesh ref={capsuleRef} position={[0, -1, 0]}>
//         <capsuleGeometry args={[0.5, 2, 32, 100]} />
//         <meshStandardMaterial color="blue" />
//       </mesh>
//     </>
//   )
// }

// export default SidePageModel2_1