// Modal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";
import KakaoSignup from "./KakaoSignup";
import MailVerify from "./MailVerify";

interface styleI {
  $selected?: boolean;
}

const Index: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [menuNumber, setMenuNumber] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <MenuWrap>
          <MenuTitle
            $selected={menuNumber === 1}
            onClick={() => setMenuNumber(1)}
          >
            Login
          </MenuTitle>
          <MenuTitle
            $selected={menuNumber !== 1}
            onClick={() => setMenuNumber(2)}
          >
            Signup
          </MenuTitle>
        </MenuWrap>
        {menuNumber === 1 && <Login setMenuNumber={setMenuNumber} />}
        {menuNumber === 2 && (
          <Signup setMenuNumber={setMenuNumber} setEmail={setEmail} />
        )}
        {menuNumber === 3 && <KakaoSignup />}
        {menuNumber === 4 && (
          <MailVerify setMenuNumber={setMenuNumber} email={email} />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Index;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #000000a6;
  border-radius: 2px;
  width: 400px;
  max-width: 100%;
  box-shadow: 1px 1px 1px #0000005c;
`;

const MenuWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  margin: 32px 40px 8px 40px;
`;

const MenuTitle = styled.div<styleI>`
  margin-right: 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  padding: 0 2px 4px 2px;

  ${({ $selected }) => $selected && `border-bottom: 2px solid white;`}
`;
