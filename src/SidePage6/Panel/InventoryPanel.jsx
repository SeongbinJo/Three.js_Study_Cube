import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { SketchPicker } from "react-color"
import { useMediaQuery } from "react-responsive"

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
  // 🖥 PC: width >= 1024px
  const isPC = useMediaQuery({ minWidth: 1024 })

  // 📱 Mobile: width < 768px
  const isMobile = useMediaQuery({ maxWidth: 767 })

  // 📱📟 Tablet: 768px <= width < 1024px
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })

  // 공통 스타일
  const panelBaseStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    backgroundColor: "green",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  }

  // 크기 설정
  let width = "80vw"
  let height = "auto"
  let flexDirection = "row"

  if (isMobile) {
    width = "95vw"
    flexDirection = "column"
  } else if (isTablet) {
    width = "80vw"
    flexDirection = "column"
  } else if (isPC) {
    width = "40vw"
    flexDirection = "row"
  }

  return (
    <div style={{ ...panelBaseStyle, width }}>
      <div style={{ display: "flex", flexDirection, gap: "20px", width: "100%", justifyContent: "center" }}>
        {/* Canvas */}
        <div style={{ flex: "1", backgroundColor: "lightgray", borderRadius: "5px" }}>
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

        {/* 색상 선택 도구 */}
        <div style={{ display: "flex", gap: "20px", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          <SketchPicker color={color} disableAlpha onChange={handleColorChange} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {swatches.map((swatchColor, index) => (
              <div key={index} onClick={() => {
                setSelectedSwatchIndex(index)
                setColor(swatchColor)
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
            ))}
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}>
        <button onClick={() => {
          setCreateBoxBtn(true)
          setShowInventory(false)
        }}>블럭 사용하기</button>

        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
          <input
            type="checkbox"
            checked={isGrid}
            onChange={() => setIsGrid(prev => !prev)}
          />
          <span>Grid 적용</span>
        </label>

        <button onClick={() => setBackgroundColor(color)}>배경색 적용하기</button>
      </div>
    </div>
  )
}

export default InventoryPanel
