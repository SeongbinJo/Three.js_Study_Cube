import * as THREE from "three"

function SidePage6Model({ id, position, color }) {
    return (
      <mesh position={position} userData={{ id, position }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
          {/* <lineSegments scale={[1, 1, 1]}> */}
            {/* <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} /> */}
            {/* <lineBasicMaterial attach="material" color="black" /> */}
          {/* </lineSegments> */}
      </mesh>
    )
  }

export default SidePage6Model