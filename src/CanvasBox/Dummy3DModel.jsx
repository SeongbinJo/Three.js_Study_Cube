import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

function Dummy3DModel() {
    // const refMesh = useRef()

    // useFrame : 매 프레임이 렌더링되기 직전 호출
    // delta : 이전, 다음 프레임 사이의 경과시간
    // useFrame((state, delta) => {
    //     refMesh.current.rotation.y += 0.007
    // })

    return (
        <>
            <directionalLight position={[1,1,1]} />
            
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="blue" />
            </mesh>
        </>
    )
}

export default Dummy3DModel