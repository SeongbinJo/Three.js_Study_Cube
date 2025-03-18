// import { useRef, useEffect } from "react"
// import { TransformControls } from "@react-three/drei"
// import * as THREE from 'three'

// function SidePageModel2({ orbitRef }) {
//   const transformRef = useRef(null)
//   const boxRef = useRef(null)
//   const capsuleRef = useRef(null) // 캡슐 모델을 위한 ref
 


//   return (
//     <>
//       <mesh ref={boxRef} position={[0, 0, 0]}>
//         <boxGeometry args={[6, 0.5, 1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       <TransformControls
//         ref={transformRef}
//         mode="rotate"
//         position={[0, -1, 0]}  // TransformControls의 위치
//         onMouseDown={() => (orbitRef.current.enabled = false)}
//         onMouseUp={() => (orbitRef.current.enabled = true)}
//       >
//         <group>
//           <mesh ref={capsuleRef} position={[0, -1, 0]}>
//             <capsuleGeometry args={[0.5, 2, 32, 100]} /> {/* 캡슐 모델로 대체 */}
//             <meshStandardMaterial color="blue" />
//           </mesh>
//         </group>
//       </TransformControls>
//     </>
//   )
// }

// export default SidePageModel2

import { useRef, useEffect } from "react"
import { TransformControls } from "@react-three/drei"
import * as THREE from 'three'

function SidePageModel2({ orbitRef }) {
  const transformRef = useRef(null)
  const boxRef = useRef(null)
  const capsuleRef = useRef(null) // 캡슐 모델을 위한 ref
  const boxHelperRef = useRef(null)
  const capsuleBoundingBoxRef = useRef(null) // 캡슐의 bounding box

  const box = new THREE.Box3()  // 충돌 감지용 box
  const capsuleCenter = new THREE.Vector3()  // 캡슐의 중심
  const capsuleBox = new THREE.Box3()  // 캡슐의 bounding box

  // 충돌 감지
  const detectCollision = () => {
    if (boxRef.current && capsuleRef.current) {
      // bounding box 계산
      box.setFromObject(boxRef.current)

      // 캡슐의 위치 계산
      const capsule = capsuleRef.current
      capsuleCenter.setFromMatrixPosition(capsule.matrixWorld)  // 캡슐의 중심 위치 계산

      // 캡슐의 bounding box 계산
      capsuleBox.setFromObject(capsuleRef.current)

      // 충돌 여부 체크 (Box와 Capsule 간의 충돌)
      if (box.intersectsBox(capsuleBox)) {
        console.log("Box와 Capsule이 충돌했습니다.")
      } else {
        console.log("충돌 없음")
      }
    }
  }

  useEffect(() => {
    // 바운딩 박스 시각화
    if (boxRef.current) {
      const boxHelper = new THREE.BoxHelper(boxRef.current, 0xffff00)
      boxHelperRef.current = boxHelper
      boxRef.current.add(boxHelper)
    }

    // 캡슐의 bounding box 시각화
    if (capsuleRef.current) {
      const capsule = capsuleRef.current
      // 캡슐의 bounding box 계산이 제대로 수행되도록 보장
      const boundingBox = new THREE.Box3().setFromObject(capsule)
      
      // bounding box 크기 계산
      const size = boundingBox.getSize(new THREE.Vector3())
      console.log(size) // 바운딩 박스 크기 확인

      const boxHelper = new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x, size.y, size.z))
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
      const lines = new THREE.LineSegments(boxHelper, material)
      capsuleBoundingBoxRef.current = lines
      capsule.add(lines)
    }

    // 매 프레임마다 충돌 체크
    const interval = setInterval(detectCollision, 100)

    return () => {
      clearInterval(interval)

      // 컴포넌트가 unmount 될 때, 헬퍼 객체를 제거
      if (boxHelperRef.current) boxRef.current.remove(boxHelperRef.current)
      if (capsuleBoundingBoxRef.current) capsuleRef.current.remove(capsuleBoundingBoxRef.current)
    }
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
        position={[0, -1, 0]}  // TransformControls의 위치
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      >
        <group>
          <mesh ref={capsuleRef} position={[0, -1, 0]}>
            <capsuleGeometry args={[0.5, 2, 32, 100]} /> {/* 캡슐 모델로 대체 */}
            <meshStandardMaterial color="blue" />
          </mesh>
        </group>
      </TransformControls>
    </>
  )
}

export default SidePageModel2