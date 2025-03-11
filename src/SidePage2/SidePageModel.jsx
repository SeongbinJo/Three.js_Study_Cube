import * as THREE from "three"


function SidePageModel2() {

  return (
    <>
      <mesh position={[0,0,0]}>
        <boxGeometry args={[5, 0.5, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0,-1.75,0]}>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  )
}

export default SidePageModel2


// import { useRef } from "react"
// import { useFrame, useThree } from "@react-three/fiber"
// import * as THREE from "three"
// import { shaderMaterial } from "@react-three/drei"
// import { extend } from "@react-three/fiber"

// // 커스텀 셰이더 생성
// const TransparentShaderMaterial = shaderMaterial(
//   { mouseY: 0, color: new THREE.Color("blue") },
//   // vertex shader
//   `
//     varying vec3 vPosition;
//     void main() {
//       vPosition = position;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   // fragment shader
//   `
//     uniform float mouseY;
//     uniform vec3 color;
//     varying vec3 vPosition;
//     void main() {
//       float opacity = 1.0;
//       float diff = abs(vPosition.y - mouseY);
//       if (diff < 0.25) {
//         opacity = 0.2;
//       }
//       gl_FragColor = vec4(color, opacity);
//     }
//   `
// )

// extend({ TransparentShaderMaterial })

// function SidePageModel() {
//   const ref = useRef()
//   const { mouse, viewport } = useThree()

//   useFrame(() => {
//     if (ref.current) {
//       const y = mouse.y * viewport.height / 2
//       ref.current.uniforms.mouseY.value = y
//     }
//   })

//   return (
//     <>
//       <mesh>
//         <boxGeometry args={[0.5, 5, 0.5]} />
//         <meshStandardMaterial color="white" />
//       </mesh>
//       <mesh>
//         <boxGeometry args={[2, 3, 2]} />
//         <transparentShaderMaterial ref={ref} transparent />
//       </mesh>
//     </>
//   )
// }

// export default SidePageModel