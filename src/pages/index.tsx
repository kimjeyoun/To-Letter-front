import { Canvas } from "@react-three/fiber";
import Secen from "../component/Secen";
import { OrbitControls } from "@react-three/drei";
import Index from "../component/account/Index";
import { PopupProvider } from "../context/PopupContext";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountModalState } from "../recoil/accountAtom";
import sessionStorageService from "../utils/sessionStorageService";
import { myPageModalState } from "../recoil/myInfoAtom";
import MyPage from "../component/myPage/MyPage";
import { letterPopupState } from "../recoil/letterPopupAtom";
import LetterPopup from "../component/Room/LetterPopup";

function Home() {
  const [modalState, setModalState] = useRecoilState(accountModalState);
  const [mypageModalState, setMyPageModalState] =
    useRecoilState(myPageModalState);
  const letterPopupModal = useRecoilValue(letterPopupState);

  return (
    <>
      <PopupProvider>
        <Canvas shadows>
          <Secen />
          {sessionStorageService.get("accessToken") === null && (
            <OrbitControls
              minPolarAngle={Math.PI / 2.5} // under
              maxPolarAngle={1.396} // 약 80도
              minAzimuthAngle={-Math.PI / 4} // left
              maxAzimuthAngle={Math.PI / 4} // right
              enablePan={false} // Ctrl 키로 시점 이동 비활성화
              minDistance={3} // 최소 확대 거리
              maxDistance={3} // 최대 축소 거리
            />
          )}
          {sessionStorageService.get("accessToken") !== null && (
            <OrbitControls
              minPolarAngle={Math.PI / 2.8} // under
              maxPolarAngle={1.396} // 약 80도
              minAzimuthAngle={-Math.PI / 4} // left
              maxAzimuthAngle={Math.PI / 4} // right
              enablePan={false} // Ctrl 키로 시점 이동 비활성화
              minDistance={2} // 최소 확대 거리
              maxDistance={2} // 최대 축소 거리
            />
          )}
        </Canvas>
        {modalState.isOpen && <Index />}
        {mypageModalState && <MyPage />}
        {letterPopupModal && <LetterPopup />}
      </PopupProvider>
    </>
  );
}

export default Home;