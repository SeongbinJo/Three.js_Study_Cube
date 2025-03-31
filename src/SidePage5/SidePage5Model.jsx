function SidePage5Model({position, color}) {

    return (
        <>
            <mesh position={position}>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </>
    )
}

export default SidePage5Model