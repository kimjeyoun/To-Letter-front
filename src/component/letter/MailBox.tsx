import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoIosMail } from "react-icons/io"; // 메일 버튼
import useDebounce from "../../hook/useDebounce";
import sessionStorageService from "../../utils/sessionStorageService";
import { getReceiveLetter, getSendLetter } from "../../apis/controller/letter";
import {
  individualLetterState,
  receiveLetterBoxModalState,
} from "../../recoil/letterPopupAtom";
import { useSetRecoilState } from "recoil";
import { toUserNicknameModalState } from "../../recoil/toUserNicknameAtom";

interface Mail {
  id: number;
  sender: string;
  subject: string;
  timeReceived: string;
}

const Mailbox: React.FC = () => {
  const [mails, setMails] = useState<Mail[]>([]);
  const [receiveMails, setReceiveMails] = useState<Mail[]>([]);
  const [sendMails, setSendMails] = useState<Mail[]>([]);

  const [tab, setTab] = useState("received"); // "received" or "send"
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  const setReceiveLetterBoxModal = useSetRecoilState(
    receiveLetterBoxModalState
  );
  const setToUserNicknameModal = useSetRecoilState(toUserNicknameModalState);
  const setIndividualLetterInfo = useSetRecoilState(individualLetterState);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllReceiveLetter();
    getAllSendLetter();
  }, []);
  useEffect(() => {
    searchFilter(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, debouncedSearchTerm, receiveMails, sendMails]);

  // 모달 외부 클릭 감지 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setReceiveLetterBoxModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setReceiveLetterBoxModal]);

  // 받은 편지함
  const getAllReceiveLetter = async () => {
    try {
      const res = await getReceiveLetter();
      const listLetter = res.data.responseData.listLetter;
      const formattedMails = listLetter.map((letter: any) => ({
        id: letter.id,
        sender: letter.fromUserNickname,
        subject: letter.contents,
        timeReceived: letter.arrivedAt,
      }));
      setReceiveMails(formattedMails);
    } catch (err) {
      console.log(err);
    }
  };

  // 보낸 편지함
  const getAllSendLetter = async () => {
    try {
      const res = await getSendLetter();
      const listLetter = res.data.responseData.listLetter;
      const formattedMails = listLetter.map((letter: any) => ({
        id: letter.id,
        sender: letter.fromUserNickname,
        subject: letter.contents,
        timeReceived: letter.arrivedAt,
      }));
      setSendMails(formattedMails);
    } catch (err) {
      console.log(err);
    }
  };

  // 검색어 필터링
  const searchFilter = (type: string) => {
    if (type === "received") {
      const filteredMails = receiveMails.filter(
        (mail) =>
          mail.subject.includes(debouncedSearchTerm) ||
          mail.sender.includes(debouncedSearchTerm)
      );
      setMails(filteredMails);
    } else if (type === "send") {
      const filteredMails = sendMails.filter(
        (mail) =>
          mail.subject.includes(debouncedSearchTerm) ||
          mail.sender.includes(debouncedSearchTerm)
      );
      setMails(filteredMails);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };

  // 편지 쓰기 모달창 이동 이벤트
  const toUserNicknameModalClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // 이벤트 전파 방지
    if (sessionStorageService.get("accessToken") !== null) {
      setReceiveLetterBoxModal(false);
      setToUserNicknameModal(true);
    }
  };

  // 메일 아이템 클릭 이벤트(개별 편지 팝업창)
  const handleMailItemClick = (mail: Mail) => {
    console.log("개별 메일 확인: ", mail);
    setIndividualLetterInfo({
      isOpen: true,
      id: mail.id,
      toUserNickname: mail.sender,
      letterContent: mail.subject,
      fromUserNickname: mail.sender,
      onDelete:false
    });
    setReceiveLetterBoxModal(false);
  };

  return (
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <MailboxWrap>
          <Header>
            <Tab
              $active={tab === "received"}
              onClick={() => handleTabChange("received")}
            >
              받은 편지함
            </Tab>
            <Tab
              $active={tab === "send"}
              onClick={() => handleTabChange("send")}
            >
              보낸 편지함
            </Tab>
            <Exit onClick={() => setReceiveLetterBoxModal(false)}>X</Exit>
          </Header>
          <SearchBar
            placeholder="메일 검색"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <MailList>
            {mails.map((mail) => (
              <MailItem key={mail.id} onClick={() => handleMailItemClick(mail)}>
                <MailItemColumnWrap>
                  <MailItemRowWrap>
                    <Sender>{mail.sender}</Sender>
                    <TimeReceived>{mail.timeReceived}</TimeReceived>
                  </MailItemRowWrap>
                  <Subject>{mail.subject}</Subject>
                </MailItemColumnWrap>
              </MailItem>
            ))}
          </MailList>
          <LetterWriteButton onClick={toUserNicknameModalClick}>
            <IoIosMail />
          </LetterWriteButton>
        </MailboxWrap>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  color: white;
`;

const ModalContent = styled.div`
  background: #000000a6;
  border-radius: 2px;
  width: 430px;
  height: 600px;
  max-width: 100%;
  box-shadow: 1px 1px 1px #0000005c;
  position: relative;
  padding: 20px;
`;

const MailboxWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
`;

const Tab = styled.button<{ $active: boolean }>`
  text-align: center;
  border-radius: 4px;
  font-size: 18px;
  padding: 10px 20px;
  background-color: ${({ $active }) =>
    $active ? "rgba(75, 75, 75, 0.1);" : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "#ccc")};
  border: none;
  cursor: pointer;
  &:hover {
    background-color: rgba(75, 75, 75, 0.1);
    color: #fff;
  }
`;

const Exit = styled.div`
  position: absolute;
  right: -14px;
  top: -14px;
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 10px;
  padding: 12px 0px;
  margin-top: 6px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  font-size: 16px;
  color: #000000;
  background-color: #ffffff;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #848484;
  }
`;

const LetterWriteButton = styled.button`
  position: absolute;
  bottom: -6px;
  left: 386px;
  width: 50px;
  height: 50px;
  background-color: #595858;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #505050;
  }
`;

const MailList = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: #e9e4e4;
    border-radius: 6px;
  }
`;

const MailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
`;

const MailItemColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  height: 100%;
  position: relative;
`;

const MailItemRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  margin-bottom: 5px;
`;

const Sender = styled.div`
  font-weight: bold;
`;

const Subject = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 추가 */
  display: block; /* 추가 */
`;

const TimeReceived = styled.div`
  color: #888;
`;

export default Mailbox;