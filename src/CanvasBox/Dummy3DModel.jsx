function Dummy3DModel() {
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