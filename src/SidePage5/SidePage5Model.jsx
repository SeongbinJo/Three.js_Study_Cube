import { RigidBody } from "@react-three/rapier"

function SidePage5Model({ position, color, type }) {

    return (
        <>
            <RigidBody type={type} restitution={0.1}> // restitution : 반탄력
                <mesh position={position}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </RigidBody>

        </>
    )
}

export default SidePage5Model