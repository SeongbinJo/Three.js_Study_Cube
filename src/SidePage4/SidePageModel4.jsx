import { Canvas, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { OrbitControls } from "@react-three/drei"

function SidePageModel4() {
  const orbitRef = useRef()
  const nutRef = useRef()
  const [isDragging, setIsDragging] = useState(false)

  const isDraggingRef = useRef(isDragging)

  // 최소, 최대 높이 설정
  const minY = 0  // 최소 높이
  const maxY = 0.5   // 최대 높이

  const BoltModel = () => {
    const { scene } = useGLTF('/GLTFModels/bolt&nut/bolt/scene.gltf')
    return <primitive object={scene} scale={[3, 3, 3]} rotation={[0, 5.5, -1.5]} />
  }

  const NutModel = () => {
    const { scene } = useGLTF('/GLTFModels/bolt&nut/nut/scene.gltf')

    return (
      <mesh
        ref={nutRef}
        scale={[0.0015, 0.0015, 0.0015]}
        rotation={nutRef.current ? nutRef.current.rotation : [-0.05, 0, 0.04]}
        onPointerDown={handlePointerDown}
        position={nutRef.current ? nutRef.current.position : [0, 0, 0]}
      >
        <primitive object={scene} />
      </mesh>
    )
  }

  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  useEffect(() => {
    if (!nutRef.current) return

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        setIsDragging(false)
        orbitRef.current.enabled = true
        console.log("드래그 멈춤! (클릭 해제됨)")
      }
    }

    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, orbitRef])

  const handleMouseMove = (event) => {
    if (isDraggingRef.current) {
      // 마우스 좌표 계산 (캔버스 좌표에서 NDC로 변환)
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1.13
  
      console.log(`마우스 좌표 : ${mouseX}, ${mouseY}`)
  
      // 여기에 모델의 위치를 바꾸는 로직 추가
      // 예시로 Y 위치를 화면의 Y 좌표로 결정한다고 가정
      const newY = mouseY * 1  // Y축을 5만큼의 범위로 변환 (조정 가능)
  
      // 최소값과 최대값을 설정하여 Y 위치를 제한
      const constrainedY = Math.max(minY, Math.min(newY, maxY))

      // nutRef의 Y 위치를 제한된 값으로 업데이트
      nutRef.current.position.y = constrainedY

      const rotationSpeed = 60
      nutRef.current.rotation.y = mouseY * rotationSpeed
  
      console.log("드래그 중! Y 위치:", constrainedY)
    }
  }

  const handlePointerDown = () => {
    setIsDragging(true)
    orbitRef.current.enabled = false
    console.log("클릭 상태 유지! (pointerdown 발생)")

    document.addEventListener("mousemove", handleMouseMove)
  }

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, -30]} intensity={1} />
      <directionalLight position={[-10, -15, 10]} intensity={1} />
      <directionalLight position={[20, 30, 30]} intensity={0.7} />
      <directionalLight position={[-20, -30, -30]} intensity={0.7} />

      <OrbitControls ref={orbitRef} />

      <Suspense fallback={null}>
        <BoltModel />
        <NutModel />
      </Suspense>
    </Canvas>
  )
}

export default SidePageModel4