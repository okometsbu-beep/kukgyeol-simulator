(function () {
  "use strict";

  const DATA = window.KG_DATA;
  const SAVE_KEY = "genuine-evidence-save-v1";
  const DEBT_LIMIT = 12000000;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const screens = {
    title: $("#title-screen"),
    setup: $("#setup-screen"),
    game: $("#game-screen"),
    ending: $("#ending-screen")
  };

  const scenes = [
    { id: "contact", title: "첫 연락", objective: "프로필 밖의 사람을 확인한다", bg: "video-call" },
    { id: "her_question", title: "그녀의 질문", objective: "나도 검증받는 사람임을 기억한다", bg: "video-call" },
    { id: "route_pressure", title: "만남의 규칙", objective: "만남을 주선한 구조와 비용을 파악한다", bg: "broker-suspicion" },
    { id: "arrival", title: "현지 첫 만남", objective: "통역을 거치지 않은 표정과 말을 살핀다", bg: "airport" },
    { id: "private_talk", title: "둘만의 대화", objective: "결혼을 선택한 진짜 계기를 듣는다", bg: "romance-start" },
    { id: "boundaries", title: "서로의 선", objective: "아이·직업·몸·첫날밤에 대한 동의를 확인한다", bg: "romance-start" },
    { id: "documents", title: "서류의 날짜", objective: "느낌과 별개로 기본 사실을 검증한다", bg: "broker-suspicion" },
    { id: "romance", title: "마음이 움직이는 밤", objective: "의심만 하다가 관계를 놓치지 않는다", bg: "romance-start" },
    { id: "money_crisis", title: "갑작스러운 돈 이야기", objective: "돕는 것과 확인하는 것을 동시에 해낸다", bg: "broker-suspicion" },
    { id: "investigation", title: "보이지 않는 연결", objective: "소문이 아닌 확인 가능한 자료를 찾는다", bg: "nightlife-secret" },
    { id: "interrogation_one", title: "첫 번째 진술", objective: "사람이 아니라 모순을 겨눈다", bg: "broker-suspicion" },
    { id: "breathing_room", title: "흔들리는 마음", objective: "스트레스와 관계, 조사 사이의 균형을 잡는다", bg: "nightlife-secret" },
    { id: "interrogation_two", title: "마지막 진술", objective: "결론 전에 남은 모순 하나를 확인한다", bg: "broker-suspicion" },
    { id: "decision", title: "결정의 날", objective: "증거가 말하는 만큼만 결론 내린다", bg: "wedding" }
  ];

  const setup = { step: 0, playerId: null, countryId: null, routeId: null, partnerId: null, candidates: [] };
  let state = null;
  let notebookFilter = "all";
  let modalCloseHandler = null;

  const formatWon = value => {
    const amount = Math.round(Math.abs(value));
    const sign = value < 0 ? "-" : "";
    if (amount >= 100000000) return `${sign}${(amount / 100000000).toFixed(amount % 100000000 ? 1 : 0)}억원`;
    if (amount >= 10000) return `${sign}${Math.round(amount / 10000).toLocaleString("ko-KR")}만원`;
    return `${sign}${amount.toLocaleString("ko-KR")}원`;
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pick = items => items[Math.floor(Math.random() * items.length)];
  const getPlayer = () => DATA.players.find(item => item.id === (state ? state.playerId : setup.playerId));
  const getPartner = () => DATA.people.find(item => item.id === (state ? state.partnerId : setup.partnerId));
  const getCountry = () => DATA.countries.find(item => item.id === (state ? state.countryId : setup.countryId));
  const getRoute = () => DATA.routes.find(item => item.id === (state ? state.routeId : setup.routeId));
  const getCase = () => DATA.cases.find(item => item.id === state.caseId);

  function photoStyle(art, kind = "woman") {
    if (kind === "man") {
      const col = art % 3;
      const row = Math.floor(art / 3);
      return `background-image:url('./assets/men.webp');background-size:300% 200%;background-position:${col * 50}% ${row * 100}%`;
    }
    const sheet = art.sheet;
    const cell = art.cell;
    if (sheet === "legacy") {
      const col = cell % 4;
      const row = Math.floor(cell / 4);
      return `background-image:url('./assets/women-legacy.webp');background-size:400% 300%;background-position:${col * 33.333}% ${row * 50}%`;
    }
    const col = cell % 2;
    const row = Math.floor(cell / 2);
    return `background-image:url('./assets/women-${sheet}.webp');background-size:200% 200%;background-position:${col * 100}% ${row * 100}%`;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function setSavedButton() {
    try { $("#continue-game").hidden = !localStorage.getItem(SAVE_KEY); } catch (_) { $("#continue-game").hidden = true; }
  }

  function resetSetup() {
    setup.step = 0;
    setup.playerId = null;
    setup.countryId = null;
    setup.routeId = null;
    setup.partnerId = null;
    setup.candidates = [];
    renderSetup();
  }

  function setupCopy() {
    return [
      ["주인공을 고르세요", "돈이 많다고 항상 유리하지는 않습니다. 침착함·대화력·약점이 조사 방식과 관계에 영향을 줍니다."],
      ["어느 나라에서 만날까요?", "국가는 사건의 난이도나 사기 확률이 아닙니다. 이름·도시·문화적 대화의 배경만 바뀝니다."],
      ["어떻게 만날까요?", "경로에 따라 비용, 만남의 속도, 얻기 쉬운 정보와 발생 가능한 사건이 달라집니다."],
      ["이번에 만날 사람을 고르세요", "화면에는 얼굴이 겹치지 않는 네 명만 나옵니다. 새 사건을 시작하면 같은 나라에서도 다른 인물과 성격이 나옵니다."]
    ][setup.step];
  }

  function renderSetup() {
    const [title, guide] = setupCopy();
    $("#setup-title").textContent = title;
    $("#setup-guide").textContent = guide;
    $("#setup-step").textContent = `${setup.step + 1} / 4`;
    $("#setup-progress-bar").style.width = `${(setup.step + 1) * 25}%`;
    const grid = $("#setup-grid");
    grid.innerHTML = "";
    let items = [];
    let selectedId = null;

    if (setup.step === 0) { items = DATA.players; selectedId = setup.playerId; }
    if (setup.step === 1) { items = DATA.countries; selectedId = setup.countryId; }
    if (setup.step === 2) { items = DATA.routes; selectedId = setup.routeId; }
    if (setup.step === 3) {
      if (!setup.candidates.length) setup.candidates = buildCandidates();
      items = setup.candidates;
      selectedId = setup.partnerId;
    }

    items.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `selection-card${item.id === selectedId ? " is-selected" : ""}`;
      button.dataset.id = item.id;
      button.setAttribute("aria-pressed", item.id === selectedId ? "true" : "false");
      if (setup.step === 0) {
        button.innerHTML = `<div class="selection-photo" style="${photoStyle(item.art, "man")}"></div><div class="selection-body"><h3>${item.name} · ${item.age}세</h3><p>${item.job} · 월 ${formatWon(item.income)}</p><span class="selection-tag">${item.hook}</span><span class="selection-cost">보유 ${formatWon(item.cash)}</span></div>`;
      } else if (setup.step === 1) {
        button.innerHTML = `<div class="selection-body"><h3>${item.flag} ${item.name}</h3><p>${item.city}</p><span class="selection-tag">${item.note}</span></div>`;
      } else if (setup.step === 2) {
        button.innerHTML = `<div class="selection-body"><h3>${item.icon} ${item.name}</h3><p>${item.note}</p><span class="selection-tag">속도 ${item.speed}</span><span class="selection-cost">예상 ${item.expected}</span></div>`;
      } else {
        button.innerHTML = `<div class="selection-photo" style="${photoStyle(item.art)}"></div><div class="selection-body"><h3>${item.name} · ${item.age}세</h3><p>${item.job}</p><span class="selection-tag">${item.personality}</span><span class="selection-cost">${item.boundary}</span></div>`;
      }
      button.addEventListener("click", () => chooseSetupItem(item.id));
      grid.appendChild(button);
    });

    const selected = [setup.playerId, setup.countryId, setup.routeId, setup.partnerId][setup.step];
    $("#setup-next").disabled = !selected;
    $("#setup-next").textContent = setup.step === 3 ? "이 사람과 사건 시작" : "다음";
    renderSetupSummary();
  }

  function chooseSetupItem(id) {
    if (setup.step === 0) setup.playerId = id;
    if (setup.step === 1) { setup.countryId = id; setup.partnerId = null; setup.candidates = []; }
    if (setup.step === 2) { setup.routeId = id; setup.partnerId = null; setup.candidates = []; }
    if (setup.step === 3) setup.partnerId = id;
    renderSetup();
  }

  function buildCandidates() {
    const pool = DATA.people.filter(person => person.countryId === setup.countryId);
    return [0, 1, 2, 3].map(slot => {
      const variants = pool.filter(person => person.faceSlot === slot);
      if (setup.routeId === "broker" && Math.random() < .72) return [...variants].sort((a, b) => a.age - b.age)[0];
      return pick(variants);
    }).sort(() => Math.random() - .5);
  }

  function renderSetupSummary() {
    const chosen = [
      DATA.players.find(x => x.id === setup.playerId),
      DATA.countries.find(x => x.id === setup.countryId),
      DATA.routes.find(x => x.id === setup.routeId),
      DATA.people.find(x => x.id === setup.partnerId)
    ].filter(Boolean);
    const box = $("#setup-summary");
    box.hidden = chosen.length < 2;
    if (!box.hidden) box.textContent = chosen.map(x => x.name).join("  ·  ");
  }

  function weightedCase(routeId) {
    const available = DATA.cases.filter(item => item.routes.includes(routeId));
    const total = available.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * total;
    for (const item of available) {
      cursor -= item.weight;
      if (cursor <= 0) return item;
    }
    return available[available.length - 1];
  }

  function startGame() {
    const player = DATA.players.find(x => x.id === setup.playerId);
    const route = DATA.routes.find(x => x.id === setup.routeId);
    const mystery = weightedCase(route.id);
    state = {
      version: 1,
      playerId: setup.playerId,
      countryId: setup.countryId,
      routeId: setup.routeId,
      partnerId: setup.partnerId,
      caseId: mystery.id,
      scene: 0,
      cash: player.cash,
      debt: 0,
      spent: 0,
      trust: 43,
      calm: player.calm,
      charm: player.charm,
      elapsedDays: 0,
      daysLeft: route.id === "broker" ? 24 : 90,
      evidence: [],
      confirmed: 0,
      mistakes: 0,
      flags: {},
      moneyLog: [],
      pending: null,
      pressed: {},
      ending: null
    };
    spend(route.initialCost, `${route.name} 시작 비용`, false);
    addEvidence({ id: "profile_snapshot", title: "처음 받은 프로필", type: "clue", text: "이름·나이·직업·사진이 적힌 첫 프로필 화면. 사실 여부는 아직 확인하지 않았다.", source: route.name, quality: 1 });
    saveGame(false);
    showScreen("game");
    renderGame();
  }

  function spend(amount, label, allowGameOver = true) {
    if (!amount) return;
    state.spent += amount;
    if (state.cash >= amount) state.cash -= amount;
    else {
      const shortfall = amount - state.cash;
      state.cash = 0;
      state.debt += shortfall;
    }
    state.moneyLog.unshift({ label, amount, day: state.elapsedDays });
    if (allowGameOver && state.debt >= DEBT_LIMIT) finishEarly("debt");
  }

  function earn(amount, label) {
    if (state.debt > 0) {
      const paid = Math.min(state.debt, amount);
      state.debt -= paid;
      amount -= paid;
      state.moneyLog.unshift({ label: `${label} · 빚 상환`, amount: -paid, day: state.elapsedDays });
    }
    state.cash += amount;
  }

  function passTime(days) {
    const beforeMonth = Math.floor(state.elapsedDays / 30);
    state.elapsedDays += days;
    state.daysLeft -= days;
    const afterMonth = Math.floor(state.elapsedDays / 30);
    const salaryMonths = afterMonth - beforeMonth;
    if (salaryMonths > 0) earn(getPlayer().income * salaryMonths, `${salaryMonths}개월 수입`);
    if (state.debt > 0 && salaryMonths > 0) {
      const interest = Math.max(100000, Math.round(state.debt * .025 * salaryMonths));
      state.debt += interest;
      state.moneyLog.unshift({ label: "급전 이자", amount: interest, day: state.elapsedDays });
      state.calm -= 1;
    }
  }

  function addEvidence(item) {
    if (!item || state.evidence.some(saved => saved.id === item.id)) return false;
    state.evidence.push({ ...item, obtainedAt: state.scene });
    return true;
  }

  function addRumor(title, text) {
    const id = `rumor_${state.scene}_${state.evidence.length}`;
    addEvidence({ id, title, type: "rumor", text, source: "주변 소문", quality: 1 });
  }

  function applyDelta(result) {
    if (result.cost) spend(result.cost, result.costLabel || result.title);
    if (result.trust) state.trust = clamp(state.trust + result.trust, 0, 100);
    if (result.calm) state.calm = clamp(state.calm + result.calm, 0, 9);
    if (result.days) passTime(result.days);
    if (result.evidence) addEvidence(result.evidence);
    if (result.flag) state.flags[result.flag] = true;
    if (result.flags) Object.assign(state.flags, result.flags);
  }

  function relationshipLabel() {
    if (state.scene < 4) return "서로 알아보는 중";
    if (state.scene < 7) return state.trust >= 55 ? "호감이 자라는 중" : "조심스러운 만남";
    if (state.scene < 11) return state.trust >= 65 ? "연애 중 · 불안한 단서" : "관계가 흔들리는 중";
    return state.trust >= 60 ? "결정을 앞둔 연인" : "결정을 앞둔 두 사람";
  }

  function sceneContent() {
    const scene = scenes[state.scene];
    const partner = getPartner();
    const route = getRoute();
    const mystery = getCase();
    const player = getPlayer();
    const common = { speaker: partner.name, mood: "관찰 중", portrait: true, caption: `${getCountry().flag} ${getCountry().name} · ${route.name}` };
    switch (scene.id) {
      case "contact":
        return { ...common, mood: "조금 긴장", text: `“${partner.voice}”\n\n프로필에는 ${partner.job}, ${partner.age}세라고 적혀 있다. 첫인상만으로는 어느 쪽도 알 수 없다.`, choices: [
          choice("live_video", "지금 짧게 영상통화하기", "사진과 목소리, 주변 상황을 실시간으로 확인한다.", "지금: 무료 · 앞으로: 신원 확인 단서", 0, "investigate"),
          choice("slow_chat", "일주일간 일상 대화하기", "일·식사·퇴근 같은 평범한 대화를 쌓아 말의 흐름을 본다.", "지금: 7일 · 앞으로: 신뢰가 크게 오름", 0, "romance"),
          choice("translator_intro", "독립 통역과 함께 인사하기", "주선자와 관계없는 통역사를 써서 첫 문장의 뜻부터 맞춘다.", "지금: 30만원 · 앞으로: 번역 왜곡 방지", 300000, "investigate")
        ] };
      case "her_question":
        return { ...common, mood: "진지함", text: `${partner.name}이 화면 쪽으로 몸을 기울인다.\n\n“${player.name} 씨도 저를 확인하고 있죠? 저도 물어볼게요. 빚은 있어요? 결혼하면 제가 일을 계속해도 돼요?”`, choices: [
          choice("player_honest", "통장과 빚을 있는 그대로 말한다", `현재 현금과 월수입, ${player.flaw}는 점까지 숨기지 않는다.`, "지금: 자존심이 조금 불편 · 앞으로: 거짓말 약점 제거", 0, "romance"),
          choice("player_polish", "수입을 조금 부풀려 안심시킨다", "‘결혼하면 더 벌 수 있다’며 불확실한 계획을 확정처럼 말한다.", "지금: 호감 가능 · 앞으로: 들키면 큰 약점", 0, "risky"),
          choice("player_counter", "대답 뒤 같은 질문을 돌려준다", "내 상황을 먼저 말하고 그녀의 빚·일·가족지원도 묻는다.", "지금: 분위기는 현실적 · 앞으로: 생활 협상 단서", 0, "investigate")
        ] };
      case "route_pressure":
        if (route.id === "broker") return { ...common, speaker: "업체 실장", mood: "계약 재촉", text: `“지금 후보가 제일 괜찮습니다. 이번 주 안에 출국하면 잔금 포함 총액은 약 ${formatWon(14630000 + 4690000)}입니다. 오늘 예약금부터 걸죠.”\n\n평균 수치와 내 계약서의 포함 항목은 같은 말이 아니다.`, choices: routeChoices() };
        if (route.id === "app") return { ...common, speaker: partner.name, mood: "기대와 경계", text: `“앱에서 오래 이야기만 하다가 사라지는 사람도 많았어요. 만날 거면 날짜를 정해요. 대신 제 신분증 사진을 먼저 보내라는 건 싫어요.”`, choices: routeChoices() };
        return { ...common, speaker: route.id === "friend" ? "공통 지인" : "모임 운영자", mood: "확신하는 말투", text: `“${partner.name}은 내가 오래 봐서 알아. 걱정할 사람 아니야.”\n\n소개자의 자신감은 참고가 될 수 있지만 공식 확인을 대신하지는 않는다.`, choices: routeChoices() };
      case "arrival":
        return { ...common, mood: "실제로 만남", text: `입국장을 나서자 ${partner.name}이 사진보다 먼저 손을 흔든다. 어색한 웃음 뒤에 작은 침묵이 온다.\n\n“직접 보니까… 말이 잘 안 나오네요. 배고파요?”`, choices: [
          choice("arrival_direct", "둘이 천천히 식사한다", "기본 여행비만 쓰고 통역 없이 쉬운 말로 대화한다.", "지금: 120만원 · 앞으로: 둘만의 리듬", 1200000, "romance"),
          choice("arrival_interpreter", "독립 통역을 하루 고용한다", "업체 통역사가 아닌 사람에게 중요한 말만 정확히 확인한다.", "지금: 여행 120만 + 통역 30만원 · 앞으로: 정확한 기억", 1500000, "investigate"),
          choice("arrival_luxury", "좋은 호텔과 선물로 분위기를 띄운다", "말이 막힐 때 돈을 써서 첫날의 분위기를 끌어올린다.", "지금: 300만원 · 앞으로: 호감↑, 기대수준↑", 3000000, "risky")
        ] };
      case "private_talk":
        return { ...common, mood: "마음을 열까 망설임", text: `조용한 카페에서 통역사가 자리를 비운다. ${partner.name}이 한참 컵만 만지다가 말한다.\n\n“제가 국제결혼을 생각한 이유, 정말 듣고 싶어요? 듣고 나서 저를 계산적인 사람이라고 볼 수도 있어요.”`, choices: [
          choice("listen_motive", "판단하지 않고 끝까지 듣는다", `그녀가 말한 계기: “${partner.motive}”`, "지금: 3일 · 앞으로: 동기와 감정 분리", 0, "romance"),
          choice("ask_korea", "왜 하필 한국인지 구체적으로 묻는다", "생활·직업·가족·체류 계획을 한 항목씩 묻는다.", "지금: 조금 딱딱함 · 앞으로: 계획 검증", 0, "investigate"),
          choice("test_love", "돈이 없어도 결혼할지 떠본다", "실제 상황이 아닌 가난을 연기해 반응을 시험한다.", "지금: 반응을 빨리 봄 · 앞으로: 거짓말 노출 위험", 0, "risky")
        ] };
      case "boundaries":
        return { ...common, mood: "선명한 표정", text: `“${partner.boundary}. 그리고 문신, 담배, 아이, 밤일 같은 것도 서로 물을 수 있어요. 하지만 검사받는 기분이면 싫어요.”\n\n빠른 성혼 노선일수록 동의하지 않은 침묵을 ‘예’로 해석하기 쉽다.`, choices: [
          choice("mutual_boundaries", "서로 같은 질문표에 답한다", "아이 계획·임신검사·문신·흡연·직업·송금을 나도 똑같이 공개한다.", "지금: 어색하지만 공평 · 앞으로: 갈등 예방", 0, "romance"),
          choice("body_check", "그녀의 문신과 몸 상태부터 확인한다", "내 정보는 공개하지 않고 신체·임신 가능성을 먼저 확인하려 한다.", "지금: 정보를 빨리 얻음 · 앞으로: 신뢰 크게 하락", 0, "risky"),
          choice("slow_consent", "결혼과 첫날밤의 속도를 분리한다", "좋아하는 마음과 성관계·혼인 동의는 별개라고 분명히 말한다.", "지금: 업체 일정과 충돌 · 앞으로: 강요 위험 감소", 0, "romance")
        ] };
      case "documents":
        return { ...common, speaker: "사건 수첩", mood: "사실 확인", text: `사진, 직장, 이전 혼인, 거주지, 송금.\n\n확인은 불신의 선언이 아니라 서로가 같은 사실 위에서 결정하기 위한 절차다. 다만 출처가 불분명한 소문은 오히려 판단을 흐린다.`, choices: [
          choice("official_docs", "공식 서류와 원본 날짜를 확인한다", "독립 번역으로 혼인·재직·사진 원본을 대조한다.", "지금: 50만원 · 앞으로: 검증된 자료 1개", 500000, "investigate"),
          choice("trust_no_docs", "이번에는 믿고 넘어간다", "관계의 온도를 지키지만 현재 모순은 확인되지 않은 채 남는다.", "지금: 신뢰↑ · 앞으로: 최종 판단 자료 부족", 0, "romance"),
          choice("cheap_rumor", "택시기사와 주변인에게 소문을 묻는다", "빠르고 싸지만 누가 왜 한 말인지 확인하기 어렵다.", "지금: 10만원 · 앞으로: 미확인 소문 1개", 100000, "risky")
        ] };
      case "romance":
        return { ...common, mood: "가까워진 밤", text: `비가 그친 뒤 둘은 숙소 앞을 오래 걷는다. ${partner.name}이 먼저 손을 내밀다가 멈춘다.\n\n“오늘은 조사 말고… 그냥 우리 얘기하면 안 돼요?”`, choices: [
          choice("confess", "좋아한다고 솔직하게 고백한다", "확답을 강요하지 않고 지금의 마음만 전한다.", "지금: 관계가 연애로 전환 · 앞으로: 오판할 때 상처도 커짐", 0, "romance"),
          choice("future_plan", "1년 생활계획을 함께 그린다", "어느 나라에서 살지, 일과 돈을 어떻게 나눌지 적어 본다.", "지금: 설렘은 덜함 · 앞으로: 결혼 적합성↑", 0, "investigate"),
          choice("push_kiss", "분위기를 핑계로 먼저 입맞춤한다", "대답을 기다리지 않고 호감이 있다고 가정한다.", "지금: 매력에 따라 성공 가능 · 실패 시 신뢰 급락", 0, "risky")
        ] };
      case "money_crisis":
        return { ...common, mood: "갑작스러운 위기", text: mystery.event, choices: moneyChoices(mystery) };
      case "investigation":
        return { ...common, speaker: "조사 선택", mood: "시간이 줄어든다", text: `확실한 증거는 대체로 돈이나 시간이 든다. 싼 소문은 빠르지만 잘못된 사람을 범인으로 만들 수 있다.\n\n현재 남은 일정은 ${Math.max(0, state.daysLeft)}일이다.`, choices: investigationChoices(mystery) };
      case "interrogation_one":
        return interrogationContent(0);
      case "breathing_room":
        return { ...common, mood: state.trust >= 60 ? "걱정스러운 눈" : "지친 표정", text: `며칠째 같은 문장을 되짚느라 잠을 설쳤다. 휴대폰 알림이 울릴 때마다 심장이 먼저 뛴다.\n\n${partner.name}: “당신이 저를 알아보는 건지, 잡아내려는 건지 모르겠어요.”`, choices: [
          choice("date_rest", "조사 없는 하루를 보낸다", "시장과 공원을 걷고 서로 좋아하는 것만 이야기한다.", "지금: 35만원·3일 · 신뢰와 침착함 회복", 350000, "romance"),
          choice("solo_rest", "혼자 자고 상담을 받는다", "판단을 미루고 수면·상담으로 스트레스를 먼저 낮춘다.", "지금: 20만원·4일 · 침착함 크게 회복", 200000, "investigate"),
          choice("secret_trace", "쉬는 척하면서 뒤를 밟는다", "상대나 업체의 이동을 몰래 확인한다. 성공하면 강한 자료, 들키면 관계 손상.", "지금: 60만원·2일 · 고위험 조사", 600000, "risky"),
          choice("rush_answer", "지금 결혼하면 의심을 멈추겠다고 한다", "불안을 빠른 결혼으로 덮는다.", "지금: 일정 단축 · 앞으로: 미확인 위험과 비용 증가", 0, "risky")
        ] };
      case "interrogation_two":
        return interrogationContent(1);
      case "decision":
        return { ...common, speaker: "최종 판단", mood: "되돌릴 수 없는 선택", text: `결혼식 예약 시각까지 두 시간.\n\n사건 수첩에는 확인된 사실 ${state.evidence.filter(e => e.type === "fact").length}개, 단서 ${state.evidence.filter(e => e.type === "clue").length}개, 소문 ${state.evidence.filter(e => e.type === "rumor").length}개가 있다. ‘수상하다’와 ‘사기다’는 같은 문장이 아니다.`, choices: decisionChoices() };
      default: return common;
    }
  }

  function choice(id, title, description, impact, cost, style) {
    return { id, title, description, impact, cost, style };
  }

  function routeChoices() {
    const route = getRoute();
    if (route.id === "broker") return [
      choice("contract_review", "잔금 전에 계약서를 따로 검토한다", "포함·불포함·환불·추가금 조항을 독립 통역으로 읽는다.", "지금: 40만원·3일 · 앞으로: 업체 모순 확인", 400000, "investigate"),
      choice("pay_reservation", "기회를 놓치기 전에 예약금을 낸다", "업체 일정과 후보 우선권을 유지한다.", "지금: 300만원 · 앞으로: 속도↑, 회수 어려움", 3000000, "risky"),
      choice("pretend_agree", "동의하는 척하고 내부 말을 더 듣는다", "잔금 의사가 있는 것처럼 행동해 업체의 다음 제안을 끌어낸다.", "지금: 비용 없음 · 앞으로: 단서 가능, 들키면 신뢰↓", 0, "risky")
    ];
    if (route.id === "app") return [
      choice("app_meeting", "공공장소에서 만날 날짜를 잡는다", "왕복 일정과 숙소를 내가 직접 예약한다.", "지금: 2일 · 앞으로: 실제 신원 확인", 0, "romance"),
      choice("app_identity", "실시간 영상과 일상 인증을 제안한다", "신분증 사본 대신 즉석 질문과 영상으로 확인한다.", "지금: 약간 어색 · 앞으로: 도용 위험 감소", 0, "investigate"),
      choice("app_gift", "마음을 보여 주려고 고가 선물을 보낸다", "주소와 호감을 얻지만 돈으로 관계를 앞당긴다.", "지금: 80만원 · 앞으로: 금전 기대↑", 800000, "risky")
    ];
    return [
      choice("reference_check", "공통 지인과 별도로 당사자에게 묻는다", "소개자의 평가와 본인의 말을 따로 기록한다.", "지금: 2일 · 앞으로: 진술 비교 가능", 0, "investigate"),
      choice("accept_reference", "지인의 보증을 믿고 일정을 잡는다", "확인 시간을 줄이고 관계에 집중한다.", "지금: 신뢰↑ · 앞으로: 지인의 사각지대", 0, "romance"),
      choice("quiet_gossip", "다른 모임 사람에게 몰래 평판을 묻는다", "당사자 모르게 빠른 정보를 얻지만 소문일 수 있다.", "지금: 10만원 · 앞으로: 미확인 소문", 100000, "risky")
    ];
  }

  function moneyChoices(mystery) {
    const demand = getRoute().id === "broker" ? 4800000 : 3200000;
    return [
      choice("pay_crisis", "사랑을 증명하려 바로 보낸다", "질문하지 않고 요청된 계좌로 전액 송금한다.", `지금: ${formatWon(demand)} · 앞으로: 일정 유지, 회수 어려움`, demand, "risky"),
      choice("verify_transfer", "원본을 확인하고 수취인에게 직접 보낸다", "독립 통역과 서류를 확인한 뒤 실제 당사자 계좌만 사용한다.", "지금: 30만원·3일 · 앞으로: 돈 관련 단서", 300000, "investigate"),
      choice("hard_refusal", "‘돈 얘기면 끝’이라고 선을 긋는다", "사정 확인 없이 모든 금전 이야기를 사기의 신호로 선언한다.", "지금: 돈 보존 · 앞으로: 진심인 상대도 크게 상처", 0, "risky"),
      choice("fake_transfer", "가짜 송금 화면으로 반응을 떠본다", "돈을 보낸 척하고 누가 가장 먼저 확인하는지 본다.", "지금: 비용 없음 · 성공 시 단서, 들키면 치명적", 0, "risky")
    ];
  }

  function investigationChoices(mystery) {
    const remainingClues = Object.values(mystery.clues).filter(cl => !state.evidence.some(e => e.id === cl.id));
    return [
      choice("hire_investigator", "독립 현지 조사원을 고용한다", "거주·직장·가족·업체 연결을 합법적인 범위에서 확인한다.", "지금: 150만원·5일 · 앞으로: 검증된 강한 자료", 1500000, "investigate"),
      choice("digital_verify", "사진·메시지·사이트 원본을 대조한다", "촬영일·삭제 대화·계정 생성일처럼 디지털 흔적을 확인한다.", "지금: 45만원·3일 · 앞으로: 원본 단서", 450000, "investigate"),
      choice("ask_local", "현지 지인에게 빨리 물어본다", "값은 싸지만 그 사람의 이해관계와 기억은 확인되지 않는다.", "지금: 10만원·1일 · 앞으로: 소문 1개", 100000, "risky"),
      choice("snoop_phone", "잠든 사이 휴대폰을 몰래 본다", "자료를 찾을 수 있지만 사생활 침해가 들키면 관계가 무너진다.", `지금: 비용 없음 · 남은 핵심자료 ${remainingClues.length}개`, 0, "risky")
    ];
  }

  function interrogationContent(index) {
    const mystery = getCase();
    const statement = mystery.statements[index];
    const partner = getPartner();
    const isBrokerLine = mystery.culprit === "broker" && index === 1;
    return {
      speaker: isBrokerLine ? "업체 실장" : partner.name,
      mood: state.pressed[index] ? "추가 설명을 기다림" : "긴장",
      portrait: !isBrokerLine,
      caption: `진술 ${index + 1} / 2 · 틀린 증거는 관계를 크게 해칩니다`,
      text: state.pressed[index] ? statement.press : "지금 가진 증거를 꺼내기 전에, 문장 안에서 확인할 부분을 찾자.",
      statement,
      statementIndex: index,
      choices: [
        choice(`press_${index}`, "더 구체적으로 묻는다", "사람을 범인으로 몰지 않고 날짜·계좌·원본을 질문한다.", "지금: 설명 추가 · 틀려도 큰 패널티 없음", 0, "investigate"),
        choice(`present_${index}`, "이 진술에 증거를 제시한다", "수첩에서 이 문장과 직접 모순되는 자료를 고른다.", "성공: 모순 확정 · 실패: 신뢰 -12, 침착함 -1", 0, "evidence"),
        choice(`pass_${index}`, "아직 판단하지 않고 넘긴다", "관계를 해치지 않지만 이 모순은 확인되지 않은 채 남는다.", "지금: 안전 · 앞으로: 최종 확신 부족", 0, "romance")
      ]
    };
  }

  function decisionChoices() {
    const route = getRoute();
    const choices = [
      choice("decide_marry", "그녀를 믿고 결혼한다", "남은 모순까지 감수하고 함께 살기로 결정한다.", "진심이면 큰 행복 · 사기면 큰 금전·관계 손실", route.id === "broker" ? 16320000 : 6500000, "romance"),
      choice("decide_postpone", "결혼은 미루고 관계를 더 본다", "사기라고 단정하지 않고 혼인·송금·비자 절차를 멈춘다.", "오판 위험 최소 · 관계와 시간은 일부 잃음", 0, "investigate"),
      choice("decide_partner", `${getPartner().name}을 사기라고 지목한다`, "수집한 증거로 상대가 처음부터 속였다고 공개적으로 결론 낸다.", "맞으면 해결 · 틀리면 관계 즉시 파탄과 평판 피해", 0, "risky")
    ];
    if (route.id === "broker" || getCase().culprit === "broker" || getCase().culprit === "both") {
      choices.push(choice("decide_broker", "업체의 개입을 고발한다", "상대를 범인으로 단정하지 않고 계약·송금·압박 구조를 문제 삼는다.", "업체가 범인이면 해결 · 아니면 계약 분쟁과 관계 손상", 0, "risky"));
    }
    return choices;
  }

  function renderGame() {
    if (!state || state.ending) return;
    const scene = scenes[state.scene];
    const content = sceneContent();
    const partner = getPartner();
    const country = getCountry();

    $("#chapter-label").textContent = `${state.scene + 1}장 / ${scenes.length}장`;
    $("#phase-label").textContent = scene.title;
    $("#objective-text").textContent = scene.objective;
    $("#cash-label").textContent = state.debt ? `빚 ${formatWon(state.debt)}` : formatWon(state.cash);
    $("#trust-label").textContent = state.trust;
    $("#calm-label").textContent = state.calm;
    $("#partner-country").textContent = `${country.flag} ${country.name}`;
    $("#partner-name").textContent = `${partner.name} · ${partner.age}세`;
    $("#relationship-label").textContent = relationshipLabel();
    $("#partner-mini-photo").style.cssText = photoStyle(partner.art);
    $("#scene-caption").textContent = content.caption || `${country.flag} ${country.name}`;
    $("#speaker-name").textContent = content.speaker;
    $("#speaker-mood").textContent = content.mood || "";
    $("#dialogue-text").textContent = content.text;

    const visual = $("#scene-visual");
    const bgName = content.bg || scene.bg;
    visual.style.backgroundImage = `url('./assets/cutscenes/${bgName}.webp')`;
    const portraitWrap = $("#portrait-wrap");
    portraitWrap.hidden = content.portrait === false;
    $("#partner-portrait").style.cssText = photoStyle(partner.art);

    const statementBox = $("#statement-box");
    statementBox.hidden = !content.statement;
    if (content.statement) {
      $("#statement-text").textContent = content.statement.text;
      $("#statement-note").textContent = state.pressed[content.statementIndex] ? "추가 설명을 들었습니다. 이제 관련 증거가 있는지 확인하세요." : "먼저 더 묻거나, 직접 모순되는 증거를 제시하세요.";
    }

    $("#feedback-box").hidden = true;
    renderChoices(content.choices);
    updateSidebar();
    saveGame(false);
  }

  function renderChoices(choices) {
    const wrap = $("#choices");
    const template = $("#choice-template");
    wrap.innerHTML = "";
    choices.forEach(item => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.classList.add(`is-${item.style || "plain"}`);
      node.dataset.choice = item.id;
      node.querySelector(".choice-title").textContent = item.title;
      node.querySelector(".choice-description").textContent = item.description;
      node.querySelector(".choice-impact").textContent = item.impact;
      node.querySelector(".choice-cost").textContent = item.cost ? formatWon(item.cost) : "";
      const projectedDebt = Math.max(0, item.cost - state.cash);
      if (projectedDebt && state.debt + projectedDebt >= DEBT_LIMIT) {
        node.querySelector(".choice-cost").textContent += " · 파산 위험";
      }
      node.addEventListener("click", () => handleChoice(item.id));
      wrap.appendChild(node);
    });
  }

  function updateSidebar() {
    $("#evidence-count").textContent = `${state.evidence.length}개`;
    $("#side-cash").textContent = formatWon(state.cash);
    $("#side-debt").textContent = state.debt ? formatWon(state.debt) : "없음";
    $("#side-spent").textContent = formatWon(state.spent);
    $("#side-days").textContent = `${Math.max(0, state.daysLeft)}일`;
    const preview = $("#notebook-preview");
    const latest = [...state.evidence].slice(-3).reverse();
    preview.innerHTML = latest.length ? latest.map(item => `<div class="preview-note"><i>${typeIcon(item.type)}</i><span>${item.title}</span></div>`).join("") : `<p class="preview-empty">아직 기록이 없습니다.</p>`;
  }

  function typeIcon(type) { return type === "fact" ? "✓" : type === "rumor" ? "?" : "◇"; }

  function handleChoice(id) {
    if (id === "continue_scene") return advanceScene();
    if (id.startsWith("press_")) return pressStatement(Number(id.split("_")[1]));
    if (id.startsWith("present_")) return openEvidencePicker(Number(id.split("_")[1]));
    if (id.startsWith("pass_")) {
      passTime(1);
      return showResult({ title: "판단 보류", text: "모순을 확정하지 않았다. 관계는 지켰지만 최종 판단에 쓸 확신도 늘지 않았다.", noApply: true });
    }
    if (id.startsWith("decide_")) return resolveDecision(id);

    const result = resolveAction(id);
    if (!result) return;
    applyDelta(result);
    if (state.ending) return;
    if (state.calm <= 0) return finishEarly("burnout");
    if (state.trust <= 0) return finishEarly("breakup");
    showResult(result);
  }

  function resolveAction(id) {
    const partner = getPartner();
    const player = getPlayer();
    const mystery = getCase();
    const isScam = mystery.culprit !== "none";
    const reactions = {
      warm: `“${partner.voice}”\n\n말끝의 긴장이 조금 풀렸다.`,
      careful: `“확인하는 건 괜찮아요. 저한테도 같은 자료를 보여줘요.”\n\n${partner.personality}. 그래서인지 대답보다 질문 방식을 먼저 살폈다.`,
      hurt: `“저를 이미 정답이 정해진 문제처럼 보는 것 같아요.”\n\n${partner.name}이 시선을 거뒀다.`
    };
    const map = {
      live_video: { title: "화면 속 일상이 이어졌다", text: `즉석 영상에서 ${partner.job}의 근무 공간과 대화 흐름이 자연스럽게 이어졌다. 신원을 완전히 증명하진 않지만 도용 가능성은 낮아졌다.`, trust: 4, days: 2, evidence: { id: "live_video", title: "즉석 영상통화", type: "clue", text: "미리 준비하기 어려운 질문과 주변 풍경에 자연스럽게 답했다.", source: "직접 확인", quality: 2 } },
      slow_chat: { title: "평범한 말이 쌓였다", text: `${reactions.warm}\n대단한 고백보다 퇴근길, 늦은 답장, 싫어하는 음식이 반복해서 기억에 남았다.`, trust: 9, days: 7, evidence: { id: "daily_timeline", title: "일주일의 일상 대화", type: "clue", text: "날짜별 일상과 근무시간이 큰 모순 없이 이어진다.", source: "직접 대화", quality: 2 } },
      translator_intro: { title: "첫 문장의 뜻을 맞췄다", text: `업체와 무관한 통역사가 표현의 온도까지 설명했다. ${partner.name}도 내 말을 같은 방식으로 확인했다.`, trust: 5, days: 2, cost: 300000, costLabel: "독립 통역 1회", evidence: { id: "first_translation", title: "독립 통역 첫 대화", type: "fact", text: "첫 대화를 양쪽 모두에게 독립적으로 역번역해 의미를 확인했다.", source: "독립 통역", quality: 3 } },
      player_honest: { title: "검증은 양쪽을 향했다", text: `현재 형편과 ${player.flaw}는 점까지 말했다. ${partner.name}은 잠시 계산하더니 자기 경계도 더 구체적으로 말했다.`, trust: 10, days: 2, flag: "playerHonest", evidence: { id: "mutual_finance", title: "서로 공개한 재정", type: "fact", text: "주인공도 현금·수입·부채를 같은 기준으로 공개했다.", source: "둘의 대화", quality: 3 } },
      player_polish: { title: "당장은 분위기가 좋아졌다", text: `숫자를 조금 키워 말하자 ${partner.name}의 표정이 편해졌다. 하지만 실제 계약이나 생활비 이야기가 나오면 이 문장이 다시 돌아온다.`, trust: 5, days: 1, flag: "playerLied" },
      player_counter: { title: "면접이 협상으로 바뀌었다", text: `내 수입을 먼저 말한 뒤 같은 항목을 물었다. ${partner.name}은 가족지원과 직업 계획을 구체적으로 답했다.`, trust: 6, days: 2, evidence: { id: "mutual_plan", title: "서로의 생활 조건", type: "fact", text: "일·부채·가족지원·거주 희망을 양쪽이 같은 질문으로 확인했다.", source: "둘의 대화", quality: 3 } },
      contract_review: { title: "계약서에 없는 돈이 보였다", text: "포함 비용과 현지 추가비가 한 문장에 섞여 있었다. 환불 규정은 소개 단계가 지나면 급격히 불리해졌다.", trust: 2, days: 3, cost: 400000, costLabel: "계약 독립 검토", evidence: { id: "route_contract", title: "업체 계약 비용표", type: "fact", text: "계약·성혼·항공·통역·현지 추가비가 서로 다른 항목임을 확인했다.", source: "계약서 독립 번역", quality: 3 } },
      pay_reservation: { title: "일정은 빨라졌고 돈은 묶였다", text: "업체는 태도가 달라질 만큼 친절해졌다. 그러나 예약금은 후보가 바뀌어도 환불이 어렵다는 말을 뒤늦게 덧붙였다.", trust: 3, days: 1, cost: 3000000, costLabel: "업체 추가 예약금", flag: "paidReservation" },
      pretend_agree: { title: "편법이 한 번은 먹혔다", text: isScam ? "잔금을 낼 것처럼 말하자 직원들끼리 ‘다음 단계 대본’을 확인하는 소리가 들렸다." : `직원은 특별한 말을 하지 않았다. 오히려 거짓 동의가 ${partner.name}에게 전달돼 어색함이 남았다.`, trust: isScam ? 0 : -7, calm: isScam ? 1 : -1, days: 1, evidence: isScam ? { id: "broker_whisper", title: "업체 직원의 단계 대화", type: "clue", text: "결정을 유도하는 순서가 미리 정해진 듯한 직원 대화를 들었다.", source: "직접 들음", quality: 2 } : null },
      app_meeting: { title: "말이 날짜가 됐다", text: "내가 직접 예약한 공개 장소에서 만나기로 했다. 돈이나 비자 이야기는 아직 나오지 않았다.", trust: 6, days: 2, flag: "safeMeeting" },
      app_identity: { title: "그녀도 나를 확인했다", text: `${reactions.careful}\n서로 즉석에서 같은 동작과 질문에 답했다.`, trust: 5, days: 2, evidence: { id: "mutual_identity", title: "상호 실시간 확인", type: "clue", text: "두 사람이 실시간 영상과 즉석 질문으로 프로필 도용 위험을 낮췄다.", source: "상호 확인", quality: 2 } },
      app_gift: { title: "상자는 마음보다 먼저 도착했다", text: "그녀는 기뻐했지만 다음 대화부터 가격을 자주 물었다. 호감인지 기대가 올라간 것인지는 아직 모른다.", trust: 5, days: 2, cost: 800000, costLabel: "고가 선물", flag: "moneyCourtship" },
      reference_check: { title: "두 사람의 말이 따로 기록됐다", text: `소개자가 모르는 부분은 모른다고 했고, ${partner.name}의 말과 일치하는 부분만 남겼다.`, trust: 4, days: 2, evidence: { id: "separate_reference", title: "분리된 소개자 진술", type: "clue", text: "소개자의 직접 경험과 전해 들은 말을 구분해 기록했다.", source: "공통 지인", quality: 2 } },
      accept_reference: { title: "만남은 부드럽게 빨라졌다", text: "의심받지 않는다는 안도감 덕분에 대화는 가까워졌다. 다만 소개자가 보증한 범위는 여전히 모호하다.", trust: 7, days: 1 },
      quiet_gossip: { title: "빠른 말에는 출처가 없었다", text: "‘그런 이야기를 들었다’는 답만 돌아왔다. 누가 직접 봤는지는 아무도 말하지 못했다.", trust: -2, days: 1, cost: 100000, costLabel: "주변 사례비", evidence: { id: "early_gossip", title: "출처 없는 초기 평판", type: "rumor", text: "모임 주변에서 좋지 않은 이야기를 들었다지만 직접 본 사람은 확인되지 않았다.", source: "주변 소문", quality: 1 } },
      arrival_direct: { title: "말보다 표정이 먼저 익숙해졌다", text: `${partner.name}이 메뉴판의 사진을 가리키며 웃었다. 완벽히 통하지 않아도 서로 다시 묻는 방식이 생겼다.`, trust: 8, days: 3, cost: 1200000, costLabel: "왕복 항공·기본 체류" },
      arrival_interpreter: { title: "중요한 문장을 정확히 남겼다", text: "독립 통역사는 모르는 표현을 아는 척하지 않았다. 서로의 결혼 동기와 금전 기대를 각자 확인했다.", trust: 6, days: 3, cost: 1500000, costLabel: "항공·체류·독립 통역", evidence: { id: "arrival_record", title: "첫 만남 독립 통역 기록", type: "fact", text: "결혼 동기·직업·가족지원에 대한 양쪽 답변을 역번역해 확인했다.", source: "독립 통역", quality: 3 } },
      arrival_luxury: { title: "화려한 첫날이 남았다", text: `분위기는 분명 좋아졌다. 그러나 ${partner.name}은 내 평소 생활도 늘 이 정도인지 물었다.`, trust: 9, days: 2, cost: 3000000, costLabel: "고급 숙소·선물", flag: "luxuryExpectation" },
      listen_motive: { title: "동기와 마음을 한 문장에 섞지 않았다", text: `${partner.motive}. 그 현실적인 이유와 나에게 느끼는 호감은 동시에 존재할 수 있었다.`, trust: 10, days: 3, evidence: { id: "motive_statement", title: "당사자가 말한 결혼 계기", type: "clue", text: partner.motive, source: "둘만의 대화", quality: 2 } },
      ask_korea: { title: "계획이 구체적인 부분과 빈 부분이 갈렸다", text: "직업과 가족지원은 바로 답했지만 체류 첫 달 계획에서는 잠시 말이 막혔다. 이 침묵만으로는 어느 쪽도 확정할 수 없다.", trust: 3, days: 2, evidence: { id: "korea_plan", title: "한국 생활 계획 답변", type: "clue", text: "직업·거주·가족지원 답변을 항목별로 기록했다. 일부 일정은 아직 비어 있다.", source: "둘만의 대화", quality: 2 } },
      test_love: { title: "시험은 상대에게도 시험이 됐다", text: isScam ? "갑자기 돈이 없다는 말에 그녀는 사랑보다 한국행 일정부터 다시 물었다." : "그녀는 돈보다 왜 중요한 일을 거짓말로 떠보느냐고 화를 냈다.", trust: isScam ? -2 : -12, calm: -1, days: 1, flag: "fakePoverty", evidence: isScam ? { id: "money_first_reaction", title: "가난을 연기했을 때의 반응", type: "clue", text: "수입이 사라졌다는 말 뒤 감정보다 일정·송금 질문이 먼저 나왔다. 단독으로는 결정적이지 않다.", source: "반응 시험", quality: 1 } : null },
      mutual_boundaries: { title: "검사가 아니라 교환이 됐다", text: `${partner.name}은 내 답을 들은 뒤 자기 답도 수정 없이 적었다. 임신과 아이 계획은 ‘원함/원치 않음’뿐 아니라 시기와 검사 동의로 나뉘었다.`, trust: 9, days: 2, evidence: { id: "boundary_sheet", title: "서로 작성한 생활·동의 질문표", type: "fact", text: "아이·임신검사·문신·흡연·직업·송금·첫날밤 동의를 양쪽이 같은 기준으로 답했다.", source: "상호 작성", quality: 3 } },
      body_check: { title: "정보는 얻었지만 사람은 멀어졌다", text: `${reactions.hurt}\n문신이나 나이, 임신 가능성은 확인 항목일 수 있어도 사기의 증거는 아니었다.`, trust: -14, calm: -1, days: 1, flag: "oneSidedCheck" },
      slow_consent: { title: "좋아함과 동의를 분리했다", text: `“그 말은 고마워요. 제가 마음을 바꿔도 화내지 않을 거죠?”\n\n업체 일정은 느려졌지만 ${partner.name}의 대답은 오히려 길어졌다.`, trust: 11, days: 3, evidence: { id: "consent_record", title: "속도와 동의에 대한 합의", type: "fact", text: "결혼 결정과 성적 동의를 분리하고 언제든 의사를 바꿀 수 있다고 합의했다.", source: "둘의 대화", quality: 3 } },
      official_docs: { title: "날짜 하나가 이야기의 뼈대가 됐다", text: "공식 서류와 원본을 대조하자 추측이 아니라 확인할 수 있는 문장이 생겼다.", trust: 1, days: 4, cost: 500000, costLabel: "서류 발급·독립 번역", evidence: mystery.clues.doc },
      trust_no_docs: { title: "오늘의 온도는 지켰다", text: `${reactions.warm}\n다만 확인하지 않은 항목은 믿는 사실이 아니라 아직 모르는 사실로 수첩에 남았다.`, trust: 7, days: 2, flag: "skippedDocs" },
      cheap_rumor: { title: "소문은 결론처럼 들렸다", text: "‘그 동네 사람은 다 안다’는 말은 컸지만 날짜도 당사자도 없었다.", trust: -3, calm: -1, days: 1, cost: 100000, costLabel: "주변 사례비", evidence: { id: `doc_rumor_${state.scene}`, title: "출처 불명 주변 소문", type: "rumor", text: "정확한 날짜와 직접 목격자를 확인하지 못한 이야기다.", source: "주변 소문", quality: 1 } },
      confess: { title: "연애가 시작됐다", text: `${partner.name}은 바로 대답하지 않았다. 한참 뒤 손을 잡으며 말했다.\n\n“의심이 없어져서가 아니라, 그래도 더 알고 싶어서 좋아요.”`, trust: 13, days: 3, flags: { dating: true, sawRomance: true } },
      future_plan: { title: "둘의 미래가 종이 위에 놓였다", text: "낭만적인 대답만 나오진 않았다. 어느 나라에서 살지와 직업 문제에서 첫 اختلاف이 보였지만, 고칠 수 있는 اختلاف이었다.", trust: 8, days: 3, evidence: { id: "one_year_plan", title: "1년 공동생활 계획", type: "fact", text: "거주·직업·생활비·가족지원·아이 계획을 함께 작성했다.", source: "공동 작성", quality: 3 }, flag: "dating" },
      push_kiss: { title: state.charm >= 6 ? "순간은 설레었지만 질문이 남았다" : "멈춰야 할 선을 넘었다", text: state.charm >= 6 ? "그녀가 잠시 웃었지만 ‘다음에는 먼저 물어봐요’라고 분명히 말했다." : `${partner.name}이 뒤로 물러났다. 호감은 동의를 대신하지 못했다.`, trust: state.charm >= 6 ? 3 : -16, calm: state.charm >= 6 ? 0 : -1, days: 1, flag: "pushedIntimacy" },
      pay_crisis: { title: "일정은 유지됐지만 질문은 남았다", text: isScam ? "돈이 도착했다는 확인은 그녀보다 다른 사람에게서 먼저 왔다. 다음 요구가 가능하다는 신호가 됐다." : "실제 급한 문제는 해결됐다. 그러나 확인 없이 큰돈을 보내는 방식은 다음 갈등의 씨앗이 됐다.", trust: isScam ? 2 : 7, calm: -1, days: 1, cost: getRoute().id === "broker" ? 4800000 : 3200000, costLabel: "긴급 송금", flag: "paidCrisis" },
      verify_transfer: { title: "도움과 확인을 함께 했다", text: isScam ? "수취인과 원본을 확인하겠다는 말에 설명이 흔들렸다. 돈은 보내지 않았고 기록 하나가 남았다." : `${partner.name}은 처음엔 서운해했지만 실제 수취인에게 직접 보내자 안도했다.`, trust: isScam ? -2 : 6, days: 3, cost: 300000, costLabel: "독립 통역·확인", evidence: mystery.clues.money },
      hard_refusal: { title: "돈은 지켰고 관계는 다쳤다", text: isScam ? "요구는 즉시 멈췄다. 그러나 상대도 입을 닫아 더 확인할 기회가 사라졌다." : `“사정을 묻지도 않고 저를 사기꾼으로 봤네요.”\n\n${partner.name}의 목소리가 차갑게 가라앉았다.`, trust: isScam ? -4 : -18, calm: 1, days: 1, flag: "harshMoneyRefusal" },
      fake_transfer: { title: isScam ? "편법이 연결고리를 흔들었다" : "거짓 시험이 들켰다", text: isScam ? "가짜 화면을 보내자 원래 수취인이 아닌 사람이 즉시 ‘입금이 안 됐다’고 연락했다." : "실제 문제를 해결하려던 가족이 은행에 확인하면서 거짓 화면이 드러났다.", trust: isScam ? -2 : -22, calm: -1, days: 1, evidence: isScam ? mystery.clues.digital : null, flag: "fakeTransfer" },
      hire_investigator: { title: "사람이 아니라 사실을 확인했다", text: "허가된 기록과 직접 면담을 나눠 조사했다. ‘느낌상 이상하다’는 문장은 보고서에서 제외됐다.", trust: -1, calm: 1, days: 5, cost: 1500000, costLabel: "현지 독립 조사", evidence: mystery.clues.investigate },
      digital_verify: { title: "원본에는 편집되지 않은 시간이 있었다", text: "사진 촬영일, 메시지 앞뒤, 사이트 생성일을 대조했다. 문장보다 삭제와 편집의 순서가 더 많은 말을 했다.", trust: 0, days: 3, cost: 450000, costLabel: "디지털 원본 확인", evidence: mystery.clues.digital },
      ask_local: { title: "쓸모 있을 수도, 독이 될 수도 있는 말", text: "빠른 답을 얻었지만 당사자가 직접 본 것과 다른 사람에게 들은 것이 섞여 있었다.", trust: -2, calm: -1, days: 1, cost: 100000, costLabel: "현지 사례비", evidence: { id: `local_rumor_${state.scene}`, title: "현지에서 들은 평판", type: "rumor", text: "당사자·날짜·원본을 확인하지 못한 주변 이야기다. 증거로 제시하면 위험하다.", source: "현지 소문", quality: 1 } },
      snoop_phone: { title: isScam ? "자료는 찾았고 신뢰도 잃었다" : "의심이 관계를 삼켰다", text: isScam ? "결정적인 화면을 찾았지만 잠금 기록 때문에 몰래 본 사실도 들켰다." : `수상한 대화는 없었다. 대신 ${partner.name}은 침해당한 사생활만 분명히 확인했다.`, trust: isScam ? -12 : -28, calm: -1, days: 1, evidence: isScam ? mystery.clues.digital : null, flag: "snooped" },
      date_rest: { title: "사건 밖의 사람이 다시 보였다", text: `오랜만에 ${partner.name}이 크게 웃었다. 해결된 모순은 없지만, 결론을 내릴 체력은 돌아왔다.`, trust: 9, calm: 2, days: 3, cost: 350000, costLabel: "데이트·휴식" },
      solo_rest: { title: "결론보다 잠을 먼저 선택했다", text: "상담사는 불안한 느낌과 확인된 사실을 종이에 나눠 적게 했다. 같은 자료가 조금 다르게 보였다.", trust: -1, calm: 4, days: 4, cost: 200000, costLabel: "숙소 연장·상담" },
      secret_trace: { title: isScam ? "뒤를 밟아 연결을 확인했다" : "아무것도 없었고 미행만 남았다", text: isScam ? "예상하지 못한 장소에서 사건과 연결된 사람을 만나는 장면을 확인했다." : "그녀는 말한 곳에서 말한 일을 했다. 미행 사실을 알게 된 뒤 내 연락을 받지 않았다.", trust: isScam ? -6 : -24, calm: -1, days: 2, cost: 600000, costLabel: "이동·조사 비용", evidence: isScam ? mystery.clues.investigate : null, flag: "tailed" },
      rush_answer: { title: "불안을 결혼 일정으로 덮었다", text: "업체와 가족은 환영했지만 확인되지 않은 문장들은 사라지지 않았다. 오히려 잔금과 서류 마감이 한꺼번에 다가왔다.", trust: 6, calm: -1, days: 1, cost: getRoute().id === "broker" ? 2500000 : 800000, costLabel: "일정 변경·예약금", flag: "rushedMarriage" }
    };
    return map[id];
  }

  function pressStatement(index) {
    if (state.pressed[index]) {
      showToast("이미 추가 설명을 들었습니다. 이제 증거를 고르거나 판단을 보류하세요.");
      return;
    }
    state.pressed[index] = true;
    passTime(1);
    renderGame();
  }

  function openEvidencePicker(index) {
    const statement = getCase().statements[index];
    const usable = state.evidence;
    openModal("증거 제시", "이 진술과 직접 모순되는 자료는?", `<p class="warning-box">사람의 인상이나 출처 없는 소문을 내밀면 오판 패널티를 받습니다. 제목이 아니라 내용과 출처를 읽으세요.</p><div class="evidence-list">${usable.map(item => evidenceCardHtml(item, true)).join("")}</div>`, element => {
      element.querySelectorAll("[data-evidence]").forEach(button => button.addEventListener("click", () => evaluateEvidence(index, button.dataset.evidence, statement)));
    });
  }

  function evaluateEvidence(index, evidenceId, statement) {
    closeModal();
    const evidence = state.evidence.find(item => item.id === evidenceId);
    const correct = statement.required.includes(evidenceId);
    if (correct) {
      state.confirmed += 1;
      state.trust = clamp(state.trust + 3, 0, 100);
      passTime(1);
      showResult({ title: "모순을 정확히 짚었다", text: `${evidence.title}을(를) 제시했다.\n\n${statement.success}`, days: 1, noApply: true });
    } else {
      state.mistakes += 1;
      state.trust = clamp(state.trust - 12, 0, 100);
      state.calm = clamp(state.calm - 1, 0, 9);
      passTime(1);
      showResult({ title: "증거가 문장을 겨누지 못했다", text: `${evidence.title}은(는) 이 진술을 직접 반박하지 못한다. ${evidence.type === "rumor" ? "출처 없는 소문을 사실처럼 꺼낸 대가가 컸다." : "관련은 있어 보여도 다른 가능성을 배제하지 못했다."}`, bad: true, days: 1, noApply: true });
    }
  }

  function showResult(result) {
    if (state.calm <= 0) return finishEarly("burnout");
    if (state.trust <= 0) return finishEarly("breakup");
    const feedback = $("#feedback-box");
    feedback.hidden = false;
    feedback.classList.toggle("is-bad", Boolean(result.bad || (result.trust || 0) < -5));
    feedback.innerHTML = `<strong>${result.title}</strong><br>${String(result.text).replace(/\n/g, "<br>")}`;
    renderChoices([choice("continue_scene", "다음 장으로", "결과를 수첩과 상태에 반영하고 이야기를 계속한다.", `신뢰 ${state.trust} · 침착함 ${state.calm} · ${state.debt ? `빚 ${formatWon(state.debt)}` : `현금 ${formatWon(state.cash)}`}`, 0, "plain")]);
    updateSidebar();
    saveGame(false);
  }

  function advanceScene(event) {
    if (event) event.preventDefault();
    if (state.debt >= DEBT_LIMIT) return finishEarly("debt");
    state.scene += 1;
    if (state.scene >= scenes.length) return resolveDecision("decide_postpone");
    renderGame();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resolveDecision(id) {
    const mystery = getCase();
    const strong = state.evidence.filter(item => item.quality >= 3 && item.type !== "rumor").length;
    const hasCaseEvidence = state.evidence.filter(item => Object.values(mystery.clues).some(cl => cl.id === item.id)).length;
    const enough = state.confirmed >= 1 && strong >= 2 && hasCaseEvidence >= 2;
    if (id === "decide_marry") {
      const cost = getRoute().id === "broker" ? 16320000 : 6500000;
      spend(cost, getRoute().id === "broker" ? "성혼 잔금·부대비용" : "결혼·이동 준비");
      if (state.ending) return;
      if (mystery.culprit === "none") return finishGame("happy");
      if (mystery.culprit === "broker") return finishGame(enough ? "escape_together" : "broker_loss");
      return finishGame("married_scam");
    }
    if (id === "decide_postpone") return finishGame(mystery.culprit === "none" ? "cautious_love" : "safe_exit");
    if (id === "decide_partner") {
      if (mystery.culprit === "partner" || mystery.culprit === "both") return finishGame(enough ? "case_solved" : "unproven_accusation");
      return finishGame("false_accusation");
    }
    if (id === "decide_broker") {
      if (mystery.culprit === "broker" || mystery.culprit === "both") return finishGame(enough ? "broker_exposed" : "unproven_accusation");
      return finishGame("false_broker_accusation");
    }
  }

  function finishEarly(type) {
    if (!state || state.ending) return;
    const endings = {
      debt: ["GAME OVER · 급전 한도 초과", "사랑보다 이자가 먼저 찾아왔다", "급전과 잔금이 겹치며 고금리 빚이 1,200만원을 넘었다. 조사를 이어 갈 선택지도, 관계를 정리할 여유도 사라졌다.", "nightlife-secret"],
      burnout: ["GAME OVER · 번아웃", "의심이 모든 하루를 삼켰다", "잠과 판단력을 잃은 채 같은 메시지만 반복해서 읽었다. 결론을 내리기 전에 일상과 건강이 먼저 무너졌다.", "broker-suspicion"],
      breakup: ["GAME OVER · 관계 파탄", "확인보다 심문이 앞섰다", "신뢰가 바닥나며 상대는 더 이상 대화에 응하지 않았다. 진실이 무엇이든 확인할 길도 함께 닫혔다.", "airport"]
    };
    renderEnding(endings[type], type);
  }

  function finishGame(type) {
    const partner = getPartner();
    const endings = {
      happy: ["TRUE END · 함께 확인한 사랑", `${partner.name}과 결혼을 선택했다`, "모든 불안을 없앤 뒤 결혼한 것은 아니었다. 둘은 모르는 것을 모른다고 말하고, 돈·일·가족·아이 계획을 계속 확인하는 규칙을 만들었다.", state.trust >= 70 ? "newborn" : "wedding"],
      cautious_love: ["GOOD END · 아직 끝내지 않은 대화", "결혼을 미뤘지만 사랑을 끝내진 않았다", "성급한 결론 대신 장거리 연애와 독립된 재정으로 시간을 더 보기로 했다. 진심인 상대에게 ‘보류’는 거절이 아니라 안전한 약속이 되었다.", "airport"],
      safe_exit: ["SAFE END · 증명 전에는 멈춤", "사기라고 외치지 않고 절차를 중단했다", "혼인·송금·비자 절차를 멈춰 큰 피해는 피했다. 범인을 공개 지목할 정도의 증거는 없었지만, 결혼하지 않을 권리에는 유죄판결이 필요하지 않다.", "airport"],
      case_solved: ["BEST END · 진술 붕괴", "진짜 모순을 증거로 무너뜨렸다", "외모나 소문이 아니라 날짜·계좌·원본·독립 진술을 연결했다. 성급한 의심이 아닌 입증으로 사기 계획을 멈췄다.", "broker-suspicion"],
      broker_exposed: ["BEST END · 배후 확인", "두 사람 사이에 끼어든 구조를 밝혀냈다", "상대를 범인으로 몰지 않고 계약·송금·대본의 연결을 입증했다. 피해자와 공모자를 구분한 판단이었다.", "broker-suspicion"],
      escape_together: ["GOOD END · 업체 밖의 두 사람", "사랑은 남기고 업체와 계약은 끊었다", "업체의 개입을 충분히 의심해 잔금과 중간 송금을 중단했다. 둘은 서둘러 결혼하지 않고 직접 절차를 다시 밟기로 했다.", "romance-start"],
      broker_loss: ["BAD END · 새는 돈", "사랑은 진짜였지만 계약은 아니었다", "그녀를 믿는 것과 업체 비용을 검증하는 일을 같은 선택으로 묶었다. 관계는 남았지만 중간 송금과 추가비용은 돌아오지 않았다.", "broker-suspicion"],
      married_scam: ["GAME OVER · 결혼 뒤 드러난 계획", "사랑이라 믿은 채 모든 절차를 끝냈다", "확인되지 않은 모순을 설렘으로 덮었다. 입국·송금·이탈 계획이 실행되면서 큰 금전 손실과 법적 분쟁이 시작됐다.", getCase().id === "hidden_nightlife" ? "nightlife-secret" : "airport"],
      unproven_accusation: ["BAD END · 맞았지만 입증하지 못했다", "의심은 맞았고 방식은 틀렸다", "실제로 뒤가 구린 사건이었지만 제시한 자료가 직접 모순을 입증하지 못했다. 공개 비난이 앞서며 증거는 사라지고 역으로 분쟁에 휘말렸다.", "broker-suspicion"],
      false_accusation: ["GAME OVER · 거짓 결론", "진심인 사람을 사기꾼으로 만들었다", "불편한 동기와 소문을 범죄의 증거처럼 연결했다. 상대는 큰 상처를 입었고 관계는 물론 주변의 신뢰도 함께 잃었다.", "airport"],
      false_broker_accusation: ["BAD END · 잘못 겨눈 고발", "불리한 계약과 범죄를 구분하지 못했다", "업체 진행이 거칠고 비쌌다는 사실만으로 공모 사기를 단정했다. 계약 분쟁은 남았지만 범죄를 입증할 연결은 없었다.", "broker-suspicion"]
    };
    renderEnding(endings[type], type);
  }

  function renderEnding(data, type) {
    state.ending = type;
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
    $("#ending-grade").textContent = data[0];
    $("#ending-title").textContent = data[1];
    $("#ending-text").textContent = data[2];
    $("#ending-visual").style.backgroundImage = `linear-gradient(0deg, rgba(16,13,21,.48), transparent 55%), url('./assets/cutscenes/${data[3]}.webp')`;
    $("#ending-stats").innerHTML = [
      ["신뢰", `${state.trust} / 100`], ["침착함", `${state.calm} / 9`], ["총지출", formatWon(state.spent)], ["남은 빚", state.debt ? formatWon(state.debt) : "없음"], ["수집 자료", `${state.evidence.length}개`], ["확정한 모순", `${state.confirmed}개`]
    ].map(([label, value]) => `<div class="ending-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
    const mystery = getCase();
    $("#truth-report-body").innerHTML = `<h3>${mystery.label}</h3><p>${mystery.truth}</p><p><strong>범행 주체:</strong> ${mystery.culprit === "none" ? "없음" : mystery.culprit === "partner" ? "상대방" : mystery.culprit === "broker" ? "업체" : "상대방과 업체의 공모"}</p><p><strong>이번 판에 모은 핵심 자료:</strong> ${state.evidence.filter(item => Object.values(mystery.clues).some(cl => cl.id === item.id)).map(item => item.title).join(", ") || "없음"}</p>`;
    showScreen("ending");
  }

  function openNotebook() {
    notebookFilter = "all";
    renderNotebookModal();
  }

  function renderNotebookModal() {
    const counts = {
      all: state.evidence.length,
      fact: state.evidence.filter(e => e.type === "fact").length,
      clue: state.evidence.filter(e => e.type === "clue").length,
      rumor: state.evidence.filter(e => e.type === "rumor").length
    };
    const filtered = notebookFilter === "all" ? state.evidence : state.evidence.filter(e => e.type === notebookFilter);
    const tabs = [["all", "전체"], ["fact", "확인된 사실"], ["clue", "해석이 필요한 단서"], ["rumor", "미확인 소문"]];
    const body = `<div class="notebook-tabs">${tabs.map(([id, label]) => `<button class="notebook-tab${id === notebookFilter ? " is-active" : ""}" data-filter="${id}" type="button">${label} ${counts[id]}</button>`).join("")}</div><div class="evidence-list">${filtered.length ? filtered.map(item => evidenceCardHtml(item, false)).join("") : `<p class="preview-empty">이 분류에는 아직 기록이 없습니다.</p>`}</div><p class="warning-box">수첩은 ‘사기 점수’를 보여주지 않습니다. 확인된 사실도 진심과 사기 양쪽을 지지할 수 있습니다. 최종 결론은 진술과 직접 연결해 판단하세요.</p>`;
    openModal("사건 수첩", "사실 · 단서 · 소문", body, element => {
      element.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => { notebookFilter = button.dataset.filter; renderNotebookModal(); }));
    });
  }

  function evidenceCardHtml(item, selectable) {
    const names = { fact: "확인된 사실", clue: "해석 필요", rumor: "미확인 소문" };
    const tag = selectable ? "button" : "article";
    const attr = selectable ? ` type="button" data-evidence="${item.id}"` : "";
    return `<${tag} class="evidence-card"${attr}><div class="evidence-head"><strong>${typeIcon(item.type)} ${item.title}</strong><span class="evidence-type ${item.type}">${names[item.type]}</span></div><p>${item.text}</p><small>출처: ${item.source} · 신뢰도 ${"●".repeat(item.quality)}${"○".repeat(3 - item.quality)}</small></${tag}>`;
  }

  function openMoney() {
    const player = getPlayer();
    const rows = state.moneyLog.length ? state.moneyLog.map(item => `<div class="money-row"><span>${item.label} · ${item.day}일째</span><strong>${item.amount < 0 ? "+" : "-"}${formatWon(Math.abs(item.amount))}</strong></div>`).join("") : "<p>아직 지출이 없습니다.</p>";
    openModal("재정 상세", "빚은 실제 패널티입니다", `<div class="money-breakdown"><div class="money-row"><span>현재 현금</span><strong>${formatWon(state.cash)}</strong></div><div class="money-row"><span>현재 빚</span><strong>${formatWon(state.debt)}</strong></div><div class="money-row"><span>월 수입</span><strong>${formatWon(player.income)}</strong></div><div class="money-row"><span>누적 지출</span><strong>${formatWon(state.spent)}</strong></div>${rows}</div><p class="warning-box">현금이 모자라면 부족분은 자동으로 급전이 됩니다. 월이 넘어갈 때 약 2.5%의 게임상 이자가 붙고 침착함이 줄어듭니다. 고금리 급전이 1,200만원을 넘으면 즉시 게임오버입니다.</p>`);
  }

  function openHowTo() {
    openModal("게임 방법", "진짜 사랑인가, 계획된 사기인가", `<ol class="guide-list"><li><strong>대화로 사람을 알아보세요</strong><span>연애를 포기하고 조사만 하면 신뢰가 무너집니다. 상대도 당신의 돈·직업·태도를 확인합니다.</span></li><li><strong>사실과 소문을 나누세요</strong><span>국적·외모·문신·야간근무·나이·아이를 원치 않는다는 말은 사기의 증거가 아닙니다.</span></li><li><strong>진술에 맞는 증거를 제시하세요</strong><span>틀린 자료를 내밀면 신뢰 -12, 침착함 -1. 사람보다 문장 안의 날짜·계좌·원본을 겨누세요.</span></li><li><strong>결혼 거절과 공개 비난은 다릅니다</strong><span>결혼은 이유 없이 미룰 수 있지만, 누군가를 사기꾼이라 지목하려면 직접 연결되는 증거가 필요합니다.</span></li><li><strong>돈과 스트레스도 생존 조건입니다</strong><span>고금리 급전 1,200만원, 침착함 0, 신뢰 0 중 하나라도 되면 최종 판단 전에 게임이 끝납니다.</span></li></ol>`);
  }

  function openModal(kicker, title, body, afterRender) {
    $("#modal-kicker").textContent = kicker;
    $("#modal-title").textContent = title;
    $("#modal-body").innerHTML = body;
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
    modalCloseHandler = null;
    if (afterRender) afterRender($("#modal-body"));
    $("#close-modal").focus();
  }

  function closeModal() {
    $("#overlay").hidden = true;
    document.body.style.overflow = "";
    if (modalCloseHandler) modalCloseHandler();
    modalCloseHandler = null;
  }

  function showToast(message) {
    const feedback = $("#feedback-box");
    feedback.hidden = false;
    feedback.classList.remove("is-bad");
    feedback.textContent = message;
    setTimeout(() => { if (feedback.textContent === message) feedback.hidden = true; }, 2400);
  }

  function saveGame(notify = true) {
    if (!state || state.ending) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      if (notify) showToast("현재 사건을 이 기기에 저장했습니다.");
    } catch (_) {
      if (notify) showToast("이 브라우저에서는 저장할 수 없습니다.");
    }
    setSavedButton();
  }

  function continueGame() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!saved || saved.version !== 1) throw new Error("invalid save");
      state = saved;
      showScreen("game");
      renderGame();
    } catch (_) {
      localStorage.removeItem(SAVE_KEY);
      setSavedButton();
      resetSetup();
      showScreen("setup");
    }
  }

  function restartCurrent() {
    if (!window.confirm("현재 진행을 지우고 같은 설정으로 새 사건을 시작할까요? 사건의 진실은 다시 무작위로 정해집니다.")) return;
    setup.playerId = state.playerId;
    setup.countryId = state.countryId;
    setup.routeId = state.routeId;
    setup.partnerId = state.partnerId;
    startGame();
  }

  $("#new-game").addEventListener("click", () => { resetSetup(); showScreen("setup"); });
  $("#continue-game").addEventListener("click", continueGame);
  $("#how-to").addEventListener("click", openHowTo);
  $("#setup-next").addEventListener("click", () => {
    if (setup.step < 3) { setup.step += 1; renderSetup(); window.scrollTo({ top: 0 }); }
    else startGame();
  });
  $$('[data-action="back-title"]').forEach(button => button.addEventListener("click", () => showScreen("title")));
  $("#open-notebook").addEventListener("click", openNotebook);
  $("#mobile-notebook").addEventListener("click", openNotebook);
  $("#money-pill").addEventListener("click", openMoney);
  $("#mobile-status").addEventListener("click", openMoney);
  $("#save-button").addEventListener("click", () => saveGame(true));
  $("#mobile-save").addEventListener("click", () => saveGame(true));
  $("#restart-button").addEventListener("click", restartCurrent);
  $("#close-modal").addEventListener("click", closeModal);
  $("#overlay").addEventListener("click", event => { if (event.target === $("#overlay")) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("#overlay").hidden) closeModal(); });
  $("#retry-case").addEventListener("click", () => {
    setup.playerId = state.playerId; setup.countryId = state.countryId; setup.routeId = state.routeId; setup.partnerId = state.partnerId;
    startGame();
  });
  $("#back-title-end").addEventListener("click", () => { state = null; setSavedButton(); showScreen("title"); });

  setSavedButton();
  if (navigator.serviceWorker && typeof navigator.serviceWorker.register === "function") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
  }
})();
