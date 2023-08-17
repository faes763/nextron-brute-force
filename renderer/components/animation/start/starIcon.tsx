import { motion } from "framer-motion-3d";
import { degreesToRadians } from "popmotion";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export function StarIcon({ isLiked, isHover }) {
    const [path,setPath] = useState("");
    useEffect(()=>{
        ipcRenderer.invoke('get-app-path','public/star-icon.glb').then((res)=>{
            setPath(res);
        })
    },[]);
    if(path == "") return null;

    const GLTF = useGLTF('/star-icon.glb');
    return (
    <Canvas
      resize={{ offsetSize: true }}
      style={{ width: '25px', height: '25px' }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
    >
      {lights.map(([x, y, z, intensity], i) => (
        <pointLight
          key={i}
          intensity={intensity}
          position={[x / 8, y / 8, z / 8]}
          color="#fff"
        />
      ))}
      <group  dispose={null}>
        <motion.mesh
        
          geometry={(GLTF as any).nodes.Star.geometry}
          rotation={[Math.PI / 2, 0, degreesToRadians(360)]}
          scale={4}
          animate={[isLiked ? "liked" : "unliked", isHover ? "hover" : ""]}
          variants={{
            unliked: {
              x: [0, 0],
              y: [0, 0],
              scale: 3.9
            },
            liked: {
              x: 5,
              y: [0, -1, 1],
              scale: 3.9,
              transition: { duration: 0.5 }
            },
            hover: {
              rotateZ: 0,
              rotateY: 0.3,
              scale: 4.3,
              transition: {
                rotateZ: { duration: 1.5, ease: "linear", repeat: Infinity }
              }
            }
          }}
        >
          <meshPhongMaterial
            color="#ffdd00"
            emissive="#ff9500"
            specular="#fff"
            shininess={100}
          />
        </motion.mesh>
      </group>
    </Canvas>
  );
}

const lights = [
  [2, 1, 4, 1],
  [8, 0, 4, 1]
];
