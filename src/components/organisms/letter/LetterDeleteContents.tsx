import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { IoTrashBinSharp } from "react-icons/io5";
import useDebounce from "@/hooks/useDebounce";
import { getReceiveLetter, getSendLetter } from "@/lib/api/controller/letter";
import { useRecoilState } from "recoil";
import { individualLetterState } from "@/store/recoil/letterAtom";
import DeleteConfirmContents from "./DeleteConfirmContents";
import { CgPlayListCheck } from "react-icons/cg";
import useThrottle from "@/hooks/useThrottle";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/router";

interface Mail {
  id: number;
  sender: string;
  subject: string;
  timeReceived: string;
}

const LetterDeleteContents: React.FC = () => {
  const router = useRouter();
  /* 편지 삭제 확인 모달을 관리하는 query */
  const { confirm } = router.query;
  /* 편지 리스트 관리 ref */
  const listRef = useRef<HTMLDivElement>(null);
  /* 편지 리스트 관리 state */
  const [mails, setMails] = useState<Mail[]>([]);
  /* 받은 편지 리스트 관리 state */
  const [receiveMails, setReceiveMails] = useState<Mail[]>([]);
  /* 보낸 편지 리스트 관리 state */
  const [sendMails, setSendMails] = useState<Mail[]>([]);
  /* 검색어 관리 state */
  const [searchTerm, setSearchTerm] = useState("");
  /* 개별 편지 체크박스 상태 관리 state */
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  /* 검색어 디바운스 훅 */
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  /* 삭제할 편지 ID 관리 state */
  const [deleteLetterIds, setDeleteLetterIds] = useState<number[]>([]);
  /* 무한스크롤을 위한 받은 편지 페이지 관리 state */
  const [, setReceivePage] = useState(0);
  /* 무한스크롤을 위한 보낸 편지 페이지 관리 state */
  const [, setSendPage] = useState(0);
  /* 무한스크롤을 위한 받은 편지 페이지 마지막 여부 관리 state */
  const [receiveHasMore, setReceiveHasMore] = useState(true);
  /* 무한스크롤을 위한 보낸 편지 페이지 마지막 여부 관리 state */
  const [sendHasMore, setSendHasMore] = useState(true);
  /* 삭제 완료 확인 및 초기화를 위한 state */
  const [deleteLetter, setDeleteLetter] = useState<boolean>(false);
  /* 개별 편지 내용 관리 state */
  const [individualLetterInfo, setIndividualLetterInfo] = useRecoilState(
    individualLetterState
  );
  /* 편지 삭제 모달 탭 관리 state */
  const [tab, setTab] = useState<"received" | "send">(individualLetterInfo.tab); // "received" or "send"

  /** 편지 삭제 버튼 클릭 시 실행 함수 */
  const openConfirmModal = () => {
    if (deleteLetterIds.length === 0) {
      alert("삭제할 편지를 선택해주세요.");
      return;
    }
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          confirm: "true",
        },
      },
      undefined,
      { shallow: true }
    );
  };

  /** 받은 편지함 데이터 로드 */
  const getAllReceiveLetter = async (pageNumber = 0) => {
    try {
      const res = await getReceiveLetter({
        page: pageNumber,
        size: 10,
        sort: "desc",
      });
      const listLetter = res.data.responseData.letterDTO;
      const pageable = res.data.responseData.pageable;
      const formattedMails = listLetter.map((letter: any) => ({
        id: letter.id,
        sender: letter.fromUserNickname,
        subject: letter.contents,
        timeReceived: letter.arrivedAt,
      }));
      setCheckedState(new Array(formattedMails.length).fill(false));
      setReceiveMails((prevMails) => [...prevMails, ...formattedMails]);
      // pageable 데이터만으로 마지막 페이지 여부 확인
      if (listLetter.length < pageable.pageSize) {
        setReceiveHasMore(false); // 현재 페이지의 데이터가 pageSize보다 적으면 마지막 페이지로 간주
      } else {
        setReceiveHasMore(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /** 보낸 편지함 데이터 로드 함수 */
  const getAllSendLetter = async (pageNumber = 0) => {
    try {
      const res = await getSendLetter({
        page: pageNumber,
        size: 10,
        sort: "desc",
      });
      const listLetter = res.data.responseData.listLetter;
      const pageable = res.data.responseData.pageable;
      const formattedMails = listLetter.map((letter: any) => ({
        id: letter.id,
        sender: letter.fromUserNickname,
        subject: letter.contents,
        timeReceived: letter.arrivedAt,
      }));
      setCheckedState(new Array(formattedMails.length).fill(false));
      setSendMails((prevMails) => [...prevMails, ...formattedMails]);
      // pageable 데이터만으로 마지막 페이지 여부 확인
      if (listLetter.length < pageable.pageSize) {
        setSendHasMore(false); // 현재 페이지의 데이터가 pageSize보다 적으면 마지막 페이지로 간주
      } else {
        setSendHasMore(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /** tab에 따른 검색어 필터링 함수 */
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

  /** 검색어 변경 시 업데이트 함수 */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /** 편지 삭제 모달 탭 변경 시 업데이트 함수 */
  const handleTabChange = (newTab: "received" | "send") => {
    setTab(newTab);
  };

  /** 무한 스크롤 이벤트 핸들러 함수 **/
  const throttledScrollHandler = useThrottle(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        if (tab === "received" && receiveHasMore) {
          setReceivePage((prevPage) => {
            const nextPage = prevPage + 1;
            getAllReceiveLetter(nextPage);
            return nextPage;
          });
        } else if (tab === "send" && sendHasMore) {
          setSendPage((prevPage) => {
            const nextPage = prevPage + 1;
            getAllSendLetter(nextPage);
            return nextPage;
          });
        }
      }
    }
  }, 100);

  /** throttle된 함수를 useMemo로 메모이제이션 */
  const handleScroll = useMemo(
    () => throttledScrollHandler,
    [throttledScrollHandler]
  );

  /** 메일 아이템 클릭 이벤트(개별 편지 팝업창) */
  const handleMailItemClick = (mail: Mail) => {
    setIndividualLetterInfo({
      isOpen: true,
      id: mail.id,
      toUserNickname: mail.sender,
      letterContent: mail.subject,
      fromUserNickname: mail.sender,
      onDelete: true,
      tab: tab,
    });
  };

  /** 전체 선택 버튼 클릭 시 실행 함수 */
  const handleSelectAllClick = () => {
    const allChecked = checkedState.every(Boolean); // 모든 체크박스가 체크되어 있는지 확인
    const newCheckedState = new Array(mails.length).fill(!allChecked);
    setCheckedState(newCheckedState);

    if (!allChecked) {
      // 전체 체크하는 경우: 체크되지 않은 메일의 ID를 추가
      const uncheckedMailIds = mails
        .filter((_, index) => !checkedState[index]) // 체크되지 않은 메일만 필터링
        .map((mail) => mail.id);

      setDeleteLetterIds((prevIds) => [...prevIds, ...uncheckedMailIds]);
    } else {
      // 전체 해제하는 경우: 현재 체크된 모든 메일의 ID를 삭제
      const checkedMailIds = mails.map((mail) => mail.id);
      setDeleteLetterIds((prevIds) =>
        prevIds.filter((id) => !checkedMailIds.includes(id))
      );
    }
  };

  /** 체크박스 상태 변경 시 id값 업데이트 함수 */
  const handleCheckboxChange = (index: number) => {
    const updatedCheckedState = checkedState.map((item, idx) =>
      idx === index ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const selectedMailId = mails[index].id;
    if (updatedCheckedState[index]) {
      // 체크된 경우 메일 ID 추가
      setDeleteLetterIds((prevIds) => [...prevIds, selectedMailId]);
    } else {
      // 체크 해제된 경우 메일 ID 제거
      setDeleteLetterIds((prevIds) =>
        prevIds.filter((id) => id !== selectedMailId)
      );
    }
  };

  /** 편지 삭제 모달 초기화 및 데이터 로드 */
  useEffect(() => {
    setReceiveMails([]);
    setSendMails([]);
    getAllReceiveLetter();
    getAllSendLetter();
  }, [deleteLetter, individualLetterInfo.id]);

  /** 편지 삭제 모달 탭 변경 시 검색어 필터링 */
  useEffect(() => {
    searchFilter(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, debouncedSearchTerm, receiveMails, sendMails]);

  /** 편지 삭제 모달 탭 변경 시 스크롤 초기화 */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [tab]);

  /** 스크롤 이벤트 핸들러 */
  useEffect(() => {
    const currentRef = listRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <ModalOverlay>
      <ModalContent>
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
            <Exit onClick={() => router.push("/")}>X</Exit>
          </Header>
          <SearchBar
            placeholder="메일 검색"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <MailList ref={listRef}>
            {mails.map((mail, index) => (
              <MailItem key={mail.id}>
                <MailCheckBtn
                  key={mail.id}
                  type="checkbox"
                  checked={checkedState[index]} // 개별 체크박스 상태
                  onChange={() => handleCheckboxChange(index)} // 클릭 이벤트
                />
                <MailItemColumnWrap onClick={() => handleMailItemClick(mail)}>
                  <MailItemRowWrap>
                    <Sender>{mail.sender}</Sender>
                    <TimeReceived>{formatDate(mail.timeReceived)}</TimeReceived>
                  </MailItemRowWrap>
                  <Subject>{mail.subject}</Subject>
                </MailItemColumnWrap>
              </MailItem>
            ))}
          </MailList>
          <LetterAllCheck onClick={handleSelectAllClick}>
            <CgPlayListCheck />
          </LetterAllCheck>
          <LetterWriteButton onClick={openConfirmModal}>
            <IoTrashBinSharp />
          </LetterWriteButton>
        </MailboxWrap>
      </ModalContent>
      {confirm === "true" && (
        <DeleteConfirmContents
          mailIds={deleteLetterIds} // state로 관리되는 ID들만 전달
          onClose={() => {
            router.push(
              {
                pathname: router.pathname,
                query: { ...router.query, confirm: undefined },
              },
              undefined,
              { shallow: true }
            );
          }}
          type={tab}
          setSearchTerm={setSearchTerm}
          setDeleteLetter={setDeleteLetter}
        />
      )}
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

const LetterAllCheck = styled.button`
  position: absolute;
  bottom: 52px;
  left: 386px;
  width: 50px;
  height: 50px;
  background-color: #636363;
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
    background-color: #8d8d8d;
  }
`;

const LetterWriteButton = styled.button`
  position: absolute;
  bottom: -6px;
  left: 386px;
  width: 50px;
  height: 50px;
  background-color: #b84d4d;
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
    background-color: #e75252;
  }
`;

const MailList = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

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
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  margin-right: 10px;
  cursor: pointer;
`;

const MailCheckBtn = styled.input.attrs({ type: "checkbox" })`
  /* 기본 체크박스 숨기기 */
  appearance: none;
  margin: 8px;
  min-width: 20px;
  height: 20px;
  border: 2px solid #5a5a5a;
  border-radius: 4px;
  cursor: pointer;

  /* 체크 시 스타일 */
  &:checked {
    background-color: #5a5a5a;
    border-color: #5a5a5a;
  }

  /* 체크 표시 추가 (가상 요소 활용) */
  &:checked::after {
    content: "✔";
    color: white;
    display: block;
    text-align: center;
    margin-top: -2px;
    font-size: 16px;
  }
`;

const MailItemColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  position: relative;
  width: calc(100% - 32px);
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
  max-width: calc(100% - 8px);
  display: block; /* 추가 */
`;

const TimeReceived = styled.div`
  color: #888;
`;

export default LetterDeleteContents;