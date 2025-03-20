import { Experience } from "./Experience"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Suspense } from "react"

function SidePageModel3({ orbitRef }) {


  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      {/* <color attach="background" args={["#ececec"]} /> */}
      <Suspense>
        <Physics debug gravity={[0, -10, 0]}>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

export default SidePageModel3
