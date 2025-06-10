import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { SketchPicker } from "react-color"
import "../css/InventoryPanel.css"

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
        <div className="inventory-panel">
            <div className="inventory-items">

                <div className="inventory-canvas">
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

                <div className="picker-wrapper">
                    <SketchPicker
                        color={color}
                        disableAlpha
                        presetColors={[]}
                        onChange={handleColorChange}
                        styles={{
                            default: {
                                picker: {
                                    width: '100%',
                                    height: '100%',
                                    boxSizing: 'border-box',
                                },
                            },
                        }}
                    />
                </div>

            </div>

            <div className="swatch-list">
                {swatches.map((swatchColor, index) => (
                    <div key={index}>
                        <div
                            className={`swatch-color ${selectedSwatchIndex === index ? 'selected' : ''}`}
                            style={{ backgroundColor: swatchColor }}
                            onClick={() => {
                                if (selectedSwatchIndex === index) {
                                    setSelectedSwatchIndex(null)
                                } else {
                                    setSelectedSwatchIndex(index)
                                    setColor(swatchColor)
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="inventory-buttons">
                <button onClick={() => {
                    setCreateBoxBtn(true)
                    setShowInventory(prev => !prev)
                }}>
                    블럭 사용하기
                </button>
                <label className="checkbox-label">
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
