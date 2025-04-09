import { DragControls } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { Canvas, useThree } from "@react-three/fiber"


function SidePage6Model({ id, position, color, type, highlight }) {
    return (
      <mesh position={position} userData={{ id, position, type }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
        {highlight && (
          <lineSegments scale={[1, 1, 1]}>
            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial attach="material" color="black" />
          </lineSegments>
        )}
      </mesh>
    )
  }

export default SidePage6Model