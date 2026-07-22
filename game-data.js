(function () {
  "use strict";

  const players = [
    {
      id: "junsu", name: "김준수", age: 38, job: "중소기업 대리", cash: 18000000, housingAsset: 70000000, income: 3900000, incomeRisk: "stable", singleLiving: 1450000, monthlyCommitment: 250000, calm: 6, charm: 4, empathy: 7, reason: 4, courage: 3, appearance: 5, portability: 3, art: 0,
      hook: "공감은 좋지만 결정을 오래 미루는 직장인", flaw: "거절당할까 봐 할 말을 삼킨다",
      needs: [
        { id: "kind", label: "상대를 배려하는 다정한 사람", kind: "behavior", values: ["warm_cautious", "family_centered", "quiet_observer"], points: 1200 },
        { id: "three_children", label: "아이 셋까지 함께 생각하는 사람", kind: "children", min: 3, points: 2400 },
        { id: "natural_body", label: "과장보다 자연스럽고 건강한 체형", kind: "body", values: ["균형 잡힌 체형", "운동으로 탄탄한 체형"], points: 1100 },
        { id: "money_rules", label: "돈 약속을 분명히 하는 사람", kind: "behavior", values: ["practical_planner", "guarded_survivor"], points: 1300 },
        { id: "no_pressure", label: "서로의 속도를 존중하는 사람", kind: "behavior", values: ["warm_cautious", "quiet_observer", "ambitious_independent"], points: 900 }
      ]
    },
    {
      id: "minho", name: "박민호", age: 44, job: "자영업", cash: 32000000, housingAsset: 130000000, income: 5400000, incomeRisk: "business", singleLiving: 1900000, monthlyCommitment: 1200000, calm: 3, charm: 6, empathy: 3, reason: 4, courage: 8, appearance: 6, portability: 4, art: 1,
      hook: "수입은 높지만 사업 고정비와 성급함이 큰 자영업자", flaw: "빨리 확답을 받고 싶어 한다",
      needs: [
        { id: "beautiful", label: "첫눈에 매력적인 사람", kind: "attractiveness", min: 8, points: 1500 },
        { id: "busty", label: "볼륨감 있는 체형", kind: "cup", min: "D", points: 1900 },
        { id: "gap_twenty", label: "20살 이상 나이 차이", kind: "ageGap", min: 20, points: 2600 },
        { id: "family_first", label: "가정을 크게 꾸리고 싶은 사람", kind: "behavior", values: ["family_centered", "warm_cautious"], points: 1400 },
        { id: "three_children", label: "아이 셋 이상을 원하는 사람", kind: "children", min: 3, points: 2500 }
      ]
    },
    {
      id: "taeho", name: "이태호", age: 35, job: "개발자", cash: 25000000, housingAsset: 100000000, income: 5200000, incomeRisk: "stable", singleLiving: 1650000, monthlyCommitment: 450000, calm: 7, charm: 3, empathy: 3, reason: 8, courage: 4, appearance: 4, portability: 8, art: 2,
      hook: "재택 이동은 쉽지만 감정 표현이 서툰 개발자", flaw: "사람의 말을 보고서처럼 듣는다",
      needs: [
        { id: "planner", label: "계획과 숫자로 대화되는 사람", kind: "behavior", values: ["practical_planner", "guarded_survivor"], points: 1400 },
        { id: "career", label: "자기 경력을 계속 키우는 사람", kind: "career", points: 1300 },
        { id: "independent", label: "혼자서도 단단한 독립형", kind: "behavior", values: ["ambitious_independent", "practical_planner"], points: 1300 },
        { id: "no_tattoo", label: "문신이 없는 사람", kind: "tattoo", value: "none", points: 900 },
        { id: "chemistry", label: "친밀한 호흡까지 잘 맞는 사람", kind: "chemistry", min: 75, points: 2100 }
      ]
    },
    {
      id: "seongjin", name: "최성진", age: 49, job: "운송업", cash: 35000000, housingAsset: 160000000, income: 5200000, incomeRisk: "business", singleLiving: 1800000, monthlyCommitment: 1500000, calm: 4, charm: 5, empathy: 5, reason: 4, courage: 7, appearance: 4, portability: 2, art: 3,
      hook: "현금은 많지만 차량·사업비와 나이 차이 부담이 큰 생활형", flaw: "나이 차이를 돈으로 메우려 한다",
      needs: [
        { id: "gap_twenty", label: "20살 이상 나이 차이", kind: "ageGap", min: 20, points: 2700 },
        { id: "affectionate", label: "애정 표현이 확실한 사람", kind: "behavior", values: ["passionate_impulsive", "playful_social"], points: 1200 },
        { id: "busty", label: "볼륨감 있는 체형", kind: "cup", min: "D", points: 1900 },
        { id: "family_first", label: "양가와 가족행사를 중시하는 사람", kind: "behavior", values: ["family_centered"], points: 1600 },
        { id: "children", label: "아이 둘 이상을 원하는 사람", kind: "children", min: 2, points: 1700 }
      ]
    },
    {
      id: "hyunwoo", name: "정현우", age: 41, job: "공무원", cash: 22000000, housingAsset: 90000000, income: 4300000, incomeRisk: "secure", singleLiving: 1550000, monthlyCommitment: 300000, calm: 6, charm: 4, empathy: 6, reason: 7, courage: 5, appearance: 5, portability: 1, art: 4,
      hook: "생활은 안정적이지만 해외 이동이 어려운 공무원", flaw: "한번 의심하면 표정에 다 드러난다",
      needs: [
        { id: "kind", label: "성격이 선하고 책임감 있는 사람", kind: "behavior", values: ["warm_cautious", "family_centered", "guarded_survivor"], points: 1400 },
        { id: "quiet", label: "차분하고 소란스럽지 않은 사람", kind: "behavior", values: ["quiet_observer", "warm_cautious"], points: 1100 },
        { id: "career", label: "한국에서도 일할 의지가 있는 사람", kind: "career", points: 1200 },
        { id: "healthy", label: "함께 생활 관리가 가능한 건강 상태", kind: "health", points: 1100 },
        { id: "language", label: "통역 없이도 대화가 이어지는 사람", kind: "language", min: 70, points: 1500 }
      ]
    },
    {
      id: "dojun", name: "한도준", age: 33, job: "프리랜서 영상편집자", cash: 12000000, housingAsset: 50000000, income: 4500000, incomeRisk: "freelance", singleLiving: 1700000, monthlyCommitment: 150000, calm: 4, charm: 8, empathy: 7, reason: 3, courage: 6, appearance: 8, portability: 9, art: 5,
      hook: "외모와 대화는 강하지만 수입이 들쭉날쭉한 프리랜서", flaw: "좋을 때 쓴 돈을 나중에 계산한다",
      needs: [
        { id: "beautiful", label: "자기 눈에 확실히 매력적인 사람", kind: "attractiveness", min: 8, points: 1500 },
        { id: "fit", label: "운동으로 탄탄한 체형", kind: "body", values: ["운동으로 탄탄한 체형"], points: 1500 },
        { id: "playful", label: "농담과 즉흥 여행이 통하는 사람", kind: "behavior", values: ["playful_social", "passionate_impulsive"], points: 1300 },
        { id: "chemistry", label: "친밀한 호흡이 강하게 맞는 사람", kind: "chemistry", min: 75, points: 2200 },
        { id: "independent", label: "각자의 일과 자유를 존중하는 사람", kind: "behavior", values: ["ambitious_independent", "practical_planner"], points: 1300 }
      ]
    }
  ];

  const shadowDesires = {
    control: {
      id: "control", label: "결정권을 쥐고 싶은 마음", icon: "♜",
      impulse: "상대가 중요한 선택을 자신에게 맡길 때 강하게 끌린다.",
      regulated: "서로 정한 범위 안에서 주도하고, 거절과 수정 권한을 남긴다.",
      distorted: "상대의 돈·일·연락·몸에 대한 선택권까지 대신 결정하려 든다.",
      compatible: ["surrender", "security", "dependence"]
    },
    surrender: {
      id: "surrender", label: "안전한 사람에게 맡기고 싶은 마음", icon: "◐",
      impulse: "믿을 수 있는 상대가 방향을 정해 줄 때 긴장이 풀린다.",
      regulated: "언제든 멈출 수 있는 조건과 범위를 먼저 합의한다.",
      distorted: "불편한 책임까지 상대에게 넘기고 의존을 사랑으로 착각한다.",
      compatible: ["control", "rescue", "certainty"]
    },
    possession: {
      id: "possession", label: "상대의 가장 중요한 사람이 되고 싶은 마음", icon: "◆",
      impulse: "상대가 다른 누구보다 자신을 먼저 선택하길 바란다.",
      regulated: "서로 우선할 순간과 각자의 인간관계를 함께 지킨다.",
      distorted: "질투를 이유로 친구·가족·동료와의 관계를 감시하거나 끊게 한다.",
      compatible: ["adoration", "dependence", "surrender"]
    },
    rescue: {
      id: "rescue", label: "구원자가 되어 필요받고 싶은 마음", icon: "✚",
      impulse: "상대의 문제를 해결해 주며 자기 가치를 확인하고 싶다.",
      regulated: "도움의 한도와 상환·자립 계획을 함께 정한다.",
      distorted: "돈과 희생을 은혜로 남겨 상대가 떠나지 못하게 만든다.",
      compatible: ["security", "escape", "surrender"]
    },
    escape: {
      id: "escape", label: "상대를 통해 다른 삶으로 탈출하고 싶은 마음", icon: "↗",
      impulse: "이 관계가 지금의 답답한 삶을 완전히 바꿔 주길 바란다.",
      regulated: "새 삶의 비용과 책임을 나누고 각자 스스로도 준비한다.",
      distorted: "상대를 사람보다 비자·집·신분·새 출발의 수단으로 본다.",
      compatible: ["rescue", "security", "status"]
    },
    status: {
      id: "status", label: "매력적인 상대를 통해 가치를 증명하고 싶은 마음", icon: "♛",
      impulse: "남들이 부러워할 관계를 통해 자신이 특별하다고 느끼고 싶다.",
      regulated: "서로의 매력을 자랑스러워하되 사생활과 존엄을 지킨다.",
      distorted: "상대를 트로피와 비교표로 만들고 보이는 조건만 관리한다.",
      compatible: ["adoration", "escape", "possession"]
    },
    security: {
      id: "security", label: "사랑으로 생활의 안전까지 보장받고 싶은 마음", icon: "▣",
      impulse: "돈·집·체류가 안정될 때 비로소 사랑받는다고 느낀다.",
      regulated: "수입·부채·생활비를 공개하고 두 사람의 안전망을 함께 만든다.",
      distorted: "애정과 결혼을 경제적 보장의 대가처럼 교환한다.",
      compatible: ["rescue", "certainty", "control"]
    },
    adoration: {
      id: "adoration", label: "조건 없이 선택받고 숭배받고 싶은 마음", icon: "✦",
      impulse: "반복되는 칭찬과 강한 애정 표현으로 자기 가치를 확인하고 싶다.",
      regulated: "필요한 애정 표현을 말하되 상대에게 끝없는 증명을 요구하지 않는다.",
      distorted: "답장·선물·질투를 시험해 사랑을 계속 입증하게 만든다.",
      compatible: ["possession", "status", "rescue"]
    },
    certainty: {
      id: "certainty", label: "상대의 모든 진실을 알아야 안심되는 마음", icon: "◉",
      impulse: "빈칸이 남아 있으면 배신의 가능성부터 떠올린다.",
      regulated: "중요한 사실을 서로 같은 기준으로 확인하고 모를 권리도 인정한다.",
      distorted: "확인을 명분으로 휴대폰·계좌·과거와 사생활 전부를 열람하려 한다.",
      compatible: ["security", "surrender", "control"]
    },
    dependence: {
      id: "dependence", label: "상대가 나 없이는 못 살길 바라는 마음", icon: "∞",
      impulse: "상대가 자신을 절대적으로 필요로 할 때 버려지지 않을 것 같다.",
      regulated: "서로 의지하되 각자의 일·돈·친구와 떠날 자유를 지킨다.",
      distorted: "상대의 자립을 약화시켜 관계 밖 선택지를 없앤다.",
      compatible: ["rescue", "control", "possession"]
    }
  };

  const playerShadowProfiles = {
    junsu: [["rescue", 3], ["adoration", 2]],
    minho: [["control", 4], ["status", 4]],
    taeho: [["certainty", 4], ["control", 3]],
    seongjin: [["rescue", 4], ["dependence", 3]],
    hyunwoo: [["certainty", 4], ["possession", 2]],
    dojun: [["adoration", 4], ["escape", 3]]
  };

  players.forEach(player => {
    player.shadowDesires = (playerShadowProfiles[player.id] || []).map(([id, intensity]) => ({ ...shadowDesires[id], intensity }));
  });

  const countries = [
    { id: "vn", name: "베트남", flag: "🇻🇳", city: "호찌민·다낭", note: "업체 맞선과 앱 만남이 모두 활발하다" },
    { id: "cn", name: "중국", flag: "🇨🇳", city: "칭다오·선양", note: "소개·커뮤니티·직접 교류 노선이 섞여 있다" },
    { id: "th", name: "태국", flag: "🇹🇭", city: "방콕·치앙마이", note: "앱과 현지 장기교류의 비중이 높다" },
    { id: "jp", name: "일본", flag: "🇯🇵", city: "도쿄·오사카", note: "언어교환과 취미 커뮤니티 노선이 많다" },
    { id: "ph", name: "필리핀", flag: "🇵🇭", city: "마닐라·세부", note: "영어 대화가 쉽지만 장거리 판단은 남는다" },
    { id: "kh", name: "캄보디아", flag: "🇰🇭", city: "프놈펜·시엠립", note: "가족·업체·통역사가 관계에 끼기 쉽다" }
  ];

  const routes = [
    { id: "app", name: "언어교환·소개 앱", icon: "📱", initialCost: 49000, expected: "월 5만~30만원 + 항공·체류비", speed: "느림", note: "둘만의 대화가 많다. 프로필 도용과 투자 유도는 직접 걸러야 한다.", tags: ["대화 많음", "신원 확인 중요"] },
    { id: "friend", name: "지인 소개", icon: "🤝", initialCost: 200000, expected: "소개 사례 + 항공·체류비", speed: "보통", note: "공통 지인이 완충 역할을 한다. 지인도 모든 사정을 아는 것은 아니다.", tags: ["공통 지인", "평판 확인"] },
    { id: "broker", name: "현지 맞선 업체", icon: "🏢", initialCost: 3000000, expected: "업체에 내는 평균 비용 1,463만원 + 부대비용", speed: "매우 빠름", note: "후보는 많고 진행이 빠르다. 계약·환불·통역·추가비용을 따로 확인해야 한다.", tags: ["후보 많음", "압박 강함"] },
    { id: "community", name: "취미·교민 커뮤니티", icon: "🌏", initialCost: 100000, expected: "모임·번역·여행비 중심", speed: "느림", note: "자연스럽게 알 수 있다. 평판과 사생활 소문이 뒤섞일 수 있다.", tags: ["자연스러운 만남", "소문 주의"] }
  ];

  const paymentPlans = {
    app: [
      { id: "app-free", name: "무료 체험", price: 0, billing: "7일", badge: "가볍게 시작", perks: ["좋아요 5회", "일반 채팅", "직접 번역"] },
      { id: "app-plus", name: "플러스", price: 19900, billing: "30일", badge: "대화 중심", perks: ["좋아요 무제한", "음성메시지", "자동번역 30회"] },
      { id: "app-premium", name: "프리미엄", price: 59000, billing: "30일", badge: "추천", perks: ["본인확인 후보 우선", "영상통화", "프로필 추가 필터"] }
    ],
    friend: [
      { id: "friend-basic", name: "가벼운 소개", price: 100000, billing: "1회", badge: "식사 포함", perks: ["공통 지인 동석", "연락처 교환", "기본 일정 조율"] },
      { id: "friend-check", name: "확인 포함 소개", price: 350000, billing: "1회", badge: "안심형", perks: ["공통 지인 면담", "기본 신원 확인", "독립 통역 1시간"] }
    ],
    broker: [
      { id: "broker-consult", name: "상담 예약", price: 500000, billing: "예약금", badge: "계약 전", perks: ["후보 4명 열람", "계약서 견적", "현지 일정 상담"] },
      { id: "broker-standard", name: "표준 맞선", price: 3000000, billing: "계약금", badge: "빠른 진행", perks: ["후보 우선 추천", "현지 통역", "맞선 일정 대행"] },
      { id: "broker-premium", name: "프리미엄 맞선", price: 6000000, billing: "계약금", badge: "추천 후보", perks: ["젊은 후보 우선 노출", "영상 프로필", "전담 일정 관리"] }
    ],
    community: [
      { id: "community-free", name: "일반 모임", price: 0, billing: "무료", badge: "자연스러운 만남", perks: ["공개 모임 참가", "개인 채팅", "직접 일정 조율"] },
      { id: "community-event", name: "공식 교류회", price: 80000, billing: "1회", badge: "운영자 확인", perks: ["운영자 확인 회원", "소규모 테이블", "행사 후 연락"] },
      { id: "community-translate", name: "통역 동행 모임", price: 300000, billing: "1회", badge: "대화 지원", perks: ["독립 통역", "문화 설명", "대화 기록 정리"] }
    ]
  };

  const profilePools = {
    names: {
      vn: ["마이", "린", "투", "아인", "응옥", "옌", "흐엉", "짬", "미엔", "란", "비", "하", "타오", "니", "푸엉", "지엠"],
      cn: ["샤오위", "메이린", "뤄시", "옌", "리리", "팅팅", "위에", "징", "신이", "자오", "루루", "칭", "샤오란", "멍", "페이", "나나"],
      th: ["핌", "다오", "수다", "니차", "메이", "폰", "아라야", "칸야", "남", "무크", "파이", "잉", "벨", "눈", "민", "플로이"],
      jp: ["하나", "레이나", "미오", "아키코", "유이", "나나미", "카오리", "마키", "사키", "리호", "아야", "노조미", "마유", "에리", "치하루", "미사키"],
      ph: ["엘레나", "마라", "조이", "그레이스", "베아", "카밀", "리자", "루스", "안젤", "니나", "클레어", "아이비", "셀라", "미카", "트리샤", "제인"],
      kh: ["스레이", "다비", "말리", "소피아", "리나", "찬타", "나리", "보파", "티다", "모니", "비체카", "소카", "칸니카", "말리스", "피어리", "라따나"]
    },
    jobs: ["회계 사무원", "호텔 프런트", "온라인 판매자", "간호 보조", "카페 매니저", "미용사", "의류점 직원", "여행사 직원", "한국어 강사", "무역회사 직원", "식당 매니저", "프리랜서 번역가", "은행 창구 직원", "제과사", "대학원생", "소규모 가게 운영"],
    motives: ["언어교환을 하다 진지한 관계를 생각하게 됐다", "친구의 국제부부를 보며 다른 나라 사람과의 삶을 상상했다", "가족의 소개를 받았지만 마지막 결정은 직접 하고 싶다", "자기 일을 존중해 줄 동반자를 찾고 있다", "이혼 뒤 서두르지 않는 재혼을 원한다", "한국 문화보다 대화가 통하는 사람에게 관심이 생겼다", "고향과 한국을 오가며 살 수 있는 관계를 원한다", "외로움을 숨기지 않고 생활을 함께할 사람을 찾는다"],
    personalities: ["다정하지만 답을 재촉받으면 닫힌다", "장난이 많고 호감 표현이 빠르다", "현실적이고 돈 약속을 분명히 한다", "낯을 가리지만 메시지는 길다", "활달하고 독립심이 강하다", "갈등을 싫어해 싫다는 말을 돌려 한다", "직설적이지만 사과도 빠르다", "관찰력이 좋고 한 말을 오래 기억한다"],
    voices: ["천천히 알아가고 싶어요. 좋은 말보다 행동을 볼게요.", "답장이 늦어도 마음이 없는 건 아니에요. 일할 때는 정말 바빠요.", "나만 확인받는 관계는 싫어요. 당신 이야기도 들려줘요.", "저는 한국에 가는 것만 목표가 아니에요. 제 일도 중요해요.", "처음부터 결혼 이야기만 하면 조금 무서워요.", "농담은 좋아하지만 중요한 약속은 정확히 말해 주세요.", "가족을 도울 수는 있어도 우리 생활이 무너지면 안 돼요.", "사진보다 실제로 만났을 때 편한 사람이 좋아요."],
    boundaries: ["결혼 뒤에도 일을 계속하고 싶다", "아이 계획은 같이 살아 본 뒤 다시 정하고 싶다", "부모에게 보내는 생활비 한도를 함께 정하고 싶다", "결혼을 최소 1년 뒤로 생각한다", "아이 없는 결혼도 가능하다고 생각한다", "양국을 오가는 생활을 원한다", "개인 통장과 공동생활비 통장을 나누고 싶다", "먼저 동거하거나 장거리 연애를 더 해 보고 싶다"],
    interests: ["여행", "요리", "반려동물", "노래방", "산책", "영화", "운동", "카페", "사진", "게임", "패션", "독서", "드라마", "재테크", "베이킹", "캠핑"],
    cities: { vn: ["호찌민", "다낭", "하노이", "껀터"], cn: ["칭다오", "선양", "상하이", "다롄"], th: ["방콕", "치앙마이", "파타야", "콘깬"], jp: ["도쿄", "오사카", "사이타마", "후쿠오카"], ph: ["마닐라", "세부", "다바오", "바기오"], kh: ["프놈펜", "시엠립", "바탐방", "캄퐁참"] }
  };

  const behaviorProfiles = [
    {
      id: "warm_cautious", name: "다정하지만 천천히 마음을 여는 사람",
      publicHint: "답장은 길지만 중요한 결정은 서두르지 않는다",
      responseRhythm: "하루에 두세 번, 생각을 정리한 긴 답장을 보낸다",
      affectionLanguage: "작은 약속을 기억하고 일상을 챙겨 주는 행동",
      conflictStyle: "목소리가 커지면 일단 거리를 둔 뒤 다시 이야기한다",
      moneyStyle: "비상금과 생활비를 나누고 큰돈은 며칠 고민한다",
      independence: "가까운 관계에서도 혼자 보내는 시간이 꼭 필요하다",
      jealousy: "질투는 느끼지만 확인되지 않은 일로 상대를 몰아붙이지 않는다",
      intimacyBoundary: "충분히 안전하다고 느끼기 전에는 신체 이야기를 피한다",
      likedReaction: "바로 답을 재촉하지 않는 태도에 안도해, 조금 생각한 뒤 평소보다 긴 답을 보냈다.",
      dislikedReaction: "표정은 웃고 있었지만 답장이 짧아졌다. 압박이 끝날 때까지 중요한 말은 꺼내지 않았다.",
      likes: ["honest", "space", "practical"], dislikes: ["pressure", "control", "extravagant"]
    },
    {
      id: "playful_social", name: "장난스럽고 사람을 좋아하는 사람",
      publicHint: "농담과 사진을 자주 보내고 답장이 빠른 편이다",
      responseRhythm: "짧은 메시지를 자주 보내며 바로 반응해 주길 기대한다",
      affectionLanguage: "함께 웃는 시간, 즉흥적인 데이트와 가벼운 스킨십",
      conflictStyle: "처음에는 농담으로 넘기다가 참은 말을 한꺼번에 꺼낸다",
      moneyStyle: "경험에는 잘 쓰지만 장기 저축 계획은 자주 미룬다",
      independence: "친구와 가족 모임이 잦고 연인도 함께 어울리길 바란다",
      jealousy: "연락이 갑자기 줄면 마음이 식었다고 오해하기 쉽다",
      intimacyBoundary: "호감 표현은 빠르지만 공개하고 싶지 않은 정보는 분명히 나눈다",
      likedReaction: "장난스러운 이모티콘을 연달아 보내고, 다음에 같이 해 볼 일을 먼저 제안했다.",
      dislikedReaction: "처음에는 농담으로 넘겼지만 곧 말수가 줄었다. 가볍게 보인다는 느낌을 싫어했다.",
      likes: ["humor", "affection", "adventure"], dislikes: ["cold", "control", "interrogation"]
    },
    {
      id: "practical_planner", name: "현실을 먼저 계산하는 계획형",
      publicHint: "감정보다 일정·돈·거주 계획을 구체적으로 묻는다",
      responseRhythm: "바쁠 때는 답장이 늦지만 약속한 시간에는 반드시 연락한다",
      affectionLanguage: "미래 계획을 함께 세우고 약속을 실제 행동으로 옮기는 것",
      conflictStyle: "감정보다 사실을 정리하려 하지만 차갑게 들릴 때가 있다",
      moneyStyle: "예산표와 개인 통장을 중시하고 충동적인 지출을 싫어한다",
      independence: "결혼 뒤에도 자기 직업과 수입을 유지하고 싶어 한다",
      jealousy: "말보다 일정과 행동이 맞지 않을 때 의심한다",
      intimacyBoundary: "건강·피임·아이 계획을 먼저 합의해야 편안해진다",
      likedReaction: "좋다는 말 대신 일정과 비용을 메모했다. 다음 약속을 구체적으로 잡는 것이 그녀의 호감 표현이었다.",
      dislikedReaction: "근거 없는 큰 약속을 들으며 표정이 굳었다. 지킬 날짜와 방법부터 다시 물었다.",
      likes: ["practical", "honest", "ambition"], dislikes: ["extravagant", "evasion", "pressure"]
    },
    {
      id: "quiet_observer", name: "말보다 행동을 오래 보는 관찰형",
      publicHint: "첫인상은 조용하지만 상대가 한 말을 오래 기억한다",
      responseRhythm: "읽고도 바로 답하지 않으며 밤에 천천히 이야기한다",
      affectionLanguage: "말없이 필요한 일을 해 주고 불편한 점을 먼저 알아차리는 것",
      conflictStyle: "쉽게 싸우지 않지만 선을 넘으면 마음을 닫는 시간이 길다",
      moneyStyle: "지출은 적지만 자기 돈의 세부 내역을 쉽게 공개하지 않는다",
      independence: "혼자 결정하고 해결하려는 습관이 강하다",
      jealousy: "표현은 적어도 비교당했다고 느낀 일을 오래 기억한다",
      intimacyBoundary: "신뢰가 충분히 쌓여야 몸과 과거 이야기를 꺼낸다",
      likedReaction: "한참 뒤 짧지만 정확한 답이 돌아왔다. 다음 만남에서 방금 한 말을 그대로 기억하고 있었다.",
      dislikedReaction: "대꾸하며 싸우지는 않았지만 마음을 닫았다. 이후 질문에는 필요한 말만 골라 답했다.",
      likes: ["space", "honest", "care"], dislikes: ["pressure", "brag", "interrogation"]
    },
    {
      id: "family_centered", name: "가족과 관계를 함께 생각하는 사람",
      publicHint: "둘의 감정만큼 양가 가족의 안심과 예의를 중요하게 여긴다",
      responseRhythm: "가족 일정에 따라 연락 시간이 바뀌지만 연락을 끊지는 않는다",
      affectionLanguage: "가족을 존중하고 함께 식사하며 돌봄을 나누는 행동",
      conflictStyle: "둘만의 문제도 가족에게 조언을 구해 갈등이 커질 수 있다",
      moneyStyle: "가족을 돕는 돈을 생활비와 별개의 책임으로 생각한다",
      independence: "중요한 결정에서 가족 의견을 완전히 무시하기 어렵다",
      jealousy: "자신보다 친구나 일을 우선한다고 느끼면 서운함을 크게 표현한다",
      intimacyBoundary: "가족과 미래가 불분명한 관계에서는 친밀한 속도를 늦춘다",
      likedReaction: "둘의 선택이 양가에 어떤 의미인지까지 물었다. 자기 가족에게도 이 대화를 전하고 싶어 했다.",
      dislikedReaction: "자기 가족이 짐처럼 취급됐다고 느껴 목소리가 낮아졌다. 둘만의 문제가 아니라고 선을 그었다.",
      likes: ["care", "honest", "practical"], dislikes: ["family_disrespect", "control", "evasion"]
    },
    {
      id: "ambitious_independent", name: "일과 성장을 포기하지 않는 독립형",
      publicHint: "연애 중에도 일·공부 계획을 우선순위에서 빼지 않는다",
      responseRhythm: "근무 시간에는 연락이 뜸하지만 자기 일정은 미리 알려 준다",
      affectionLanguage: "서로의 목표를 응원하고 능력을 인정해 주는 말",
      conflictStyle: "통제받는다고 느끼면 즉시 반박하고 자기 선택권을 요구한다",
      moneyStyle: "자기 수입과 개인 통장을 지키며 공동비용은 정확히 나눈다",
      independence: "결혼을 위해 경력을 당연히 포기하라는 말을 가장 싫어한다",
      jealousy: "연락보다 신뢰를 중시하지만 자신의 동료 관계를 의심하면 크게 화낸다",
      intimacyBoundary: "친밀감과 결혼 약속을 교환 조건으로 묶지 않는다",
      likedReaction: "자기 일과 목표까지 관계 안에서 존중받는다고 느꼈다. 앞으로의 계획을 먼저 공유했다.",
      dislikedReaction: "선택권을 빼앗는 말에 즉시 반박했다. 사랑과 복종은 다른 것이라고 분명히 말했다.",
      likes: ["ambition", "honest", "space"], dislikes: ["control", "pressure", "family_disrespect"]
    },
    {
      id: "passionate_impulsive", name: "감정이 빠르고 기복도 큰 열정형",
      publicHint: "호감 표현과 미래 이야기가 빠르지만 기분 변화도 눈에 보인다",
      responseRhythm: "좋을 때는 밤새 대화하고 서운하면 답장을 갑자기 줄인다",
      affectionLanguage: "강한 표현, 자주 하는 연락과 특별한 날의 이벤트",
      conflictStyle: "감정을 바로 쏟아낸 뒤 후회하고 먼저 사과하기도 한다",
      moneyStyle: "사랑하는 사람에게는 크게 쓰지만 계획 밖 지출이 잦다",
      independence: "관계가 뜨거울 때는 모든 시간을 함께 보내고 싶어 한다",
      jealousy: "애매한 연락이나 다른 이성 이야기에 반응이 빠르다",
      intimacyBoundary: "신체적 친밀감은 빠를 수 있어도 사적인 과거는 쉽게 말하지 않는다",
      likedReaction: "표정이 단번에 밝아지고 감정을 숨기지 않았다. 바로 다음 약속까지 잡으려 했다.",
      dislikedReaction: "서운함을 곧바로 쏟아냈다가 답장을 끊었다. 진정된 뒤에는 먼저 사과할 여지도 남겼다.",
      likes: ["affection", "adventure", "humor"], dislikes: ["cold", "delay", "interrogation"]
    },
    {
      id: "guarded_survivor", name: "쉽게 믿지 않지만 책임감이 강한 사람",
      publicHint: "좋은 말보다 반복되는 행동과 돈 약속을 오래 확인한다",
      responseRhythm: "개인정보를 묻는 메시지에는 답이 늦고 일상 이야기는 편하게 한다",
      affectionLanguage: "위기 때 도망가지 않고 함께 해결하는 행동",
      conflictStyle: "공격받는다고 느끼면 사실을 숨기고 방어적으로 변한다",
      moneyStyle: "비상금을 중요하게 여기며 빚이나 가족 사정을 말하기 어려워한다",
      independence: "도움을 받아도 언젠가 반드시 갚아야 마음이 편하다",
      jealousy: "배신 가능성에 예민하지만 직접 확인하기 전에는 드러내지 않는다",
      intimacyBoundary: "몸·건강·과거 정보는 명확한 동의와 높은 신뢰 없이는 공유하지 않는다",
      likedReaction: "말보다 다음 행동을 보겠다고 했지만 방어적인 표정이 조금 풀렸다. 작은 사실 하나를 먼저 꺼냈다.",
      dislikedReaction: "예전 경험을 떠올린 듯 즉시 방어적으로 변했다. 안전하다는 확신 전에는 어떤 사정도 더 말하지 않았다.",
      likes: ["honest", "care", "practical"], dislikes: ["pressure", "interrogation", "brag"]
    }
  ];

  const behaviorInnerProfiles = {
    warm_cautious: {
      relationshipNeeds: ["대답을 재촉하지 않는 안전", "작은 약속이 실제로 반복되는 생활"],
      taboo: "거절이나 망설임을 사랑이 없다는 뜻으로 몰아붙이는 것",
      contradiction: "천천히 가고 싶지만, 아주 안전한 사람에게는 선택을 맡기고 싶어 한다.",
      shadowIds: ["surrender", "security"]
    },
    playful_social: {
      relationshipNeeds: ["자주 웃고 반응해 주는 관심", "친구와 일상까지 함께 즐기는 연인"],
      taboo: "자신을 가볍거나 누구에게나 같은 사람으로 취급하는 것",
      contradiction: "자유로운 척하지만 사랑받는다는 증명이 끊기면 질투가 빠르게 올라온다.",
      shadowIds: ["adoration", "possession"]
    },
    practical_planner: {
      relationshipNeeds: ["날짜·돈·역할이 분명한 약속", "자기 경력과 개인 돈의 존중"],
      taboo: "방법과 기한 없이 무엇이든 해 주겠다고 약속하는 것",
      contradiction: "공정한 계획을 원하지만 불안할수록 모든 변수를 자기 손에 두려 한다.",
      shadowIds: ["certainty", "control"]
    },
    quiet_observer: {
      relationshipNeeds: ["침묵을 벌로 해석하지 않는 여유", "말보다 오래 이어지는 행동"],
      taboo: "대답이 느리다는 이유로 휴대폰과 사생활을 확인하는 것",
      contradiction: "혼자 있고 싶어 하면서도 상대가 자신을 가장 먼저 알아봐 주길 바란다.",
      shadowIds: ["possession", "certainty"]
    },
    family_centered: {
      relationshipNeeds: ["양가를 짐이 아니라 삶의 일부로 보는 태도", "돌봄과 가족비용의 공동 책임"],
      taboo: "가족과의 연결을 끊어야 사랑을 증명할 수 있다고 말하는 것",
      contradiction: "가족을 지키려 하지만 때로는 누군가가 모든 부담에서 구해 주길 바란다.",
      shadowIds: ["rescue", "security"]
    },
    ambitious_independent: {
      relationshipNeeds: ["능력과 목표를 진심으로 인정받는 것", "결혼 뒤에도 유지되는 선택권"],
      taboo: "사랑한다면 일과 꿈을 포기해야 한다는 요구",
      contradiction: "독립을 강조하지만 가장 가까운 사람에게만큼은 특별한 존재로 인정받고 싶어 한다.",
      shadowIds: ["status", "adoration"]
    },
    passionate_impulsive: {
      relationshipNeeds: ["강하고 분명한 애정 표현", "갈등 뒤에도 다시 가까워지는 확신"],
      taboo: "감정을 무시한 채 차갑게 연락을 끊는 것",
      contradiction: "뜨겁게 사랑할수록 상대의 시간과 관심도 전부 자기 것이길 바라기 쉽다.",
      shadowIds: ["possession", "adoration"]
    },
    guarded_survivor: {
      relationshipNeeds: ["위기 때 사라지지 않는 행동", "돈과 위험을 숨기지 않는 공동 안전망"],
      taboo: "도움을 준 뒤 빚처럼 기억해 복종을 요구하는 것",
      contradiction: "누구에게도 기대지 않으려 하지만 안전하다고 느끼면 모든 경계를 내려놓고 싶어 한다.",
      shadowIds: ["security", "surrender"]
    }
  };

  behaviorProfiles.forEach(profile => Object.assign(profile, behaviorInnerProfiles[profile.id] || {}));

  const behaviorVoicePacks = {
    warm_cautious: {
      tone: "조용하고 다정한 존댓말. 생각할 시간이 필요하면 솔직히 말한다.",
      initiative: "slow_date",
      lines: {
        hello: "안녕하세요. 답을 빨리 못 해도 무시하는 건 아니에요. 천천히 얘기해도 괜찮죠?",
        daily: "오늘 버스에서 졸다가 내릴 곳을 지나쳤어요. 괜히 당신한테 먼저 말하고 싶었어요.",
        invite: "이번 주말에 조용한 카페 갈래요? 오래 있지 않아도 괜찮아요.",
        pleased: "고마워요. 대답을 기다려 주니까 저도 숨기지 않고 말하고 싶어져요.",
        hurt: "지금 바로 대답하라고 하면… 맞는 말도 못 할 것 같아요. 오늘은 조금 쉬고 싶어요.",
        money: "도와주는 마음은 고마워요. 그래도 금액과 이유를 우리 둘이 먼저 적어 봐요.",
        doubt: "확인이 필요하면 같이 해요. 다만 처음부터 제가 거짓말한다고 정해 놓지는 말아 줘요.",
        apology: "아까는 겁나서 말을 닫았어요. 다시 물어보면 이번에는 끝까지 이야기할게요.",
        marriage: "좋아해요. 그래서 더 천천히, 우리가 지킬 약속부터 정하고 싶어요.",
        married: "오늘은 해결책 말고 제 옆에 십 분만 앉아 있어 줄래요?"
      }
    },
    playful_social: {
      tone: "짧고 빠른 반말 섞인 존댓말. 장난과 이모티콘이 많지만 무시당하면 급격히 식는다.",
      initiative: "spontaneous_date",
      lines: {
        hello: "드디어 답장! 😏 프로필보다 재미없는 사람이면 제가 바로 도망갈 거예요ㅎㅎ",
        daily: "나 방금 침 흘리면서 잤어ㅎㅎ 이건 비밀인데… 이미 말해 버렸네?",
        invite: "오늘 밤 야시장 어때요? 계획은 제가 짤게요. 당신은 웃을 준비만 해요.",
        pleased: "아, 그 대답 좋다! 캡처해 둘래요. 나중에 딴말하면 보여 줄 거예요ㅎㅎ",
        hurt: "농담으로 넘기려고 했는데 솔직히 좀 서운해요. 저를 가볍게 보는 건 싫어요.",
        money: "데이트엔 쓰고 싶죠. 근데 다음 달 라면만 먹는 건 싫으니까 예산 먼저!",
        doubt: "탐정 놀이하는 거예요? 궁금한 건 물어봐요. 몰래 하면 진짜 화낼 거예요.",
        apology: "내가 말 세게 했죠? 미안. 대신 당신도 삐진 얼굴 풀기, 약속!",
        marriage: "결혼식보다 결혼 다음 날이 더 궁금해요. 아침에 누가 먼저 깨울까요?",
        married: "우리 요즘 부부 말고 룸메이트 같아. 오늘은 휴대폰 놓고 나랑 놀아요."
      }
    },
    practical_planner: {
      tone: "간결하고 구체적인 존댓말. 날짜·금액·책임을 문장에 넣으며 빈 약속을 싫어한다.",
      initiative: "budget_talk",
      lines: {
        hello: "반가워요. 서로 원하는 생활과 결혼 시기를 먼저 확인하면 좋겠습니다.",
        daily: "퇴근했습니다. 오늘 지출을 정리했는데 지난주보다 식비가 12% 줄었어요.",
        invite: "토요일 두 시부터 다섯 시까지 괜찮아요. 카페와 산책, 예상 비용은 이 정도예요.",
        pleased: "좋아요. 말뿐 아니라 날짜까지 정했으니 믿을 수 있겠어요.",
        hurt: "그 약속은 방법과 기한이 없어요. 기분 좋은 말보다 가능한 계획을 듣고 싶습니다.",
        money: "사랑과 송금은 다른 문제예요. 받는 사람, 이유, 상한을 확인하고 결정해요.",
        doubt: "의심을 없애려면 확인 항목을 하나씩 정하죠. 서로 같은 기준을 적용하고요.",
        apology: "제가 너무 보고서처럼 말했네요. 기분이 상했다는 것도 사실로 받아들일게요.",
        marriage: "결혼하고 싶습니다. 거주지와 생활비, 경력 계획에 합의한다는 조건으로요.",
        married: "이번 달 적자는 이유가 있어요. 누가 잘못했는지보다 다음 달부터 바꿀 항목을 정해요."
      }
    },
    quiet_observer: {
      tone: "짧고 여백이 많은 존댓말. 즉답하지 않지만 상대의 예전 말을 정확히 기억한다.",
      initiative: "quiet_memory",
      lines: {
        hello: "안녕하세요. 글로 먼저 이야기하고 싶어요. 전화는 조금 긴장돼서요.",
        daily: "비 왔어요. 지난번에 비 냄새 좋아한다고 했죠. 생각났어요.",
        invite: "사람 적은 곳이면… 이번 주에 만날 수 있어요.",
        pleased: "그 말, 기억할게요. …좋은 뜻으로요.",
        hurt: "지금은 더 말하면 싫은 말까지 할 것 같아요. 생각하고 연락할게요.",
        money: "돈 이야기는 필요해요. 하지만 제 통장 전체를 보여 주는 건 아직 어려워요.",
        doubt: "지난번과 오늘 설명이 달라요. 이유를 들으면 이해할 수도 있어요.",
        apology: "말없이 있는 동안 당신을 벌주려던 건 아니에요. 어떻게 말할지 몰랐어요.",
        marriage: "화려한 약속은 못 하겠어요. 그래도 같이 사는 하루는 상상해 봤어요.",
        married: "당신이 힘든 거 알아요. 냉장고에 밥 해 뒀어요. 얘기는 먹고 나서 해요."
      }
    },
    family_centered: {
      tone: "따뜻하지만 가족을 자주 ‘우리’에 포함한다. 예의와 돌봄이 무시되면 단호해진다.",
      initiative: "family_call",
      lines: {
        hello: "반가워요. 우리 엄마가 옆에서 누구랑 이야기하냐고 계속 물어봐요ㅎㅎ",
        daily: "아버지 병원 다녀왔어요. 피곤했는데 조카가 제 머리를 묶어 줘서 웃었어요.",
        invite: "이번엔 제 동생도 잠깐 인사해도 될까요? 그다음엔 우리 둘만 걸어요.",
        pleased: "제 가족 이야기를 부담으로만 듣지 않아 줘서 고마워요. 저도 당신 가족을 알고 싶어요.",
        hurt: "저한테 가족은 떼어 놓을 짐이 아니에요. 그 말을 쉽게 하면 저도 함께 밀려난 기분이에요.",
        money: "부모님을 돕고 싶어요. 그렇다고 우리 집 생활비가 없어질 만큼 보내겠다는 뜻은 아니에요.",
        doubt: "우리 가족에게 직접 확인해도 괜찮아요. 다만 사람들 앞에서 망신 주듯 묻지는 말아 줘요.",
        apology: "우리 엄마 말만 듣고 당신 뜻을 놓쳤어요. 다음 결정은 둘이 먼저 할게요.",
        marriage: "당신과 가족이 되고 싶어요. 양가가 완벽히 같을 순 없어도 서로 무시하지 않았으면 해요.",
        married: "오늘 엄마 전화가 길었죠. 다음엔 우리 저녁 시간부터 지키겠다고 말할게요."
      }
    },
    ambitious_independent: {
      tone: "자신감 있고 직설적이다. 애정 표현에도 일과 선택권을 포기하지 않는다는 전제가 있다.",
      initiative: "career_offer",
      lines: {
        hello: "안녕하세요. 먼저 말할게요. 저는 결혼 때문에 일을 그만둘 생각은 없어요.",
        daily: "오늘 제안서 통과했어요. 축하해 줘요. 당신에게 제일 먼저 말하는 거예요.",
        invite: "제 발표 끝나고 저녁 먹을래요? 일하는 제 모습도 보여 주고 싶어요.",
        pleased: "제 목표를 경쟁 상대로 보지 않아서 좋아요. 당신 계획도 제대로 듣고 싶어요.",
        hurt: "걱정이라는 말로 제 선택을 대신 정하지 마세요. 저는 배우자를 찾지, 보호자를 찾는 게 아니에요.",
        money: "각자 번 돈과 함께 쓸 돈을 나누죠. 독립은 숨김이 아니라 책임이에요.",
        doubt: "검증은 서로 하면 돼요. 제 직장만 확인하지 말고 당신 빚과 소득도 보여 주세요.",
        apology: "내 권리를 지키려다 당신 마음까지 공격했네요. 그 부분은 미안해요.",
        marriage: "같이 가고 싶어요. 단, 둘 중 누구도 자기 인생을 입장료로 내지 않는 결혼이어야 해요.",
        married: "저도 지쳤어요. 집안일을 도와주는 게 아니라 당신 몫을 맡아 주세요."
      }
    },
    passionate_impulsive: {
      tone: "감정 표현이 크고 빠르며 미래형 문장을 자주 쓴다. 서운하면 연락 온도가 바로 달라진다.",
      initiative: "surprise_confession",
      lines: {
        hello: "사진 보고 그냥 지나가려다가 다시 돌아왔어요. 이상하죠? 벌써 궁금해졌어요.",
        daily: "오늘 달 봤어요? 같은 달 보는 거 생각하니까 갑자기 보고 싶어졌어요.",
        invite: "내일 와요. 너무 갑자기인가? 그래도 보고 싶은데 어떡해요.",
        pleased: "진짜요? 나 지금 너무 좋아서 혼자 웃고 있어요. 책임져요.",
        hurt: "나는 이렇게 솔직한데 왜 당신은 자꾸 한 발 뒤에 있어요? 혼자 좋아하는 기분 싫어요.",
        money: "돈은 다시 벌 수 있잖아요. 오늘을 놓치는 게 더 아까워요… 그래도 당신이 불안하면 줄일게요.",
        doubt: "또 의심해요? 차라리 지금 영상통화 해요. 내 표정 보고 말해요.",
        apology: "아까는 화가 먼저 나왔어요. 사실은 당신이 멀어질까 봐 무서웠어요.",
        marriage: "나 당신이랑 결혼하고 싶어요. 예쁜 날만 아니라 싸운 다음 날도 같이 있고 싶어요.",
        married: "우리 이렇게 차갑게 살려고 결혼한 거 아니잖아요. 오늘은 꼭 안아 줘요."
      }
    },
    guarded_survivor: {
      tone: "평범한 일상은 편하게 말하지만 돈·과거·신원 질문에는 경계가 선다. 행동을 오래 본 뒤 조금씩 연다.",
      initiative: "small_test",
      lines: {
        hello: "안녕하세요. 좋은 말은 많이 들어 봤어요. 이번에는 서로 행동을 천천히 보면 좋겠어요.",
        daily: "오늘 가게 전기가 나갔는데 혼자 고쳤어요. 이런 날은 제가 꽤 쓸모 있는 사람 같아요.",
        invite: "비싼 곳 말고 제가 아는 식당에 갈래요? 사람 많은 곳이 저는 편해요.",
        pleased: "왜 그런지 묻고 기다려 줬네요. 조금은 더 말해도 괜찮을 것 같아요.",
        hurt: "전에 믿었던 사람이 제 말을 무기로 썼어요. 지금 방식이면 아무것도 더 말할 수 없어요.",
        money: "돈이 필요하다고 해도 바로 보내지 마세요. 저도 증명할 수 있는 것부터 보여 줄게요.",
        doubt: "확인해도 돼요. 저도 당신을 확인할 거예요. 한쪽만 심사받는 관계는 싫어요.",
        apology: "숨긴 게 있어요. 속이려던 건 아니지만 말하지 않은 책임까지 없어지는 건 아니죠.",
        marriage: "당신이 위기 때도 달아나지 않는 걸 더 보고 싶어요. 그 뒤라면 결혼을 말할 수 있어요.",
        married: "도와달라는 말을 잘 못해요. 오늘만은… 제가 괜찮다고 해도 한 번 더 물어봐 줘요."
      }
    }
  };

  behaviorProfiles.forEach(profile => Object.assign(profile, behaviorVoicePacks[profile.id] || {}));

  const peopleByCountry = {
    vn: [
      ["마이", 29, "온라인 쇼핑몰 직원", "한국 생활보다 서로의 성격을 먼저 보고 싶다", "상냥하지만 결정을 재촉받으면 입을 닫는다", "천천히 말해줘요. 저는 약속보다 행동을 봐요.", "결혼 후에도 일을 계속하고 싶다"],
      ["린", 26, "네일숍 보조", "가족의 기대와 자신의 연애 사이에서 고민 중이다", "장난이 많고 감정 표현이 빠르다", "나 오늘 예뻐요? 대답 오래 생각하면 감점이에요.", "아이 계획은 결혼 뒤에 다시 의논하고 싶다"],
      ["투", 37, "회계 담당", "이혼 뒤 안정적인 동반자를 찾고 있다", "차분하고 숫자와 약속에 예민하다", "좋은 말보다 다음 달 계획을 이야기해 주세요.", "재혼 사실을 숨기지 않고 시작하고 싶다"],
      ["아인", 34, "식당 매니저", "관광객 상대 일을 하며 국제연애를 현실적으로 생각했다", "직설적이고 자존심이 세다", "불쌍해서 만나는 거면 지금 그만해요.", "한국과 베트남을 오가며 살고 싶다"],
      ["응옥", 24, "대학생·통역 아르바이트", "한국어 공부를 하다가 자연스럽게 교류를 시작했다", "호기심이 많지만 경계도 빠르다", "아저씨처럼 가르치지 말고 친구처럼 이야기해요.", "졸업 전 결혼은 원하지 않는다"],
      ["옌", 31, "미용실 운영", "혼자 일군 가게를 존중해 줄 사람을 찾는다", "활달하고 독립심이 강하다", "저는 한국 가려고 인생을 버리는 사람이 아니에요.", "가게를 정리하지 않는 장거리 결혼도 고려한다"],
      ["흐엉", 39, "약국 직원", "아이 없이도 평온한 재혼을 원한다", "다정하지만 사적인 질문에는 선을 긋는다", "우리 나이에 설렘도 좋지만 잠은 잘 자야죠.", "임신을 원하지 않는다"],
      ["짬", 28, "호텔 프런트", "교대근무를 이해할 동반자를 찾는다", "세련되고 사교적이라 오해를 자주 산다", "밤에 일한다고 다 수상한 사람은 아니잖아요.", "결혼 후에도 호텔 경력을 이어가고 싶다"]
    ],
    cn: [
      ["샤오위", 30, "무역회사 직원", "한국 거래처를 접하며 국제연애를 생각했다", "논리적이고 농담은 느리게 받아들인다", "제 말을 통역사 말로 바꾸지 말고 직접 물어봐요.", "양가 경제를 분리해 관리하고 싶다"],
      ["메이린", 38, "학원 강사", "늦더라도 대화가 통하는 결혼을 원한다", "말이 빠르고 토론을 즐긴다", "의견이 다르면 싸움인가요? 저는 그게 대화인데.", "아이보다 부부의 생활을 우선하고 싶다"],
      ["뤄시", 27, "라이브커머스 진행자", "온라인 방송을 이해해 줄 사람을 찾는다", "표현이 크고 휴대폰 사용이 많다", "카메라 앞의 저와 집의 저는 조금 달라요.", "직업을 통제받는 결혼은 거절한다"],
      ["옌", 42, "의류점 운영", "재혼 후 서로의 사업을 존중하길 바란다", "현실적이고 손해 보는 걸 싫어한다", "사랑해도 계약은 읽어야죠. 그게 왜 차가워요?","각자 자산을 지키는 혼인 계약을 원한다"],
      ["리리", 25, "한국어 전공 대학원생", "유학 경험 뒤 한국과의 인연을 열어 두었다", "말수가 적지만 메시지는 길다", "전화에선 긴장해요. 글로는 더 잘 말할 수 있어요.", "학업을 마친 뒤 결혼하고 싶다"],
      ["팅팅", 33, "간호사", "교대근무와 부모 부양을 이해할 사람을 찾는다", "침착하지만 거짓말에 매우 엄격하다", "제 가족 책임도 결혼하면 없어지는 건 아니에요.", "부모에게 정기적으로 생활비를 보낼 계획이다"],
      ["위에", 36, "번역 프리랜서", "문화 차이를 즐기는 동반자를 원한다", "유머가 건조하고 혼자 있는 시간이 필요하다", "답장이 늦으면 바쁜 거지 마음이 사라진 건 아니에요.", "주말부부도 가능하다고 생각한다"],
      ["징", 29, "카페 매니저", "친구의 국제부부를 보고 관심이 생겼다", "붙임성이 좋고 가족과 매우 가깝다", "우리 엄마 질문 많아요. 그래도 면접은 아니에요.", "가족과 가까이 살고 싶다"]
    ],
    th: [
      ["핌", 31, "여행사 직원", "외국인 손님을 만나며 국경 밖 삶을 자연스럽게 생각했다", "낙천적이지만 계획 없는 약속을 싫어한다", "괜찮아요는 정말 괜찮을 때만 말해줘요.", "태국을 자주 방문할 수 있는 결혼을 원한다"],
      ["다오", 28, "카페 바리스타", "언어교환 앱에서 진지한 관계를 찾는다", "부끄러움이 많고 웃음으로 넘기는 버릇이 있다", "제가 웃는다고 동의한 건 아닐 수도 있어요.", "당분간 아이보다 둘의 생활을 원한다"],
      ["수다", 39, "마사지숍 관리자", "직업에 대한 편견 없는 재혼을 원한다", "단단하고 부당한 질문에는 바로 맞선다", "제 직업을 듣고 이미 결론 냈다면 만날 이유가 없어요.", "딸과 함께 받아들여 줄 사람을 찾는다"],
      ["니차", 35, "은행 창구 직원", "경제적으로 독립된 동반자 관계를 원한다", "꼼꼼하고 감정 표현이 느리다", "송금보다 신뢰가 먼저예요. 계좌도 각자 관리해요.", "임신 가능성 검사를 함께 받고 싶다"],
      ["메이", 24, "댄스 강사", "한국 음악을 좋아해 교류를 시작했다", "에너지가 넘치고 자유를 중시한다", "춤추는 사진 때문에 저를 다 안다고 생각하지 마요.", "결혼을 최소 2년 뒤로 생각한다"],
      ["폰", 33, "호텔 예약 담당", "야간근무를 이해하는 사람을 찾는다", "관찰력이 좋고 상대의 말버릇을 잘 기억한다", "어제 한 말이랑 오늘 말이 다른데, 어느 쪽이 진짜예요?","한국에서도 호텔업을 이어가고 싶다"],
      ["아라야", 41, "플로리스트", "아이 없이 취미와 여행을 나눌 재혼을 원한다", "우아하고 선이 분명하다", "저를 구하러 오지 마세요. 같이 걸을 사람을 찾아요.", "임신을 원하지 않는다"],
      ["칸야", 29, "온라인 판매자", "사업 확장과 사랑을 모두 포기하지 않으려 한다", "야심차고 결과 중심이다", "제 목표가 크다고 사랑이 가짜인 건 아니잖아요.", "양국에서 온라인 사업을 계속하고 싶다"]
    ],
    jp: [
      ["하나", 35, "출판 편집자", "취미 모임에서 장거리 연애 가능성을 보았다", "섬세하고 침묵이 길다", "바로 답하지 않아도 생각 중일 수 있어요.", "각자의 일과 방을 존중하고 싶다"],
      ["레이나", 43, "의료 사무", "재혼을 서두르지 않고 천천히 만나고 싶다", "친절하지만 사생활 경계가 강하다", "확인과 감시는 다른 말이라고 생각해요.", "아이 없는 재혼을 원한다"],
      ["미오", 28, "게임 그래픽 디자이너", "온라인 취미 친구에서 연애로 발전하길 바란다", "솔직하고 혼자 충전하는 시간이 길다", "매일 전화는 힘들어요. 좋아하지 않아서가 아니고요.", "결혼보다 동거 경험을 먼저 원한다"],
      ["아키코", 46, "작은 료칸 운영", "가업을 함께 이해할 동반자를 찾는다", "책임감이 강하고 이동에 현실적이다", "제가 한국으로 가는 것만 답은 아니잖아요.", "일본 정착 또는 장거리 결혼을 원한다"],
      ["유이", 26, "한국어 강사", "문화교류 행사에서 진지한 만남을 기대한다", "밝지만 갈등을 피하려 돌려 말한다", "싫다는 말을 부드럽게 해도 싫다는 뜻이에요.", "30대 이후 아이를 생각하고 있다"],
      ["나나미", 32, "패션 판매직", "도시 밖 삶도 가능할지 탐색 중이다", "사교적이고 취향이 분명하다", "좋아하는 옷까지 허락받고 싶지는 않아요.", "생활비를 정확히 반반 나누길 원한다"],
      ["카오리", 39, "통역 안내사", "관광객이 아닌 생활의 파트너를 찾는다", "재치 있지만 상대의 모순을 그냥 넘기지 않는다", "그 말, 지난번이랑 달라요. 이유를 들어도 될까요?","양가 돌봄 계획을 먼저 정하고 싶다"],
      ["마키", 34, "제과사", "작은 가게와 가족을 함께 꾸리고 싶다", "다정하지만 과로하면 연락이 끊긴다", "답장이 없는 날은 빵이 저를 잡아먹은 날이에요.", "한국에서 제과점을 열 가능성을 본다"]
    ],
    ph: [
      ["엘레나", 30, "콜센터 상담원", "영어로 깊은 대화를 나눌 동반자를 찾는다", "표현이 따뜻하고 가족 이야기가 많다", "우리 가족을 사랑할 필요는 없지만 존중은 해줘요.", "부모에게 정기적인 지원을 계속할 생각이다"],
      ["마라", 36, "초등학교 교사", "아이 교육과 일을 존중하는 재혼을 원한다", "차분하고 질문이 구체적이다", "한국에서 제 자격이 인정되는지도 같이 알아봐요.", "아들 한 명과 함께 살기를 원한다"],
      ["조이", 25, "호텔 서비스 직원", "외국인 친구가 많아 국제연애가 낯설지 않다", "사교적이고 감정 표현이 크다", "제가 모두에게 친절한 것과 당신을 좋아하는 건 달라요.", "결혼을 최소 1년 뒤로 생각한다"],
      ["그레이스", 41, "온라인 영어 강사", "아이 없이 대화가 통하는 재혼을 원한다", "유쾌하고 독립적이다", "사랑에도 근무시간이 있어요. 수업 중엔 답장 못 해요.", "임신을 원하지 않는다"],
      ["베아", 28, "간호조무사", "해외 취업보다 안정적인 가족을 꿈꾼다", "헌신적이지만 거절을 어려워한다", "괜찮다고 해도 한 번 더 제 뜻을 물어봐 줘요.", "아이 둘을 원하지만 시기는 협의하고 싶다"],
      ["카밀", 34, "회계 보조", "가족 빚을 숨기지 않고 받아들일 사람을 찾는다", "현실적이고 체면보다 사실을 중시한다", "우리 집 형편을 말하면 도망갈까 봐 무서웠어요.", "가족 지원 상한을 함께 정하고 싶다"],
      ["리자", 39, "바·레스토랑 매니저", "야간 서비스업에 대한 편견 없는 사람을 원한다", "강단 있고 소문에 지쳐 있다", "밤에 일한다는 이유만으로 계속 캐묻는 결혼은 싫어요.", "한국에서도 관리직으로 일하고 싶다"],
      ["루스", 31, "프리랜서 번역가", "종교와 생활 방식을 존중할 동반자를 찾는다", "조용하지만 원칙에는 단호하다", "결혼한다고 신앙이나 제 이름을 버리진 않을 거예요.", "교회 공동체와 계속 연결되고 싶다"]
    ],
    kh: [
      ["스레이", 27, "봉제회사 사무직", "가족의 소개로 국제결혼을 현실적으로 검토한다", "수줍지만 중요한 문제엔 단호하다", "통역사가 대신 대답해도 제 대답은 아닐 수 있어요.", "부모 지원을 계속하고 싶다"],
      ["다비", 34, "식료품점 운영", "사업과 가족을 함께 존중할 재혼을 원한다", "생활력이 강하고 숫자에 빠르다", "가게를 포기하라는 말부터 하면 대화는 끝이에요.", "양국을 오가는 생활을 원한다"],
      ["말리", 39, "호텔 세탁팀장", "딸과 안전하게 살 동반자를 찾는다", "말은 적지만 사람을 오래 본다", "저보다 제 딸에게 어떻게 하는지 볼 거예요.", "딸 한 명과 함께 살기를 원한다"],
      ["소피아", 31, "NGO 행정직", "한국어 공부 모임에서 진지한 만남을 찾는다", "똑 부러지고 구호 대상 취급을 싫어한다", "우리 나라를 가난하다는 말 하나로 설명하지 마세요.", "일을 계속하며 대학원 진학도 생각한다"],
      ["리나", 24, "카페 직원", "사촌의 소개로 처음 국제연애를 고민한다", "호기심이 많지만 가족 눈치를 본다", "제가 좋다고 해도 우리 가족 말 때문에 흔들릴 수 있어요.", "결혼을 서두르고 싶지 않다"],
      ["찬타", 29, "미용사", "기술로 자립하면서 사랑도 찾고 싶다", "활달하고 신체 표현이 자유롭다", "작은 문신 하나가 제 인생 설명서는 아니에요.", "한국에서 미용 자격을 준비하고 싶다"],
      ["나리", 36, "회계 직원", "경제 약속을 명확히 하는 결혼을 원한다", "침착하고 계약 문구를 꼼꼼히 본다", "돈 이야기를 피하는 사람이 저는 더 무서워요.", "공동계좌와 개인계좌를 함께 쓰고 싶다"],
      ["보파", 42, "식당 주방장", "아이 없이 편안한 재혼을 찾는다", "유머가 많고 현실을 담담히 말한다", "로맨스도 좋지만 설거지는 누가 할지 정해야죠.", "임신을 원하지 않는다"]
    ]
  };

  const profileLooks = [
    "밝은 보정이 들어간 얼굴 사진",
    "피부 보정이 강한 셀카",
    "전신이 보이는 여행 사진",
    "AI 필터 느낌이 나는 스튜디오 사진",
    "카페에서 찍은 자연스러운 사진",
    "화려하게 꾸민 외출 사진",
    "몸매가 드러나는 패션 사진",
    "직장에서 찍은 단정한 사진"
  ];

  const makePeople = () => countries.flatMap(country => peopleByCountry[country.id].map((p, index) => ({
    id: `${country.id}-${index}`,
    countryId: country.id,
    name: p[0], age: p[1], job: p[2], motive: p[3], personality: p[4], voice: p[5], boundary: p[6],
    faceSlot: index,
    art: { sheet: country.id, profileCell: index * 2, realCell: index * 2 + 1, newlywedCell: index * 2, settledCell: index * 2 + 1, cols: 4, rows: 4 },
    profileLook: profileLooks[index],
    profileDifference: ["조명과 피부 보정이 꽤 강하다", "눈과 턱선에 필터 흔적이 보인다", "각도 때문에 키와 체형이 다르게 보였다", "실물은 표정이 훨씬 자연스럽다"][index % 4]
  })));

  const clue = (id, title, type, text, source, quality) => ({ id, title, type, text, source, quality });

  const cases = [
    {
      id: "genuine_misread", label: "진심과 번역의 오해", culprit: "none", routes: ["app", "friend", "broker", "community"], weight: 18,
      event: "그녀의 어머니가 갑자기 수술비 이야기를 꺼냈다. 통역사는 오늘 안에 답해야 한다고 재촉한다.",
      clues: {
        doc: clue("gm_doc", "날짜가 이어지는 생활 기록", "fact", "사진·근무표·통화 기록의 날짜가 프로필 설명과 자연스럽게 이어진다.", "원본 파일 확인", 3),
        money: clue("gm_receipt", "병원 예약 확인서", "clue", "금액은 번역 과정에서 부풀려졌지만 실제 진료 예약과 보호자 이름은 확인된다.", "독립 통역", 2),
        investigate: clue("gm_neighbor", "직장 동료의 일치하는 설명", "fact", "직장·거주·가족관계에 대한 설명이 서로 독립적으로 일치한다.", "현지 확인", 3),
        digital: clue("gm_cut", "잘린 음성메시지 원본", "clue", "업체가 전달한 음성은 앞뒤가 잘려 있었다. 원본에는 돈 요구를 거절하는 그녀의 말이 있다.", "원본 대조", 3)
      },
      statements: [
        { text: "저는 돈을 보내 달라고 한 적 없어요. 통역사에게 엄마가 아프다고만 말했어요.", press: "그녀는 원본 음성메시지를 직접 보내겠다고 한다.", required: ["gm_cut", "gm_receipt"], success: "잘린 음성과 원본의 뜻이 다르다. 그녀의 설명이 확인됐다." },
        { text: "제가 연락이 끊긴 날에는 실제로 야간 근무였어요.", press: "근무표 사진은 있지만 날짜 부분이 작아 잘 보이지 않는다.", required: ["gm_doc", "gm_neighbor"], success: "근무표와 동료의 설명이 정확히 맞는다." }
      ],
      truth: "그녀의 마음은 진심이었다. 돈 이야기를 키우고 결정을 재촉한 쪽은 통역 과정이었다. 강하게 몰아붙이면 관계가 깨지지만, 차분히 원본을 확인하면 오히려 신뢰가 깊어진다."
    },
    {
      id: "practical_honest", label: "현실적인 사랑", culprit: "none", routes: ["app", "friend", "broker", "community"], weight: 15,
      event: "그녀는 결혼 뒤 가족에게 매달 생활비를 보내야 한다며 구체적인 액수를 먼저 꺼냈다.",
      clues: {
        doc: clue("ph_budget", "가족 부양 예산표", "fact", "수입·부채·부모 약값이 적힌 예산표다. 숨긴 채무는 보이지 않는다.", "당사자 제공", 3),
        money: clue("ph_transfer", "3년치 소액 송금 기록", "fact", "결혼 이야기가 나오기 전부터 같은 액수를 꾸준히 보냈다.", "은행 내역", 3),
        investigate: clue("ph_work", "재직과 자산 확인", "fact", "직장과 작은 저축계좌가 실제로 확인된다.", "공식 서류", 3),
        digital: clue("ph_chat", "친구와의 오래된 대화", "clue", "한국행보다 동반자의 성격을 걱정하는 대화가 결혼 전부터 이어진다.", "메시지 원본", 2)
      },
      statements: [
        { text: "제가 당신을 사랑해도 부모님이 매달 내는 약값은 그대로예요. 제 수입에서 얼마를 도울 수 있는지 우리 생활비와 함께 정하고 싶어요.", press: "그녀는 부모 약값, 자기 수입, 부부 생활비를 한 표에 적고 매달 지원할 수 있는 상한을 정하자고 제안한다.", required: ["ph_budget", "ph_transfer"], success: "가족 지원 요구가 갑자기 만들어진 것이 아니라 이전부터 예산에 기록돼 있었다는 사실이 확인됐다." },
        { text: "한국이 목적이었다면 제 일을 계속할 방법부터 찾지 않았을 거예요.", press: "그녀는 자격 전환에 필요한 자료를 보여 준다.", required: ["ph_work", "ph_chat"], success: "결혼과 별개로 이어 온 계획이 확인됐다." }
      ],
      truth: "그녀의 동기는 낭만만으로 이루어지지 않았지만 거짓은 아니었다. 가족부양·직업·생활비를 숨기지 않고 협상하려 했다. 현실적이라는 이유만으로 사기라고 단정하면 오판이다."
    },
    {
      id: "broker_skimming", label: "업체의 중간 가로채기", culprit: "broker", routes: ["broker", "friend"], weight: 18,
      event: "업체가 ‘신부 가족 보증금’ 480만원을 오늘 입금해야 일정이 유지된다고 통보했다. 그녀는 그 돈 이야기를 처음 듣는 눈치다.",
      clues: {
        doc: clue("bs_contract", "계약서 밖의 보증금", "clue", "계약서 어디에도 가족 보증금 조항이 없다.", "계약서 대조", 3),
        money: clue("bs_account", "대표 가족과 다른 예금주", "clue", "입금 계좌 예금주는 그녀나 가족이 아니라 업체 직원의 친척이다.", "계좌 확인", 3),
        investigate: clue("bs_family", "가족의 송금 미수령 진술", "fact", "이전 지원금도 가족이 받은 적이 없다고 독립 통역 앞에서 답했다.", "독립 면담", 3),
        digital: clue("bs_ledger", "업체 내부 정산 화면", "fact", "‘신부 전달’ 항목과 실제 지급액이 다르다.", "현지 조사", 3)
      },
      statements: [
        { text: "우리 가족은 보증금을 부탁한 적이 없어요. 저도 방금 들었어요.", press: "업체 통역사는 말을 끊으며 문화 차이라고 설명한다.", required: ["bs_account", "bs_family"], success: "계좌와 가족 진술이 업체의 설명을 반박한다." },
        { text: "지난번 돈도 업체가 가족에게 줬다고 했어요.", press: "그녀는 그날 가족 계좌를 직접 보여 주겠다고 한다.", required: ["bs_ledger", "bs_contract"], success: "업체 정산 기록과 계약서 사이의 모순이 확정됐다." }
      ],
      truth: "그녀와 가족은 업체가 요구한 돈을 받지 못했다. 관계를 의심하게 만든 쪽은 중간에서 비용을 부풀리고 송금을 가로챈 업체였다. 그녀를 범인으로 지목하면 공범이 아닌 피해자를 잃는다."
    },
    {
      id: "hidden_spouse", label: "숨겨진 혼인 관계", culprit: "partner", routes: ["app", "friend", "broker", "community"], weight: 12,
      event: "현지 숙소 로비에서 낯선 남자가 그녀를 보자 ‘집에는 언제 오냐’고 따졌다. 그녀는 먼 친척이라고 한다.",
      clues: {
        doc: clue("hs_registry", "종료되지 않은 혼인 기록", "fact", "공식 기록상 이전 혼인이 아직 정리되지 않았다.", "공식 서류", 3),
        money: clue("hs_rent", "같은 주소의 공동 임대료", "clue", "그녀와 그 남자가 최근까지 같은 집 임대료를 나눠 냈다.", "계좌 내역", 2),
        investigate: clue("hs_landlord", "집주인의 확인", "fact", "두 사람이 부부라고 소개하며 함께 살았다는 진술이다.", "현지 면담", 3),
        digital: clue("hs_photo", "최근 촬영된 가족사진 원본", "fact", "‘오래된 사진’이라고 했지만 촬영정보는 석 달 전이다.", "사진 메타정보", 3)
      },
      statements: [
        { text: "서류 정리가 늦었을 뿐이에요. 우리는 오래전에 끝났어요.", press: "정확히 언제 별거했는지 묻자 답이 두 번 바뀐다.", required: ["hs_rent", "hs_landlord"], success: "최근까지 동거했다는 기록과 진술이 맞물린다." },
        { text: "그 가족사진은 몇 년 전 사진이에요.", press: "원본을 달라고 하자 메신저가 사진 날짜를 바꿨다고 주장한다.", required: ["hs_photo", "hs_registry"], success: "사진 촬영일과 현재 혼인기록이 진술을 무너뜨린다." }
      ],
      truth: "그녀는 현재 배우자와 함께 살면서 국제결혼 상대에게는 관계가 끝났다고 말했다. 혼인 기록 하나만의 행정 지연이 아니라, 최근 동거와 사진까지 겹친 계획된 은폐였다."
    },
    {
      id: "visa_plan", label: "결혼을 이용한 입국 계획", culprit: "partner", routes: ["app", "friend", "broker", "community"], weight: 11,
      event: "그녀가 한국에 도착하기도 전에 모르는 번호로 ‘직원 숙소 준비 완료’라는 한국어 메시지를 받았다.",
      clues: {
        doc: clue("vp_resume", "결혼 전 작성된 한국 취업 이력서", "clue", "교제 시작 전에 한국 유흥·서비스업 취업용 이력서가 작성됐다.", "파일 생성일", 3),
        money: clue("vp_deposit", "한국 숙소 계약금", "clue", "그녀 명의로 서울 외곽 숙소에 계약금이 송금됐다.", "송금 내역", 3),
        investigate: clue("vp_recruiter", "브로커의 취업 알선 진술", "fact", "입국 뒤 일주일 안에 이탈하는 조건을 협의했다는 설명이다.", "현지 조사", 3),
        digital: clue("vp_script", "삭제된 입국 후 계획", "fact", "복구된 대화에는 ‘결혼식 뒤 여권을 챙겨 이동’이라는 문장이 있다.", "메시지 복구", 3)
      },
      statements: [
        { text: "그 이력서는 친구가 장난으로 만들어 준 거예요.", press: "파일 이름과 작성 날짜를 묻자 그녀는 휴대폰을 돌려 달라고 한다.", required: ["vp_resume", "vp_recruiter"], success: "작성 시점과 알선자의 진술이 우연으로 보기 어렵다." },
        { text: "한국 숙소는 우리가 같이 살 집을 알아본 거예요.", press: "주소를 묻자 모른다고 답한다.", required: ["vp_deposit", "vp_script"], success: "공동생활이 아닌 이탈 계획의 숙소라는 사실이 드러났다." }
      ],
      truth: "그녀는 결혼 생활보다 입국과 취업을 먼저 계획했다. 단순히 결혼 후 일하려 한 것이 아니라, 배우자 모르게 숙소·알선자·이탈 시점을 준비해 두었다."
    },
    {
      id: "broker_collusion", label: "업체와 짜고 서두른 결혼", culprit: "both", routes: ["broker"], weight: 16,
      event: "첫 만남 직후 업체가 ‘오늘 합방하지 않으면 신부가 마음을 바꾼다’며 추가 서약서와 잔금 결제를 동시에 내민다.",
      clues: {
        doc: clue("bc_template", "여러 신랑에게 같은 서약서", "fact", "위약금 문구와 손글씨 번역까지 다른 계약자 사례와 똑같다.", "계약 사례 대조", 3),
        money: clue("bc_split", "결혼 성사 보너스 분배표", "clue", "빠른 결정을 성사시키면 그녀에게 별도 수당이 지급되는 표다.", "정산 자료", 3),
        investigate: clue("bc_previous", "이전 맞선 상대의 진술", "fact", "한 달 전에도 같은 사랑 고백과 같은 가족 사연을 들었다고 한다.", "독립 면담", 3),
        digital: clue("bc_script", "업체가 보낸 대화 대본", "fact", "고백·가족 위기·합방 권유 문장이 시간표와 함께 적혀 있다.", "메신저 원본", 3)
      },
      statements: [
        { text: "우리는 운명이라서 빠른 거예요. 업체는 상관없어요.", press: "왜 업체 직원이 둘만의 대화 내용을 아는지 묻자 대답을 피한다.", required: ["bc_script", "bc_previous"], success: "다른 상대에게도 반복된 대본이 확인됐다." },
        { text: "서약서는 당신이 떠날까 봐 가족이 원한 거예요.", press: "가족에게 직접 묻자는 제안에 업체가 통화를 막는다.", required: ["bc_template", "bc_split"], success: "서약서와 수당이 업체의 판매 절차였음이 드러났다." }
      ],
      truth: "그녀와 업체는 빠른 결혼·첫날밤 압박·가족 위기를 한 세트로 운영했다. 감정 표현 자체가 증거는 아니지만, 반복 대본과 보너스·계약 자료가 둘이 함께 꾸민 사기를 입증했다."
    },
    {
      id: "romance_invest", label: "앱 투자형 로맨스 사기", culprit: "partner", routes: ["app", "community"], weight: 14,
      event: "그녀가 둘의 신혼자금을 빨리 불리자며 해외 코인 거래소 링크를 보냈다. 오늘만 가능한 수익이라고 한다.",
      clues: {
        doc: clue("ri_image", "다른 이름으로 쓰인 프로필 사진", "clue", "같은 사진이 해외 SNS에서 다른 이름으로 활동 중이다.", "이미지 원본 대조", 2),
        money: clue("ri_wallet", "피해 신고된 지갑 주소", "fact", "입금 주소가 여러 로맨스 사기 신고에 등장한다.", "공개 신고 자료", 3),
        investigate: clue("ri_domain", "일주일 전에 만든 거래소", "fact", "공식 금융사가 아니라 최근 개설된 가짜 사이트다.", "도메인 기록", 3),
        digital: clue("ri_copy", "복사된 연애 문장", "clue", "그녀의 긴 고백이 다른 피해 사례 문장과 토씨까지 같다.", "문장 검색", 3)
      },
      statements: [
        { text: "사진 도용은 제가 당한 거예요. 이 계정이 진짜 저예요.", press: "즉석 영상통화를 요청하자 카메라가 고장 났다고 한다.", required: ["ri_image", "ri_copy"], success: "신원뿐 아니라 고백까지 복제된 계정임이 드러났다." },
        { text: "그 거래소는 제 삼촌도 오래 썼어요. 위험하지 않아요.", press: "회사 등록번호를 요청하자 링크가 갑자기 접속되지 않는다.", required: ["ri_wallet", "ri_domain"], success: "사이트와 지갑이 사기 인프라라는 사실이 확인됐다." }
      ],
      truth: "화면 속 인물의 신원은 도용됐고, 연애 대화는 투자금을 보내게 하기 위한 대본이었다. 송금 전에 계정·사이트·지갑을 따로 확인하면 막을 수 있다."
    },
    {
      id: "parallel_suitors", label: "동시에 진행된 여러 약혼", culprit: "partner", routes: ["app", "friend", "broker", "community"], weight: 10,
      event: "카페 직원이 예약 이름을 확인하며 ‘어제 오신 한국 분과 같은 기념일 코스 맞죠?’라고 묻는다.",
      clues: {
        doc: clue("ps_booking", "반복된 커플 예약", "clue", "같은 달에 다른 남성과 같은 코스를 세 번 예약했다.", "예약 기록", 2),
        money: clue("ps_gifts", "여러 명의 정기 송금", "fact", "서로 다른 한국인 세 명이 같은 가족 사연으로 돈을 보냈다.", "계좌 내역", 3),
        investigate: clue("ps_suitor", "다른 약혼 상대의 영상통화", "fact", "두 사람 모두 같은 날짜에 결혼 약속을 받았다.", "당사자 확인", 3),
        digital: clue("ps_schedule", "남성별 대화 일정표", "fact", "이름·시차·가족 사연·송금일이 표로 관리되고 있다.", "공유 문서", 3)
      },
      statements: [
        { text: "다른 한국인은 그냥 단체 관광 손님이었어요.", press: "그 사람 이름을 말하자 그녀가 이미 성까지 알고 있다.", required: ["ps_booking", "ps_suitor"], success: "같은 약혼 약속을 받은 상대가 직접 확인됐다." },
        { text: "가족이 돈을 받은 건 한 번뿐이에요.", press: "계좌를 보여 달라는 말에 가족 통장이라 자신도 모른다고 한다.", required: ["ps_gifts", "ps_schedule"], success: "사연과 송금일이 사람별로 관리된 흔적이 드러났다." }
      ],
      truth: "그녀는 여러 상대에게 같은 결혼 약속과 가족 위기를 반복해 송금과 선물을 받았다. 다른 이성과 연락했다는 사실이 아니라, 중복 약혼·반복 송금·관리표가 사기를 입증했다."
    },
    {
      id: "hidden_nightlife", label: "숨겨진 이탈·유흥업소 취업 계획", culprit: "partner", routes: ["app", "friend", "broker"], weight: 9,
      event: "한국 번호로 ‘노래방 출근 날짜 확정, 남편에게는 말하지 말 것’이라는 메시지가 그녀의 휴대폰에 떴다.",
      clues: {
        doc: clue("hn_contract", "입국 전 작성된 근무 약정", "fact", "결혼식 날짜 뒤 바로 시작하는 야간업소 근무 약정이다.", "문서 원본", 3),
        money: clue("hn_advance", "업소 선불금 수령", "clue", "항공권을 담보로 선불금이 지급됐다.", "송금 내역", 3),
        investigate: clue("hn_manager", "업소 관리자의 통화", "fact", "결혼은 체류를 위한 절차라고 들었다는 진술이다.", "녹취·면담", 3),
        digital: clue("hn_route", "입국 당일 이탈 동선", "fact", "공항 픽업 뒤 배우자를 피해 이동하는 계획이 공유돼 있다.", "메신저 원본", 3)
      },
      statements: [
        { text: "그 메시지는 예전에 일하던 식당 사장이 보낸 거예요.", press: "가게 이름과 주소를 묻자 말이 막힌다.", required: ["hn_contract", "hn_manager"], success: "업소와 근무 시작일이 결혼 일정에 맞춰져 있음을 확인했다." },
        { text: "선불금은 가족이 빌린 돈이라 저는 몰랐어요.", press: "본인 인증 기록을 보여 주자 휴대폰을 빼앗으려 한다.", required: ["hn_advance", "hn_route"], success: "본인이 돈과 이탈 동선을 직접 확인한 기록이 드러났다." }
      ],
      truth: "야간근무나 유흥업 종사 자체가 사기의 근거는 아니다. 이 사건에서는 결혼 상대에게 숨긴 근무 계약, 선불금, 입국 당일 이탈 계획이 함께 확인돼 기망 의도가 드러났다."
    },
    {
      id: "pressured_escape", label: "사기가 아니라 압박에서의 탈출", culprit: "none", routes: ["broker", "friend"], weight: 13,
      event: "그녀가 결혼식 전날 갑자기 사라졌다. 업체는 ‘원래 도망갈 여자였다’며 새 후보를 고르면 할인해 주겠다고 한다.",
      clues: {
        doc: clue("pe_penalty", "신부에게만 적용된 위약금 서약", "fact", "만남을 거절하면 가족이 큰돈을 갚는다는 현지 서약서다.", "계약 대조", 3),
        money: clue("pe_debt", "업체가 만든 소개비 채무", "clue", "그녀 가족 명의 채무가 만남 직전에 생겼다.", "채무 서류", 2),
        investigate: clue("pe_shelter", "여성 지원기관의 확인", "fact", "그녀는 돈을 가지고 달아난 것이 아니라 강요를 피해 보호를 요청했다.", "독립 기관", 3),
        digital: clue("pe_refusal", "삭제된 거절 메시지", "fact", "그녀는 업체에 여러 번 ‘더 알아본 뒤 결정하겠다’고 보냈다.", "메시지 복구", 3)
      },
      statements: [
        { text: "저는 당신이 싫어서 사라진 게 아니에요. 모두가 오늘 결혼하라고 했어요.", press: "둘만 통화할 시간을 주자 처음으로 구체적인 위약금 이야기를 한다.", required: ["pe_penalty", "pe_refusal"], success: "그녀가 계속 속도를 늦추려 했다는 기록이 확인됐다." },
        { text: "당신 돈을 가져간 적 없어요. 업체가 받은 돈은 저도 못 받았어요.", press: "업체는 연락을 끊고 그녀의 절도라고 주장한다.", required: ["pe_debt", "pe_shelter"], success: "실종이 사기 이탈이 아니라 강요에서 벗어난 과정임이 확인됐다." }
      ],
      truth: "그녀의 이탈은 처음부터 결혼 의사가 없었다는 증거가 아니었다. 업체와 가족의 채무·초고속 결정·첫날밤 압박에서 벗어나 보호를 요청한 것이었다. 성급한 공개 비난은 피해를 키운다."
    }
  ];

  window.KG_DATA = { players, countries, routes, paymentPlans, profilePools, behaviorProfiles, shadowDesires, people: makePeople(), cases };
})();
