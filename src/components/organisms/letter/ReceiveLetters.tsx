// components/organisms/letter/ReceiveLetters.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { individualLetterState } from "@/store/recoil/letterAtom";
import {
  getReceiveLetter,
  getLetterReading,
} from "@/lib/api/controller/letter";
import useDebounce from "@/hooks/useDebounce";
import { LetterList } from "./LetterList";
import { Mail } from "@/types/letterType";
import { useRouter } from "next/navigation";

export function ReceiveLetters() {
  const router = useRouter();
  /** 받은 메일 리스트 관리 state **/
  const [letters, setLetters] = useState<Mail[]>([]);
  /** 무한스크롤을 위한 받은 편지 페이지 관리 state **/
  const [, setPage] = useState(0);
  /** 무한스크롤을 위한 받은 편지 페이지 마지막 여부 관리 state **/
  const [hasMore, setHasMore] = useState(true);
  /** 검색어 관리 state **/
  const [searchTerm, setSearchTerm] = useState("");
  /** 검색어 디바운스 훅 **/
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  /** 개별 편지 정보 관리 state **/
  const setIndividualLetterInfo = useSetRecoilState(individualLetterState);

  /** 받은 편지함 데이터 조회 함수 */
  const getAllReceiveLetters = useCallback(async (pageNumber = 0) => {
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
        viewCheck: letter.viewCheck,
      }));

      setLetters((prevMails) => [...prevMails, ...formattedMails]);

      // 마지막 페이지 체크
      if (listLetter.length < pageable.pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  /** 개별 메일 아이템 클릭 이벤트(개별 편지 팝업창) */
  const handleLetterClick = async (mail: Mail) => {
    setIndividualLetterInfo({
      isOpen: true,
      id: mail.id,
      toUserNickname: mail.sender,
      letterContent: mail.subject,
      fromUserNickname: mail.sender,
      onDelete: false,
      tab: "received",
    });
    await getLetterReading(mail.id);
    router.push("/letter/individualletter");
  };

  /** 무한 스크롤 page 관리 함수 */
  const fetchMore = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getAllReceiveLetters(nextPage);
      return nextPage;
    });
  };

  /** 초기 받은 편지 데이터 로드 */
  useEffect(() => {
    getAllReceiveLetters(0);
  }, [getAllReceiveLetters]);

  /** 검색어 필터링 */
  const filteredLetters = useMemo(
    () =>
      letters.filter(
        (mail) =>
          mail.subject.includes(debouncedSearchTerm) ||
          mail.sender.includes(debouncedSearchTerm)
      ),
    [letters, debouncedSearchTerm]
  );

  return (
    <LetterList
      letters={filteredLetters}
      onLetterClick={handleLetterClick}
      fetchMore={fetchMore}
      hasMore={hasMore}
      searchTerm={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      type="receive"
    />
  );
}