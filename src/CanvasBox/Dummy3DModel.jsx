function Dummy3DModel() {
    return (
        <>
            <directionalLight position={[1,1,1]} />
            <mesh rotation={[0, 45*Math.PI/180, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="blue" />
            </mesh>
        </>
    )
}

export default Dummy3DModel