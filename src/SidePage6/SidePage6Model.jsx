import { DragControls } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { Canvas, useThree } from "@react-three/fiber"


function SidePage6Model({ id, position, color, type, onClick }) {
    return (
        <RigidBody type={type} restitution={0.1}>
            <mesh userData={{ id, position }} position={position} onClick={onClick}>
    <boxGeometry args={[1,1,1]} />
    <meshStandardMaterial color={color} />
</mesh>
        </RigidBody>
    )
}

export default SidePage6Model