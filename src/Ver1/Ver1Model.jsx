function Ver1Model({position, color}) {

    return (
        <>
            <mesh position={position}>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </>
    )
}

export default Ver1Model