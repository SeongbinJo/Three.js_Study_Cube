import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { SketchPicker } from "react-color"

function InventoryPanel({
  color,
  setColor,
  isGrid,
  setIsGrid,
  setBackgroundColor,
  handleColorChange,
  swatches,
  selectedSwatchIndex,
  setSelectedSwatchIndex,
  setCreateBoxBtn,
  setShowInventory
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        backgroundColor: "green",
        padding: "10px",
        borderRadius: "5px",
        maxWidth: "40%",
      }}
    >
      <button
        onClick={() => {
          setCreateBoxBtn(true)
          setShowInventory(prev => !prev)
        }}
      >
        블럭 사용하기
      </button>
      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '6px', marginLeft: '10px', marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={isGrid}
          onChange={() => setIsGrid(prev => !prev)}
        />
        <span>Grid 적용</span>
      </label>
      <button onClick={() => setBackgroundColor(color)}>배경색 적용하기</button>

      <div style={{
        marginTop: "20px",
        backgroundColor: "lightgray",
        borderRadius: "5px",
        width: "100%"
      }}>
        <Canvas camera={{ position: [1, 1, 5], fov: 30 }}>
          <OrbitControls autoRotate enablePan={false} enableZoom={false} />
          <directionalLight position={[10, 15, -30]} />
          <directionalLight position={[10, 30, -30]} />
          <directionalLight position={[20, -20, 30]} />
          <directionalLight position={[-10, 0, 0]} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </Canvas>
      </div>

      <div style={{ display: "flex", marginTop: "20px", gap: "20px", alignItems: "flex-start" }}>
        <SketchPicker color={color} disableAlpha onChange={handleColorChange} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "50px" }}>
          {swatches.map((swatchColor, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div
                onClick={() => {
                  if (selectedSwatchIndex === index) {
                    setSelectedSwatchIndex(null)
                  } else {
                    setSelectedSwatchIndex(index)
                    setColor(swatchColor)
                  }
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: swatchColor,
                  border: selectedSwatchIndex === index ? "3px solid pink" : "1px solid pink",
                  cursor: "pointer"
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InventoryPanel