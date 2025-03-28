"use client";

import { ThreeEvent } from "@react-three/fiber";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three";
import * as THREE from "three";
import axiosInterceptor from "@/lib/api/axiosInterceptor";
import { useRouter } from "next/navigation";
import usePointerCursor from "@/hooks/usePointerCursor";
import { useGLTFLoader } from "@/hooks/useGLTFLoader";

const TrashBin = () => {
  const router = useRouter();
  /** 커서 스타일 커스텀 훅 */
  const { handlePointerOver, handlePointerOut } = usePointerCursor();
  /** 의자 glb 모델 */
  const chairglb = useGLTFLoader("/models/trashBin.glb");

  /** 쓰레기통 클릭 함수 */
  const onClickTrashBin = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (
      axiosInterceptor.defaults.headers.common["Authorization"] !== undefined
    ) {
      router.push("/letter/letterdelete/receive");
    }
  };

  /** 쓰레기통 style 변경 */
  useEffect(() => {
    chairglb.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new MeshStandardMaterial({
          color: "#41271f",
        }); // 나무 색상으로 변경
        mesh.castShadow = true; // 그림자 생성
        mesh.receiveShadow = true; // 그림자 수신
      }
    });
  }, [chairglb]);

  return (
    <mesh
      rotation-y={Math.PI / 2}
      scale={1}
      position={[2, -6.5, -1.3]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
      onClick={onClickTrashBin}
    >
      <primitive object={chairglb.scene} />
    </mesh>
  );
};

export default TrashBin;
