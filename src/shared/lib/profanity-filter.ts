// 한국어 욕설 필터 유틸리티
// badwords-ko의 주요 욕설 목록 기반

const badWords = [
  "개새끼",
  "개새기",
  "개새",
  "개년",
  "개놈",
  "개자식",
  "개소리",
  "개같",
  "개쓰레기",
  "씨발",
  "시발",
  "씨바",
  "시바",
  "ㅅㅂ",
  "ㅆㅂ",
  "병신",
  "븅신",
  "ㅂㅅ",
  "미친",
  "미쳤",
  "ㅁㅊ",
  "좆",
  "좃",
  "존나",
  "존 나",
  "ㅈㄴ",
  "지랄",
  "ㅈㄹ",
  "니애미",
  "니엄마",
  "애미",
  "엄마없",
  "느금마",
  "느검마",
  "니기미",
  "애비없",
  "에미",
  "에비",
  "창녀",
  "걸레",
  "썅",
  "씹",
  "섹스",
  "sex",
  "fuck",
  "shit",
  "ass",
  "bitch",
  "호로",
  "후레",
  "꺼져",
  "닥쳐",
  "지랄",
  "또라이",
  "미친놈",
  "미친년",
  "정신병자",
  "쓰레기",
  "쓰렉",
  "쓰레기새끼",
];

class ProfanityFilter {
  private badWords: string[];

  constructor() {
    this.badWords = badWords;
  }

  /**
   * 문자열에 욕설이 포함되어 있는지 확인
   */
  isProfane(text: string): boolean {
    if (!text || typeof text !== "string") {
      return false;
    }

    const lowerText = text.toLowerCase().replace(/\s/g, "");

    return this.badWords.some((word) => {
      const lowerWord = word.toLowerCase().replace(/\s/g, "");
      return (
        lowerText.includes(lowerWord) || text.toLowerCase().includes(word.toLowerCase())
      );
    });
  }

  /**
   * 욕설을 *로 치환
   */
  clean(text: string): string {
    if (!text || typeof text !== "string") {
      return text;
    }

    let cleanedText = text;
    this.badWords.forEach((word) => {
      const regex = new RegExp(word, "gi");
      cleanedText = cleanedText.replace(regex, "*".repeat(word.length));
    });

    return cleanedText;
  }

  /**
   * 커스텀 욕설 단어 추가
   */
  addWords(...words: string[]) {
    this.badWords.push(...words);
  }

  /**
   * 욕설 단어 목록 가져오기
   */
  getWords(): string[] {
    return [...this.badWords];
  }
}

export const profanityFilter = new ProfanityFilter();
export default ProfanityFilter;

