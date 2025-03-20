import { Box, Capsule, OrbitControls, Sphere, Torus } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Scene } from "three/src/Three.Core.js";
import { AxesHelper } from "three/src/Three.Core.js";
import * as THREE from 'three'
import { useState } from "react";


export const Experience = () => {
    const { camera, scene } = useThree()

    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)

    const capsuleRef = useRef()
    const cubeRef = useRef()
    const slide = () => {
        cubeRef.current.applyImpulse({ x: -4, y: 0.1, z: 0 })
    }

    const [rotationDirection, setRotationDirection] = useState(2)
    const collisionRef = useRef(false) // 충돌이 발생했는지 체크

    const handleCollision = (event) => {
        if (collisionRef.current) return // 충돌이 이미 처리 중이라면 리턴
        console.log("쾅!")
        setRotationDirection((prev) => prev * -1)
        collisionRef.current = true // 충돌 상태로 설정
    
        // 일정 시간이 지난 후 충돌 상태를 초기화
        setTimeout(() => {
            collisionRef.current = false // 충돌 상태를 해제
        }, 500) // 예: 500ms 후 충돌 상태 초기화
    };

    useFrame((_state, delta) => {
        const curRotation = quat(capsuleRef.current.rotation())
        const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            delta * rotationDirection
        )
        curRotation.multiply(incrementRotation)
        capsuleRef.current.setNextKinematicRotation(curRotation)
    })

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[-10, 10, 0]} intensity={0.4} />
            <OrbitControls minDistance={20} maxDistance={40}/>

            <RigidBody position={[-3, 0, 0]} colliders="ball" gravityScale={5}>
            <Sphere>
                <meshStandardMaterial color="hotpink" />
            </Sphere>
        </RigidBody>

            <RigidBody position={[3, 0, 2]} colliders="cuboid" ref={cubeRef} enabledTranslations={[false, false, false]} enabledRotations={[false, false, false]}>
                <Box
                    onClick={slide}
                >
                    <meshStandardMaterial color="royalblue" />
                </Box>
            </RigidBody>

            {/* <RigidBody position={[3, 5, 3]} colliders="trimesh">
            <Torus>
                <meshStandardMaterial color="orange" />
            </Torus>
        </RigidBody> */}

            <RigidBody type="kinematicPosition" position={[0, 0, 0]} colliders="trimesh" ref={capsuleRef} onCollisionEnter={handleCollision}>
                <group position={[2, 0, 0]}>
                    <Capsule args={[0.5, 4, 10, 30]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="royalblue" />
                    </Capsule>
                </group>
            </RigidBody>

            {/* <RigidBody type="kinematicPosition" position={[0, 0.75, 0]} ref={capsuleRef}>
            <group position={[2.5, 0, 0]}>
                <Box args={[5, 0.5, 0.5]}>
                    <meshStandardMaterial color="peachpuff" />
                </Box>
            </group>
        </RigidBody> */}

            <RigidBody type="fixed" position={[0, -1, 0]} restitution={0.5}>
                <Box args={[10, 1, 10]}>
                    <meshStandardMaterial color="springgreen" />
                </Box>
            </RigidBody>
        </>
    )
}