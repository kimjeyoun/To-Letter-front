"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "../components/canvas/Scene";
import axiosInterceptor from "@/lib/api/axiosInterceptor";
import { useModelLoadingStore } from "@/store/recoil/zustand/modelLoadingStore";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress } = useModelLoadingStore();

  /** kakao 리다이렉션 페이지에서 모달 전환을 위한 파라미터 처리 */
  useEffect(() => {
    if (searchParams.get("modal") === "kakao-signup") {
      router.push("/auth/kakao");
    } else if (searchParams.get("modal") === "login") {
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  useEffect(() => {
    // 모델이 로드되지 않은 상태라면 가이드 페이지로 리다이렉트
    if (progress < 100) {
      router.push("/guide");
      return;
    }

    // 자주 사용되는 모달 경로들을 미리 프리페치
    router.prefetch("/login");
    router.prefetch("/signup");
  }, [progress, router]);

  // 모델이 로드되지 않았다면 빈 화면을 보여줌
  if (progress < 100) return null;

  const isAuthorized =
    axiosInterceptor.defaults.headers.common["Authorization"] !== undefined;

  return (
    <main>
      <Canvas shadows>
        <Scene />
        <OrbitControls
          minPolarAngle={Math.PI / (isAuthorized ? 2.8 : 2.5)}
          maxPolarAngle={1.396}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          enablePan={false}
          minDistance={isAuthorized ? 2 : 3}
          maxDistance={isAuthorized ? 2 : 3}
        />
      </Canvas>
    </main>
  );
}
