import React, { ChangeEvent, useRef, useState } from "react";
import { styled } from "styled-components";
import { useRecoilState } from "recoil";
import { myInfoState } from "@/store/recoil/accountAtom";
import { useRouter } from "next/navigation";
import { ElementBox, MainBox, SectionBox } from "@/components/atoms/Box";
import Button from "@/components/atoms/Button";
import InputForm from "@/components/molecules/InputForm";
import SummaryTip from "@/components/molecules/SummaryTip";
import { Text } from "@/components/atoms/Text";

export default function MyInfoContents() {
  const router = useRouter();
  //닉네임 중복 체크
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  //차후 useUser로 변환 필요
  const [myInfoForm, setMyInfoForm] = useRecoilState(myInfoState);
  const tipText = useRef<string>(
    `
    To Letter가 우편 배송 기간을 계산할 때 사용하는 도로명 주소
    값으로, 실제 자신의 주소를 입력하지 않아도 괜찮아요!
    `
  );

  const onChangeFormHdr = (e: ChangeEvent<HTMLInputElement>) => {
    setMyInfoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "nickname") setIsNicknameChecked(false);
  };

  const onClickOpenModal = () => {
    router.push("/auth/address");
  };

  return (
    <MainBox $direction="column" $alignItems="flex-start" $width="100%">
      <SectionBox $direction="column" $width="100%" $margin="24px 0">
        <InputForm
          keyValue="inputform-email"
          labelTitle="Email"
          name="email"
          type="text"
          value={myInfoForm.email}
          onChange={onChangeFormHdr}
          isExistButton={false}
          readonly={true}
        />
        <InputForm
          keyValue="inputform-nickname"
          labelTitle="Nickname"
          name="nickname"
          type="text"
          onChange={onChangeFormHdr}
          isExistButton={true}
          buttonTitle="중복 체크"
          value={myInfoForm.nickname}
          onClick={() => {
            setIsNicknameChecked(true);
          }}
          $disable={isNicknameChecked}
        />
        <ElementBox $justifyContent="space-between" $margin="16px 0 0">
          <ElementBox>
            <Text $color="#e9e9e9">MailboxAddress</Text>
            <SummaryTip
              key="addressTip"
              tipText={tipText.current}
              $margin="0 0 0 4px"
              $bottom="-140px"
            />
          </ElementBox>
          <Button
            $width="80px"
            $padding="2px 0"
            title="주소 입력"
            onClick={onClickOpenModal}
          />
        </ElementBox>
        {myInfoForm.address && (
          <FormAddressInput
            $width="100%"
            $padding="8px 0"
            $margin="8px 0 0 0"
            $border="none"
            $backgroundColor="transparent"
          >
            {myInfoForm.address}
          </FormAddressInput>
        )}
      </SectionBox>

      <SectionBox $direction="column" $width="100%">
        <Button
          title="내 정보 수정하기"
          onClick={() => {}}
          $padding="8px 0"
          $margin="0 0 16px 0"
        />
        <Button title="Logout" onClick={() => {}} $padding="8px 0" />
      </SectionBox>
    </MainBox>
  );
}

const FormAddressInput = styled(ElementBox)`
  border-bottom: 1px solid white;
  font-size: 16px;
  color: #ffffff;
`;
