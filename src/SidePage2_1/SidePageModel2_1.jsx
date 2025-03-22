import { useRef, useEffect } from "react"
import { TransformControls } from "@react-three/drei"
import * as THREE from 'three'
import { useState } from "react"

function SidePageModel2_1({ orbitRef }) {

  const capsuleRef = useRef();

  useEffect(() => {
    if (capsuleRef.current) {
      // 캡슐 geometry의 중심을 이동시켜 모델의 회전 축을 변경
      const geometry = capsuleRef.current.geometry;
      geometry.translate(0, -1, 0);  // 중심을 (0, -1, 0)으로 이동시켜 회전 축을 변경

      // 회전 (z축 45도)
      const euler = new THREE.Euler(0, 0, Math.PI / 4, 'XYZ');
      capsuleRef.current.rotation.copy(euler);  // rotation에 Euler 객체 복사
    }
  }, []);

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <TransformControls
        mode="rotate"
        position={[0, -1.2, 0]}  // TransformControls의 위치
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
        showX={false}
        showY={false}
      >
        <mesh ref={capsuleRef} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 2, 32, 100]} /> {/* 캡슐 모델로 대체 */}
          <meshStandardMaterial color="blue" />
        </mesh>
      </TransformControls>
    </>
  )
}

export default SidePageModel2_1
