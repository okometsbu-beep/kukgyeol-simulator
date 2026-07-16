(function () {
  "use strict";

  const DATA = window.KG_DATA;
  const SAVE_KEY = "genuine-evidence-save-v3";
  const DEBT_LIMIT = 12000000;
  const CONFLICT_LIMIT = 100;
  const ROLL_DELAY = window.__KG_FAST_TEST__ ? 0 : 1050;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const screens = {
    title: $("#title-screen"),
    setup: $("#setup-screen"),
    game: $("#game-screen"),
    ending: $("#ending-screen")
  };

  const scenes = [
    { id: "match_event", title: "새로운 매치", objective: "사진 밖의 사람에게 첫 말을 건다", bg: "app-match" },
    { id: "contact", title: "첫 연락", objective: "프로필 밖의 사람을 확인한다", bg: "video-call" },
    { id: "chat_why", title: "왜 나를 골랐어요?", objective: "조건표가 아닌 서로의 이유를 말한다", bg: "first-message" },
    { id: "chat_flirt", title: "자정이 넘은 채팅", objective: "설렘과 과장을 구분하며 호감을 표현한다", bg: "first-message" },
    { id: "self_growth", title: "만나기 전의 일주일", objective: "관계만 기다리지 않고 내 준비도 한다", bg: "video-call" },
    { id: "her_question", title: "그녀의 질문", objective: "나도 검증받는 사람임을 기억한다", bg: "video-call" },
    { id: "first_date_chat", title: "조금 사적인 문답", objective: "조건표가 아닌 사람의 말버릇을 알아간다", bg: "video-call" },
    { id: "route_pressure", title: "만남의 규칙", objective: "만남을 주선한 구조와 비용을 파악한다", bg: "broker-suspicion" },
    { id: "arrival", title: "현지 첫 만남", objective: "통역을 거치지 않은 표정과 말을 살핀다", bg: "airport" },
    { id: "private_talk", title: "둘만의 대화", objective: "결혼을 선택한 진짜 계기를 듣는다", bg: "romance-start" },
    { id: "family_call", title: "화면 너머의 가족", objective: "가족의 기대와 당사자의 뜻을 구분한다", bg: "video-call" },
    { id: "boundaries", title: "서로의 선", objective: "아이·직업·몸·첫날밤에 대한 동의를 확인한다", bg: "romance-start" },
    { id: "speed_pressure", title: "오늘 결정하라는 사람들", objective: "빠른 감정과 빠른 절차를 분리한다", bg: "broker-suspicion" },
    { id: "documents", title: "서류의 날짜", objective: "느낌과 별개로 기본 사실을 검증한다", bg: "broker-suspicion" },
    { id: "romance", title: "마음이 움직이는 밤", objective: "의심만 하다가 관계를 놓치지 않는다", bg: "romance-start" },
    { id: "first_intimacy", title: "조금 더 가까워질까", objective: "호감과 동의를 따로 확인한다", bg: "first-night" },
    { id: "turning_point", title: "지금이라도 말할 수 있다면", objective: "완벽한 사람보다 솔직한 선택을 요구한다", bg: "romance-start" },
    { id: "her_investigation", title: "이번에는 그녀의 확인", objective: "상대가 내 삶을 검증할 권리도 받아들인다", bg: "video-call" },
    { id: "money_crisis", title: "갑작스러운 돈 이야기", objective: "돕는 것과 확인하는 것을 동시에 해낸다", bg: "broker-suspicion" },
    { id: "investigation", title: "보이지 않는 연결", objective: "소문이 아닌 확인 가능한 자료를 찾는다", bg: "nightlife-secret" },
    { id: "anonymous_tip", title: "익명의 제보", objective: "충격적인 주장보다 원본과 발신자를 확인한다", bg: "nightlife-secret" },
    { id: "interrogation_one", title: "첫 번째 진술", objective: "사람이 아니라 모순을 겨눈다", bg: "broker-suspicion" },
    { id: "breathing_room", title: "흔들리는 마음", objective: "스트레스와 관계, 조사 사이의 균형을 잡는다", bg: "nightlife-secret" },
    { id: "interrogation_two", title: "마지막 진술", objective: "결론 전에 남은 모순 하나를 확인한다", bg: "broker-suspicion" },
    { id: "final_check", title: "마지막 한 통", objective: "결론을 바꿀 수 있는 확인을 한 번만 더 한다", bg: "airport" },
    { id: "decision", title: "결혼할 것인가", objective: "사랑, 의심, 모은 증거를 함께 놓고 결정한다", bg: "wedding" },
    { id: "wedding_place", title: "어디서 결혼할까", objective: "양가의 마음과 실제 예산을 함께 본다", bg: "wedding" },
    { id: "wedding_budget", title: "결혼식의 크기", objective: "보여 주는 하루와 결혼 뒤 생활비 사이에서 정한다", bg: "wedding" },
    { id: "wedding_day", title: "결혼식 날", objective: "예상 밖의 요구에 둘이 같은 편으로 대응한다", bg: "wedding" },
    { id: "move_country", title: "어디서 살 것인가", objective: "누가 무엇을 포기하는지 구체적으로 정한다", bg: "airport" },
    { id: "new_home", title: "신혼집의 첫날", objective: "낯선 생활에서 생긴 불편을 말로 풀어낸다", bg: "airport" },
    { id: "household_money", title: "생활비 통장", objective: "공동생활비와 개인 돈의 선을 정한다", bg: "romance-start" },
    { id: "partner_work", title: "그녀의 일", objective: "수입, 체류, 경력을 한꺼번에 따져 본다", bg: "nightlife-secret" },
    { id: "family_remittance", title: "가족에게 보내는 돈", objective: "도움의 액수와 한도를 부부가 합의한다", bg: "video-call" },
    { id: "intimacy_distance", title: "닫힌 방문", objective: "잠자리를 피하는 행동을 곧바로 한 가지 이유로 단정하지 않는다", bg: "nightlife-secret" },
    { id: "intimacy_talk", title: "말하기 어려운 밤", objective: "아이 계획과 부부 사이의 거리를 솔직하게 확인한다", bg: "romance-start" },
    { id: "child_plan", title: "아이를 원하나요", objective: "말로만 넘겼던 생각을 서로 다시 확인한다", bg: "video-call" },
    { id: "health_check", title: "함께 받는 검사", objective: "한 사람의 책임이 아닌 둘의 건강 문제로 다룬다", bg: "video-call" },
    { id: "pregnancy_try", title: "기다리는 달", objective: "가능성과 마음의 준비를 함께 감당한다", bg: "romance-start" },
    { id: "pregnancy_result", title: "두 줄 또는 한 줄", objective: "결과에 따라 다음 계획을 다시 세운다", bg: "newborn" },
    { id: "pregnancy_months", title: "임신 중의 생활", objective: "병원비, 일, 집안일을 현실적으로 나눈다", bg: "newborn" },
    { id: "birth", title: "아이가 태어난 날", objective: "새 가족의 시작을 맞는다", bg: "newborn" },
    { id: "newborn_night", title: "잠들지 못하는 밤", objective: "피로가 원망이 되기 전에 역할을 나눈다", bg: "newborn" },
    { id: "childcare_plan", title: "누가 아이를 돌볼까", objective: "돈, 경력, 돌봄 시간을 함께 계산한다", bg: "newborn" },
    { id: "marriage_crisis", title: "부부싸움", objective: "이기기보다 문제를 끝낼 방법을 고른다", bg: "nightlife-secret" },
    { id: "hidden_after_marriage", title: "결혼 뒤의 낯선 흔적", objective: "야간근무와 숨긴 일을 구분해 확인한다", bg: "nightlife-secret" },
    { id: "anniversary_inquiry", title: "결혼 1년의 심문", objective: "마지막 의심을 증거와 대화로 확인한다", bg: "broker-suspicion" },
    { id: "family_decision", title: "우리 가족의 다음 해", objective: "사랑만이 아니라 함께 살아 낸 결과로 결론을 낸다", bg: "newborn" }
  ];

  const setup = { step: 0, playerId: null, countryId: null, routeId: null, planId: null, partnerId: null, partnerSnapshot: null, candidates: [] };
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
  const shuffle = items => [...items].sort(() => Math.random() - .5);
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const getPlayer = () => DATA.players.find(item => item.id === (state ? state.playerId : setup.playerId));
  const getPartner = () => state ? (state.partnerSnapshot || DATA.people.find(item => item.id === state.partnerId)) : (setup.partnerSnapshot || setup.candidates.find(item => item.id === setup.partnerId) || DATA.people.find(item => item.id === setup.partnerId));
  const getCountry = () => DATA.countries.find(item => item.id === (state ? state.countryId : setup.countryId));
  const getRoute = () => DATA.routes.find(item => item.id === (state ? state.routeId : setup.routeId));
  const getPlan = () => (DATA.paymentPlans[state ? state.routeId : setup.routeId] || []).find(item => item.id === (state ? state.planId : setup.planId));
  const getCase = () => DATA.cases.find(item => item.id === state.caseId);

  function photoStyle(art, kind = "woman", mode = "real") {
    if (kind === "man") {
      const col = art % 3;
      const row = Math.floor(art / 3);
      return `background-image:url('./assets/men.webp');background-size:300% 200%;background-position:${col * 50}% ${row * 100}%`;
    }
    const cols = art.cols || 4;
    const rows = art.rows || 4;
    const lifeMode = mode === "newlywed" || mode === "settled";
    const cell = mode === "profile" ? art.profileCell : mode === "newlywed" ? art.newlywedCell : mode === "settled" ? art.settledCell : art.realCell;
    const col = cell % cols;
    const row = Math.floor(cell / cols);
    const x = cols === 1 ? 0 : (col / (cols - 1)) * 100;
    const y = rows === 1 ? 0 : (row / (rows - 1)) * 100;
    const polish = mode === "profile" ? "filter:brightness(1.08) saturate(1.08) contrast(.96);" : "";
    const file = lifeMode ? `women-${art.sheet}-life.webp` : `women-${art.sheet}.webp`;
    return `background-image:url('./assets/${file}');background-size:${cols * 100}% ${rows * 100}%;background-position:${x}% ${y}%;${polish}`;
  }

  function currentPhotoMode() {
    if (!state) return "profile";
    if (state.flags.weddingCompleted && state.monthsMarried >= 6) return "settled";
    if (state.flags.weddingCompleted) return "newlywed";
    return state.flags.metInPerson ? "real" : "profile";
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
    setup.planId = null;
    setup.partnerId = null;
    setup.partnerSnapshot = null;
    setup.candidates = [];
    renderSetup();
  }

  function setupCopy() {
    return [
      ["주인공을 고르세요", "보유 자금과 말재주·공감·판단·배짱이 서로 다릅니다. 앞으로 고르는 행동의 성공 확률도 달라집니다."],
      ["어느 나라에서 만날까요?", "국가는 사건의 난이도나 사기 확률이 아닙니다. 이름·도시·문화적 대화의 배경만 바뀝니다."],
      ["어떻게 만날까요?", "경로에 따라 비용, 만남의 속도, 얻기 쉬운 정보와 발생 가능한 사건이 달라집니다."],
      ["이용 방식을 선택하세요", "결제 금액은 실제 청구가 아니라 선택한 주인공의 게임 속 자금에서 빠집니다. 상품에 따라 후보와 대화 기능이 달라집니다."],
      ["새로운 프로필", "사진 설명문 대신 이름·나이·도시·직업·관심사와 본인확인 여부만 보여 줍니다. 다음 판에는 같은 얼굴도 다른 이름과 삶으로 조합됩니다."]
    ][setup.step];
  }

  function renderSetup() {
    const [title, guide] = setupCopy();
    $("#setup-title").textContent = title;
    $("#setup-guide").textContent = guide;
    $("#setup-step").textContent = `${setup.step + 1} / 5`;
    $("#setup-progress-bar").style.width = `${(setup.step + 1) * 20}%`;
    screens.setup.classList.toggle("is-dating-app", setup.step >= 3);
    const grid = $("#setup-grid");
    grid.innerHTML = "";
    let items = [];
    let selectedId = null;

    if (setup.step === 0) { items = DATA.players; selectedId = setup.playerId; }
    if (setup.step === 1) { items = DATA.countries; selectedId = setup.countryId; }
    if (setup.step === 2) { items = DATA.routes; selectedId = setup.routeId; }
    if (setup.step === 3) { items = DATA.paymentPlans[setup.routeId] || []; selectedId = setup.planId; }
    if (setup.step === 4) {
      if (!setup.candidates.length) setup.candidates = buildCandidates();
      items = setup.candidates;
      selectedId = setup.partnerId;
    }

    if (setup.step >= 3) {
      grid.insertAdjacentHTML("beforeend", `<div class="dating-app-bar"><div><span class="dating-logo">Lumi</span><small>${setup.step === 3 ? "멤버십" : `${getCountry().flag} ${getCountry().name} 추천`}</small></div><div class="dating-wallet">내 자금 ${formatWon(DATA.players.find(x => x.id === setup.playerId)?.cash || 0)}</div></div>`);
    }

    items.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `selection-card${item.id === selectedId ? " is-selected" : ""}`;
      button.dataset.id = item.id;
      button.setAttribute("aria-pressed", item.id === selectedId ? "true" : "false");
      if (setup.step === 0) {
        button.innerHTML = `<div class="selection-photo is-man" style="${photoStyle(item.art, "man")}"></div><div class="selection-body"><h3>${item.name} · ${item.age}세</h3><p>${item.job} · 월 ${formatWon(item.income)}</p><span class="selection-tag">${item.hook}</span><span class="selection-cost">말재주 ${item.charm} · 공감 ${item.empathy} · 판단 ${item.reason} · 배짱 ${item.courage}</span><span class="selection-cost">보유 ${formatWon(item.cash)}</span></div>`;
      } else if (setup.step === 1) {
        button.innerHTML = `<div class="selection-body"><h3>${item.flag} ${item.name}</h3><p>${item.city}</p><span class="selection-tag">${item.note}</span></div>`;
      } else if (setup.step === 2) {
        button.innerHTML = `<div class="selection-body"><h3>${item.icon} ${item.name}</h3><p>${item.note}</p><span class="selection-tag">속도 ${item.speed}</span><span class="selection-cost">예상 ${item.expected}</span></div>`;
      } else if (setup.step === 3) {
        button.classList.add("payment-plan-card");
        button.innerHTML = `<div class="selection-body"><span class="plan-badge">${item.badge}</span><h3>${item.name}</h3><p>${item.billing}</p><strong class="plan-price">${item.price ? formatWon(item.price) : "무료"}</strong><ul>${item.perks.map(perk => `<li>✓ ${perk}</li>`).join("")}</ul><span class="virtual-pay-note">게임 속 가상 결제</span></div>`;
      } else {
        button.classList.add("dating-profile-card");
        button.innerHTML = `<div class="selection-photo" style="${photoStyle(item.art, "woman", "profile")}"><span class="online-dot"></span>${item.verified ? '<span class="verified-badge">✓ 본인확인</span>' : ""}</div><div class="selection-body"><div class="profile-name-row"><h3>${item.name}, ${item.age}</h3><span>${item.distance}</span></div><p>${item.city} · ${item.job}</p><div class="interest-row">${item.interests.map(tag => `<span>${tag}</span>`).join("")}</div><p class="profile-one-line">“${item.voice}”</p><div class="profile-actions"><span>✕</span><b>♥</b></div></div>`;
      }
      button.addEventListener("click", () => chooseSetupItem(item.id));
      grid.appendChild(button);
    });

    const selected = [setup.playerId, setup.countryId, setup.routeId, setup.planId, setup.partnerId][setup.step];
    $("#setup-next").disabled = !selected;
    if (setup.step === 3 && selected) {
      const plan = (DATA.paymentPlans[setup.routeId] || []).find(x => x.id === selected);
      $("#setup-next").textContent = plan.price ? `${formatWon(plan.price)} 결제하고 프로필 보기` : "무료로 프로필 보기";
    } else $("#setup-next").textContent = setup.step === 4 ? "좋아요 보내고 대화 시작" : "다음";
    renderSetupSummary();
  }

  function chooseSetupItem(id) {
    if (setup.step === 0) setup.playerId = id;
    if (setup.step === 1) { setup.countryId = id; setup.partnerId = null; setup.candidates = []; }
    if (setup.step === 2) { setup.routeId = id; setup.planId = null; setup.partnerId = null; setup.candidates = []; }
    if (setup.step === 3) { setup.planId = id; setup.partnerId = null; setup.candidates = []; }
    if (setup.step === 4) { setup.partnerId = id; setup.partnerSnapshot = setup.candidates.find(item => item.id === id) || null; }
    renderSetup();
  }

  function buildCandidates() {
    const templates = DATA.people.filter(person => person.countryId === setup.countryId);
    const names = shuffle(DATA.profilePools.names[setup.countryId]);
    const faceSlots = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4);
    const premiumBroker = setup.planId === "broker-premium";
    return faceSlots.map((faceSlot, index) => {
      const base = templates.find(person => person.faceSlot === faceSlot);
      const personalitySource = pick(templates);
      const rawAge = premiumBroker ? 24 + Math.floor(Math.random() * 9) : clamp(base.age + Math.floor(Math.random() * 7) - 3, 24, 46);
      const interests = shuffle(DATA.profilePools.interests).slice(0, 3);
      const city = pick(DATA.profilePools.cities[setup.countryId]);
      const tattoo = pick(["none", "none", "none", "small", "small", "large"]);
      const health = pick(["특별히 알려진 불편 없음", "허리 통증이 있어 오래 서 있으면 힘듦", "피부 알레르기가 있어 특정 화장품을 피함", "수술 흉터가 있으나 일상생활에는 지장 없음", "빈혈이 있어 피곤하면 어지러움"]);
      return {
        ...base,
        id: `proc-${setup.countryId}-${Date.now().toString(36)}-${index}-${Math.floor(Math.random() * 9999)}`,
        name: names[index], age: rawAge, job: pick(DATA.profilePools.jobs), city,
        motive: pick(DATA.profilePools.motives), personality: pick(DATA.profilePools.personalities),
        voice: pick(DATA.profilePools.voices), boundary: pick(DATA.profilePools.boundaries), interests,
        distance: `${60 + Math.floor(Math.random() * 980)}km`, verified: setup.planId === "app-premium" ? Math.random() < .85 : Math.random() < .46,
        languageLevel: setup.countryId === "ph" ? 72 + Math.floor(Math.random() * 20) : 18 + Math.floor(Math.random() * 58),
        privateTraits: { tattoo, health, chemistry: 35 + Math.floor(Math.random() * 61), pace: pick(["slow", "slow", "warm", "fast"]) },
        profileDifference: pick(["사진보다 표정이 편안했다", "화면에서 보던 인상보다 말투가 차분했다", "사진 보정은 있었지만 알아보지 못할 정도는 아니었다", "프로필보다 훨씬 수수하고 자연스러웠다"]),
        basePersonality: personalitySource.personality
      };
    });
  }

  function renderSetupSummary() {
    const chosen = [
      DATA.players.find(x => x.id === setup.playerId),
      DATA.countries.find(x => x.id === setup.countryId),
      DATA.routes.find(x => x.id === setup.routeId),
      (DATA.paymentPlans[setup.routeId] || []).find(x => x.id === setup.planId),
      setup.candidates.find(x => x.id === setup.partnerId)
    ].filter(Boolean);
    const box = $("#setup-summary");
    box.hidden = chosen.length < 2;
    if (!box.hidden) box.textContent = chosen.map(x => x.name).join("  ·  ");
  }

  function openPlanCheckout() {
    const plan = (DATA.paymentPlans[setup.routeId] || []).find(item => item.id === setup.planId);
    const player = DATA.players.find(item => item.id === setup.playerId);
    if (!plan || !player) return;
    const amount = plan.price ? formatWon(plan.price) : "0원";
    openModal("Lumi 결제", plan.price ? "멤버십 결제를 확인하세요" : "무료 이용을 시작할까요?", `<div class="checkout-card"><div class="checkout-brand"><b>Lumi</b><span>안전 결제</span></div><div class="checkout-product"><span>${escapeHtml(plan.name)} · ${escapeHtml(plan.billing)}</span><strong>${amount}</strong></div><dl><div><dt>이용자</dt><dd>${escapeHtml(player.name)}</dd></div><div><dt>결제 수단</dt><dd>게임 속 가상 카드 •••• 1027</dd></div><div><dt>결제 후 자금</dt><dd>${formatWon(player.cash - plan.price)}</dd></div></dl><p>실제 돈은 청구되지 않습니다. 이 금액만 게임 속 보유 자금에서 차감됩니다.</p></div><div class="confirm-actions"><button id="cancel-checkout" class="ghost-button" type="button">다른 상품 보기</button><button id="confirm-checkout" class="primary-button" type="button">${plan.price ? `${amount} 결제` : "무료로 시작"}</button></div>`, element => {
      element.querySelector("#cancel-checkout").addEventListener("click", closeModal);
      element.querySelector("#confirm-checkout").addEventListener("click", () => { closeModal(); setup.step = 4; renderSetup(); window.scrollTo({ top: 0 }); });
    });
  }

  function weightedCase(routeId) {
    const all = DATA.cases.filter(item => item.routes.includes(routeId));
    const scamRound = Math.random() < 0.5;
    const available = all.filter(item => scamRound ? ["partner", "both"].includes(item.culprit) : !["partner", "both"].includes(item.culprit));
    const pool = available.length ? available : all;
    const total = pool.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * total;
    for (const item of pool) {
      cursor -= item.weight;
      if (cursor <= 0) return item;
    }
    return pool[pool.length - 1];
  }

  function chooseChildIntent(partner) {
    const words = partner.boundary;
    if (/임신을 원하지|아이 없이|아이 없는/.test(words)) return "no";
    if (/아이 둘|아이를 원|아이 계획/.test(words)) return Math.random() < .72 ? "yes" : "later";
    if (/졸업|2년|1년|30대 이후|당분간/.test(words)) return "later";
    return pick(["yes", "later", "unsure", "unsure"]);
  }

  function chooseIntimacyTruth(mystery) {
    if (["partner", "both"].includes(mystery.culprit) && Math.random() < .48) return "deception";
    return pick(["fatigue", "fear", "medical", "different_child_plan", "fatigue"]);
  }

  function partnerScamActive() {
    return Boolean(state.flags.partnerOriginallyScam && !state.flags.reformed);
  }

  function startGame() {
    const player = DATA.players.find(x => x.id === setup.playerId);
    const partner = setup.partnerSnapshot || setup.candidates.find(x => x.id === setup.partnerId) || DATA.people.find(x => x.id === setup.partnerId);
    const route = DATA.routes.find(x => x.id === setup.routeId);
    const plan = (DATA.paymentPlans[setup.routeId] || []).find(x => x.id === setup.planId) || (DATA.paymentPlans[setup.routeId] || [])[0];
    if (!player || !partner || !route || !plan) return;
    const mystery = weightedCase(route.id);
    state = {
      version: 3,
      playerId: setup.playerId,
      countryId: setup.countryId,
      routeId: setup.routeId,
      planId: plan.id,
      partnerId: setup.partnerId,
      partnerSnapshot: JSON.parse(JSON.stringify(partner)),
      caseId: mystery.id,
      scene: 0,
      cash: player.cash,
      debt: 0,
      spent: 0,
      trust: 43,
      affection: 46,
      conflict: 4,
      calm: player.calm,
      stress: clamp((9 - player.calm) * 7, 8, 45),
      charm: player.charm,
      empathy: player.empathy,
      reason: player.reason,
      courage: player.courage,
      skillXp: { charm: 0, empathy: 0, reason: 0, courage: 0, calm: 0 },
      growthLog: [],
      communicationMode: null,
      communicationClarity: 0,
      languageLevel: partner.languageLevel || 35,
      elapsedDays: 0,
      daysLeft: route.id === "broker" ? 24 : 90,
      evidence: [],
      confirmed: 0,
      mistakes: 0,
      married: false,
      monthsMarried: 0,
      children: 0,
      pregnancy: false,
      pregnancyAttempts: 0,
      partnerIncome: 0,
      monthlyLiving: 2200000,
      monthlyRemittance: 0,
      childIntent: chooseChildIntent(partner),
      intimacyTruth: chooseIntimacyTruth(mystery),
      intimacy: 58,
      fertilityFactor: .82 + Math.random() * .34,
      weddingPlace: null,
      weddingStyle: null,
      homeCountry: null,
      flags: { originalScam: mystery.culprit !== "none", partnerOriginallyScam: ["partner", "both"].includes(mystery.culprit) },
      moneyLog: [],
      pending: null,
      pressed: {},
      ending: null
    };
    spend(plan.price, `${plan.name} 가상 결제`, false);
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
    if (!state.married) state.daysLeft -= days;
    const afterMonth = Math.floor(state.elapsedDays / 30);
    const salaryMonths = afterMonth - beforeMonth;
    if (salaryMonths > 0) {
      const householdIncome = (getPlayer().income * (state.playerIncomeFactor || 1) + (state.partnerIncome || 0)) * salaryMonths;
      earn(householdIncome, `${salaryMonths}개월 가구 수입`);
      if (state.married) {
        state.monthsMarried += salaryMonths;
        const childCost = state.children * 785000;
        const pregnancyCost = state.pregnancy ? 320000 : 0;
        const monthlyCost = state.monthlyLiving + state.monthlyRemittance + childCost + pregnancyCost;
        spend(monthlyCost * salaryMonths, `${salaryMonths}개월 생활비${state.children ? "·양육비" : ""}`);
        state.stress = clamp(state.stress + salaryMonths * (state.children ? 3 : 1), 0, 100);
      }
    }
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
    if (result.affection) state.affection = clamp(state.affection + result.affection, 0, 100);
    else if (result.trust) state.affection = clamp(state.affection + Math.round(result.trust * .45), 0, 100);
    if (result.conflict) state.conflict = clamp(state.conflict + result.conflict, 0, 100);
    else if ((result.trust || 0) < 0) state.conflict = clamp(state.conflict + Math.ceil(Math.abs(result.trust) * .45), 0, 100);
    if (result.calm) {
      state.calm = clamp(state.calm + result.calm, 0, 9);
      state.stress = clamp(state.stress - result.calm * 8, 0, 100);
    }
    if (result.stress) state.stress = clamp(state.stress + result.stress, 0, 100);
    if (result.intimacy) state.intimacy = clamp(state.intimacy + result.intimacy, 0, 100);
    if (result.clarity) state.communicationClarity = clamp(state.communicationClarity + result.clarity, 0, 100);
    if (result.income) earn(result.income, result.incomeLabel || "추가 수입");
    if (result.grow) Object.entries(result.grow).forEach(([stat, amount]) => growStat(stat, amount, result.title));
    if (result.days) passTime(result.days);
    if (result.evidence) addEvidence(result.evidence);
    if (result.children) state.children = Math.max(0, state.children + result.children);
    if (result.set) Object.assign(state, result.set);
    if (result.flag) state.flags[result.flag] = true;
    if (result.flags) Object.assign(state.flags, result.flags);
  }

  function growStat(stat, amount = 1, reason = "경험") {
    if (!(stat in state)) return;
    const before = state[stat];
    state[stat] = clamp(state[stat] + amount, 1, 10);
    if (state[stat] !== before) state.growthLog.unshift({ stat, amount: state[stat] - before, reason, day: state.elapsedDays });
    state.growthLog = state.growthLog.slice(0, 12);
  }

  function gainSkillXp(stat) {
    if (!state.skillXp || !Object.prototype.hasOwnProperty.call(state.skillXp, stat) || stat === "fertility") return "";
    state.skillXp[stat] += 1;
    if (state.skillXp[stat] < 3 || state[stat] >= 10) return `\n\n${statLabel(stat)} 경험 ${state.skillXp[stat]}/3`;
    state.skillXp[stat] = 0;
    growStat(stat, 1, "판정 경험 누적");
    return `\n\n성공 경험이 쌓여 ${statLabel(stat)}가 1 올랐다.`;
  }

  function relationshipLabel() {
    if (state.married) {
      if (state.conflict >= 70) return "결혼 생활이 무너지기 직전";
      if (state.children) return `결혼 ${Math.max(1, state.monthsMarried)}개월 · 아이 ${state.children}명`;
      return `결혼 ${Math.max(1, state.monthsMarried)}개월 · 신혼 생활`;
    }
    if (state.scene < 6) return "앱에서 서로 알아보는 중";
    if (state.scene < 14) return state.trust >= 55 ? "호감이 자라는 중" : "조심스러운 만남";
    if (state.scene < 25) return state.trust >= 65 ? "연애 중 · 진심을 확인하는 중" : "관계가 흔들리는 중";
    return state.trust >= 60 ? "결정을 앞둔 연인" : "결정을 앞둔 두 사람";
  }

  function phaseName() {
    if (state.scene < 6) return "앱에서 알아가기";
    if (state.scene < 17) return "현지 연애";
    if (state.scene < 26) return "진실 확인";
    if (state.scene < 30) return "결혼 준비";
    if (state.scene < 37) return "신혼 생활";
    if (state.scene < 42) return "아이 계획";
    return "가족의 삶";
  }

  function sceneContent() {
    const scene = scenes[state.scene];
    const partner = getPartner();
    const country = getCountry();
    const route = getRoute();
    const mystery = getCase();
    const player = getPlayer();
    const timeText = state.married ? `결혼 ${Math.max(1, state.monthsMarried)}개월째` : `${state.elapsedDays + 1}일째`;
    const common = { speaker: partner.name, mood: "조심스러운 표정", portrait: true, caption: `${getCountry().flag} ${getCountry().name} · ${route.name}`, context: `${phaseName()} · ${timeText}` };
    switch (scene.id) {
      case "match_event":
        return { ...common, speaker: "Lumi", mood: "새 매치", portrait: false, eventCard: true, eventTitle: `${partner.name} 님과 매치됐어요`, eventText: `${partner.city} · ${partner.job}\n서로 좋아요를 보냈습니다. 이제 첫 문장이 관계의 온도를 정합니다.`, text: "프로필 사진이 화면을 가득 채우고, 채팅창 아래에서 커서가 깜박인다.", choices: [
          choice("open_match", "채팅창을 연다", "상대의 언어 수준과 내가 쓸 소통 방법부터 정한다.", "다음: 첫 대화 방법 선택", 0, "romance")
        ] };
      case "contact":
        return { ...common, mood: "답장을 쓰는 중", messages: [
          { side: "her", text: `안녕하세요. ${player.name} 씨 맞죠? 저도 조금 긴장돼요 🙂` },
          { side: "system", text: `상대의 한국어·영어 소통 수준은 약 ${partner.languageLevel}%입니다. 통역 없이 대화하면 말이 어긋날 수 있습니다.` }
        ], text: "어떤 방법으로 첫 대화를 이어 갈까?", choices: [
          choice("chat_text_auto", "자동번역 채팅으로 천천히 말한다", "짧은 문장 하나씩 보내고 번역된 뜻이 맞는지 되묻는다.", "판단 판정 · 성공하면 오해 없이 부담 적은 시작", 0, "investigate", { stat: "reason", base: 58 }),
          choice("chat_voice_slow", "음성메시지와 사진으로 말한다", "목소리·표정·오늘 먹은 음식 사진을 섞어 쉬운 말로 대화한다.", "공감 판정 · 성공하면 설렘과 소통 모두 증가", 0, "romance", { stat: "empathy", base: 55 }),
          choice("chat_video_gesture", "짧은 영상통화를 제안한다", "말이 막히면 손짓과 번역 앱을 함께 쓰기로 한다.", "말재주 판정 · 성공하면 신원 단서와 호감", 0, "romance", { stat: "charm", base: 52 }),
          choice("translator_intro", "독립 통역과 함께 인사한다", "업체와 무관한 통역사가 서로의 첫 문장을 역번역한다.", "30만원 · 소통 정확도 높음 · 통역 기록 확보", 300000, "investigate")
        ] };
      case "chat_why":
        return { ...common, mood: "조금 궁금함", messages: [
          { side: "her", text: `솔직히 물어봐도 돼요? ${player.name} 씨는 왜 저한테 좋아요를 눌렀어요?` },
          { side: "her", text: "사진이 마음에 들어서요, 아니면 외국 사람과 결혼하고 싶어서요?" }
        ], text: "그럴듯한 정답보다 다음 질문으로 이어질 말을 골라야 한다.", choices: [
          choice("why_honest", "사진도 좋았지만 소개글이 더 궁금했다고 말한다", `“${partner.voice}”라는 한 줄을 보고 실제 목소리를 듣고 싶었다고 답한다.`, "공감 판정 · 성공하면 그녀도 국제연애를 택한 이유를 말함", 0, "romance", { stat: "empathy", base: 60 }),
          choice("why_lonely", "혼자 지내는 게 지쳤다고 솔직히 말한다", "외로움을 숨기지 않되 누군가 나를 구해 주길 바라는 건 아니라고 덧붙인다.", "배짱 판정 · 성공하면 인간적인 공감", 0, "romance", { stat: "courage", base: 57 }),
          choice("why_status", "내 조건이면 좋은 남편감이라고 강조한다", "집·수입·한국 생활의 장점을 앞세워 자신을 소개한다.", "말재주 판정 · 성공하면 조건 관심, 실패하면 허세로 보임", 0, "risky", { stat: "charm", base: 46 }),
          choice("why_avoid", "그 질문은 만나서 하자며 넘긴다", "답을 피하고 외모 칭찬만 보낸다.", "호감은 잠깐 증가 · 진심에 대한 신뢰 감소", 0, "risky")
        ] };
      case "chat_flirt":
        return { ...common, mood: "새벽의 웃음", messages: [
          { side: "her", text: "오늘 회사에서 힘들었어요. 그런데 지금은 조금 괜찮아요." },
          { side: "her", text: `당신은 제가 실제로 만나면 사진과 달라도 웃어 줄 거예요?` }
        ], text: "가벼운 농담, 진지한 안심, 과한 약속은 서로 다른 미래를 만든다.", choices: [
          choice("flirt_reassure", "사진보다 표정과 대화가 궁금하다고 답한다", "나도 프로필보다 어색할 수 있다며 첫 만남의 부담을 나눈다.", "공감 판정 · 성공하면 호감·신뢰 크게 증가", 0, "romance", { stat: "empathy", base: 59 }),
          choice("flirt_tease", "그럼 서로 3초 동안 웃지 않기 내기를 하자고 한다", "영상통화 약속을 장난스럽게 잡아 둘만의 농담을 만든다.", "말재주 판정 · 성공하면 특별 대사와 설렘", 0, "romance", { stat: "charm", base: 55 }),
          choice("flirt_promise", "어떤 모습이든 평생 사랑한다고 말한다", "아직 만나지 않았지만 확신하는 사람처럼 큰 약속을 한다.", "성공하면 호감 급상승 · 실패하면 대본처럼 들림", 0, "risky", { stat: "charm", base: 38 }),
          choice("flirt_gift", "피곤하다니 작은 배달 선물을 보낸다", "주소 전체를 묻지 않고 앱의 선물 기능을 사용한다.", "5만원 · 호감 증가 · 돈으로 대화하는 습관 위험", 50000, "romance")
        ] };
      case "self_growth":
        return { ...common, speaker: player.name, mood: "만남을 준비함", portrait: false, text: "답장만 기다리다 보면 내 하루도, 매력도 멈춘다. 현지에서 만나기 전 일주일을 어디에 쓸까?", choices: [
          choice("growth_language", "매일 30분씩 그녀의 언어를 배운다", "인사·감정·돈·동의에 관한 기본 문장을 직접 익힌다.", "7일 · 공감 +1 · 통역 없는 대화 성공률 증가", 120000, "romance"),
          choice("growth_style", "운동하고 옷과 머리를 정돈한다", "사진만 꾸미기보다 자세와 자신감을 함께 다듬는다.", "7일 · 말재주 +1 · 스트레스 감소", 280000, "romance"),
          choice("growth_work", "추가 근무로 여행비를 번다", "연락 시간은 줄지만 현지 만남에 쓸 여유를 만든다.", "7일 · 90만원 수입 · 배짱 +1 · 호감 소폭 감소", 0, "investigate"),
          choice("growth_wait", "온종일 메시지만 기다린다", "빠르게 답하지만 내 생활 리듬을 포기한다.", "호감 소폭 증가 · 스트레스 크게 증가", 0, "risky")
        ] };
      case "her_question":
        return { ...common, mood: "진지함", text: `${partner.name}이 화면 쪽으로 몸을 기울인다.\n\n“${player.name} 씨도 저를 확인하고 있죠? 저도 물어볼게요. 빚은 있어요? 결혼하면 제가 일을 계속해도 돼요?”`, choices: [
          choice("player_honest", "통장과 빚을 있는 그대로 말한다", `현재 현금과 월수입, ${player.flaw}는 점까지 숨기지 않는다.`, "지금: 자존심이 조금 불편 · 앞으로: 거짓말 약점 제거", 0, "romance"),
          choice("player_polish", "수입을 조금 부풀려 안심시킨다", "‘결혼하면 더 벌 수 있다’며 불확실한 계획을 확정처럼 말한다.", "말재주 판정 · 통하면 잠깐 호감, 들키면 큰 약점", 0, "risky", { stat: "charm", base: 52 }),
          choice("player_counter", "대답 뒤 같은 질문을 돌려준다", "내 상황을 먼저 말하고 그녀의 빚·일·가족지원도 묻는다.", "지금: 분위기는 현실적 · 앞으로: 생활 협상 단서", 0, "investigate")
        ] };
      case "first_date_chat":
        return { ...common, mood: "조금 장난스러움", text: `${partner.name}이 준비했다며 휴대폰 메모를 펼친다.\n\n“질문 세 개만 해요. 마지막 연애는 왜 끝났어요? 혼자 있을 때 제일 창피한 습관은? 그리고… 저한테 처음 설렌 순간은?”`, choices: [
          choice("awkward_story", "멋있지 않은 실제 이야기를 들려준다", "외로워서 소개팅 앱을 지웠다 다시 깐 일과 연애에서 피했던 갈등을 말한다.", "지금: 체면↓ · 앞으로: 대사가 더 솔직해짐", 0, "romance"),
          choice("compatibility_quiz", "나도 준비한 질문표를 꺼낸다", "생활패턴·돈·아이·거주지를 빠르게 확인한다.", "지금: 설렘은 적음 · 앞으로: 조건 충돌 조기 발견", 0, "investigate"),
          choice("pickup_line", "능청스러운 답으로 분위기를 잡는다", "‘처음 화면이 켜진 순간’이라며 살짝 과장해 웃음을 노린다.", "말재주 판정 · 성공하면 설렘, 실패하면 준비한 멘트처럼 들림", 0, "risky", { stat: "charm", base: 55 })
        ] };
      case "route_pressure":
        if (route.id === "broker") return { ...common, speaker: "업체 실장", mood: "계약 재촉", text: `“지금 후보가 제일 괜찮습니다. 이번 주 안에 출국하면 잔금 포함 총액은 약 ${formatWon(14630000 + 4690000)}입니다. 오늘 예약금부터 걸죠.”\n\n평균 수치와 내 계약서의 포함 항목은 같은 말이 아니다.`, choices: routeChoices() };
        if (route.id === "app") return { ...common, speaker: partner.name, mood: "기대와 경계", text: `“앱에서 오래 이야기만 하다가 사라지는 사람도 많았어요. 만날 거면 날짜를 정해요. 대신 제 신분증 사진을 먼저 보내라는 건 싫어요.”`, choices: routeChoices() };
        return { ...common, speaker: route.id === "friend" ? "공통 지인" : "모임 운영자", mood: "확신하는 말투", text: `“${partner.name}은 내가 오래 봐서 알아. 걱정할 사람 아니야.”\n\n소개자의 자신감은 참고가 될 수 있지만 공식 확인을 대신하지는 않는다.`, choices: routeChoices() };
      case "arrival":
        return { ...common, mood: "긴장한 웃음", portrait: false, eventCard: true, eventTitle: `${country.city}에 도착했다`, eventText: `왕복 항공권과 체류비가 반영됩니다. 이제 프로필 사진이 아닌 실제 모습으로 관계가 이어집니다.`, context: `현지 첫 만남 · 공항 도착`, text: `입국장을 나서자 ${partner.name}이 먼저 손을 흔든다. 실제로 보니 ${partner.profileDifference}. 화면 밖의 사람이 눈앞에 있다는 사실에 둘 다 한동안 웃기만 했다.\n\n“직접 보니까 저도 말이 안 나오네요. 우선 밥부터 먹을까요?”`, choices: [
          choice("arrival_direct", "둘이 천천히 식사한다", "기본 여행비만 쓰고 통역 없이 쉬운 말로 대화한다.", "지금: 120만원 · 앞으로: 둘만의 리듬", 1200000, "romance"),
          choice("arrival_interpreter", "독립 통역을 하루 고용한다", "업체 통역사가 아닌 사람에게 중요한 말만 정확히 확인한다.", "지금: 여행 120만 + 통역 30만원 · 앞으로: 정확한 기억", 1500000, "investigate"),
          choice("arrival_luxury", "좋은 호텔과 선물로 분위기를 띄운다", "말이 막힐 때 돈을 써서 첫날의 분위기를 끌어올린다.", "지금: 300만원 · 앞으로: 호감↑, 기대수준↑", 3000000, "risky")
        ] };
      case "private_talk":
        return { ...common, mood: "마음을 열까 망설임", text: `조용한 카페에서 통역사가 자리를 비운다. ${partner.name}이 한참 컵만 만지다가 말한다.\n\n“제가 국제결혼을 생각한 이유, 정말 듣고 싶어요? 듣고 나서 저를 계산적인 사람이라고 볼 수도 있어요.”`, choices: [
          choice("listen_motive", "판단하지 않고 끝까지 듣는다", `그녀가 말한 계기: “${partner.motive}”`, "3일 사용 · 결혼을 생각한 이유와 나에 대한 마음을 따로 이해", 0, "romance"),
          choice("ask_korea", "왜 하필 한국인지 구체적으로 묻는다", "생활·직업·가족·체류 계획을 한 항목씩 묻는다.", "지금: 조금 딱딱함 · 앞으로: 계획 검증", 0, "investigate"),
          choice("test_love", "돈이 없어도 결혼할지 떠본다", "실제 상황이 아닌 가난을 연기해 반응을 시험한다.", "지금: 반응을 빨리 봄 · 앞으로: 거짓말 노출 위험", 0, "risky")
        ] };
      case "family_call":
        return { ...common, speaker: `${partner.name}의 가족`, mood: "기대와 긴장", text: `화면에 가족들이 한꺼번에 들어온다. 누군가는 한국 집 크기를 묻고, 누군가는 ${partner.name}에게 현지말로 빠르게 무언가를 재촉한다.\n\n가족이 원하는 것과 그녀가 원하는 것이 같다고 단정할 수 없다.`, choices: [
          choice("family_independent", "독립 통역으로 가족과 따로 이야기한다", "생활비·거주·결혼 속도를 가족과 그녀에게 각각 묻는다.", "30만원·2일 사용 · 가족의 말과 그녀의 말을 비교", 300000, "investigate"),
          choice("family_gift", "분위기를 위해 부모님 선물을 건넨다", "큰 설명 없이 현금성 선물로 첫인상을 부드럽게 만든다.", "지금: 100만원 · 앞으로: 호감↑, 금전 기대↑", 1000000, "risky"),
          choice("family_private", "가족 통화 뒤 그녀의 뜻을 다시 묻는다", "가족 앞에서 답하지 못한 부분을 둘만 있을 때 확인한다.", "지금: 2일 · 앞으로: 당사자 의사 확인", 0, "romance")
        ] };
      case "boundaries":
        return { ...common, mood: "선명한 표정", text: `“${partner.boundary}. 아이, 담배, 직업, 가족에게 보낼 돈은 지금 이야기할 수 있어요. 하지만 몸을 보여 달라거나 건강을 증명하라는 말은 싫어요.”\n\n사적인 신체 정보는 말만으로 확정할 수 없고, 서로 동의해 실제로 가까워진 뒤에야 자연스럽게 알 수 있다.`, choices: [
          choice("mutual_boundaries", "서로 같은 생활 질문에 답한다", "아이 계획·흡연·직업·가족 송금·첫날밤의 속도를 나도 똑같이 답한다.", "어색하지만 공평 · 이후 생활 갈등 예방", 0, "romance"),
          choice("health_boundary", "건강은 필요할 때 함께 검사하자고 제안한다", "지금 몸을 확인하려 하지 않고 결혼·임신 계획이 구체화되면 둘이 같은 검사를 받기로 한다.", "신뢰 증가 · 사적인 정보는 아직 모름", 0, "investigate"),
          choice("slow_consent", "결혼과 첫날밤의 속도를 분리한다", "좋아하는 마음과 성관계·혼인 동의는 별개라고 분명히 말한다.", "지금: 업체 일정과 충돌 · 앞으로: 강요 위험 감소", 0, "romance")
        ] };
      case "speed_pressure":
        return { ...common, speaker: route.id === "broker" ? "업체 실장" : partner.name, mood: "시간 압박", text: route.id === "broker" ? `“두 분 분위기 좋잖아요. 오늘 결혼 약속서에 서명하고 같은 방을 쓰면 일정도 비용도 아낄 수 있습니다.”\n\n직원은 대답하지 않은 침묵까지 동의로 받아 적으려 한다.` : `“가족들이 항공권 날짜부터 잡자고 해요. 우리 좋아하는 건 맞지만, 결혼 날짜까지 오늘 정해야 해요?”`, choices: [
          choice("private_consent", "직원을 내보내고 서로의 뜻만 확인한다", "비용·가족·첫날밤을 하나씩 떼어 예·아니오를 다시 묻는다.", "지금: 일정이 늦어짐 · 앞으로: 압박 주체 확인", 0, "investigate"),
          choice("sign_fast", "분위기가 좋을 때 결혼 약속서에 서명한다", "마음이 바뀌기 전에 예약금과 위약금 서류를 함께 처리한다.", "200만원 지출 · 일정은 빨라지지만 취소 비용 증가", 2000000, "risky"),
          choice("agree_romance_not_schedule", "좋아한다고 말하되 날짜는 거절한다", "감정에 대한 확답과 절차에 대한 보류를 동시에 전한다.", "지금: 업체와 충돌 · 앞으로: 관계와 계약 분리", 0, "romance")
        ] };
      case "documents":
        return { ...common, speaker: "사건 수첩", mood: "사실 확인", text: `사진, 직장, 이전 혼인, 거주지, 송금.\n\n확인은 불신의 선언이 아니라 서로가 같은 사실 위에서 결정하기 위한 절차다. 다만 출처가 불분명한 소문은 오히려 판단을 흐린다.`, choices: [
          choice("official_docs", "공식 서류와 원본 날짜를 확인한다", "독립 번역으로 혼인·재직·사진 원본을 대조한다.", "지금: 50만원 · 앞으로: 검증된 자료 1개", 500000, "investigate"),
          choice("trust_no_docs", "이번에는 그녀의 말을 믿는다", "분위기를 깨지 않고 지금 설명을 받아들인다.", "신뢰 증가 · 확인하지 않은 부분은 그대로 남음", 0, "romance"),
          choice("cheap_rumor", "택시기사와 주변인에게 소문을 묻는다", "빠르고 싸지만 누가 왜 한 말인지 확인하기 어렵다.", "지금: 10만원 · 앞으로: 미확인 소문 1개", 100000, "risky")
        ] };
      case "romance":
        return { ...common, mood: "가까워진 밤", portrait: false, eventCard: true, eventTitle: "좋아한다는 말을 꺼낼 밤", eventText: "조사가 관계를 대신할 수는 없습니다. 지금부터는 맞을 수도, 어색하게 빗나갈 수도 있는 감정의 선택입니다.", text: `비가 그친 뒤 둘은 숙소 앞을 오래 걷는다. ${partner.name}이 먼저 손을 내밀다가 멈춘다.\n\n“오늘은 조사 말고… 그냥 우리 얘기하면 안 돼요?”`, choices: [
          choice("confess", "좋아한다고 솔직하게 고백한다", "확답을 강요하지 않고 지금의 마음만 전한다.", "지금: 관계가 연애로 전환 · 앞으로: 오판할 때 상처도 커짐", 0, "romance"),
          choice("future_plan", "1년 생활계획을 함께 그린다", "어느 나라에서 살지, 일과 돈을 어떻게 나눌지 적어 본다.", "지금: 설렘은 덜함 · 앞으로: 결혼 적합성↑", 0, "investigate"),
          choice("push_kiss", "분위기를 핑계로 먼저 입맞춤한다", "대답을 기다리지 않고 호감이 있다고 가정한다.", "지금: 매력에 따라 성공 가능 · 실패 시 신뢰 급락", 0, "risky")
        ] };
      case "first_intimacy": {
        const unusuallyFast = partnerScamActive() && (partner.privateTraits?.pace === "fast" || route.id === "broker");
        const opening = unusuallyFast && state.affection < 65
          ? `${partner.name}이 예상보다 빠르게 같은 방에서 더 가까워져도 된다고 말한다. 호감이 낮은데도 빠른 친밀감을 허용하는 행동은 하나의 신호일 수 있지만, 사기의 증거는 아니다.`
          : `${partner.name}이 내 손을 잡았다가 잠시 멈춘다. “저도 가까워지고 싶어요. 그런데 오늘이 아니어도 괜찮다고 먼저 말해 줬으면 좋겠어요.”`;
        return { ...common, mood: "설렘과 망설임", portrait: false, eventCard: true, eventTitle: "둘만 남은 밤", eventText: "친밀감은 정보 획득 버튼이 아닙니다. 두 사람 모두 원할 때만 관계가 이어집니다.", text: opening, choices: [
          choice("intimacy_consent", "서로 원하는지 다시 묻고 가까워진다", "피임·건강·멈추고 싶은 신호를 먼저 확인하고 둘 다 동의할 때만 이어 간다.", "공감 판정 · 성공하면 친밀감과 속궁합을 알게 됨", 0, "romance", { stat: "empathy", base: 62 }),
          choice("intimacy_wait", "오늘은 포옹까지만 하자고 말한다", "거절이 아니라 다음에도 안전하게 만날 수 있다는 약속으로 전한다.", "신뢰 증가 · 사적인 신체 정보는 아직 모름", 0, "romance"),
          choice("intimacy_talk_only", "밤을 새워 서로의 연애 경험을 묻는다", "몸보다 경계·피임·질투·싫은 행동을 질문과 답으로 확인한다.", "판단 판정 · 관계 갈등 예방 정보", 0, "investigate", { stat: "reason", base: 58 }),
          choice("intimacy_pressure", "결혼 얘기까지 했으니 거절하지 말라고 한다", "동의를 약속이나 비용의 대가처럼 요구한다.", "매우 위험 · 신뢰 급락 및 즉시 이별 가능", 0, "risky")
        ] };
      }
      case "turning_point":
        return { ...common, mood: "쉽게 읽히지 않는 표정", text: `관계가 깊어졌지만 아직 말하지 않은 부분이 있다는 느낌도 남는다.\n\n“만약 제가 처음에 좋은 사람처럼 보이려고 거짓말한 게 있다면… 지금 말해도 우리에게 기회가 있을까요?”`, choices: [
          choice("offer_fresh_start", "지금 전부 말하면 함께 다시 판단하겠다고 한다", "무조건 용서한다고 약속하지 않고, 숨긴 사실과 앞으로의 행동을 따로 보겠다고 말한다.", "공감+배짱 판정 · 높은 호감과 신뢰라면 마음을 돌릴 기회", 0, "romance", { stat: "empathy", assist: "courage", base: 50 }),
          choice("turning_romance", "일주일 동안 조사 없이 둘만의 추억을 만든다", "소소한 식사와 사진, 둘만 알아듣는 농담을 쌓는다.", "40만원·7일 · 호감 크게 증가 · 새 증거 없음", 400000, "romance"),
          choice("turning_record", "말이 바뀐 부분부터 차분히 적어 보자고 한다", "고백을 유도하지 않고 서로 과장하거나 숨긴 사실을 같은 표에 쓴다.", "판단 판정 · 성공하면 구체적 진술 확보", 0, "investigate", { stat: "reason", base: 61 }),
          choice("turning_threat", "지금 말하지 않으면 사기라고 신고하겠다고 한다", "증거가 충분하지 않은 상태에서 공포로 자백을 받으려 한다.", "매우 위험 · 대화 통로가 닫힐 수 있음", 0, "risky")
        ] };
      case "her_investigation":
        return { ...common, mood: state.flags.playerLied ? "상처와 의심" : "조심스러운 확인", text: state.flags.playerLied ? `“회사와 수입을 찾아봤어요. 당신이 처음 말한 숫자랑 다르던데요. 저만 조사받아야 해요?”` : `“당신 집과 회사도 실제로 보고 싶어요. 저한테 서류를 요구했으니 저도 같은 기준으로 확인해도 되죠?”`, choices: [
          choice("accept_reverse_check", "나도 같은 기준으로 확인받는다", "직장·집·빚 자료를 보여 주고 과장한 말이 있다면 먼저 인정한다.", "조금 불편하지만 서로의 신뢰 증가", 0, "romance"),
          choice("privacy_double_standard", "내 사생활은 다르다며 거절한다", "결혼할 남자의 정보는 믿어야 한다며 확인을 막는다.", "지금: 정보 보호 · 앞으로: 신뢰 크게 하락", 0, "risky"),
          choice("charm_deflect", "농담과 데이트 약속으로 넘긴다", "답을 주지 않고 분위기를 바꿔 이 질문을 미룬다.", "말재주 판정 · 성공해도 질문은 나중에 돌아옴", 0, "risky", { stat: "charm", base: 45 })
        ] };
      case "money_crisis":
        return { ...common, mood: "갑작스러운 위기", text: mystery.event, choices: moneyChoices(mystery) };
      case "investigation":
        return { ...common, speaker: "조사 선택", mood: "시간이 줄어든다", text: `확실한 증거는 대체로 돈이나 시간이 든다. 싼 소문은 빠르지만 잘못된 사람을 범인으로 만들 수 있다.\n\n현재 남은 일정은 ${Math.max(0, state.daysLeft)}일이다.`, choices: investigationChoices(mystery) };
      case "anonymous_tip":
        return { ...common, speaker: "익명의 메시지", mood: "발신자 불명", text: `‘그 사람을 믿지 마세요. 이미 다른 한국 남자와 결혼을 약속했습니다.’\n\n얼굴이 반쯤 가려진 사진 한 장이 따라왔다. 충격적인 내용일수록 누가, 언제, 어떤 원본으로 보냈는지부터 확인해야 한다.`, choices: [
          choice("trace_tip", "발신자와 사진 원본부터 확인한다", "사진 촬영일·잘린 부분·계정 생성일을 독립적으로 대조한다.", "지금: 45만원·3일 · 앞으로: 디지털 핵심자료", 450000, "investigate"),
          choice("show_tip_calmly", "사진을 보여 주고 설명을 요청한다", "사기라고 단정하지 않고 장소·날짜·함께 찍힌 사람을 묻는다.", "지금: 관계 긴장 · 앞으로: 새 진술 확보", 0, "romance"),
          choice("accuse_from_tip", "사진을 근거로 즉시 거짓말이라 몰아붙인다", "발신자와 원본을 확인하기 전에 결론을 공개한다.", "지금: 빠른 반응 · 틀리면 신뢰 급락", 0, "risky"),
          choice("delete_tip", "익명 제보는 보지 않고 지운다", "관계는 지키지만 사실일 가능성까지 함께 버린다.", "지금: 신뢰↑ · 앞으로: 핵심자료를 놓칠 수 있음", 0, "romance")
        ] };
      case "interrogation_one":
        return interrogationContent(0);
      case "breathing_room":
        return { ...common, mood: state.trust >= 60 ? "걱정스러운 눈" : "지친 표정", text: `며칠째 같은 문장을 되짚느라 잠을 설쳤다. 휴대폰 알림이 울릴 때마다 심장이 먼저 뛴다.\n\n${partner.name}: “당신이 저를 알아보는 건지, 잡아내려는 건지 모르겠어요.”`, choices: [
          choice("date_rest", "조사 없는 하루를 보낸다", "시장과 공원을 걷고 서로 좋아하는 것만 이야기한다.", "지금: 35만원·3일 · 신뢰와 침착함 회복", 350000, "romance"),
          choice("solo_rest", "혼자 자고 상담을 받는다", "판단을 미루고 수면·상담으로 스트레스를 먼저 낮춘다.", "지금: 20만원·4일 · 침착함 크게 회복", 200000, "investigate"),
          choice("secret_trace", "쉬는 척하면서 뒤를 밟는다", "상대나 업체의 이동을 몰래 확인한다. 성공하면 강한 자료, 들키면 관계 손상.", "판단 판정 · 지금 60만원, 성공하면 강한 자료", 600000, "risky", { stat: "reason", base: 46, assist: "courage" }),
          choice("rush_answer", "지금 결혼하면 의심을 멈추겠다고 한다", "불안을 빠른 결혼으로 덮는다.", "지금: 일정 단축 · 앞으로: 미확인 위험과 비용 증가", 0, "risky")
        ] };
      case "interrogation_two":
        return interrogationContent(1);
      case "final_check":
        return { ...common, mood: "마지막 기회", text: `결정 전날 밤, 수첩을 다시 펼쳤다. 확인한 자료도 있고 돈과 시간이 없어 놓친 자료도 있다.\n\n마지막으로 한 통만 더 전화할 수 있다. 무엇을 확인할지가 결론보다 중요할 수 있다.`, choices: [
          choice("final_source_call", "처음 정보를 만든 곳에 다시 전화한다", "병원·집주인·직장·은행·계약 당사자 중 현재 사건의 핵심 한 곳을 확인한다.", "판단 판정 · 지금 30만원, 성공하면 핵심자료 1개", 300000, "investigate", { stat: "reason", base: 68 }),
          choice("final_reconcile", "둘이 수첩을 함께 읽고 틀린 부분을 고친다", "내가 오해한 말과 그녀가 숨긴 말을 각각 하나씩 꺼낸다.", "관계 회복 · 새로 확인되는 자료는 없음", 0, "romance"),
          choice("final_post_rumor", "커뮤니티에 사진과 사연을 올려 반응을 본다", "개인정보를 공개해 집단의 추측으로 결론을 얻으려 한다.", "지금: 제보 가능 · 앞으로: 오판·법적 분쟁 위험", 0, "risky")
        ] };
      case "decision":
        return { ...common, speaker: "나", mood: "결정을 앞둔 밤", context: `교제 ${state.elapsedDays + 1}일째 · 결혼 여부를 정하는 자리`, text: `내일이면 결혼 준비를 시작할 수 있다. 하지만 결혼은 엔딩이 아니라 함께 사는 첫날이다.\n\n수첩에는 확인된 사실 ${state.evidence.filter(e => e.type === "fact").length}개, 더 확인할 단서 ${state.evidence.filter(e => e.type === "clue").length}개, 출처가 약한 소문 ${state.evidence.filter(e => e.type === "rumor").length}개가 남아 있다. 이제 사랑을 믿을지, 더 기다릴지, 누군가를 사기라고 지목할지 정해야 한다.`, choices: decisionChoices() };
      case "wedding_place":
        return { ...common, speaker: partner.name, mood: "기대와 걱정", context: `결혼 준비 1주차 · 양가 영상통화`, text: `“우리 가족은 제가 자란 곳에서 하는 결혼식을 보고 싶어 해요. 당신 가족은 한국 예식을 원하고요. 둘 다 하면 좋겠지만, 결혼 뒤 쓸 돈이 너무 줄어들까 봐 걱정돼요.”\n\n예식 장소는 단순한 배경이 아니다. 누구의 가족이 환영받는지, 얼마의 빚을 안고 신혼을 시작할지가 함께 정해진다.`, choices: weddingPlaceChoices() };
      case "wedding_budget":
        return { ...common, speaker: "웨딩 담당자", mood: "선택을 기다림", context: `${state.weddingPlace || "결혼식"} 준비 · 견적 상담`, text: `식장과 기본 일정을 정하자 추가 항목이 한꺼번에 붙었다. 사진, 의상, 식사 인원, 가족 이동, 통역, 영상 촬영.\n\n${partner.name}이 견적서를 내려다본다. “하루를 예쁘게 만들고 싶은 마음은 있어요. 그래도 결혼하고 매달 돈 때문에 싸우는 건 싫어요.”`, choices: weddingBudgetChoices() };
      case "wedding_day":
        return { ...common, speaker: `${partner.name}의 가족`, mood: "갑작스러운 요구", portrait: false, eventCard: true, eventTitle: "결혼식 날", eventText: `${state.weddingPlace || "예식장"} · ${state.weddingStyle || "결혼식"}\n축하가 시작되기 40분 전, 계약에 없던 요구가 들어왔습니다.`, context: `결혼식 당일 · 예식 40분 전`, text: `예식 직전, 가족 한 사람이 약속에 없던 현금 예물을 요구했다. “여기서는 원래 이렇게 한다”는 말과 “지금 거절하면 체면이 무너진다”는 말이 겹친다.\n\n${partner.name}은 난처한 얼굴로 내 쪽을 본다. 지금 대응은 돈뿐 아니라 두 사람이 같은 편인지도 시험한다.`, choices: [
          choice("wedding_calm_talk", "둘이 먼저 기준을 맞춘다", "가족을 잠시 기다리게 하고, 통역과 함께 처음 합의한 금액을 다시 확인한다.", "공감 판정 · 성공하면 가족 체면과 예산을 함께 지킴", 300000, "romance", { stat: "empathy", base: 62 }),
          choice("wedding_firm_refusal", "추가 요구를 단호하게 거절한다", "예식이 늦어져도 계약에 없던 돈은 내지 않겠다고 직접 말한다.", "배짱 판정 · 성공하면 비용 방어, 실패하면 큰 가족 갈등", 0, "risky", { stat: "courage", base: 55 }),
          choice("wedding_pay_extra", "일단 돈을 내고 예식을 진행한다", "오늘 분위기를 지키기 위해 추가 예물을 현금으로 처리한다.", "확실히 예식은 진행 · 400만원 지출, 다음 요구 가능성", 4000000, "risky")
        ] };
      case "move_country":
        return { ...common, speaker: partner.name, mood: "현실적인 표정", portrait: false, eventCard: true, eventTitle: "이제 어디를 집이라고 부를까", eventText: "항공권을 끊기 전에 두 사람이 모두 동의해야 합니다. 선택은 수입·적응·가족관계를 바꿉니다.", context: `혼인 신고 뒤 · 첫 거주지를 정하는 밤`, text: `“결혼식은 끝났지만 이제 진짜 어려운 걸 정해야 해요. 제가 한국으로 가면 일과 가족을 두고 가야 하고, 당신이 여기 오면 당신 수입이 흔들려요. 계속 떨어져 사는 것도 쉬운 답은 아니고요.”`, choices: [
          choice("move_korea", "한국에서 신혼을 시작해 보는 건 어때?", "언어 수업·개인 통장·가족 방문 예산을 보장하는 조건으로 한국행을 제안한다.", "합의 판정 · 250만원 · 내 수입 유지, 그녀 적응 부담", 2500000, "investigate", { stat: "empathy", assist: "reason", base: 56, joint: true, label: "거주 합의" }),
          choice("move_local", `${country.name}에서 1년 살아 보는 건 어때?`, "내 일을 줄이는 대신 그녀의 생활권에서 결혼을 시험해 보자고 제안한다.", "합의 판정 · 400만원 · 관계 이해 증가, 내 수입 감소", 4000000, "romance", { stat: "courage", assist: "empathy", base: 58, joint: true, label: "거주 합의" }),
          choice("move_distance", "6개월만 두 나라를 오가면 어때?", "만나는 날짜와 비용, 연락 규칙을 계약처럼 구체적으로 제안한다.", "합의 판정 · 150만원 · 경력 유지, 외로움 위험", 1500000, "risky", { stat: "reason", base: 50, joint: true, label: "거주 합의" })
        ] };
      case "new_home":
        return { ...common, mood: "낯선 집에서 지침", context: `${state.homeCountry === "korea" ? "한국" : state.homeCountry === "local" ? country.name : "두 나라"} 생활 첫 달`, text: `여행 때는 웃고 넘겼던 차이가 매일 반복되기 시작했다. 음식 냄새, 연락 빈도, 난방 온도, 혼자 있고 싶은 시간까지 모두 생활 문제가 됐다.\n\n“당신은 제가 불편하다고 말하면 왜 바로 해결책부터 말해요? 가끔은 그냥 제 편이라는 말이 먼저 필요해요.”`, choices: [
          choice("home_listen", "오늘은 해결책보다 마음부터 듣는다", "무엇이 제일 외롭고 힘든지 끊지 않고 듣는다.", "공감 판정 · 성공하면 호감과 적응이 크게 오름", 0, "romance", { stat: "empathy", base: 64 }),
          choice("home_rules", "생활 규칙표를 함께 만든다", "집안일, 혼자 있는 시간, 가족 통화 시간을 눈에 보이게 정한다.", "판단 판정 · 성공하면 갈등을 오래 줄임", 0, "investigate", { stat: "reason", base: 60 }),
          choice("home_buy_gifts", "새 가전과 선물로 기분을 바꾼다", "대화를 미루고 필요한 물건을 한꺼번에 사 준다.", "지금 300만원 · 잠깐 호감↑, 문제는 남음", 3000000, "risky")
        ] };
      case "household_money":
        return { ...common, speaker: "나", mood: "계산기를 든 밤", context: `결혼 ${Math.max(1, state.monthsMarried)}개월째 · 첫 가계 회의`, text: `결혼식 카드값과 월세, 식비가 한꺼번에 빠져나갔다. ${partner.name}의 개인 지출과 가족 송금은 아직 정확히 합의하지 않았다.\n\n돈을 모두 합치는 것도, 완전히 숨기는 것도 각각 위험하다. 지금 정한 방식은 이후의 사기 단서와 부부싸움에 직접 영향을 준다.`, choices: [
          choice("money_three_accounts", "생활비·저축·개인 돈을 나눈다", "공동생활비 통장 하나와 각자의 개인 통장을 따로 두고 매달 함께 확인한다.", "판단 판정 · 성공하면 지출 추적과 신뢰가 쉬워짐", 0, "investigate", { stat: "reason", base: 68 }),
          choice("money_all_partner", "생활비 관리를 그녀에게 맡긴다", "내 월급카드를 건네고 집안 돈을 한 사람이 관리하게 한다.", "편함 · 진심이면 효율↑, 속임수가 있으면 피해가 커짐", 0, "romance"),
          choice("money_hide_account", "비상금을 몰래 따로 만든다", "들키지 않게 일부 수입을 다른 계좌로 옮긴다.", "자금 방어 · 들키면 신뢰와 갈등에 큰 타격", 0, "risky", { stat: "courage", base: 52 })
        ] };
      case "partner_work":
        return { ...common, mood: "일하고 싶은 마음", context: `결혼 ${Math.max(2, state.monthsMarried)}개월째 · 취업 이야기`, text: `“집에만 있으면 제가 없어지는 기분이에요. 제 경력을 살릴 수 있으면 좋겠지만, 당장 돈을 벌 수 있는 일도 알아봤어요. 밤에 끝나는 서비스 일도 있고요.”\n\n일은 수입을 늘리지만 부부가 함께 보내는 시간과 새로운 인간관계도 바꾼다.`, choices: [
          choice("work_training", "언어·자격 교육부터 지원한다", "6개월 교육비를 쓰고 경력에 가까운 일을 준비한다.", "지금 200만원 · 이후 월수입 240만원, 적응과 신뢰↑", 2000000, "romance"),
          choice("work_immediate", "바로 구할 수 있는 일을 시작한다", "교대근무가 있는 서비스·생산직으로 빠르게 수입을 만든다.", "다음 달부터 월수입 280만원 · 피로와 야간 귀가 증가", 0, "investigate"),
          choice("work_forbid", "집에 적응할 때까지 일을 막는다", "수입은 내가 책임질 테니 외부 일은 하지 말라고 한다.", "통제는 쉬움 · 호감↓, 갈등↑, 숨은 구직 가능", 0, "risky")
        ] };
      case "family_remittance":
        return { ...common, speaker: partner.name, mood: "미안하지만 단호함", context: `결혼 ${Math.max(3, state.monthsMarried)}개월째 · 가족에게 온 전화`, text: `“엄마 약값과 동생 학비 때문에 매달 돈을 보내고 싶어요. 결혼 전에 말한 건 맞지만, 정확한 액수는 정하지 않았어요.”\n\n가족을 돕는 마음과 우리 집의 빚은 동시에 존재한다. 둘 중 하나를 없는 일처럼 만들 수는 없다.`, choices: [
          choice("remit_negotiate", "증빙과 가계 형편을 보고 한도를 정한다", "필요한 금액을 확인하고 매달 30만원 안에서 다시 의논하기로 한다.", "공감+판단 판정 · 성공하면 가족과 가계 모두 안정", 0, "investigate", { stat: "reason", base: 57, assist: "empathy" }),
          choice("remit_generous", "매달 80만원을 보내기로 한다", "가족의 요청을 넉넉하게 받아들이고 정기송금을 약속한다.", "가족 호감↑ · 매달 지출 80만원", 0, "romance"),
          choice("remit_none", "우리 빚을 갚을 때까지 전부 거절한다", "가족 사정은 더 확인하지 않고 송금을 0원으로 정한다.", "현금 방어 · 상대 호감↓, 가족 갈등↑", 0, "risky")
        ] };
      case "intimacy_distance":
        return { ...common, mood: "눈을 피함", context: `결혼 ${Math.max(4, state.monthsMarried)}개월째 · 반복되는 밤`, text: `최근 한 달, ${partner.name}은 “오늘은 너무 피곤해요”라고 말하며 먼저 방에 들어갔다. 며칠은 방문까지 잠갔다. 아이를 원한다고 했던 말과 지금 행동이 달라 보여 마음이 흔들린다.\n\n하지만 이 행동만으로 이유를 알 수는 없다. 피로, 두려움, 건강 문제, 아이에 대한 생각의 변화, 관계의 거짓말까지 가능성은 여러 개다.`, choices: [
          choice("distance_gentle", "잠자리 대신 요즘 마음부터 묻는다", "거절을 문제 삼지 않고 몸과 마음이 불편한 이유가 있는지 말할 시간을 준다.", "공감 판정 · 성공하면 진짜 이유에 가까운 대화", 0, "romance", { stat: "empathy", base: 60 }),
          choice("distance_check_phone", "잠든 뒤 휴대폰을 확인한다", "다른 사람이나 숨긴 일정이 있는지 몰래 메시지를 본다.", "판단 판정 · 성공하면 단서, 들키면 신뢰 급락", 0, "risky", { stat: "reason", base: 46 }),
          choice("distance_pressure", "부부라면 의무라고 따진다", "아이 약속을 꺼내며 오늘 대답하라고 압박한다.", "즉시 반응 · 호감·신뢰 급락, 갈등 크게 증가", 0, "risky"),
          choice("distance_wait", "이번 달은 믿고 기다린다", "억지로 캐묻지 않고 쉬게 하되 다음 달에 다시 대화하기로 한다.", "신뢰 소폭↑ · 이유는 아직 모름", 0, "romance")
        ] };
      case "intimacy_talk":
        return { ...common, mood: "말하기 어려운 고백", context: `주말 오후 · 둘만 있는 집`, text: `한참 침묵하던 ${partner.name}이 입을 연다.\n\n“아이를 싫어해서인지, 몸이 힘들어서인지, 당신에게 서운해서인지 저도 한 문장으로 말하기 어려워요. 그런데 자꾸 사기인지부터 묻는 눈으로 보면 더 문을 닫게 돼요.”`, choices: intimacyTalkChoices() };
      case "child_plan":
        return { ...common, mood: "진지한 표정", context: `결혼 ${Math.max(5, state.monthsMarried)}개월째 · 아이 계획을 다시 쓰는 날`, text: childPlanText(), choices: childPlanChoices() };
      case "health_check":
        return { ...common, speaker: "부부 상담 간호사", mood: "차분한 설명", context: `가족계획 상담실 · 검사 전`, text: `“나이만으로 임신 여부를 단정할 수는 없습니다. 두 사람의 건강, 시기, 의사를 함께 봐야 해요. 검사를 받아도 결과는 가능성을 보여 줄 뿐 약속을 보장하지 않습니다.”\n\n검사와 상담 비용은 들지만, 막연한 의심을 구체적인 계획으로 바꿀 수 있다.`, choices: [
          choice("health_both", "둘이 함께 기본 검사를 받는다", "두 사람의 건강과 임신 계획을 같은 기준으로 확인한다.", "지금 80만원 · 임신 가능성 정보와 신뢰↑", 800000, "investigate"),
          choice("health_partner_only", "그녀에게만 검사를 요구한다", "내 검사는 미루고 나이와 임신 가능성부터 증명하라고 한다.", "지금 45만원 · 정보 일부, 호감·신뢰↓", 450000, "risky"),
          choice("health_skip", "검사 없이 자연스럽게 기다린다", "비용은 아끼고 6개월 동안 결과를 기다린다.", "지금 무료 · 시간과 불확실성 증가", 0, "romance")
        ] };
      case "pregnancy_try":
        return { ...common, mood: "기대와 부담", context: `가족계획 ${state.pregnancyAttempts + 1}번째 달`, text: `달력에 날짜를 표시했지만 마음까지 계획대로 움직이지는 않는다. ${partner.name}은 기대하면서도 결과가 나오지 않을 때마다 자신이 평가받는 기분이 든다고 말한다.\n\n이 게임의 임신 가능성은 나이, 건강 확인, 아이를 원하는 마음을 반영한 추정치다. 현실의 의학적 진단은 아니다.`, choices: pregnancyChoices() };
      case "pregnancy_result":
        return pregnancyResultContent(common);
      case "pregnancy_months":
        return pregnancyMonthsContent(common);
      case "birth":
        return birthContent(common);
      case "newborn_night":
        return newbornNightContent(common);
      case "childcare_plan":
        return childcareContent(common);
      case "marriage_crisis":
        return { ...common, mood: "감정이 폭발하기 직전", context: `결혼 ${Math.max(10, state.monthsMarried)}개월째 · 밤 11시`, text: `쌓인 피로와 돈 이야기가 한꺼번에 터졌다. ${partner.name}이 “당신은 제가 뭘 해도 사기 가능성부터 계산해요”라고 말했고, 나도 “당신은 불리하면 대화를 끊는다”고 받아쳤다.\n\n이번 싸움은 말 한마디로 끝나지 않는다. 어떤 방식으로 대화할지가 앞으로의 갈등 수치를 바꾼다.`, choices: [
          choice("fight_pause", "20분 쉬고 한 가지 문제만 말한다", "각자 진정한 뒤 오늘은 돈, 아이, 가족 중 하나만 다룬다.", "침착 판정 · 성공하면 갈등 크게 감소", 0, "investigate", { stat: "calm", base: 62 }),
          choice("fight_apologize", "내가 상처 준 말부터 사과한다", "누가 더 잘못했는지 따지기 전에 구체적으로 한 말을 사과한다.", "공감 판정 · 성공하면 호감·신뢰 회복", 0, "romance", { stat: "empathy", base: 58 }),
          choice("fight_win", "지금까지 모은 기록으로 따져 이긴다", "메시지와 지출 내역을 꺼내 상대의 모순을 한꺼번에 공격한다.", "판단 판정 · 사실은 밝힐 수 있지만 관계 손상 위험", 0, "risky", { stat: "reason", base: 64 }),
          ...(state.flags.sharedIntimacy && state.chemistry >= 70 ? [choice("fight_reconnect_intimacy", "서로 원한다면 잠시 안고 가까워질까 묻는다", "말다툼을 덮는 의무가 아니라 둘 다 원할 때 긴장을 풀고, 남은 문제는 내일 다시 이야기한다.", "동의 판정 · 속궁합이 좋으면 친밀감 회복, 문제 자체는 남음", 0, "romance", { stat: "empathy", base: 66, joint: true, label: "서로의 동의" })] : []),
          choice("fight_leave", "짐을 싸서 며칠 집을 나간다", "대화를 끊고 연락을 받지 않은 채 혼자 지낸다.", "스트레스는 잠시↓ · 갈등과 이탈 위험↑", 350000, "risky")
        ] };
      case "hidden_after_marriage":
        return hiddenAfterMarriageContent(common);
      case "anniversary_inquiry":
        return anniversaryContent(common);
      case "family_decision":
        return familyDecisionContent(common);
      default: return common;
    }
  }

  function choice(id, title, description, impact, cost, style, check = null) {
    return { id, title, description, impact, cost, style, check };
  }

  function weddingPlaceChoices() {
    const country = getCountry();
    return [
      choice("wedding_local", `${country.name}에서 먼저 식을 올리는 건 어때?`, "그녀에게 현지 가족과 친구들이 참석하기 쉬운 예식을 제안한다.", "합의 판정 · 600만원 · 현지 가족 호감", 6000000, "romance", { stat: "empathy", base: 68, joint: true, label: "상대의 동의" }),
      choice("wedding_korea", "한국에서 식을 올리는 건 어때?", "그녀의 가족 이동과 통역을 챙긴다는 조건으로 한국 예식을 제안한다.", "합의 판정 · 1,200만원 · 그녀의 외로움 위험", 12000000, "investigate", { stat: "empathy", base: 50, joint: true, label: "상대의 동의" }),
      choice("wedding_both", "두 나라에서 작게 한 번씩 하면 어때?", "큰 한 번 대신 양가가 각각 참여할 수 있는 두 번의 작은 식을 제안한다.", "합의 판정 · 1,800만원 · 빚 위험 큼", 18000000, "romance", { stat: "reason", assist: "empathy", base: 58, joint: true, label: "상대의 동의" })
    ];
  }

  function weddingBudgetChoices() {
    return [
      choice("wedding_small", "가족 중심의 작은 식", "가까운 가족과 친구만 부르고 사진·의상도 기본 항목으로 맞춘다.", "추가 250만원 · 빚 방어, 일부 가족은 아쉬움", 2500000, "investigate"),
      choice("wedding_standard", "무리하지 않는 보통 규모", "식사와 사진, 양가 이동을 챙기되 고가 선택 항목은 줄인다.", "추가 700만원 · 호감과 비용의 균형", 7000000, "romance"),
      choice("wedding_lavish", "가족 체면을 살린 큰 결혼식", "넓은 식장, 많은 하객, 고급 사진과 예물을 선택한다.", "추가 1,500만원 · 양가 호감↑, 결혼 뒤 돈 갈등↑", 15000000, "risky")
    ];
  }

  function intimacyTalkChoices() {
    return [
      choice("intimacy_counsel", "부부 상담과 진료를 함께 받아 본다", "누구 탓인지 정하기 전에 건강과 관계 문제를 둘 다 확인한다.", "지금 35만원 · 공감 판정, 성공하면 숨긴 이유에 가까워짐", 350000, "romance", { stat: "empathy", base: 64 }),
      choice("intimacy_timeline", "말과 행동이 달랐던 날짜를 함께 본다", "아이 이야기, 야근, 다툰 날을 차분히 달력에 표시한다.", "판단 판정 · 성공하면 모순 또는 생활 원인 확인", 0, "investigate", { stat: "reason", base: 60 }),
      choice("intimacy_accuse", "아이를 원한다던 말이 거짓이었냐고 추궁한다", "다른 가능성을 확인하기 전에 처음부터 속인 것인지 답하라고 몰아붙인다.", "빠른 반응 · 맞아도 대화 통로 손상, 틀리면 큰 패널티", 0, "risky"),
      choice("intimacy_believe", "그녀의 설명을 믿고 기다린다", "지금은 증거를 내밀거나 결론 내리지 않고, 다음 상담 날짜만 함께 정한다.", "신뢰↑ · 숨은 문제가 있으면 발견이 늦어짐", 0, "romance")
    ];
  }

  function childPlanText() {
    const partner = getPartner();
    const lines = {
      yes: `“저는 아이를 원해요. 다만 임신이 사랑을 증명하는 시험처럼 되지는 않았으면 해요.”`,
      later: `“아이를 싫어하는 건 아니에요. 지금 바로는 아니고, 생활과 일이 안정된 뒤에 생각하고 싶어요.”`,
      unsure: `“처음에는 아이가 당연하다고 생각했는데, 실제 결혼 생활을 해 보니 아직 자신이 없어요.”`,
      no: `“저는 임신을 원하지 않는다는 생각이 더 분명해졌어요. 결혼했다고 마음을 바꾸겠다고 약속할 수는 없어요.”`
    };
    return `${partner.name}이 먼저 적어 둔 메모를 내민다.\n\n${lines[state.childIntent]}\n\n결혼 전의 짧은 답변과 함께 살아 본 뒤의 마음은 달라질 수 있다. 지금 필요한 것은 강요가 아니라 앞으로 함께 살 수 있는 선택인지 확인하는 일이다.`;
  }

  function childPlanChoices() {
    const base = [
      choice("child_shared_plan", "시기와 조건을 함께 적는다", "건강, 돈, 돌봄, 일을 놓고 언제 다시 결정할지 구체적으로 적는다.", "공감+판단 판정 · 성공하면 아이 문제 갈등 감소", 0, "investigate", { stat: "empathy", base: 56, assist: "reason" }),
      choice("child_demand", "결혼 전 약속을 지키라고 요구한다", "처음 대화에서 한 말을 바꿀 수 없는 계약처럼 꺼낸다.", "압박 · 갈등 크게 증가, 친밀감 하락", 0, "risky"),
      choice("child_accept_choice", state.childIntent === "no" ? "아이 없이 사는 선택을 받아들인다" : "그녀가 준비될 때까지 기다린다", "내가 정말 받아들일 수 있는지 솔직히 말하고 강요하지 않는다.", "호감·신뢰↑ · 아이 계획은 늦어지거나 사라질 수 있음", 0, "romance")
    ];
    if (state.childIntent === "yes") base.unshift(choice("child_start_now", "이번 달부터 준비를 시작한다", "건강 상담을 받고 생활비와 돌봄 계획을 세운다.", "아이 계획 진행 · 검사 비용과 결과 불확실성", 0, "romance"));
    return base;
  }

  function fertilityChance() {
    const age = getPartner().age;
    let base = age < 30 ? 27 : age < 35 ? 21 : age < 38 ? 14 : age < 41 ? 9 : age < 44 ? 5 : 3;
    base *= state.fertilityFactor;
    if (state.flags.healthBoth) base *= 1.12;
    if (state.childIntent === "later") base *= .7;
    if (state.childIntent === "unsure") base *= .55;
    if (state.childIntent === "no") base = 0;
    if (state.intimacy <= 35) base *= .45;
    return clamp(Math.round(base), 0, 45);
  }

  function pregnancyChoices() {
    const chance = fertilityChance();
    const choices = [
      choice("try_pregnancy", "이번 달 함께 시도한다", "서로 동의한 상태에서 한 달을 보내고 결과를 기다린다.", `이번 달 게임상 임신 가능성 ${chance}%`, 0, "romance", { stat: "fertility", base: chance, label: "임신 가능성" }),
      choice("prepare_six_months", "6개월 동안 건강과 생활을 먼저 챙긴다", "수면, 진료, 술·담배, 스트레스를 조절한 뒤 다시 시도한다.", "지금 120만원 · 가능성 소폭↑, 시간 6개월", 1200000, "investigate"),
      choice("stop_trying", "아이 없이 사는 가능성도 함께 이야기한다", "임신만을 결혼의 성공 조건으로 두지 않고 다른 가족 모습을 의논한다.", "압박↓ · 호감↑, 출산은 미뤄짐", 0, "romance")
    ];
    if (chance === 0) choices.shift();
    return choices;
  }

  function pregnancyResultContent(common) {
    if (state.pregnancy) return { ...common, speaker: getPartner().name, mood: "울다가 웃음", context: `임신 확인일 · 병원 앞`, bg: "newborn", portrait: false, eventCard: true, eventTitle: "두 줄이 나타났다", eventText: "기쁨과 동시에 병원비·일·집안일의 계획이 실제 일정으로 바뀝니다.", text: `검사 결과가 확인됐다. ${getPartner().name}은 종이를 몇 번이나 다시 본 뒤 내 손을 잡았다.\n\n“기쁘면서도 무서워요. 이제부터는 말이 아니라 진짜 생활이 바뀌는 거죠?”`, choices: [
      choice("pregnancy_celebrate", "둘만의 작은 축하를 한다", "비싼 선물 대신 좋아하는 음식을 먹고 앞으로 필요한 것을 적는다.", "지금 20만원 · 호감과 안정↑", 200000, "romance"),
      choice("pregnancy_budget", "출산까지의 돈과 역할부터 계산한다", "검사·병원·휴직·생활비를 월별로 적는다.", "판단 판정 · 성공하면 출산기 지출과 갈등 감소", 0, "investigate", { stat: "reason", base: 66 }),
      choice("pregnancy_broadcast", "양가에 바로 크게 알린다", "아직 초기지만 가족과 지인에게 소식을 모두 전한다.", "가족 호감↑ · 기대와 간섭도 함께 증가", 700000, "risky")
    ] };
    return { ...common, speaker: getPartner().name, mood: "애써 담담함", context: `결과를 확인한 아침 · 한 줄`, bg: "romance-start", text: `이번 달에는 임신이 되지 않았다. ${getPartner().name}은 괜찮다고 말했지만 휴지통을 오래 바라봤다.\n\n“다음 달에 또 시험받는 기분이 들까 봐 무서워요. 그래도 우리 둘이 같은 편이면 좋겠어요.”`, choices: [
      choice("pregnancy_retry_care", "세 달 쉬며 상담을 받고 다시 시도한다", "몸과 마음을 회복하고 다음 가능성을 준비한다.", "지금 60만원 · 스트레스↓, 다음 가능성↑", 600000, "romance"),
      choice("pregnancy_retry_now", "다음 달에 바로 다시 시도한다", "기다리지 않고 한 번 더 결과를 확인한다.", `게임상 임신 가능성 ${Math.max(1, fertilityChance() - 2)}% · 실패 시 스트레스↑`, 0, "risky", { stat: "fertility", base: Math.max(1, fertilityChance() - 2), label: "두 번째 임신 가능성" }),
      choice("pregnancy_no_blame", "결과와 관계없이 서로 탓하지 않기로 한다", "출산 여부와 결혼의 가치를 분리해 다시 이야기한다.", "호감·신뢰↑ · 이번에는 임신 시도 종료", 0, "romance")
    ] };
  }

  function pregnancyMonthsContent(common) {
    if (!state.pregnancy) return { ...common, speaker: "나", mood: "다른 미래를 고민함", context: `결혼 ${Math.max(8, state.monthsMarried)}개월째`, text: `임신은 아직 되지 않았다. 두 사람은 치료를 더 시도할지, 입양이나 위탁을 알아볼지, 아이 없이 둘의 삶을 꾸릴지 결정해야 한다. 어느 선택도 자동으로 행복하거나 실패인 것은 아니다.`, choices: [
      choice("family_clinic", "전문 진료를 더 받아 본다", "두 사람이 함께 진료받고 가능한 선택과 비용을 확인한다.", "지금 250만원 · 시간 4개월, 가능성 재도전", 2500000, "investigate"),
      choice("family_adoption", "입양·위탁 정보를 알아본다", "당장 결정하지 않고 필요한 절차와 책임을 함께 공부한다.", "공감 판정 · 성공하면 새로운 가족 계획", 300000, "romance", { stat: "empathy", base: 55 }),
      choice("family_two", "아이 없이 둘의 생활을 선택한다", "출산 압박을 멈추고 부부가 원하는 삶을 다시 설계한다.", "갈등↓ · 서로의 선택이 맞아야 행복 가능", 0, "romance")
    ] };
    return { ...common, speaker: getPartner().name, mood: "몸이 무겁고 예민함", context: `임신 중기 · 병원비와 집안일이 늘어난 달`, bg: "newborn", text: `병원 일정과 몸의 변화로 ${getPartner().name}은 일을 줄였다. 집안일과 생활비는 그대로인데, 작은 말에도 서운함이 커졌다.\n\n“제가 예민한 건 알아요. 그래도 당신이 도와주는 사람이 아니라 같이 책임지는 사람처럼 행동해 줬으면 해요.”`, choices: [
      choice("pregnancy_share_work", "집안일과 병원 일정을 내가 더 맡는다", "주간표를 만들고 실제 시간을 비운다.", "공감 판정 · 성공하면 호감↑, 내 스트레스 소폭↑", 0, "romance", { stat: "empathy", base: 66 }),
      choice("pregnancy_hire_help", "도우미와 배달을 이용한다", "돈을 써서 집안일과 식사 부담을 줄인다.", "지금 180만원 · 둘의 스트레스↓", 1800000, "investigate"),
      choice("pregnancy_keep_work", "수입이 중요하다며 지금처럼 버틴다", "근무와 생활 방식을 바꾸지 않고 출산까지 견딘다.", "현금 보존 · 그녀의 호감↓, 갈등↑", 0, "risky")
    ] };
  }

  function birthContent(common) {
    if (!state.pregnancy) return { ...common, speaker: getPartner().name, mood: "조용한 미소", context: `결혼 ${Math.max(11, state.monthsMarried)}개월째 · 둘이 맞는 아침`, portrait: true, bg: "romance-start", text: `예정했던 출산 장면은 오지 않았다. 대신 두 사람은 어떤 가족으로 살지 아직 선택하는 중이다.\n\n“우리 삶이 실패한 건 아니죠. 다만 서로 원하는 미래가 정말 같은지는 계속 솔직해야 해요.”`, choices: [
      choice("birthless_trip", "둘만의 새 계획을 세운다", "돈, 일, 거주, 아이 문제를 다시 써 내려간다.", "호감·신뢰↑, 결혼 생활 계속", 500000, "romance"),
      choice("birthless_pressure", "마지막으로 가족에게 설득을 부탁한다", "양가 어른을 통해 그녀에게 아이 계획을 다시 압박한다.", "갈등 크게 증가 · 관계 파탄 위험", 0, "risky")
    ] };
    return { ...common, speaker: "나", mood: "기쁨과 두려움", context: `출산 당일 · 가족이 한 명 늘어난 날`, portrait: false, eventCard: true, eventTitle: "아이가 태어났다", eventText: "가족이 한 명 늘었습니다. 출산은 엔딩이 아니라 수면·돈·돌봄을 함께 감당하는 다음 장의 시작입니다.", bg: "newborn", text: `긴 시간이 지나 아이의 울음이 들렸다. ${getPartner().name}은 지친 얼굴로 웃었고, 나는 기쁨과 함께 앞으로 감당할 돈과 밤들이 한꺼번에 떠올랐다.\n\n결혼식과 마찬가지로 출산도 엔딩이 아니다. 이제부터는 두 사람이 부모로서 함께 버틸 수 있는지가 시작된다.`, choices: [
      choice("birth_stay", "곁을 지키고 필요한 연락을 맡는다", "사진보다 회복과 돌봄을 먼저 챙긴다.", "아이 1명 · 호감과 신뢰↑", 1500000, "romance"),
      choice("birth_family_party", "양가 가족을 모두 불러 축하한다", "병실과 회복 상황보다 가족 행사를 크게 연다.", "아이 1명 · 지금 350만원, 가족 호감↑, 그녀 스트레스↑", 3500000, "risky")
    ] };
  }

  function newbornNightContent(common) {
    if (!state.children) return { ...common, speaker: getPartner().name, mood: "조금 편안해짐", context: `결혼 1년 무렵 · 둘의 생활`, bg: "romance-start", text: `아이 울음 대신 두 사람의 생활 리듬이 집을 채웠다. 출산 여부와 별개로 돈, 가족, 친밀감의 문제는 계속 남아 있다.`, choices: [
      choice("couple_reconnect", "정기적으로 둘만의 시간을 만든다", "한 달에 두 번 휴대폰과 조사 이야기를 내려놓고 데이트한다.", "매달 20만원 · 호감과 친밀감↑", 200000, "romance"),
      choice("couple_work", "각자의 일과 돈에 집중한다", "생활은 안정되지만 함께 보내는 시간을 줄인다.", "현금↑ · 친밀감↓", 0, "investigate")
    ] };
    return { ...common, speaker: getPartner().name, mood: "지쳐서 울먹임", context: `출산 뒤 6주 · 새벽 3시`, portrait: false, bg: "newborn", text: `아이가 다시 울었다. ${getPartner().name}은 세 번째로 일어나며 “왜 항상 제가 먼저 깨야 해요?”라고 말했다. 수면 부족은 사랑과 별개로 사람을 날카롭게 만든다.`, choices: [
      choice("night_shift", "밤 돌봄을 교대로 맡는다", "요일을 나누고 내가 맡은 밤에는 먼저 일어난다.", "배짱 판정 · 성공하면 갈등↓, 내 스트레스↑", 0, "romance", { stat: "courage", base: 64 }),
      choice("night_helper", "야간 도우미를 잠시 쓴다", "한 달 동안 도움을 받아 두 사람의 수면을 회복한다.", "지금 250만원 · 스트레스 크게 감소", 2500000, "investigate"),
      choice("night_escape", "출근을 핑계로 다른 방에서 잔다", "내 수면을 지키고 야간 돌봄은 그녀에게 맡긴다.", "내 스트레스↓ · 그녀 호감↓, 갈등 크게 증가", 0, "risky")
    ] };
  }

  function childcareContent(common) {
    if (!state.children) return { ...common, speaker: "나", mood: "계획을 다시 세움", context: `결혼 1년 · 가계 점검`, text: `아이 비용은 들지 않지만 양가 지원과 두 나라 이동비가 계속 나간다. 두 사람은 남은 빚과 각자의 일을 다시 정리해야 한다.`, choices: [
      choice("nochild_debt", "1년 동안 빚부터 갚는다", "여행과 큰 지출을 줄이고 재정을 회복한다.", "현금 회복 · 호감은 조금 정체", 0, "investigate"),
      choice("nochild_business", "둘의 공동 목표에 투자한다", "가게·공부·이사 중 하나를 정해 돈을 쓴다.", "지금 500만원 · 성공 확률은 판단력에 영향", 5000000, "risky", { stat: "reason", base: 54 })
    ] };
    return { ...common, speaker: "가계부", mood: "선택이 필요한 숫자", context: `아이 ${state.children}명 · 월평균 양육비가 시작됨`, text: `영유아 한 명의 게임상 기본 양육비는 월 78만5천원으로 잡았다. 어린이집, 직접 돌봄, 한 사람의 경력 중 무엇을 선택하느냐에 따라 현금과 스트레스가 달라진다.`, choices: [
      choice("care_daycare", "어린이집과 맞벌이를 선택한다", "보육 서비스를 이용하고 두 사람 모두 일을 이어 간다.", "월수입 유지 · 적응 스트레스와 추가비", 800000, "investigate"),
      choice("care_partner_home", "그녀가 당분간 돌봄을 맡는다", "그녀의 수입을 포기하고 집에서 아이를 돌본다.", "월수입 감소 · 경력과 고립 갈등 위험", 0, "risky"),
      choice("care_player_reduce", "내가 근무를 줄여 돌봄을 나눈다", "내 월수입 일부를 포기하고 평일 돌봄 시간을 확보한다.", "공감·호감↑ · 월수입 100만원 감소", 0, "romance")
    ] };
  }

  function hiddenAfterMarriageContent(common) {
    const mystery = getCase();
    const suspicious = ["partner", "both"].includes(mystery.culprit);
    const nightlife = mystery.id === "hidden_nightlife";
    const detail = nightlife ? "노래방 이름이 찍힌 급여 봉투와 새벽 택시 영수증" : suspicious ? "모르는 사람과 주고받은 송금 캡처와 삭제된 일정" : "야간 교육 출석표와 동료들이 찍힌 단체 사진";
    return { ...common, speaker: "나", mood: "심장이 빨라짐", context: `결혼 ${Math.max(12, state.monthsMarried)}개월째 · 서랍에서 나온 흔적`, text: `${detail}가 서랍에서 나왔다. ${getPartner().name}은 바로 설명하지 못하고 “먼저 진정하고 이야기하자”고 말한다.\n\n야간에 일했다는 사실, 숨겼다는 사실, 범죄나 사기에 가담했다는 사실은 서로 다른 문장이다. 하지만 결혼 뒤 숨긴 생활이 있다면 반드시 확인해야 한다.`, choices: [
      choice("after_hire_check", "계좌·근무처·귀가 시간을 확인한다", "합법적인 범위에서 독립 조사와 원본 대조를 맡긴다.", "지금 180만원 · 판단 판정, 강한 증거 가능", 1800000, "investigate", { stat: "reason", base: 68 }),
      choice("after_ask_direct", "흔적을 보여 주고 처음부터 설명해 달라고 한다", "사기라고 단정하지 않고 언제, 왜 숨겼는지 듣는다.", "공감 판정 · 성공하면 자세한 진술 확보", 0, "romance", { stat: "empathy", base: 55 }),
      choice("after_believe", "그녀의 설명을 믿는다", "증거를 더 내밀지 않고 지금 말한 사정을 받아들인다.", "신뢰↑ · 실제 속임수라면 피해가 이어짐", 0, "romance"),
      choice("after_accuse", "처음부터 결혼 사기였다고 선언한다", "계좌와 근무처를 확인하기 전에 결론부터 말한다.", "맞으면 관계 종료 · 틀리면 치명적인 오판", 0, "risky")
    ] };
  }

  function anniversaryContent(common) {
    return { ...common, speaker: getPartner().name, mood: "마지막 답을 기다림", context: `결혼 1주년 · 식탁 위에 놓인 수첩`, text: `“우리가 처음 만났을 때부터 당신은 진짜 사랑인지 사기인지 계속 물었죠. 이제는 저도 묻고 싶어요. 지난 1년을 보고도 나와 계속 살고 싶어요?”\n\n결혼 전 자료와 결혼 뒤 생활 기록을 함께 펼쳤다. 마지막 확인을 할 수도 있고, 지금까지의 설명을 믿을 수도 있다.`, choices: [
      choice("anniversary_check", "남은 한 가지를 끝까지 확인한다", "돈을 받는 사람, 근무처, 업체 연락 중 가장 큰 빈칸 하나를 원본으로 확인한다.", "지금 70만원 · 판단 판정, 최종 증거 가능", 700000, "investigate", { stat: "reason", base: 70 }),
      choice("anniversary_believe", "지난 1년의 행동을 믿는다", "새 증거를 요구하지 않고 지금까지 함께 살아 낸 시간을 선택한다.", "호감·신뢰↑ · 숨긴 일이 있으면 놓칠 수 있음", 0, "romance"),
      choice("anniversary_counsel", "결론 전에 부부 상담을 받는다", "사기 여부와 별개로 반복되는 의심과 싸움의 패턴을 확인한다.", "지금 40만원 · 갈등↓, 공감 판정", 400000, "romance", { stat: "empathy", base: 66 })
    ] };
  }

  function familyDecisionContent(common) {
    const facts = state.evidence.filter(item => item.type === "fact").length;
    return { ...common, speaker: "나", mood: "1년을 돌아봄", context: `결혼 1년 뒤 · 최종 선택`, portrait: state.children === 0, bg: state.children ? "newborn" : "romance-start", text: `결혼식 이후 ${Math.max(12, state.monthsMarried)}개월을 함께 살았다. 아이는 ${state.children}명, 남은 빚은 ${formatWon(state.debt)}, 갈등은 ${state.conflict}/100이다. 수첩에는 확인된 사실 ${facts}개가 남았다.\n\n이제 결혼 전의 약속이 아니라 실제로 함께 산 결과를 놓고 다음 해를 정한다.`, choices: [
      choice("family_stay", "이 가족과 다음 해를 시작한다", "남은 문제를 숨기지 않고 돈·일·아이 계획을 다시 약속한다.", "진심과 생활이 버텼다면 행복한 결말 · 속임수가 남았다면 위험", 0, "romance"),
      choice("family_separate", "더 망가지기 전에 별거한다", "범죄라고 단정하지 않고 돈과 거주를 분리해 안전하게 관계를 멈춘다.", "갈등과 피해 확산 방지 · 관계는 끝나거나 재협상", 0, "investigate"),
      choice("family_accuse", "모은 증거로 사기를 고발한다", "상대 또는 업체가 처음부터 속였다는 결론을 공개한다.", "증거가 맞으면 사건 해결 · 틀리면 치명적인 오판", 0, "risky")
    ] };
  }

  function routeChoices() {
    const route = getRoute();
    if (route.id === "broker") return [
      choice("contract_review", "잔금 전에 계약서를 따로 검토한다", "포함·불포함·환불·추가금 조항을 독립 통역으로 읽는다.", "지금: 40만원·3일 · 앞으로: 업체 모순 확인", 400000, "investigate"),
      choice("pay_reservation", "기회를 놓치기 전에 예약금을 낸다", "업체 일정과 후보 우선권을 유지한다.", "지금: 300만원 · 앞으로: 속도↑, 회수 어려움", 3000000, "risky"),
      choice("pretend_agree", "동의하는 척하고 내부 말을 더 듣는다", "잔금 의사가 있는 것처럼 행동해 업체의 다음 제안을 끌어낸다.", "배짱 판정 · 성공하면 단서 가능, 들키면 신뢰↓", 0, "risky", { stat: "courage", base: 54, assist: "reason" })
    ];
    if (route.id === "app") return [
      choice("app_meeting", "공공장소에서 만날 날짜를 잡는다", "왕복 일정과 숙소를 내가 직접 예약한다.", "지금: 2일 · 앞으로: 실제 신원 확인", 0, "romance"),
      choice("app_identity", "실시간 영상과 일상 인증을 제안한다", "신분증 사본 대신 즉석 질문과 영상으로 확인한다.", "지금: 약간 어색 · 앞으로: 도용 위험 감소", 0, "investigate"),
      choice("app_gift", "마음을 보여 주려고 고가 선물을 보낸다", "주소와 호감을 얻지만 돈으로 관계를 앞당긴다.", "지금: 80만원 · 앞으로: 금전 기대↑", 800000, "risky")
    ];
    return [
      choice("reference_check", "소개자와 그녀에게 따로 묻는다", "소개자가 직접 본 일과 그녀가 한 말을 따로 기록한다.", "2일 사용 · 두 사람의 말을 비교할 수 있음", 0, "investigate"),
      choice("accept_reference", "소개자의 말을 믿고 일정을 잡는다", "추가 확인을 줄이고 그녀와 대화하는 데 시간을 쓴다.", "신뢰 증가 · 소개자가 모르는 부분은 남음", 0, "romance"),
      choice("quiet_gossip", "다른 모임 사람에게 몰래 평판을 묻는다", "당사자 모르게 빠른 정보를 얻지만 소문일 수 있다.", "지금: 10만원 · 앞으로: 미확인 소문", 100000, "risky")
    ];
  }

  function moneyChoices(mystery) {
    const demand = getRoute().id === "broker" ? 4800000 : 3200000;
    return [
      choice("pay_crisis", "사랑을 증명하려 바로 보낸다", "질문하지 않고 요청된 계좌로 전액 송금한다.", `지금: ${formatWon(demand)} · 앞으로: 일정 유지, 회수 어려움`, demand, "risky"),
      choice("verify_transfer", "서류를 확인하고 돈 받을 곳에 직접 보낸다", "독립 통역으로 서류를 읽고 병원·학교처럼 실제 돈을 받아야 하는 곳의 계좌만 사용한다.", "지금 30만원·3일 · 돈 흐름을 확인할 단서", 300000, "investigate"),
      choice("hard_refusal", "‘돈 얘기면 끝’이라고 선을 긋는다", "사정 확인 없이 모든 금전 이야기를 사기의 신호로 선언한다.", "지금: 돈 보존 · 앞으로: 진심인 상대도 크게 상처", 0, "risky"),
      choice("fake_transfer", "가짜 송금 화면으로 반응을 떠본다", "돈을 보낸 척하고 누가 가장 먼저 확인하는지 본다.", "배짱 판정 · 성공하면 단서, 실패하면 거짓 시험이 들킴", 0, "risky", { stat: "courage", base: 48, assist: "reason" })
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

  function firstMissingCaseClue(mystery) {
    return Object.values(mystery.clues).find(cl => !state.evidence.some(saved => saved.id === cl.id)) || null;
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
        choice(`pass_${index}`, "그녀의 설명을 믿는다", "이번에는 증거를 제시하지 않고 그녀가 한 말을 받아들인다.", "설명이 맞으면 신뢰↑ · 거짓이면 위험 신호를 놓침", 0, "romance")
      ]
    };
  }

  function decisionChoices() {
    const route = getRoute();
    const brokerBalance = 19320000 - (getPlan()?.price || 0) - (state.flags.paidReservation ? 3000000 : 0);
    const choices = [
      choice("decide_marry", "결혼을 약속하고 준비를 시작한다", "남은 불확실성을 감수하되, 결혼식과 거주·돈 문제를 하나씩 정하기로 한다.", "결혼은 엔딩이 아님 · 이후 신혼·아이·추가 의심이 이어짐", route.id === "broker" ? Math.max(0, brokerBalance) : 2000000, "romance"),
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

    $("#chapter-label").textContent = `${phaseName()} · ${state.scene + 1}/${scenes.length}`;
    $("#phase-label").textContent = scene.title;
    $("#objective-text").textContent = scene.objective;
    $("#cash-label").textContent = state.debt ? `빚 ${formatWon(state.debt)}` : formatWon(state.cash);
    $("#affection-label").textContent = state.affection;
    $("#conflict-label").textContent = state.conflict;
    $("#player-hud-name").textContent = `${getPlayer().name} · 스트레스 ${state.stress}`;
    $("#stat-charm").textContent = state.charm;
    $("#stat-empathy").textContent = state.empathy;
    $("#stat-reason").textContent = state.reason;
    $("#stat-courage").textContent = state.courage;
    $("#relationship-hud").textContent = relationshipLabel();
    $("#hud-affection").textContent = state.affection;
    $("#hud-trust").textContent = state.trust;
    $("#hud-conflict").textContent = state.conflict;
    $("#hud-children").textContent = `${state.children}명`;
    $("#partner-country").textContent = `${country.flag} ${country.name}`;
    $("#partner-name").textContent = `${partner.name} · ${partner.age}세`;
    $("#relationship-label").textContent = relationshipLabel();
    const photoMode = currentPhotoMode();
    $("#partner-mini-photo").style.cssText = photoStyle(partner.art, "woman", photoMode);
    $("#scene-caption").textContent = content.caption || `${country.flag} ${country.name}`;
    $("#speaker-name").textContent = content.speaker;
    $("#speaker-mood").textContent = content.mood || "";
    $("#scene-context").textContent = content.context || `${phaseName()} · ${state.elapsedDays + 1}일째`;
    const dialogue = $("#dialogue-text");
    dialogue.classList.toggle("is-chat", Boolean(content.messages));
    dialogue.innerHTML = content.messages
      ? `<div class="chat-thread">${content.messages.map(message => `<div class="chat-bubble is-${escapeHtml(message.side || "system")}">${escapeHtml(message.text)}</div>`).join("")}</div>${content.text ? `<p class="chat-prompt">${escapeHtml(content.text)}</p>` : ""}`
      : escapeHtml(content.text).replace(/\n/g, "<br>");

    const visual = $("#scene-visual");
    const bgName = content.bg || scene.bg;
    visual.style.backgroundImage = `url('./assets/cutscenes/${bgName}.webp')`;
    const portraitWrap = $("#portrait-wrap");
    portraitWrap.hidden = content.portrait === false;
    $("#partner-portrait").style.cssText = photoStyle(partner.art, "woman", photoMode);
    const eventCard = $("#event-card");
    eventCard.hidden = !content.eventCard;
    visual.classList.toggle("is-event", Boolean(content.eventCard));
    if (content.eventCard) {
      $("#event-title").textContent = content.eventTitle || scene.title;
      $("#event-text").textContent = content.eventText || scene.objective;
    }

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
      node.querySelector(".choice-impact").textContent = plainImpact(item.impact);
      node.querySelector(".choice-cost").textContent = item.cost ? formatWon(item.cost) : "";
      if (item.check) {
        const chance = chanceFor(item.check);
        const chanceNode = node.querySelector(".choice-chance");
        chanceNode.hidden = false;
        chanceNode.textContent = `${item.check.label || statLabel(item.check.stat)} 성공 ${chance}%`;
        chanceNode.classList.toggle("is-low", chance < 45);
        chanceNode.classList.toggle("is-high", chance >= 70);
      }
      const projectedDebt = Math.max(0, item.cost - state.cash);
      if (projectedDebt && state.debt + projectedDebt >= DEBT_LIMIT) {
        node.querySelector(".choice-cost").textContent += " · 파산 위험";
      }
      node.addEventListener("click", () => handleChoice(item));
      wrap.appendChild(node);
    });
  }

  function updateSidebar() {
    $("#evidence-count").textContent = `${state.evidence.length}개`;
    $("#side-cash").textContent = formatWon(state.cash);
    $("#side-debt").textContent = state.debt ? formatWon(state.debt) : "없음";
    $("#side-spent").textContent = formatWon(state.spent);
    $("#side-days").textContent = state.married ? `결혼 ${state.monthsMarried}개월` : `${Math.max(0, state.daysLeft)}일`;
    const preview = $("#notebook-preview");
    const latest = [...state.evidence].slice(-3).reverse();
    preview.innerHTML = latest.length ? latest.map(item => `<div class="preview-note"><i>${typeIcon(item.type)}</i><span>${item.title}</span></div>`).join("") : `<p class="preview-empty">아직 기록이 없습니다.</p>`;
  }

  function typeIcon(type) { return type === "fact" ? "✓" : type === "rumor" ? "?" : "◇"; }

  function plainImpact(text) {
    return String(text || "")
      .replace(/지금:\s*/g, "")
      .replace(/앞으로:\s*/g, "이후 ")
      .replace(/↑/g, " 증가")
      .replace(/↓/g, " 감소")
      .replace(/확정 증거/g, "확인된 자료")
      .replace(/단서 가능/g, "단서를 얻을 수 있음")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function statLabel(stat) {
    return { charm: "말재주", empathy: "공감", reason: "판단", courage: "배짱", calm: "침착", fertility: "임신 가능성" }[stat] || "능력";
  }

  function statValue(stat) {
    if (stat === "fertility") return 5;
    return Number(state[stat] || 5);
  }

  function chanceFor(check) {
    if (check.stat === "fertility") return clamp(Math.round(check.base), 0, 100);
    const main = (statValue(check.stat) - 5) * 6;
    const assist = check.assist ? (statValue(check.assist) - 5) * 2 : 0;
    const relationship = check.stat === "empathy" || check.stat === "charm" ? Math.round((state.trust - 50) * .12) : 0;
    const jointDecision = check.joint ? Math.round((state.trust - 50) * .18 + (state.affection - 50) * .1 - state.conflict * .08) : 0;
    const stressPenalty = state.stress >= 75 ? -10 : state.stress >= 55 ? -5 : 0;
    return clamp(Math.round(check.base + main + assist + relationship + jointDecision + stressPenalty), 5, 95);
  }

  function runRoll(item) {
    const chance = chanceFor(item.check);
    const roll = 1 + Math.floor(Math.random() * 100);
    const overlay = $("#roll-overlay");
    const dice = $("#roll-dice");
    const result = $("#roll-result");
    $("#roll-title").textContent = item.title;
    $("#roll-rule").textContent = `${item.check.label || statLabel(item.check.stat)} · ${chance} 이하가 나오면 성공`;
    $("#roll-number").textContent = "?";
    result.textContent = "";
    result.className = "roll-result";
    dice.classList.add("is-rolling");
    overlay.hidden = false;
    $$(".choice-card").forEach(button => { button.disabled = true; });
    const flicker = ROLL_DELAY ? setInterval(() => { $("#roll-number").textContent = String(1 + Math.floor(Math.random() * 100)); }, 70) : null;
    setTimeout(() => {
      if (flicker) clearInterval(flicker);
      const success = roll <= chance;
      dice.classList.remove("is-rolling");
      $("#roll-number").textContent = roll;
      result.textContent = success ? (item.check.joint ? "상대가 동의했다" : "성공") : (item.check.joint ? "합의하지 못했다" : "실패");
      result.classList.add(success ? "is-success" : "is-failure");
      state.lastRoll = { scene: state.scene, choice: item.id, chance, roll, success };
      state.pendingSkillText = success ? gainSkillXp(item.check.stat) : "";
      setTimeout(() => {
        overlay.hidden = true;
        completeChoice(item.id, success);
      }, ROLL_DELAY ? 520 : 0);
    }, ROLL_DELAY);
  }

  function warningFor(item) {
    const warnings = [];
    const severe = new Set(["intimacy_pressure", "distance_pressure", "child_demand", "birthless_pressure", "after_accuse", "family_accuse", "decide_partner", "decide_broker", "fight_leave", "turning_threat", "privacy_double_standard"]);
    if (severe.has(item.id)) warnings.push("이 행동은 관계 파탄 또는 즉시 게임오버로 이어질 수 있습니다.");
    const newDebt = state.debt + Math.max(0, (item.cost || 0) - state.cash);
    if (newDebt >= DEBT_LIMIT) warnings.push(`선택 뒤 예상 빚이 ${formatWon(newDebt)}가 되어 급전 한도를 넘습니다.`);
    else if (newDebt >= DEBT_LIMIT * .8) warnings.push(`선택 뒤 예상 빚이 ${formatWon(newDebt)}로 위험 구간에 들어갑니다.`);
    if (item.style === "risky" && state.trust <= 28) warnings.push(`현재 신뢰가 ${state.trust}입니다. 조금만 더 떨어져도 관계가 끝납니다.`);
    if (item.style === "risky" && state.conflict >= 75) warnings.push(`현재 갈등이 ${state.conflict}입니다. 100이 되면 결혼 생활이 파탄 납니다.`);
    if (item.style === "risky" && state.stress >= 82) warnings.push(`현재 스트레스가 ${state.stress}입니다. 100이 되면 번아웃으로 게임오버입니다.`);
    return warnings;
  }

  function confirmDanger(item, warnings) {
    openModal("위험한 선택", "그래도 이 행동을 강행할까요?", `<div class="danger-summary"><p>${warnings.map(escapeHtml).join("</p><p>")}</p><dl><div><dt>신뢰</dt><dd>${state.trust}</dd></div><div><dt>갈등</dt><dd>${state.conflict}</dd></div><div><dt>스트레스</dt><dd>${state.stress}</dd></div><div><dt>빚</dt><dd>${formatWon(state.debt)}</dd></div></dl></div><div class="confirm-actions"><button id="cancel-danger" class="ghost-button" type="button">돌아가기</button><button id="confirm-danger" class="primary-button danger-button" type="button">그래도 강행한다</button></div>`, element => {
      element.querySelector("#cancel-danger").addEventListener("click", closeModal);
      element.querySelector("#confirm-danger").addEventListener("click", () => { closeModal(); handleChoice(item, true); });
    });
  }

  function handleChoice(itemOrId, confirmed = false) {
    const item = typeof itemOrId === "string" ? { id: itemOrId } : itemOrId;
    const id = item.id;
    if (!confirmed) {
      const warnings = warningFor(item);
      if (warnings.length) return confirmDanger(item, warnings);
    }
    if (item.check) return runRoll(item);
    return completeChoice(id, true);
  }

  function completeChoice(id, checkSuccess) {
    if (id === "continue_scene") return advanceScene();
    if (id.startsWith("press_")) return pressStatement(Number(id.split("_")[1]));
    if (id.startsWith("present_")) return openEvidencePicker(Number(id.split("_")[1]));
    if (id.startsWith("pass_")) {
      passTime(1);
      state.trust = clamp(state.trust + 3, 0, 100);
      state.affection = clamp(state.affection + 2, 0, 100);
      return showResult({ title: "그녀의 설명을 믿었다", text: "이번에는 증거를 내밀지 않고 설명을 받아들였다. 관계의 긴장은 조금 풀렸지만, 말이 사실인지 확인할 자료가 새로 생긴 것은 아니다.", noApply: true });
    }
    if (id.startsWith("decide_")) return resolveDecision(id);
    if (["family_stay", "family_separate", "family_accuse"].includes(id)) return resolveFamilyDecision(id);
    if (["wedding_calm_talk", "wedding_firm_refusal", "wedding_pay_extra"].includes(id)) state.flags.weddingCompleted = true;

    const result = resolveAction(id, checkSuccess);
    if (!result) return;
    if (state.pendingSkillText) result.text += state.pendingSkillText;
    state.pendingSkillText = "";
    applyDelta(result);
    if (state.ending) return;
    if (state.stress >= 100) return finishEarly("burnout");
    if (state.trust <= 0) return finishEarly("breakup");
    if (state.conflict >= CONFLICT_LIMIT) return finishEarly("divorce");
    showResult(result);
  }

  function resolveAction(id, checkSuccess = true) {
    const partner = getPartner();
    const player = getPlayer();
    const mystery = getCase();
    const partnerScam = partnerScamActive();
    const isScam = partnerScam || mystery.culprit === "broker" || mystery.culprit === "both";
    const hiddenReason = {
      fatigue: "교대근무와 낯선 생활이 겹쳐 몸과 마음이 지쳐 있었다.",
      fear: "임신과 출산이 두려웠지만 실망시킬까 봐 제대로 말하지 못했다.",
      medical: "통증과 건강 문제가 있었지만 부끄럽고 겁이 나서 숨기고 있었다.",
      different_child_plan: "아이를 원한다는 마음이 결혼 뒤 달라졌지만 약속을 뒤집는 사람으로 보일까 봐 피했다.",
      deception: "아이를 원한다는 말은 결혼을 빠르게 진행하기 위한 말이었고, 실제 계획은 달랐다."
    }[state.intimacyTruth];
    const privateTraits = partner.privateTraits || { tattoo: "none", health: "특별히 알려진 불편 없음", chemistry: 55, pace: "slow" };
    const tattooText = privateTraits.tattoo === "large" ? "옷으로 가려지던 큰 문신이 있었다" : privateTraits.tattoo === "small" ? "작은 문신이 있었다" : "눈에 띄는 문신은 없었다";
    const chemistryText = privateTraits.chemistry >= 75 ? "서로의 속도와 표현이 잘 맞았다" : privateTraits.chemistry >= 50 ? "어색했지만 대화하며 맞춰 갈 수 있었다" : "속도와 원하는 방식이 달라 더 많은 대화가 필요했다";
    const reactions = {
      warm: `“${partner.voice}”\n\n말끝의 긴장이 조금 풀렸다.`,
      careful: `“확인하는 건 괜찮아요. 저한테도 같은 자료를 보여줘요.”\n\n${partner.personality}. 그래서인지 대답보다 질문 방식을 먼저 살폈다.`,
      hurt: `“저를 이미 정답이 정해진 문제처럼 보는 것 같아요.”\n\n${partner.name}이 시선을 거뒀다.`
    };
    const map = {
      open_match: { title: "첫 채팅창이 열렸다", text: `${partner.name}의 ‘안녕하세요’가 도착했다. 사진 한 장이 이제 목소리와 습관을 가진 사람으로 바뀌기 시작한다.`, affection: 2, reaction: `“답장 기다리고 있었어요. 우리 어떤 방법으로 이야기할까요?”` },
      chat_text_auto: checkSuccess ? { title: "번역이 대화를 가로막지 않았다", text: "짧게 쓰고 다시 확인하자 자동번역이 틀린 표현을 둘이 웃으며 고칠 수 있었다.", trust: 6, affection: 6, days: 2, clarity: 28, set: { communicationMode: "자동번역 채팅" }, reaction: `“천천히 써 줘서 좋아요. 제가 틀리면 웃지 말고 다시 물어봐요.”` } : { title: "번역된 한 문장이 엉뚱하게 닿았다", text: "‘보고 싶다’가 ‘감시하고 있다’에 가깝게 번역돼 잠시 분위기가 얼었다. 다음부터 뜻을 다시 확인하기로 했다.", trust: -3, affection: -2, stress: 3, days: 2, clarity: 10, set: { communicationMode: "자동번역 채팅" }, bad: true, reaction: `“방금 말… 무슨 뜻이에요? 번역이 조금 무서워요.”` },
      chat_voice_slow: checkSuccess ? { title: "서툰 목소리가 오히려 가까웠다", text: "정확하지 않은 문장은 표정과 오늘 찍은 사진이 채웠다. 서로 모르는 단어를 하나씩 가르쳐 주기 시작했다.", trust: 5, affection: 9, days: 2, clarity: 22, set: { communicationMode: "음성·사진" }, reaction: `“발음 귀여워요. 내 이름 한 번만 다시 말해 봐요.”` } : { title: "목소리의 온도는 전해졌지만 뜻은 엇갈렸다", text: "농담을 진지한 요구로 알아듣고 답장이 잠시 끊겼다. 중요한 말은 문자로 다시 확인해야 한다.", trust: -2, affection: 1, days: 2, clarity: 9, set: { communicationMode: "음성·사진" }, bad: true, reaction: `“제가 잘못 들은 것 같아요. 글로 한 번만 보내 줄래요?”` },
      chat_video_gesture: checkSuccess ? { title: "어색한 영상통화가 첫 추억이 됐다", text: "말이 막힐 때마다 둘이 같은 번역 앱 화면을 들어 보였다. 실시간 주변과 표정도 자연스럽게 이어졌다.", trust: 7, affection: 8, days: 1, clarity: 25, set: { communicationMode: "영상통화·손짓" }, evidence: { id: "live_video", title: "즉석 영상통화", type: "clue", text: "미리 준비하기 어려운 질문과 주변 풍경에 자연스럽게 답했다.", source: "직접 확인", quality: 2 }, reaction: `“말은 반밖에 못 알아들었는데, 이상하게 안 어색했어요.”` } : { title: "침묵을 견디지 못하고 말이 빨라졌다", text: "화면은 진짜였지만 서로 알아듣지 못한 채 웃기만 했다. 호감은 남았고 중요한 내용은 전혀 확인되지 않았다.", trust: 1, affection: -1, days: 1, clarity: 6, set: { communicationMode: "영상통화·손짓" }, bad: true, reaction: `“다음에는 번역도 같이 켜요. 오늘은 너무 빨랐어요.”` },
      why_honest: checkSuccess ? { title: "그녀도 자신의 이유를 꺼냈다", text: `${partner.motive}. 조건만 보고 고른 선택과 지금 나에게 생긴 호감은 같지 않다고 덧붙였다.`, trust: 8, affection: 8, days: 2, reaction: `“그 한 줄까지 읽었어요? 다들 사진 이야기부터 하는데.”`, evidence: { id: "motive_statement", title: "국제연애를 시작한 계기", type: "clue", text: partner.motive, source: "첫 문답", quality: 2 } } : { title: "좋은 답을 고르느라 내 말이 사라졌다", text: "그녀는 고맙다고 했지만 더 묻지 않았다. 칭찬은 전달됐고 진짜 이유는 남았다.", trust: 1, affection: 3, days: 1, reaction: `“고마워요. 그런데 정말 그게 전부예요?”` },
      why_lonely: checkSuccess ? { title: "외로움을 약점이 아니라 사실로 말했다", text: "혼자 살며 놓쳤던 일상을 말하자 그녀도 식사 사진을 누군가에게 보내고 싶었다고 답했다.", trust: 7, affection: 9, days: 2, reaction: `“나도 그래요. 별일 없는 하루를 말할 사람이 있었으면 했어요.”` } : { title: "외로움이 책임을 맡겨 달라는 말처럼 들렸다", text: "그녀는 자신이 한국 생활과 외로움을 모두 해결해 줄 수는 없다고 선을 그었다.", trust: -2, affection: -3, days: 1, reaction: `“제가 당신을 행복하게 만들어야 하는 사람은 아니죠?”`, bad: true },
      why_status: checkSuccess ? { title: "조건에 대한 관심을 끌었다", text: "그녀는 집과 수입을 구체적으로 물었다. 대화는 이어졌지만 사람보다 조건을 앞에 놓은 관계가 시작됐다.", trust: 2, affection: 4, days: 1, flag: "statusCourtship", reaction: `“안정적인 건 좋아요. 그런데 쉬는 날에는 어떤 사람이에요?”` } : { title: "소개가 자랑처럼 들렸다", text: "숫자를 길게 말할수록 그녀의 답장은 짧아졌다.", trust: -5, affection: -5, days: 1, reaction: `“저는 면접 보러 온 게 아닌데요.”`, bad: true },
      why_avoid: { title: "칭찬은 남고 대답은 비었다", text: "사진이 예쁘다는 말에는 하트가 왔지만, 왜 국제연애를 시작했는지는 서로 말하지 못했다.", affection: 3, trust: -3, days: 1, reaction: `“만나면 꼭 대답해 줘요. 기억할 거예요.”` },
      flirt_reassure: checkSuccess ? { title: "첫 만남의 부담을 둘이 나눴다", text: "잘 보이려는 사람 둘이 아니라 어색해도 다시 웃어 줄 사람 둘이 되기로 했다.", trust: 8, affection: 11, days: 2, reaction: `“그럼 공항에서 서로 못 알아보면 먼저 웃는 사람이 이기는 거예요.”` } : { title: "안심시키려던 말이 외모 평가처럼 들렸다", text: "사진과 실제를 계속 비교하자 그녀는 카메라를 끄고 싶어 했다.", trust: -4, affection: -5, days: 1, reaction: `“그냥 제가 어떤 사람인지 궁금하다고 말하면 돼요.”`, bad: true },
      flirt_tease: checkSuccess ? { title: "둘만 아는 첫 농담이 생겼다", text: "3초를 버티지 못하고 동시에 웃었다. 다음 날에도 그녀가 먼저 그 표정을 흉내 낸 사진을 보냈다.", trust: 5, affection: 12, days: 1, flag: "insideJoke", reaction: `“반칙이에요. 당신이 먼저 웃었어요.”` } : { title: "농담의 뜻이 번역에서 사라졌다", text: "그녀는 왜 웃어야 하는지 몰라 멈췄다. 설명하는 동안 설렘도 조금 식었다.", affection: -2, days: 1, bad: true, reaction: `“미안해요. 그게 농담이에요?”` },
      flirt_promise: checkSuccess ? { title: "큰 약속이 그녀의 불안을 잠깐 눌렀다", text: "호감은 빠르게 올랐지만 앞으로 이 말을 행동으로 갚아야 한다.", trust: 3, affection: 13, days: 1, flag: "earlyForever", reaction: `“그 말 녹음했어요. 나중에 모른다고 하면 안 돼요.”` } : { title: "아직 만나지도 않은 영원이 가벼워 보였다", text: "그녀는 복사해 둔 문장 아니냐고 물었다.", trust: -7, affection: -5, days: 1, bad: true, reaction: `“저를 아직 모르잖아요. 천천히 말해도 괜찮아요.”` },
      flirt_gift: { title: "작은 선물이 퇴근길에 도착했다", text: "그녀가 커피 사진을 보내 왔다. 기쁨은 진짜지만 이 방식이 반복되면 돈이 대화의 기본값이 될 수 있다.", trust: 3, affection: 7, days: 1, cost: 50000, costLabel: "앱 선물", reaction: `“오늘 정말 힘들었는데 고마워요. 다음에는 사진만 보내도 돼요.”` },
      growth_language: { title: "서툴지만 직접 말할 문장이 생겼다", text: "이름을 정확히 부르고 ‘싫으면 말해도 돼요’를 그녀의 언어로 배웠다.", days: 7, cost: 120000, costLabel: "온라인 언어 수업", grow: { empathy: 1 }, clarity: 12, flag: "languageStudy", reaction: `“내 언어로 말해 줘서 놀랐어요. 발음은 제가 고쳐 줄게요.”` },
      growth_style: { title: "화면 속 자세부터 달라졌다", text: "잘 보이기 위한 옷보다 내 몸을 편하게 쓰는 자신감이 생겼다.", days: 7, cost: 280000, costLabel: "운동·이발·기본 의류", grow: { charm: 1 }, stress: -7, reaction: `“오늘 뭔가 달라 보여요. 표정이 더 편해졌어요.”` },
      growth_work: { title: "여행비는 벌었고 대화 시간은 줄었다", text: "추가 근무 덕분에 현금은 늘었지만 늦은 답장 때문에 그녀가 한 번 서운해했다.", days: 7, income: 900000, incomeLabel: "추가 근무 수입", grow: { courage: 1 }, affection: -2, stress: 6, reaction: `“바쁜 건 이해해요. 그래도 잘 자라는 말은 해 줄 수 있잖아요.”` },
      growth_wait: { title: "답장은 빨랐지만 내 하루가 사라졌다", text: "알림이 올 때마다 기분이 출렁였다. 그녀는 관심을 느꼈지만 나는 더 불안해졌다.", affection: 4, stress: 15, days: 7, reaction: `“항상 바로 답하네요. 혹시 일은 괜찮아요?”` },
      live_video: { title: "화면 속 일상이 이어졌다", text: `즉석 영상에서 ${partner.job}의 근무 공간과 대화 흐름이 자연스럽게 이어졌다. 신원을 완전히 증명하진 않지만 도용 가능성은 낮아졌다.`, trust: 4, days: 2, evidence: { id: "live_video", title: "즉석 영상통화", type: "clue", text: "미리 준비하기 어려운 질문과 주변 풍경에 자연스럽게 답했다.", source: "직접 확인", quality: 2 } },
      slow_chat: { title: "평범한 말이 쌓였다", text: `${reactions.warm}\n대단한 고백보다 퇴근길, 늦은 답장, 싫어하는 음식이 반복해서 기억에 남았다.`, trust: 9, days: 7, evidence: { id: "daily_timeline", title: "일주일의 일상 대화", type: "clue", text: "날짜별 일상과 근무시간이 큰 모순 없이 이어진다.", source: "직접 대화", quality: 2 } },
      translator_intro: { title: "첫 문장의 뜻을 맞췄다", text: `업체와 무관한 통역사가 표현의 온도까지 설명했다. ${partner.name}도 내 말을 같은 방식으로 확인했다.`, trust: 5, days: 2, cost: 300000, costLabel: "독립 통역 1회", evidence: { id: "first_translation", title: "독립 통역 첫 대화", type: "fact", text: "첫 대화를 양쪽 모두에게 독립적으로 역번역해 의미를 확인했다.", source: "독립 통역", quality: 3 } },
      player_honest: { title: "검증은 양쪽을 향했다", text: `현재 형편과 ${player.flaw}는 점까지 말했다. ${partner.name}은 잠시 계산하더니 자기 경계도 더 구체적으로 말했다.`, trust: 10, days: 2, flag: "playerHonest", evidence: { id: "mutual_finance", title: "서로 공개한 재정", type: "fact", text: "주인공도 현금·수입·부채를 같은 기준으로 공개했다.", source: "둘의 대화", quality: 3 } },
      player_polish: checkSuccess ? { title: "과장한 숫자가 잠깐 통했다", text: `숫자를 조금 키워 말하자 ${partner.name}의 표정이 편해졌다. 하지만 실제 계약이나 생활비 이야기가 나오면 이 문장이 다시 돌아온다.`, trust: 5, affection: 3, days: 1, flag: "playerLied" } : { title: "과장이 바로 어색해졌다", text: `${partner.name}이 구체적인 월급일과 회사 자료를 묻자 대답이 꼬였다. 안심시키려던 말이 첫 번째 불신이 됐다.`, trust: -10, affection: -7, conflict: 8, days: 1, flag: "playerLied", bad: true },
      player_counter: { title: "면접이 협상으로 바뀌었다", text: `내 수입을 먼저 말한 뒤 같은 항목을 물었다. ${partner.name}은 가족지원과 직업 계획을 구체적으로 답했다.`, trust: 6, days: 2, evidence: { id: "mutual_plan", title: "서로의 생활 조건", type: "fact", text: "일·부채·가족지원·거주 희망을 양쪽이 같은 질문으로 확인했다.", source: "둘의 대화", quality: 3 } },
      awkward_story: { title: "완벽하지 않은 대답이 웃음을 만들었다", text: `멋있는 성공담 대신 피하고 후회했던 순간을 말했다. ${partner.name}도 외로울 때 같은 영상을 세 번 돌려 본다는 이야기를 털어놓았다.`, trust: 9, days: 2, flag: "humanConversation" },
      compatibility_quiz: { title: "조건은 빨리 보였고 온도는 늦게 올랐다", text: "수면시간과 소비 습관에서 차이가 드러났다. 당장 설레는 대화는 아니었지만 미래의 싸움 하나를 미리 봤다.", trust: 4, days: 2, evidence: { id: "early_compatibility", title: "초기 생활 문답", type: "clue", text: "수면·소비·거주·아이 계획에 대한 첫 답변을 서로 기록했다.", source: "둘의 문답", quality: 2 } },
      pickup_line: checkSuccess ? { title: "뻔한 말이 이번에는 통했다", text: `${partner.name}이 웃으며 “그 대답, 다른 사람한테도 했죠?”라고 장난스럽게 받아쳤다.`, trust: 7, affection: 9, days: 1, flag: "flirtyAnswer" } : { title: "준비한 멘트처럼 들렸다", text: "잠깐의 정적 뒤 그녀가 다음 질문으로 넘어갔다. 솔직한 답을 피했다는 인상만 남았다.", trust: -4, affection: -5, days: 1, bad: true },
      contract_review: { title: "계약서에 없는 돈이 보였다", text: "기본 비용과 현지 추가비가 한 문장에 섞여 있었다. 소개 단계를 넘기면 환불받기 훨씬 어려워지는 조건도 찾았다.", trust: 2, days: 3, cost: 400000, costLabel: "계약 독립 검토", evidence: { id: "route_contract", title: "업체 계약 비용표", type: "fact", text: "업체 수수료·결혼 성사비·항공·통역·현지 추가비가 서로 다른 항목임을 확인했다.", source: "계약서 독립 번역", quality: 3 } },
      pay_reservation: { title: "일정은 빨라졌고 돈은 묶였다", text: "업체는 태도가 달라질 만큼 친절해졌다. 그러나 예약금은 후보가 바뀌어도 환불이 어렵다는 말을 뒤늦게 덧붙였다.", trust: 3, days: 1, cost: 3000000, costLabel: "업체 추가 예약금", flag: "paidReservation" },
      pretend_agree: checkSuccess ? { title: "편법이 한 번은 먹혔다", text: isScam ? "잔금을 낼 것처럼 말하자 직원들끼리 ‘다음 단계 대본’을 확인하는 소리가 들렸다." : `직원은 특별한 말을 하지 않았다. 오히려 거짓 동의가 ${partner.name}에게 전달돼 어색함이 남았다.`, trust: isScam ? 0 : -7, calm: isScam ? 1 : -1, days: 1, evidence: isScam ? { id: "broker_whisper", title: "업체 직원의 단계 대화", type: "clue", text: "결정을 유도하는 순서가 미리 정해진 듯한 직원 대화를 들었다.", source: "직접 들음", quality: 2 } : null } : { title: "떠보기가 너무 일찍 들켰다", text: `직원이 계약서를 내밀자 대답을 바꾸는 모습이 드러났다. 업체도 입을 닫았고 ${partner.name}은 자신까지 시험당했다고 느꼈다.`, trust: -12, conflict: 8, calm: -1, days: 1, bad: true },
      app_meeting: { title: "말이 날짜가 됐다", text: "내가 직접 예약한 공개 장소에서 만나기로 했다. 돈이나 비자 이야기는 아직 나오지 않았다.", trust: 6, days: 2, flag: "safeMeeting" },
      app_identity: { title: "그녀도 나를 확인했다", text: `${reactions.careful}\n서로 즉석에서 같은 동작과 질문에 답했다.`, trust: 5, days: 2, evidence: { id: "mutual_identity", title: "서로 한 실시간 확인", type: "clue", text: "두 사람이 실시간 영상과 즉석 질문으로 다른 사람의 사진을 썼을 가능성을 낮췄다.", source: "둘의 영상통화", quality: 2 } },
      app_gift: { title: "상자는 마음보다 먼저 도착했다", text: "그녀는 기뻐했지만 다음 대화부터 가격을 자주 물었다. 호감인지 기대가 올라간 것인지는 아직 모른다.", trust: 5, days: 2, cost: 800000, costLabel: "고가 선물", flag: "moneyCourtship" },
      reference_check: { title: "두 사람의 말이 따로 기록됐다", text: `소개자가 모르는 부분은 모른다고 했고, ${partner.name}의 말과 일치하는 부분만 남겼다.`, trust: 4, days: 2, evidence: { id: "separate_reference", title: "분리된 소개자 진술", type: "clue", text: "소개자의 직접 경험과 전해 들은 말을 구분해 기록했다.", source: "공통 지인", quality: 2 } },
      accept_reference: { title: "만남은 부드럽게 빨라졌다", text: "의심받지 않는다는 안도감 덕분에 대화는 가까워졌다. 다만 소개자가 보증한 범위는 여전히 모호하다.", trust: 7, days: 1 },
      quiet_gossip: { title: "빠른 말에는 출처가 없었다", text: "‘그런 이야기를 들었다’는 답만 돌아왔다. 누가 직접 봤는지는 아무도 말하지 못했다.", trust: -2, days: 1, cost: 100000, costLabel: "주변 사례비", evidence: { id: "early_gossip", title: "출처 없는 초기 평판", type: "rumor", text: "모임 주변에서 좋지 않은 이야기를 들었다지만 직접 본 사람은 확인되지 않았다.", source: "주변 소문", quality: 1 } },
      arrival_direct: { title: "말보다 표정이 먼저 익숙해졌다", text: `${partner.name}이 메뉴판의 사진을 가리키며 웃었다. 완벽히 통하지 않아도 서로 다시 묻는 방식이 생겼다.`, trust: 8, days: 3, cost: 1200000, costLabel: "왕복 항공·기본 체류", flags: { metInPerson: true } },
      arrival_interpreter: { title: "중요한 문장을 정확히 남겼다", text: "독립 통역사는 모르는 표현을 아는 척하지 않았다. 서로의 결혼 동기와 금전 기대를 각자 확인했다.", trust: 6, days: 3, cost: 1500000, costLabel: "항공·체류·독립 통역", flags: { metInPerson: true }, evidence: { id: "arrival_record", title: "첫 만남 독립 통역 기록", type: "fact", text: "결혼 동기·직업·가족지원에 대한 양쪽 답변을 역번역해 확인했다.", source: "독립 통역", quality: 3 } },
      arrival_luxury: { title: "화려한 첫날이 남았다", text: `분위기는 분명 좋아졌다. 그러나 ${partner.name}은 내 평소 생활도 늘 이 정도인지 물었다.`, trust: 9, days: 2, cost: 3000000, costLabel: "고급 숙소·선물", flags: { luxuryExpectation: true, metInPerson: true } },
      listen_motive: { title: "동기와 마음을 한 문장에 섞지 않았다", text: `${partner.motive}. 그 현실적인 이유와 나에게 느끼는 호감은 동시에 존재할 수 있었다.`, trust: 10, days: 3, evidence: { id: "motive_statement", title: "당사자가 말한 결혼 계기", type: "clue", text: partner.motive, source: "둘만의 대화", quality: 2 } },
      ask_korea: { title: "계획이 구체적인 부분과 빈 부분이 갈렸다", text: "직업과 가족지원은 바로 답했지만 체류 첫 달 계획에서는 잠시 말이 막혔다. 이 침묵만으로는 어느 쪽도 확정할 수 없다.", trust: 3, days: 2, evidence: { id: "korea_plan", title: "한국 생활 계획 답변", type: "clue", text: "직업·거주·가족지원 답변을 항목별로 기록했다. 일부 일정은 아직 비어 있다.", source: "둘만의 대화", quality: 2 } },
      test_love: { title: "시험은 상대에게도 시험이 됐다", text: isScam ? "갑자기 돈이 없다는 말에 그녀는 사랑보다 한국행 일정부터 다시 물었다." : "그녀는 돈보다 왜 중요한 일을 거짓말로 떠보느냐고 화를 냈다.", trust: isScam ? -2 : -12, calm: -1, days: 1, flag: "fakePoverty", evidence: isScam ? { id: "money_first_reaction", title: "가난을 연기했을 때의 반응", type: "clue", text: "수입이 사라졌다는 말 뒤 감정보다 일정·송금 질문이 먼저 나왔다. 단독으로는 결정적이지 않다.", source: "반응 시험", quality: 1 } : null },
      family_independent: { title: "가족의 말과 그녀의 말이 갈라졌다", text: "가족은 빠른 결혼과 정기송금을 기대했지만, 그녀는 일과 송금 상한을 먼저 합의하고 싶다고 답했다. 누구의 뜻인지 구분할 수 있게 됐다.", trust: 6, days: 2, cost: 300000, costLabel: "가족 통화 독립 통역", evidence: { id: "family_separate_answers", title: "가족과 당사자의 분리 답변", type: "fact", text: "가족의 기대와 당사자의 결혼·송금 의사를 따로 통역해 기록했다.", source: "독립 통역", quality: 3 } },
      family_gift: { title: "가족의 환대가 빠르게 커졌다", text: "통화 분위기는 좋아졌지만 다음 연락에서는 선물 가격과 혼수 이야기가 자연스럽게 이어졌다.", trust: 7, days: 1, cost: 1000000, costLabel: "가족 현금성 선물", flag: "familyMoneyExpectation" },
      family_private: { title: "가족 앞에서 삼킨 대답을 들었다", text: `${partner.name}은 가족이 원하는 속도와 자신이 원하는 속도가 다르다고 말했다. 그 차이가 곧 사기는 아니지만 앞으로의 갈등은 분명했다.`, trust: 9, days: 2, evidence: { id: "private_family_motive", title: "가족 압박에 대한 당사자 설명", type: "clue", text: "가족의 결혼·송금 기대와 자신의 계획이 다르다고 직접 설명했다.", source: "둘만의 통화", quality: 2 } },
      mutual_boundaries: { title: "한 사람만 검사받는 대화가 아니었다", text: `${partner.name}은 내 답을 들은 뒤 자기 답도 솔직하게 적었다. 아이 계획은 원하는지뿐 아니라 시기와 건강검사 의사까지 나눠 이야기했다.`, trust: 9, days: 2, evidence: { id: "boundary_sheet", title: "둘이 작성한 생활 질문표", type: "fact", text: "아이·건강검사·문신·흡연·직업·송금·첫날밤에 대해 두 사람이 같은 질문에 답했다.", source: "둘이 함께 작성", quality: 3 } },
      health_boundary: { title: "검사가 아니라 약속을 먼저 정했다", text: "지금 몸을 확인하려 하지 않고, 실제 건강·임신 계획이 필요해질 때 둘이 같은 기준으로 검사받기로 했다.", trust: 8, affection: 5, days: 1, flag: "sharedHealthBoundary", reaction: `“저만 증명하라는 게 아니라면 괜찮아요. 필요할 때 같이 가요.”` },
      body_check: { title: "정보는 얻었지만 사람은 멀어졌다", text: `${reactions.hurt}\n문신이나 나이, 임신 가능성은 확인 항목일 수 있어도 사기의 증거는 아니었다.`, trust: -14, calm: -1, days: 1, flag: "oneSidedCheck" },
      slow_consent: { title: "좋아함과 동의를 분리했다", text: `“그 말은 고마워요. 제가 마음을 바꿔도 화내지 않을 거죠?”\n\n업체 일정은 느려졌지만 ${partner.name}의 대답은 오히려 길어졌다.`, trust: 11, days: 3, evidence: { id: "consent_record", title: "속도와 동의에 대한 합의", type: "fact", text: "결혼 결정과 성적 동의를 분리하고 언제든 의사를 바꿀 수 있다고 합의했다.", source: "둘의 대화", quality: 3 } },
      private_consent: { title: "침묵을 대답으로 쓰지 않았다", text: isScam ? "직원이 나간 뒤 그녀의 설명과 업체가 대신 말하던 내용 사이에 차이가 보였다." : `${partner.name}은 안도하며 좋아하는 마음과 오늘 결혼할 의사는 다르다고 분명히 말했다.`, trust: 8, days: 2, evidence: isScam ? { id: "pressure_gap", title: "업체 설명과 당사자 의사의 차이", type: "clue", text: "직원을 내보낸 뒤 결혼 속도와 비용에 대한 당사자 답이 달라졌다.", source: "둘만의 확인", quality: 2 } : { id: "clear_consent", title: "당사자의 분리된 동의", type: "fact", text: "연애 감정, 결혼 날짜, 첫날밤을 각각 따로 확인했다.", source: "둘만의 확인", quality: 3 } },
      sign_fast: { title: "일정은 빨라졌고 취소 비용도 생겼다", text: "예약금과 위약금이 걸리자 이후의 질문마다 ‘이미 결정했는데 왜 묻느냐’는 말이 따라붙었다.", trust: 7, calm: -1, days: 1, cost: 2000000, costLabel: "빠른 결혼 예약·약속서", flag: "fastSigned" },
      agree_romance_not_schedule: { title: "마음에는 예, 일정에는 아니오", text: `${partner.name}은 처음엔 놀랐지만 내 말의 두 부분을 이해했다. 주선자는 못마땅해했고, 둘의 대화는 오히려 선명해졌다.`, trust: 10, days: 2, flag: "separatedLoveSchedule" },
      official_docs: { title: "날짜 하나가 이야기의 뼈대가 됐다", text: "공식 서류와 원본을 대조하자 추측이 아니라 확인할 수 있는 문장이 생겼다.", trust: 1, days: 4, cost: 500000, costLabel: "서류 발급·독립 번역", evidence: mystery.clues.doc },
      trust_no_docs: { title: "오늘의 온도는 지켰다", text: `${reactions.warm}\n다만 확인하지 않은 항목은 믿는 사실이 아니라 아직 모르는 사실로 수첩에 남았다.`, trust: 7, days: 2, flag: "skippedDocs" },
      cheap_rumor: { title: "소문은 결론처럼 들렸다", text: "‘그 동네 사람은 다 안다’는 말은 컸지만 날짜도 당사자도 없었다.", trust: -3, calm: -1, days: 1, cost: 100000, costLabel: "주변 사례비", evidence: { id: `doc_rumor_${state.scene}`, title: "출처 불명 주변 소문", type: "rumor", text: "정확한 날짜와 직접 목격자를 확인하지 못한 이야기다.", source: "주변 소문", quality: 1 } },
      confess: { title: "연애가 시작됐다", text: `${partner.name}은 바로 대답하지 않았다. 한참 뒤 손을 잡으며 말했다.\n\n“의심이 없어져서가 아니라, 그래도 더 알고 싶어서 좋아요.”`, trust: 13, days: 3, flags: { dating: true, sawRomance: true } },
      future_plan: { title: "둘의 미래가 종이 위에 놓였다", text: "낭만적인 대답만 나오지는 않았다. 어느 나라에서 살지와 직업 문제에서 처음으로 의견이 갈렸지만, 대화로 조정할 수 있는 차이였다.", trust: 8, days: 3, evidence: { id: "one_year_plan", title: "1년 공동생활 계획", type: "fact", text: "거주·직업·생활비·가족지원·아이 계획을 함께 작성했다.", source: "둘이 함께 작성", quality: 3 }, flag: "dating" },
      push_kiss: { title: state.charm >= 6 ? "순간은 설레었지만 질문이 남았다" : "멈춰야 할 선을 넘었다", text: state.charm >= 6 ? "그녀가 잠시 웃었지만 ‘다음에는 먼저 물어봐요’라고 분명히 말했다." : `${partner.name}이 뒤로 물러났다. 호감은 동의를 대신하지 못했다.`, trust: state.charm >= 6 ? 3 : -16, calm: state.charm >= 6 ? 0 : -1, days: 1, flag: "pushedIntimacy" },
      intimacy_consent: checkSuccess ? { title: "둘 다 원한다는 대답 뒤에 가까워졌다", text: `서두르지 않고 중간에도 여러 번 의사를 확인했다. 함께 밤을 보낸 뒤 자연스럽게 알게 된 것은 이 정도였다.\n\n• ${tattooText}\n• 건강과 편안함: ${privateTraits.health}\n• 속궁합: ${chemistryText}\n\n이 정보는 관계의 적합성을 판단하는 생활 정보일 뿐, 사기의 증거는 아니다.`, trust: 10, affection: 14, intimacy: 18, days: 2, set: { chemistry: privateTraits.chemistry }, flags: { sharedIntimacy: true, privateRevealed: true }, reaction: `“물어봐 줘서 고마워요. 다음에도 불편하면 서로 바로 말해요.”` } : { title: "긴장을 느끼고 멈췄다", text: "둘 중 한 사람이 확신하지 못해 포옹까지만 하고 쉬었다. 멈춘 선택 덕분에 거절이 관계의 벌이 되지 않았다.", trust: 5, affection: 3, days: 1, reaction: `“오늘 멈춰도 화내지 않아서 안심됐어요.”` },
      intimacy_wait: { title: "기다림이 거절로 남지 않았다", text: "서로의 속도를 확인하고 다음 만남을 약속했다. 문신·건강·속궁합 같은 사적인 정보는 아직 알 수 없다.", trust: 9, affection: 7, days: 1, reaction: `“저도 가까워지고 싶어요. 다음에도 이렇게 물어봐 줘요.”` },
      intimacy_talk_only: checkSuccess ? { title: "몸보다 먼저 경계를 알게 됐다", text: "피임, 질투, 싫은 접촉, 다툰 뒤 혼자 있고 싶은 시간을 질문과 답으로 나눴다. 사적인 신체 정보는 아직 공개되지 않았다.", trust: 9, affection: 7, days: 2, evidence: { id: "intimacy_boundaries", title: "친밀감과 경계에 대한 문답", type: "fact", text: "두 사람이 피임·동의·싫은 행동·중단 신호를 같은 질문으로 확인했다.", source: "둘만의 대화", quality: 3 }, reaction: `“이런 얘기는 부끄럽지만, 모르고 시작하는 것보다 좋아요.”` } : { title: "질문이 너무 빠른 면접처럼 이어졌다", text: "준비한 질문을 연달아 읽자 그녀가 잠시 대화를 멈췄다. 다음에는 서로 한 질문씩 주고받기로 했다.", trust: -3, affection: -2, days: 1, bad: true, reaction: `“저도 물어볼 시간이 필요해요. 하나씩 해요.”` },
      intimacy_pressure: { title: "동의를 비용과 약속의 대가로 만들었다", text: `${partner.name}은 바로 자리를 떠났다. 결혼 이야기를 했거나 돈을 썼다는 사실은 친밀한 관계를 요구할 권리가 되지 않는다.`, trust: -48, affection: -45, conflict: 38, stress: 12, days: 1, bad: true, flag: "coercivePressure", reaction: `“지금 이 말로는 더 만날 수 없어요.”` },
      offer_fresh_start: checkSuccess && partnerScam && state.affection >= 80 && state.trust >= 80 ? { title: "준비된 대본 대신 실제 고백이 나왔다", text: `${partner.name}은 처음부터 숨겼던 계획을 털어놓았다. 처음 의도는 진심이 아니었지만 함께 지내며 마음이 바뀌었다고 말했다. 용서는 자동으로 주어지지 않는다. 송금과 절차를 멈추고 원본을 함께 제출하는 행동이 뒤따라야 한다.`, trust: -8, affection: 8, conflict: 10, days: 4, set: { intimacyTruth: "fatigue" }, flags: { reformed: true, scamConfessed: true }, evidence: { id: "reform_confession", title: "초기 계획에 대한 자발적 고백", type: "fact", text: "상대가 초기 속임수의 인물·계좌·일정을 구체적으로 말하고 관련 절차 중단에 동의했다.", source: "자발적 고백·원본 제출", quality: 3 }, reaction: `“처음에는 당신을 사람이 아니라 기회로 봤어요. 지금 말해도 용서받지 못할 수 있다는 걸 알아요.”` } : checkSuccess ? { title: "말할 수 있는 자리는 만들었지만 전부 나오진 않았다", text: partnerScam ? "그녀는 작은 과장 하나만 인정했다. 마음을 바꾸기에는 아직 관계가 충분히 깊지 않거나 계획을 버릴 준비가 되지 않았다." : "좋게 보이려고 사진과 경력을 조금 꾸민 부분을 인정했다. 계획된 사기와 이어지는 고백은 없었다.", trust: 5, affection: 5, days: 2, reaction: `“한 번에 다 말하긴 무서워요. 그래도 거짓말 하나는 지금 고칠게요.”` } : { title: "기회를 말하면서도 판결처럼 들렸다", text: "이미 결론을 내린 기색이 드러났다. 그녀는 더 말하지 않았다.", trust: -7, affection: -5, days: 1, bad: true, reaction: `“이미 답을 정했다면 제가 무슨 말을 해도 같잖아요.”` },
      turning_romance: { title: "의심 밖의 기억이 생겼다", text: "시장 간식, 잘못 탄 버스, 둘만 알아듣는 농담이 사진에 남았다. 새 증거는 없지만 관계가 점수표만은 아니게 됐다.", trust: 5, affection: 13, days: 7, cost: 400000, costLabel: "둘만의 일주일", reaction: `“이번 주는 제가 사건 속 사람이 아니라 그냥 여자친구 같았어요.”` },
      turning_record: checkSuccess ? { title: "막연한 찜찜함이 확인할 문장으로 바뀌었다", text: "프로필 경력, 가족 송금, 결혼 속도 중 서로 과장한 부분을 날짜와 함께 적었다.", trust: 3, days: 2, evidence: { id: "mutual_corrections", title: "서로 바로잡은 초기 설명", type: "clue", text: "프로필과 첫 대화에서 과장하거나 생략한 항목을 두 사람이 날짜별로 기록했다.", source: "공동 작성", quality: 2 }, reaction: `“당신 것도 적었으니 제 것도 말할게요. 하지만 바로 범죄처럼 보진 말아 줘요.”` } : { title: "표가 취조 목록처럼 보였다", text: "질문 순서가 몰아붙이는 분위기가 되어 대화가 중간에 끊겼다.", trust: -6, days: 1, bad: true, reaction: `“우리 대화하는 거예요, 조사받는 거예요?”` },
      turning_threat: { title: "자백보다 침묵을 만들었다", text: "증거가 모이지 않은 상태에서 신고를 협박하자 상대와 주변 인물이 연락과 자료를 정리하기 시작했다.", trust: -20, affection: -17, conflict: 23, stress: 8, days: 1, bad: true, flag: "earlyThreat", reaction: `“무슨 말을 해도 사기라고 할 거면 여기서 끝내요.”` },
      accept_reverse_check: { title: "확인은 한쪽만 요구하는 일이 아니었다", text: state.flags.playerLied ? "과장한 수입을 인정하고 실제 자료를 보여 줬다. 신뢰는 흔들렸지만 거짓말이 더 커지기 전에 멈췄다." : "그녀가 내 집과 일을 확인한 뒤 서로 같은 기준을 쓰게 됐다.", trust: state.flags.playerLied ? -3 : 9, calm: 1, days: 2, flags: { reverseChecked: true, playerLieCleared: Boolean(state.flags.playerLied) }, evidence: { id: "reverse_check", title: "상대가 확인한 주인공 정보", type: "fact", text: "주인공의 직장·집·재정도 상대가 같은 기준으로 확인했다.", source: "서로 확인한 자료", quality: 3 } },
      privacy_double_standard: { title: "같은 질문에 다른 규칙을 적용했다", text: `“저는 다 보여 줬는데 당신은 믿으라고만 하네요.”\n\n${partner.name}은 더 이상 자신의 자료도 보여 줄 이유가 없다고 말했다.`, trust: -16, calm: -1, days: 1, flag: "doubleStandard" },
      charm_deflect: checkSuccess ? { title: "오늘은 웃고 넘어갔다", text: "데이트 약속은 잡혔지만 그녀는 ‘다음에는 진짜 답해요’라고 메모했다.", trust: 2, affection: 4, days: 1, flag: "deferredReverseCheck" } : { title: "농담이 대답을 대신하지 못했다", text: `${partner.name}은 웃지 않았다. 확인을 피한다는 인상만 강해졌다.`, trust: -8, affection: -6, days: 1, bad: true },
      pay_crisis: { title: "일정은 유지됐지만 질문은 남았다", text: isScam ? "돈이 도착했다는 확인은 그녀보다 다른 사람에게서 먼저 왔다. 다음 요구가 가능하다는 신호가 됐다." : "실제 급한 문제는 해결됐다. 그러나 확인 없이 큰돈을 보내는 방식은 다음 갈등의 씨앗이 됐다.", trust: isScam ? 2 : 7, calm: -1, days: 1, cost: getRoute().id === "broker" ? 4800000 : 3200000, costLabel: "긴급 송금", flag: "paidCrisis" },
      verify_transfer: { title: "도움과 확인을 함께 했다", text: isScam ? "실제로 돈을 받을 곳과 원본을 확인하겠다는 말에 설명이 흔들렸다. 돈은 보내지 않았고 기록 하나가 남았다." : `${partner.name}은 처음엔 서운해했지만 병원이나 학교처럼 실제 돈을 받을 곳에 직접 보내자 안도했다.`, trust: isScam ? -2 : 6, days: 3, cost: 300000, costLabel: "독립 통역·확인", evidence: mystery.clues.money },
      hard_refusal: { title: "돈은 지켰고 관계는 다쳤다", text: isScam ? "요구는 즉시 멈췄다. 그러나 상대도 입을 닫아 더 확인할 기회가 사라졌다." : `“사정을 묻지도 않고 저를 사기꾼으로 봤네요.”\n\n${partner.name}의 목소리가 차갑게 가라앉았다.`, trust: isScam ? -4 : -18, calm: 1, days: 1, flag: "harshMoneyRefusal" },
      fake_transfer: checkSuccess ? { title: isScam ? "편법이 연결고리를 흔들었다" : "거짓 시험이 결국 들켰다", text: isScam ? "가짜 화면을 보내자 돈을 받기로 한 사람이 아닌 다른 사람이 즉시 ‘입금이 안 됐다’고 연락했다." : "실제 문제를 해결하려던 가족이 은행에 확인하면서 거짓 화면이 드러났다.", trust: isScam ? -2 : -22, calm: -1, days: 1, evidence: isScam ? mystery.clues.digital : null, flag: "fakeTransfer" } : { title: "가짜 화면이 바로 들켰다", text: "은행 화면의 시간이 맞지 않아 시험한 사실만 드러났다. 상대가 진심이든 아니든 대화 통로가 크게 손상됐다.", trust: -24, affection: -18, conflict: 20, calm: -1, days: 1, flag: "fakeTransfer", bad: true },
      hire_investigator: { title: "사람이 아니라 사실을 확인했다", text: "허가된 기록과 직접 면담을 나눠 조사했다. ‘느낌상 이상하다’는 문장은 보고서에서 제외됐다.", trust: -1, calm: 1, days: 5, cost: 1500000, costLabel: "현지 독립 조사", evidence: mystery.clues.investigate, report: { target: "프로필 직장·거주지·주요 연락처의 실제 존재", found: mystery.clues.investigate.text, unknown: "마음의 진정성과 앞으로의 행동까지는 기록만으로 확인할 수 없음", next: "보고서의 날짜와 돈 요구 또는 업체 연락 기록을 대조" } },
      digital_verify: { title: "원본에는 편집되지 않은 시간이 있었다", text: "사진 촬영일, 메시지 앞뒤, 사이트 생성일을 대조했다. 문장보다 삭제와 편집의 순서가 더 많은 말을 했다.", trust: 0, days: 3, cost: 450000, costLabel: "디지털 원본 확인", evidence: mystery.clues.digital, report: { target: "프로필 사진 원본·메시지 앞뒤·계정 생성 시점", found: mystery.clues.digital.text, unknown: "화면 속 계정을 실제로 누가 조작했는지", next: "같은 날짜의 계좌·통화·직접 진술과 연결" } },
      ask_local: { title: "빠른 답에는 출처가 빠져 있었다", text: "당사자가 직접 본 일과 다른 사람에게 들은 이야기가 섞여 있었다. 이 결과만으로 누구도 지목할 수 없다.", trust: -2, calm: -1, days: 1, cost: 100000, costLabel: "현지 사례비", evidence: { id: `local_rumor_${state.scene}`, title: "현지에서 들은 평판", type: "rumor", text: "당사자·날짜·원본을 확인하지 못한 주변 이야기다. 증거로 제시하면 위험하다.", source: "현지 소문", quality: 1 }, report: { target: "주변 상인·이웃에게 들은 평판", found: "서로 다른 두 사람이 같은 소문을 반복했지만 직접 목격자는 나오지 않음", unknown: "최초 발신자·정확한 날짜·원본", next: "공개 지목하지 말고 소문 속 날짜 하나만 공식 기록으로 확인" } },
      snoop_phone: { title: isScam ? "자료는 찾았고 신뢰도 잃었다" : "의심이 관계를 삼켰다", text: isScam ? "결정적인 화면을 찾았지만 잠금 기록 때문에 몰래 본 사실도 들켰다." : `수상한 대화는 없었다. 대신 ${partner.name}은 침해당한 사생활만 분명히 확인했다.`, trust: isScam ? -12 : -28, calm: -1, days: 1, evidence: isScam ? mystery.clues.digital : null, flag: "snooped" },
      trace_tip: { title: "사진보다 파일의 시간이 먼저 말했다", text: isScam ? "잘린 사진의 원본과 발신자 계정이 사건의 다른 기록에 연결됐다." : "사진은 오래전 단체 모임을 잘라낸 것이고, 익명 계정은 최근 만들어졌다. 제보가 오히려 함정에 가까웠다.", trust: isScam ? 0 : 5, days: 3, cost: 450000, costLabel: "익명 제보 원본 확인", evidence: mystery.clues.digital },
      show_tip_calmly: { title: "비난 대신 새 진술을 얻었다", text: isScam ? `${partner.name}의 설명에서 사진 날짜가 두 번 바뀌었다. 이 말은 다음 심문에서 확인해야 한다.` : `${partner.name}은 사진 전체와 함께 있던 사람들의 연락처를 먼저 내밀었다.`, trust: isScam ? -2 : 7, days: 2, evidence: { id: "tip_response", title: "익명 사진에 대한 당사자 설명", type: "clue", text: "사진의 장소·날짜·동행인에 대한 답변을 그대로 기록했다.", source: "직접 질문", quality: 2 } },
      accuse_from_tip: { title: isScam ? "반응은 컸지만 증거는 늘지 않았다" : "잘린 사진으로 사람을 단정했다", text: isScam ? "그녀는 연락을 끊기 전에 사진이 조작됐다고만 말했다. 원본을 찾을 통로도 함께 닫혔다." : `사진 전체를 본 뒤에도 이미 내뱉은 말은 돌아오지 않았다. ${partner.name}은 더 이상 해명하지 않겠다고 했다.`, trust: isScam ? -8 : -22, calm: -1, days: 1, flag: "tipAccusation" },
      delete_tip: { title: "관계는 지켰지만 가능성 하나도 지웠다", text: isScam ? "며칠 뒤 같은 계정은 사라졌다. 진짜 제보였는지 함정이었는지 확인할 길도 없어졌다." : `익명 계정의 의도에 휘둘리지는 않았다. ${partner.name}과의 대화는 평소 리듬을 되찾았다.`, trust: isScam ? 2 : 8, calm: 1, days: 1, flag: "tipDeleted" },
      date_rest: { title: "사건 밖의 사람이 다시 보였다", text: `오랜만에 ${partner.name}이 크게 웃었다. 해결된 모순은 없지만, 결론을 내릴 체력은 돌아왔다.`, trust: 9, calm: 2, days: 3, cost: 350000, costLabel: "데이트·휴식" },
      solo_rest: { title: "결론보다 잠을 먼저 선택했다", text: "상담사는 불안한 느낌과 확인된 사실을 종이에 나눠 적게 했다. 같은 자료가 조금 다르게 보였다.", trust: -1, calm: 4, days: 4, cost: 200000, costLabel: "숙소 연장·상담" },
      secret_trace: checkSuccess ? { title: isScam ? "뒤를 밟아 연결을 확인했다" : "아무것도 없었고 미행만 남았다", text: isScam ? "예상하지 못한 장소에서 사건과 연결된 사람을 만나는 장면을 확인했다." : "그녀는 말한 곳에서 말한 일을 했다. 미행 사실을 알게 된 뒤 내 연락을 받지 않았다.", trust: isScam ? -6 : -24, calm: -1, days: 2, cost: 600000, costLabel: "이동·조사 비용", evidence: isScam ? mystery.clues.investigate : null, flag: "tailed" } : { title: "미행은 들켰고 자료는 없었다", text: "동선을 놓친 뒤 마주쳐 버렸다. 확인한 사실은 없고 몰래 따라다녔다는 사실만 남았다.", trust: -22, affection: -15, conflict: 18, calm: -1, days: 2, cost: 600000, costLabel: "이동·조사 비용", bad: true },
      rush_answer: { title: "불안을 결혼 일정으로 덮었다", text: "업체와 가족은 환영했지만 확인되지 않은 문장들은 사라지지 않았다. 오히려 잔금과 서류 마감이 한꺼번에 다가왔다.", trust: 6, calm: -1, days: 1, cost: getRoute().id === "broker" ? 2500000 : 800000, costLabel: "일정 변경·예약금", flag: "rushedMarriage" },
      final_source_call: checkSuccess ? { title: "마지막 한 통이 빈칸 하나를 채웠다", text: "이미 가진 자료를 읽어 주지 않고 처음 정보를 만든 곳에 날짜와 돈을 받는 사람을 다시 물었다. 확인 가능한 문장 하나가 더 생겼다.", trust: 0, calm: 1, days: 2, cost: 300000, costLabel: "최종 독립 확인", evidence: firstMissingCaseClue(mystery) } : { title: "확인할 질문을 좁히지 못했다", text: "여러 의심을 한꺼번에 물으며 핵심 답을 얻지 못했다. 시간과 비용만 썼다.", calm: -1, stress: 5, days: 2, cost: 300000, costLabel: "최종 독립 확인", bad: true },
      final_reconcile: { title: "수첩에 두 사람의 수정 표시가 남았다", text: `${partner.name}도 숨겼던 두려움 하나를 인정했고, 나도 소문을 사실처럼 읽었던 부분을 고쳤다.`, trust: state.confirmed ? 9 : 6, calm: 2, days: 2, flag: "reconciled" },
      final_post_rumor: { title: "판단을 군중에게 넘겼다", text: "몇 분 만에 확신에 찬 댓글이 쏟아졌지만 누구도 원본을 보지 않았다. 개인정보는 퍼졌고 당사자와의 대화는 끝났다.", trust: -25, calm: -2, days: 1, evidence: { id: "crowd_reaction", title: "커뮤니티의 추측", type: "rumor", text: "공개된 일부 사연을 본 익명 사용자들의 추측이다. 직접 증거가 아니다.", source: "온라인 댓글", quality: 1 }, flag: "publicRumor" },
      wedding_local: checkSuccess ? { title: `${getCountry().name}에서 먼저 축하받기로 합의했다`, text: `${partner.name}은 가족이 직접 볼 수 있다는 말에 안도했다. 내 가족은 아쉬워했지만 영상과 한국 방문 일정을 따로 잡기로 했다.`, trust: 7, affection: 10, conflict: -3, days: 21, cost: 6000000, costLabel: "현지 결혼식 기본 준비", set: { weddingPlace: `${getCountry().name} 예식` }, reaction: `“우리 가족 앞에서 약속해 줘서 고마워요. 한국 가족에게도 제가 직접 인사할게요.”` } : { title: "현지 예식 제안에 바로 합의하지 못했다", text: "그녀는 가족을 기쁘게 하고 싶지만 결혼 뒤 빚이 두렵다고 말했다. 비용표를 다시 본 뒤 다음 장면에서 더 작은 규모를 논의하기로 했다.", trust: 1, conflict: 3, days: 3, set: { weddingPlace: "장소 재협의" }, reaction: `“싫다는 게 아니라, 이 돈을 쓰고도 우리가 괜찮을지 먼저 보고 싶어요.”`, bad: true },
      wedding_korea: checkSuccess ? { title: "한국 예식을 함께 준비하기로 했다", text: `가족 항공과 통역을 실제 예산에 넣자 ${partner.name}도 동의했다. 내 가족이 편한 만큼 그녀가 혼자가 되지 않게 역할을 나눴다.`, trust: 5, affection: 6, conflict: 1, days: 28, cost: 12000000, costLabel: "한국 결혼식 기본 준비", set: { weddingPlace: "한국 예식" }, reaction: `“제 가족이 손님처럼 서 있지 않게 당신이 옆에 있어 줘요.”` } : { title: "한국 예식 제안이 일방적으로 들렸다", text: "그녀는 자기 가족이 거의 오지 못하는 결혼식을 바로 결정할 수 없다고 답했다. 장소는 정해지지 않았다.", trust: -5, affection: -3, conflict: 8, days: 3, set: { weddingPlace: "장소 재협의" }, reaction: `“우리 결혼식인데 왜 당신 가족이 편한 것만 먼저 정해요?”`, bad: true },
      wedding_both: checkSuccess ? { title: "두 나라의 가족을 모두 만나기로 합의했다", text: "두 번의 예식은 피곤하고 비쌌지만 어느 한쪽만 손님이 되는 느낌은 줄었다. 문제는 신혼을 시작하기도 전에 통장 잔액이 빠르게 줄었다는 점이다.", trust: 9, affection: 12, conflict: -4, stress: 12, days: 42, cost: 18000000, costLabel: "양국 결혼식 기본 준비", set: { weddingPlace: "양국 예식" }, reaction: `“둘 다 작게 한다면 좋아요. 대신 빚이 생기면 숨기지 말아요.”` } : { title: "두 번의 예식은 지금 감당할 수 없었다", text: "마음은 좋았지만 예산과 일정이 맞지 않았다. 무리해서 결제하지 않고 한 나라의 식과 다른 나라의 가족 행사를 나누기로 했다.", trust: 4, affection: 2, days: 4, set: { weddingPlace: "한 번의 예식·추후 가족 행사" }, reaction: `“양쪽을 다 챙기려다 우리 생활이 무너지면 안 돼요.”` },
      wedding_small: { title: "작지만 둘이 감당할 수 있는 식", text: "하객 수를 줄이고 꼭 필요한 항목만 남겼다. 아쉬워하는 친척도 있었지만 결혼 뒤 생활비가 남는다는 안도감이 컸다.", trust: 5, affection: 4, conflict: -2, days: 14, cost: 2500000, costLabel: "작은 결혼식 추가비", set: { weddingStyle: "가족 중심" } },
      wedding_standard: { title: "보통 규모에서 균형을 잡았다", text: "양가 이동과 식사, 사진을 챙기되 과한 선택 항목은 줄였다. 완벽한 합의는 아니었지만 누구도 일방적으로 포기하지 않았다.", trust: 6, affection: 7, days: 21, cost: 7000000, costLabel: "보통 규모 결혼식 추가비", set: { weddingStyle: "보통 규모" } },
      wedding_lavish: { title: "화려한 하루를 선택했다", text: "사진과 가족 반응은 기대 이상이었다. 그러나 결제 문자가 올 때마다 축하보다 빚이 먼저 떠올랐고, 돈 이야기는 신혼의 첫 갈등이 됐다.", trust: 5, affection: 11, conflict: 9, stress: 14, days: 30, cost: 15000000, costLabel: "대규모 결혼식 추가비", set: { weddingStyle: "큰 결혼식" } },
      wedding_calm_talk: checkSuccess ? { title: "둘이 같은 편이 됐다", text: `${partner.name}과 먼저 합의한 뒤 가족에게 설명했다. 체면을 완전히 살리진 못했지만 추가금은 상징적인 선에서 끝났고, 그녀는 내 편에 서서 같은 말을 반복했다.`, trust: 9, affection: 10, conflict: -5, days: 1, cost: 300000, costLabel: "현장 통역·조정" } : { title: "말의 뜻이 엇갈렸다", text: "차분히 풀어 보려 했지만 통역과 가족의 말이 겹치며 내가 돈을 아끼려고 예식을 망친다는 인상만 남았다. 추가 요구는 줄지 않았고 둘 사이도 어색해졌다.", trust: -7, affection: -5, conflict: 13, stress: 8, days: 1, cost: 300000, costLabel: "현장 통역·조정", bad: true },
      wedding_firm_refusal: checkSuccess ? { title: "선을 분명히 지켰다", text: `계약서와 합의 금액을 차분히 읽고 추가 현금은 내지 않았다. 예식은 조금 늦었지만 ${partner.name}도 가족에게 같은 기준을 설명했다.`, trust: 5, affection: 3, conflict: 3, calm: 1, days: 1 } : { title: "거절이 모욕처럼 전달됐다", text: `말이 너무 세게 나가며 돈 문제가 두 가족의 체면 싸움으로 번졌다. 예식은 진행됐지만 ${partner.name}은 가장 힘든 날에 혼자 막았다고 느꼈다.`, trust: -13, affection: -10, conflict: 22, stress: 12, days: 1, bad: true },
      wedding_pay_extra: { title: "예식은 예정대로 진행됐다", text: "추가 돈을 내자 분위기는 금방 풀렸다. 하지만 누구도 왜 원래 견적과 달랐는지 설명하지 않았고, 다음 요구를 거절하기는 더 어려워졌다.", trust: 2, affection: 5, conflict: 3, stress: 7, days: 1, cost: 4000000, costLabel: "현장 추가 예물", flag: "paidWeddingPressure" },
      move_korea: checkSuccess ? { title: "한국행 비행기에 함께 올랐다", text: `${partner.name}은 창밖을 오래 보다가 “이제부터 저는 모르는 사람처럼 될 수도 있어요. 그때도 제 말을 기다려 줘요”라고 말했다.`, trust: 6, affection: 7, stress: 6, days: 30, cost: 2500000, costLabel: "항공·서류·초기 정착", set: { homeCountry: "korea", monthlyLiving: 2700000, playerIncomeFactor: 1 }, reaction: `“한국에 가는 건 동의해요. 대신 제 돈과 공부 시간은 제가 정할 수 있게 해 줘요.”` } : { title: "한국행 조건에 합의하지 못했다", text: "언어와 체류가 모두 내 손에 달리는 구조가 두렵다는 답이 돌아왔다. 현지에서 한 달 더 지내며 조건을 다시 쓰기로 했다.", trust: -2, conflict: 5, days: 30, cost: 1000000, costLabel: "거주 재협의 체류", set: { homeCountry: "local", monthlyLiving: 2100000, playerIncomeFactor: .7 }, bad: true, reaction: `“당신을 싫어해서가 아니라, 제가 아무것도 못 하는 사람이 되는 게 무서워요.”` },
      move_local: checkSuccess ? { title: `${getCountry().name}에서 생활을 시작했다`, text: "내가 낯선 사람이 되어 보니 통역과 생활 정보가 없는 답답함을 조금 이해하게 됐다. 대신 한국의 일은 줄었고 수입도 함께 내려갔다.", trust: 9, affection: 8, calm: 1, days: 30, cost: 4000000, costLabel: "현지 이주·체류 준비", set: { homeCountry: "local", monthlyLiving: 1900000, playerIncomeFactor: .65 }, reaction: `“제 생활을 직접 보려는 선택이 고마워요. 당신 일도 같이 지킬 방법을 찾아요.”` } : { title: "현지 1년은 두 사람 모두 준비가 부족했다", text: "수입 감소와 체류 조건을 계산하자 바로 시작할 수 없었다. 한국 정착을 준비하되 현지 방문을 늘리기로 했다.", trust: 2, days: 21, cost: 1200000, costLabel: "거주 대안 준비", set: { homeCountry: "korea", monthlyLiving: 2600000, playerIncomeFactor: 1 }, reaction: `“마음만으로 1년을 버티긴 어려워요. 현실적인 방법으로 다시 정해요.”` },
      move_distance: checkSuccess ? { title: "6개월의 장거리 규칙을 함께 정했다", text: "각자의 일은 지켰지만 같은 집에서 쌓이는 평범한 기억은 적었다. 항공비와 연락 규칙을 매달 다시 점검해야 한다.", trust: 2, affection: -1, conflict: 5, stress: 8, days: 60, cost: 1500000, costLabel: "첫 왕복 항공·숙소", set: { homeCountry: "distance", monthlyLiving: 3000000, playerIncomeFactor: 1 }, reaction: `“6개월 뒤에는 꼭 다시 정해요. 끝없이 기다리는 결혼은 싫어요.”` } : { title: "장거리 제안이 결정을 미루는 말로 들렸다", text: "그녀는 결혼 뒤에도 확실한 집이 없다는 데 동의하지 않았다. 결국 한국 정착 준비를 시작했다.", trust: -5, affection: -4, conflict: 8, days: 21, cost: 1800000, costLabel: "한국 정착 대안", set: { homeCountry: "korea", monthlyLiving: 2700000, playerIncomeFactor: 1 }, bad: true, reaction: `“결혼했는데 언제 함께 살지조차 모르는 건 싫어요.”` },
      home_listen: checkSuccess ? { title: "해결보다 이해가 먼저 닿았다", text: `${partner.name}은 외롭고 무서웠던 순간을 하나씩 말했다. 내가 바로 반박하지 않자 생활 문제의 크기도 오히려 작아졌다.`, trust: 8, affection: 11, conflict: -8, intimacy: 6, days: 3 } : { title: "듣고 있었지만 마음은 닿지 않았다", text: "중간중간 해명과 충고가 끼어들었다. 그녀는 결국 “또 당신 이야기로 끝났네요”라고 말하고 방으로 들어갔다.", trust: -5, affection: -7, conflict: 10, stress: 4, days: 2, bad: true },
      home_rules: checkSuccess ? { title: "생활 규칙이 싸움을 줄였다", text: "집안일과 혼자 있는 시간을 구체적으로 나누자 서로의 행동을 악의로 해석하는 일이 줄었다.", trust: 6, affection: 5, conflict: -7, days: 3, flag: "homeRules" } : { title: "표가 또 하나의 잔소리가 됐다", text: "너무 많은 규칙을 한 번에 만들었다. 지키지 못한 칸마다 누가 더 노력하지 않았는지 따지는 싸움이 생겼다.", trust: -3, affection: -3, conflict: 8, days: 2, bad: true },
      home_buy_gifts: { title: "집은 편해졌지만 말은 남았다", text: "새 물건을 받자 표정은 밝아졌다. 그러나 외로움과 가족 생각은 택배 상자 안에 들어가지 않았다.", affection: 6, trust: 1, conflict: 2, days: 2, cost: 3000000, costLabel: "신혼 가전·선물" },
      money_three_accounts: checkSuccess ? { title: "돈의 흐름이 둘에게 보였다", text: "공동생활비와 개인 돈을 나눴다. 서로 허락을 받지 않아도 되는 돈과 반드시 상의할 돈이 분명해졌다.", trust: 10, affection: 4, conflict: -7, days: 2, flag: "transparentAccounts", evidence: { id: "marriage_budget", title: "부부가 함께 보는 생활비 통장", type: "fact", text: "수입, 고정비, 가족송금, 개인 지출의 기준을 두 사람이 함께 정했다.", source: "부부 가계 회의", quality: 3 } } : { title: "복잡한 통장만 늘었다", text: "규칙을 너무 어렵게 만들자 서로 이해한 내용이 달랐다. 누락된 지출이 생길 때마다 숨긴 돈인지 실수인지 싸우게 됐다.", trust: -2, conflict: 8, stress: 3, days: 2, bad: true },
      money_all_partner: { title: "한 사람이 돈을 맡았다", text: partnerScam ? "처음 몇 달은 편했지만 생활비 명목의 이체가 여러 계좌로 흩어졌다. 내가 바로 확인하기 어려운 구조가 생겼다." : `${partner.name}은 꼼꼼히 가계부를 썼다. 다만 모든 책임이 한 사람에게 몰리자 돈 이야기를 꺼내기 더 어려워졌다.`, trust: partnerScam ? 2 : 6, affection: 4, conflict: 2, days: 2, flag: "partnerControlsMoney" },
      money_hide_account: checkSuccess ? { title: "비상금은 숨겼다", text: "급한 상황에 쓸 돈은 지켰지만, 공동 가계부의 수입 숫자는 거짓이 됐다. 나중에 발견되면 상대의 숨긴 돈을 비난하기 어려워진다.", trust: -2, conflict: 4, calm: 1, days: 1, flag: "hiddenPlayerAccount" } : { title: "몰래 만든 계좌가 들켰다", text: `은행 알림이 함께 보이며 비상금이 드러났다. ${partner.name}은 “당신은 저를 확인하면서 자기 돈은 숨겼네요”라고 말했다.`, trust: -17, affection: -12, conflict: 22, stress: 8, days: 1, bad: true },
      work_training: { title: "그녀의 경력을 다시 잇기 시작했다", text: "교육 기간에는 수입이 없었지만 스스로 하루를 꾸리는 힘이 돌아왔다. 6개월 뒤 경력과 가까운 일에서 월 240만원을 벌기 시작했다.", trust: 8, affection: 9, conflict: -4, calm: 1, days: 180, cost: 2000000, costLabel: "언어·자격 교육", set: { partnerIncome: 2400000 } },
      work_immediate: { title: "빠르게 수입이 생겼다", text: "한 달 뒤 월 280만원의 수입이 생겼다. 대신 교대근무와 늦은 귀가가 늘었고, 설명하지 않은 밤은 의심의 재료가 되기 쉬워졌다.", trust: 3, affection: 3, stress: 7, days: 30, set: { partnerIncome: 2800000 }, flag: "shiftWork" },
      work_forbid: { title: "집은 조용해졌고 그녀도 조용해졌다", text: `외부 일은 멈췄지만 ${partner.name}은 생활비를 쓸 때마다 내 눈치를 보기 시작했다. 구직 사이트 기록을 지우는 모습도 보였다.`, trust: -12, affection: -14, conflict: 18, intimacy: -8, days: 30, flag: "forbadeWork", bad: true },
      remit_negotiate: checkSuccess ? { title: "도움의 한도를 둘이 정했다", text: "약값과 학비 자료를 확인하고 월 30만원을 넘는 요청은 다시 의논하기로 했다. 가족도 적어도 기준은 알게 됐다.", trust: 7, affection: 6, conflict: -5, days: 3, set: { monthlyRemittance: 300000 } } : { title: "확인이 불신처럼 들렸다", text: "자료를 요구하는 말이 가족을 거짓말쟁이로 보는 것처럼 번역됐다. 송금액은 정하지 못했고 감정만 상했다.", trust: -6, affection: -5, conflict: 12, days: 2, bad: true },
      remit_generous: { title: "가족의 걱정은 줄었다", text: "매달 80만원을 보내자 가족의 연락은 따뜻해졌다. 그러나 결혼식 빚과 아이 비용이 겹치면 이 약속이 부부싸움으로 돌아올 수 있다.", trust: 7, affection: 8, conflict: -2, days: 2, set: { monthlyRemittance: 800000 } },
      remit_none: { title: "돈은 막았고 마음도 막혔다", text: `${partner.name}은 우리 가계를 이해한다고 했지만 가족 전화를 숨겨 받기 시작했다. 송금은 0원이지만 갈등은 사라지지 않았다.`, trust: -9, affection: -8, conflict: 16, days: 2, set: { monthlyRemittance: 0 }, flag: "blockedRemittance" },
      distance_gentle: checkSuccess ? { title: "닫힌 문 뒤의 말을 들었다", text: `${hiddenReason}\n\n그 말이 모든 의심을 해결한 것은 아니지만, 다음에 무엇을 확인해야 하는지는 분명해졌다.`, trust: state.intimacyTruth === "deception" ? -2 : 9, affection: state.intimacyTruth === "deception" ? -3 : 10, conflict: -5, intimacy: 8, days: 3, evidence: { id: "intimacy_explanation", title: "잠자리를 피한 이유에 대한 설명", type: "clue", text: hiddenReason, source: "부부 대화", quality: 2 } } : { title: "말을 기다렸지만 타이밍을 놓쳤다", text: "조심스럽게 물었지만 이미 쌓인 서운함이 먼저 나왔다. 그녀는 오늘은 말할 수 없다며 대화를 끝냈다.", trust: -3, affection: -4, conflict: 7, intimacy: -5, days: 2, bad: true },
      distance_check_phone: checkSuccess ? (partnerScam || state.intimacyTruth === "deception" ? { title: "숨긴 대화의 일부를 찾았다", text: "아이 약속과 실제 계획이 다르다는 메시지를 발견했다. 하지만 몰래 본 사실도 기록에 남아 관계는 더 거칠어졌다.", trust: -12, affection: -10, conflict: 15, stress: 6, days: 1, evidence: { id: "marriage_hidden_chat", title: "결혼 뒤 숨긴 계획 대화", type: "clue", text: "아이와 체류 계획에 대해 배우자에게 말한 내용과 다른 메시지가 남아 있다.", source: "휴대폰 화면", quality: 2 } } : { title: "사기는 없었고 침해만 남았다", text: "건강 정보와 친구에게 털어놓은 두려움이 보였다. 사기 단서는 없었고 몰래 본 사실이 들켰다.", trust: -24, affection: -18, conflict: 30, intimacy: -18, days: 1, bad: true }) : { title: "휴대폰 확인도 들켰다", text: "잠금 기록과 알림 때문에 몰래 보려 한 사실만 드러났다. 자료는 얻지 못했고 신뢰는 크게 무너졌다.", trust: -20, affection: -15, conflict: 26, intimacy: -15, days: 1, bad: true },
      distance_pressure: { title: "문은 더 단단히 닫혔다", text: `“결혼했다고 제 몸이 의무가 되는 건 아니에요.” ${partner.name}은 그날부터 같은 방에서 자지 않았다. 아이 문제도 대화가 아니라 싸움이 됐다.`, trust: -22, affection: -24, conflict: 34, intimacy: -30, stress: 12, days: 3, bad: true },
      distance_wait: { title: "이번에는 기다리기로 했다", text: "압박을 멈추자 표정은 조금 풀렸다. 다만 다음 대화 날짜를 지키지 않으면 기다림은 회피가 될 수 있다.", trust: 6, affection: 5, conflict: -3, intimacy: 2, days: 30, flag: "waitedIntimacy" },
      intimacy_counsel: checkSuccess ? { title: "한 문장으로 못 하던 이유가 보였다", text: `${hiddenReason}\n\n상담사는 이 설명이 사실인지 확인할 다음 행동과 서로 강요하지 않을 기준을 정해 줬다.`, trust: state.intimacyTruth === "deception" ? -4 : 10, affection: state.intimacyTruth === "deception" ? -3 : 11, conflict: -9, intimacy: 12, calm: 1, days: 7, cost: 350000, costLabel: "부부 상담·진료", evidence: { id: "counsel_record", title: "부부 상담에서 확인한 이유", type: state.intimacyTruth === "deception" ? "clue" : "fact", text: hiddenReason, source: "부부 상담", quality: 3 } } : { title: "상담실에서도 서로 방어했다", text: "상대의 말을 듣기보다 상담사에게 누가 맞는지 판정해 달라고 했다. 이유는 더 흐려졌고 비용과 피로만 남았다.", trust: -5, conflict: 10, stress: 5, days: 7, cost: 350000, costLabel: "부부 상담·진료", bad: true },
      intimacy_timeline: checkSuccess ? { title: "말과 행동의 날짜가 연결됐다", text: state.intimacyTruth === "deception" ? "아이를 원한다고 말한 날과 업체·가족에게 다른 계획을 보낸 날이 겹쳤다. 의심이 확인할 수 있는 모순으로 바뀌었다." : `야근과 다툼, 몸이 아팠던 날이 반복되는 패턴이 보였다. ${hiddenReason}`, trust: state.intimacyTruth === "deception" ? -3 : 7, affection: state.intimacyTruth === "deception" ? -2 : 6, conflict: -5, days: 3, evidence: { id: "intimacy_timeline", title: "부부 사이가 멀어진 날짜 기록", type: "clue", text: state.intimacyTruth === "deception" ? "배우자에게 한 아이 약속과 외부에 말한 계획의 날짜가 겹친다." : hiddenReason, source: "부부 공동 기록", quality: 2 } } : { title: "달력이 심문표가 됐다", text: "모든 피곤한 날에 이유를 증명하라고 묻자 대화가 다시 막혔다.", trust: -7, conflict: 12, intimacy: -8, days: 2, bad: true },
      intimacy_accuse: state.intimacyTruth === "deception" ? { title: "반응은 컸지만 증명은 남지 않았다", text: "그녀는 처음 말을 부정하다가 대화를 끊었다. 의심은 더 강해졌지만 다른 가능성을 지울 증거는 얻지 못했다.", trust: -12, affection: -12, conflict: 22, intimacy: -20, days: 2, flag: "intimacyAccused" } : { title: "어려운 고백을 거짓말로 만들었다", text: `${hiddenReason} 하지만 설명을 듣기 전에 사기라고 몰아붙였다. ${partner.name}은 더 이상 안전하게 말할 수 없다고 느꼈다.`, trust: -27, affection: -25, conflict: 36, intimacy: -28, stress: 10, days: 2, bad: true },
      intimacy_believe: { title: "이번에는 설명을 믿었다", text: state.intimacyTruth === "deception" ? "겉으로는 평온해졌지만 말과 행동의 차이는 남았다. 다음 확인 기회가 오기 전까지 위험도 함께 미뤄졌다." : `${hiddenReason} 기다리겠다는 말에 그녀는 다음 상담 날짜를 먼저 잡았다.`, trust: 8, affection: 7, conflict: -7, intimacy: 5, days: 14, flag: "believedIntimacy" },
      child_start_now: { title: "아이 계획을 실제 일정으로 옮겼다", text: "건강 상담과 생활비 계산부터 시작하기로 했다. 기대가 커진 만큼 결과가 늦을 때의 스트레스도 준비해야 한다.", trust: 6, affection: 8, conflict: -3, days: 7, flag: "tryingForChild" },
      child_shared_plan: checkSuccess ? { title: "서로 다른 마음을 같은 종이에 적었다", text: "지금 당장 원하는 답은 달랐지만 언제 다시 의논할지, 어떤 조건이면 가능한지 합의했다.", trust: 10, affection: 9, conflict: -12, intimacy: 6, days: 3, flag: "childPlanAgreed" } : { title: "계획표가 압박표가 됐다", text: "조건과 날짜를 너무 촘촘히 정하며 그녀는 이미 답이 정해져 있다고 느꼈다.", trust: -6, affection: -5, conflict: 11, intimacy: -5, days: 2, bad: true },
      child_demand: { title: "약속은 남았고 마음은 멀어졌다", text: `결혼 전 대답을 계약처럼 들이밀자 ${partner.name}은 아이 이야기를 피하기 시작했다. 강요로 얻은 동의는 실제 계획이 되지 못했다.`, trust: -18, affection: -20, conflict: 28, intimacy: -22, stress: 8, days: 3, bad: true },
      child_accept_choice: { title: "원하지 않는 마음도 대답으로 받아들였다", text: state.childIntent === "no" ? "아이 없는 삶이 내가 원하는 미래와 맞는지도 솔직히 고민하기로 했다. 받아들이지 못한다면 비난 대신 관계를 다시 정해야 한다." : "정해 둔 시점에 다시 이야기하되 그전까지는 매달 시험하지 않기로 했다.", trust: 10, affection: 11, conflict: -12, intimacy: 7, days: 30, flag: "acceptedChildChoice" },
      health_both: { title: "둘의 문제로 함께 확인했다", text: "검사 결과는 확답이 아니라 가능성의 범위를 보여 줬다. 적어도 한 사람에게 책임을 미루는 싸움은 줄었다.", trust: 9, affection: 7, conflict: -8, calm: 1, days: 14, cost: 800000, costLabel: "부부 기본 검사·상담", flags: { healthBoth: true, tryingForChild: state.childIntent !== "no" }, evidence: { id: "couple_health", title: "두 사람이 함께 받은 건강 상담", type: "fact", text: "임신 가능성과 건강 문제를 한 사람의 책임이 아닌 부부의 문제로 확인했다.", source: "의료 상담", quality: 3 } },
      health_partner_only: { title: "결과는 얻었지만 기준은 공평하지 않았다", text: `${partner.name}은 검사를 받았지만 “왜 당신은 증명하지 않아도 되죠?”라고 물었다. 숫자는 늘었고 신뢰는 줄었다.`, trust: -11, affection: -10, conflict: 15, intimacy: -8, days: 10, cost: 450000, costLabel: "배우자 단독 검사", flag: "partnerOnlyTest" },
      health_skip: { title: "자연스럽게 기다리기로 했다", text: "비용은 아꼈지만 결과가 없을 때 건강 문제인지 시기 문제인지 알기 어려웠다.", trust: 4, affection: 4, stress: 5, days: 90, flag: "skippedHealth" },
      try_pregnancy: checkSuccess ? { title: "임신이 확인됐다", text: "이번 달 검사에서 임신이 확인됐다. 기쁨과 함께 병원 일정, 일을 줄일 시기, 생활비가 현실이 되었다.", trust: 8, affection: 12, conflict: -6, stress: 5, intimacy: 8, days: 30, set: { pregnancy: true, pregnancyAttempts: state.pregnancyAttempts + 1 }, flag: "pregnancyConfirmed" } : { title: "이번 달에는 임신이 되지 않았다", text: "기대했던 결과는 나오지 않았다. 실패가 아니라 한 번의 결과지만, 두 사람에게는 말보다 무거웠다.", affection: -2, stress: 9, days: 30, set: { pregnancyAttempts: state.pregnancyAttempts + 1 } },
      prepare_six_months: { title: "결과보다 몸과 생활을 먼저 준비했다", text: "수면과 진료, 스트레스를 챙기며 두 사람의 생활 리듬이 조금 안정됐다. 다음 시도의 게임상 가능성도 소폭 올랐다.", trust: 7, affection: 6, conflict: -5, calm: 2, days: 180, cost: 1200000, costLabel: "6개월 건강 준비", set: { fertilityFactor: Math.min(1.35, state.fertilityFactor + .12) }, flag: "preparedPregnancy" },
      stop_trying: { title: "아이만 바라보던 시간을 멈췄다", text: "출산 여부와 결혼의 행복을 분리하자 서로를 평가하는 눈이 조금 누그러졌다.", trust: 7, affection: 8, conflict: -9, intimacy: 6, calm: 1, days: 30, flag: "pausedPregnancy" },
      pregnancy_celebrate: { title: "둘만 아는 작은 축하", text: "비싼 사진보다 좋아하는 음식과 앞으로 필요한 목록이 기억에 남았다.", trust: 6, affection: 10, conflict: -4, calm: 1, days: 3, cost: 200000, costLabel: "작은 임신 축하" },
      pregnancy_budget: checkSuccess ? { title: "출산까지의 숫자가 보였다", text: "병원비와 휴직, 월 생활비를 적자 막연한 불안이 준비할 수 있는 문제로 바뀌었다.", trust: 7, affection: 4, conflict: -6, stress: -8, days: 3, flag: "birthBudget" } : { title: "숫자가 걱정을 더 키웠다", text: "가능한 최악의 비용을 한꺼번에 적으며 축하보다 불안만 커졌다.", trust: -2, affection: -3, conflict: 5, stress: 8, days: 2, bad: true },
      pregnancy_broadcast: { title: "온 가족이 기뻐했다", text: "축하 전화가 쏟아졌다. 동시에 병원과 이름, 출산 방식에 대한 조언도 끊이지 않았다.", affection: 7, conflict: 4, stress: 8, days: 3, cost: 700000, costLabel: "가족 식사·선물", flag: "pregnancyPublic" },
      pregnancy_retry_care: { title: "잠시 쉬고 다시 준비했다", text: "결과를 서로의 탓으로 돌리지 않고 상담과 휴식에 시간을 썼다.", trust: 8, affection: 8, conflict: -8, calm: 2, days: 90, cost: 600000, costLabel: "상담·회복", set: { fertilityFactor: Math.min(1.35, state.fertilityFactor + .08) } },
      pregnancy_retry_now: checkSuccess ? { title: "두 번째 시도에서 임신이 확인됐다", text: "기다림이 짧았던 만큼 기쁨도 갑자기 찾아왔다. 이제 생활 준비를 서둘러야 한다.", trust: 6, affection: 11, stress: 7, days: 30, set: { pregnancy: true, pregnancyAttempts: state.pregnancyAttempts + 1 } } : { title: "또 한 번의 한 줄", text: "바로 다시 시도한 결과도 같았다. 몸과 마음이 쉴 틈이 없어 두 사람 모두 예민해졌다.", trust: -2, affection: -5, conflict: 8, stress: 16, days: 30, set: { pregnancyAttempts: state.pregnancyAttempts + 1 }, bad: true },
      pregnancy_no_blame: { title: "결과로 서로를 평가하지 않았다", text: "이번에는 임신 시도를 멈추고 부부의 생활부터 회복하기로 했다.", trust: 9, affection: 9, conflict: -10, intimacy: 5, calm: 2, days: 30, flag: "noPregnancyBlame" },
      family_clinic: { title: "가능한 선택과 한계를 함께 들었다", text: "치료가 보장하는 것은 없지만, 시간과 비용을 알고 다음 단계를 정할 수 있게 됐다.", trust: 6, affection: 5, stress: 8, days: 120, cost: 2500000, costLabel: "전문 진료·검사", set: { fertilityFactor: Math.min(1.45, state.fertilityFactor + .15) } },
      family_adoption: checkSuccess ? { title: "새로운 가족의 가능성을 공부했다", text: "아이를 원한다는 말과 실제로 한 사람의 삶을 책임지는 일의 차이를 배웠다. 당장 결정하지 않고 준비를 이어 가기로 했다.", trust: 9, affection: 9, conflict: -7, days: 30, cost: 300000, costLabel: "입양·위탁 교육", flag: "consideringAdoption" } : { title: "서로 원하는 이유가 달랐다", text: "나는 출산 실패를 메우는 답으로, 그녀는 아직 준비되지 않은 책임으로 받아들였다. 결론은 미뤄졌다.", trust: -2, conflict: 6, days: 30, bad: true },
      family_two: { title: "둘이 사는 삶을 다시 선택했다", text: "아이 없는 삶을 실패라고 부르지 않기로 했다. 다만 어느 한쪽이 억지로 포기한 것이라면 그 마음을 숨기지 않기로 했다.", trust: 8, affection: 9, conflict: -10, intimacy: 8, days: 60, flag: "childfreeTogether" },
      pregnancy_share_work: checkSuccess ? { title: "도와주는 사람이 아니라 함께 책임졌다", text: "병원 일정과 집안일을 실제 시간표에 넣었다. 말보다 비워 둔 시간이 신뢰를 만들었다.", trust: 9, affection: 12, conflict: -10, stress: 4, days: 90, flag: "sharedPregnancyWork" } : { title: "약속은 했지만 지키지 못했다", text: "일정표만 만들고 야근을 반복했다. 기대가 생긴 만큼 실망도 더 커졌다.", trust: -8, affection: -10, conflict: 14, stress: 7, days: 60, bad: true },
      pregnancy_hire_help: { title: "돈으로 시간을 샀다", text: "집안일 부담이 줄며 둘 다 잠을 조금 더 잤다. 지출은 컸지만 싸움도 줄었다.", trust: 5, affection: 7, conflict: -9, calm: 2, days: 90, cost: 1800000, costLabel: "임신기 가사·식사 도움" },
      pregnancy_keep_work: { title: "수입은 지켰고 서운함은 쌓였다", text: `통장 숫자는 유지됐지만 ${partner.name}은 가장 힘든 시기에 혼자였다고 기억했다.`, trust: -9, affection: -12, conflict: 18, stress: 10, days: 90, bad: true },
      birth_stay: { title: "아이가 태어나고 곁을 지켰다", text: "연락과 서류를 맡고 회복을 먼저 챙겼다. 새 가족의 첫 기억이 행사보다 돌봄이 됐다.", trust: 11, affection: 14, conflict: -8, stress: 12, days: 30, cost: 1500000, costLabel: "출산·산후 초기비", children: 1, set: { pregnancy: false }, flag: "sawBirth" },
      birth_family_party: { title: "큰 축하와 큰 피로가 함께 왔다", text: `양가 가족은 기뻐했지만 회복 중인 ${partner.name}은 사람을 맞느라 더 지쳤다.`, trust: 3, affection: 6, conflict: 8, stress: 20, days: 30, cost: 3500000, costLabel: "출산 가족 행사·초기비", children: 1, set: { pregnancy: false }, flag: "sawBirth" },
      birthless_trip: { title: "둘만의 다음 지도를 그렸다", text: "출산이 없다는 사실을 피하지 않고 일, 집, 가족과의 거리를 다시 정했다.", trust: 8, affection: 9, conflict: -8, calm: 1, days: 60, cost: 500000, costLabel: "부부 계획 여행" },
      birthless_pressure: { title: "가족의 설득이 압박이 됐다", text: `양가 전화가 이어지자 ${partner.name}은 자신의 몸과 삶이 가족 회의의 안건이 됐다고 느꼈다.`, trust: -20, affection: -21, conflict: 32, intimacy: -20, stress: 12, days: 30, bad: true },
      couple_reconnect: { title: "둘만의 시간이 다시 생겼다", text: "정기적인 데이트가 문제를 없애진 않았지만 문제 밖의 두 사람을 기억하게 했다.", trust: 7, affection: 10, conflict: -8, intimacy: 10, days: 30, cost: 200000, costLabel: "정기 데이트" },
      couple_work: { title: "생활은 안정되고 대화는 줄었다", text: "각자의 수입과 일은 나아졌지만 저녁 식탁의 침묵이 길어졌다.", trust: 1, affection: -4, intimacy: -8, stress: -3, days: 60, set: { partnerIncome: Math.max(state.partnerIncome, 2600000) } },
      night_shift: checkSuccess ? { title: "내가 맡은 밤에는 먼저 일어났다", text: "수면은 부족했지만 약속이 실제 행동이 되자 원망은 줄었다.", trust: 9, affection: 12, conflict: -13, stress: 14, days: 30, flag: "sharedNightCare" } : { title: "며칠 만에 약속이 무너졌다", text: "알람을 끄고 다시 자는 밤이 반복됐다. 말만 번듯했다는 서운함이 더 커졌다.", trust: -8, affection: -10, conflict: 15, stress: 10, days: 30, bad: true },
      night_helper: { title: "두 사람이 다시 잠을 잤다", text: "한 달의 도움으로 몸과 판단력이 회복됐다. 돈은 줄었지만 큰 싸움 하나를 피했다.", trust: 5, affection: 7, conflict: -12, calm: 3, days: 30, cost: 2500000, costLabel: "산후·야간 돌봄 도움" },
      night_escape: { title: "나는 잤고 그녀는 혼자 깨어 있었다", text: `“당신은 아빠가 된 게 아니라 조용한 방으로 옮긴 것 같아요.” ${partner.name}의 말이 짧아졌다.`, trust: -16, affection: -20, conflict: 28, stress: -6, intimacy: -10, days: 30, bad: true },
      nochild_debt: { title: "생활을 줄이고 빚을 갚았다", text: "큰 지출을 멈추고 남는 수입을 빚에 넣었다. 화려하진 않지만 재정 불안이 줄었다.", trust: 5, affection: 2, conflict: -6, calm: 2, days: 180, set: { monthlyLiving: Math.max(1500000, state.monthlyLiving - 400000) } },
      nochild_business: checkSuccess ? { title: "둘의 목표가 수입으로 이어졌다", text: "공부와 작은 사업에 투자한 돈이 자리를 잡으며 그녀도 월수입을 만들었다.", trust: 7, affection: 8, conflict: -4, days: 120, cost: 5000000, costLabel: "공동 목표 투자", set: { partnerIncome: Math.max(state.partnerIncome, 3000000) } } : { title: "투자금이 생활비를 삼켰다", text: "준비 없이 시작한 목표는 수입을 만들지 못했다. 서로 누가 고집했는지를 따지는 싸움만 남았다.", trust: -8, affection: -7, conflict: 16, stress: 14, days: 120, cost: 5000000, costLabel: "실패한 공동 투자", bad: true },
      care_daycare: { title: "맞벌이와 보육을 함께 시작했다", text: "두 사람의 수입은 유지됐지만 등원 시간과 아이의 적응 문제를 함께 감당해야 했다.", trust: 4, affection: 3, stress: 8, days: 90, cost: 800000, costLabel: "보육 초기비", set: { monthlyLiving: state.monthlyLiving + 350000, partnerIncome: Math.max(state.partnerIncome, 2400000) } },
      care_partner_home: { title: "한 사람의 경력으로 돌봄 비용을 냈다", text: `${partner.name}은 아이를 돌봤지만 수입과 외부 관계가 사라지며 고립감을 느꼈다.`, trust: 2, affection: 2, conflict: 8, stress: 9, days: 90, set: { partnerIncome: 0 }, flag: "partnerHomeCare" },
      care_player_reduce: { title: "내 수입을 줄이고 시간을 냈다", text: "현금은 줄었지만 돌봄이 한 사람의 일이 되지 않았다. 아이의 하루를 두 사람 모두 알게 됐다.", trust: 9, affection: 11, conflict: -10, stress: 5, days: 90, set: { playerIncomeFactor: Math.max(.55, (state.playerIncomeFactor || 1) - .2) } },
      fight_pause: checkSuccess ? { title: "싸움의 범위를 줄였다", text: "20분 뒤 돈 문제 하나만 이야기했다. 오늘 해결하지 않은 문제는 날짜를 잡아 다시 이야기하기로 했다.", trust: 6, affection: 5, conflict: -22, calm: 2, days: 2 } : { title: "쉬는 동안 분노만 커졌다", text: "각자 머릿속에서 상대의 잘못을 더 모았다. 돌아와서는 이전 싸움까지 모두 꺼냈다.", trust: -8, affection: -9, conflict: 18, stress: 12, days: 2, bad: true },
      fight_reconnect_intimacy: checkSuccess ? { title: "말보다 먼저 굳은 몸이 풀렸다", text: "둘 다 원한다는 것을 확인하고 가까워지자 공격적인 감정은 잦아들었다. 다만 돈과 가족 문제는 사라지지 않았고, 다음 날 다시 이야기할 시간을 정했다.", trust: 5, affection: 12, conflict: -13, intimacy: 16, stress: -8, days: 2, reaction: `“오늘은 서로 미워하지 않는다는 걸 알았어요. 내일 문제도 피하지 말아요.”` } : { title: "한 사람은 아직 가까워질 준비가 아니었다", text: "거절을 받아들이고 각자 쉬었다. 친밀감으로 싸움을 끝내려 하지 않은 덕분에 신뢰가 무너지지는 않았다.", trust: 2, conflict: -3, days: 1, reaction: `“지금은 안고 싶지 않아요. 내일 말로 먼저 풀어요.”` },
      fight_apologize: checkSuccess ? { title: "구체적인 사과가 방어를 풀었다", text: `사과 뒤에 ‘하지만’을 붙이지 않았다. ${partner.name}도 자신의 말 중 상처 준 부분을 인정했다.`, trust: 10, affection: 12, conflict: -20, intimacy: 6, days: 2 } : { title: "사과가 거래처럼 들렸다", text: "빨리 끝내려는 말투 때문에 진심이 전달되지 않았다. 그녀는 다음 행동을 보겠다고 했다.", trust: -3, affection: -4, conflict: 5, days: 2, bad: true },
      fight_win: checkSuccess ? { title: "사실은 정리됐고 마음은 다쳤다", text: `지출과 메시지의 모순을 정확히 짚어 돈 문제 하나는 확인했다. 그러나 싸움에서 진 사람처럼 느낀 ${partner.name}의 호감은 줄었다.`, trust: 2, affection: -10, conflict: 7, calm: 1, days: 2, evidence: partnerScam ? { id: "marriage_money_gap", title: "결혼 뒤 지출과 설명의 모순", type: "clue", text: "가계부 설명과 실제 송금 시점이 반복해서 다르다.", source: "부부 가계부", quality: 2 } : null } : { title: "기록을 무기처럼 휘둘렀다", text: "관련 없는 과거 메시지까지 끌어와 상대를 몰아붙였다. 문제는 해결되지 않고 감시받는 느낌만 남았다.", trust: -14, affection: -16, conflict: 26, stress: 10, days: 2, bad: true },
      fight_leave: { title: "거리는 생겼고 답은 생기지 않았다", text: "며칠 동안 잠은 잤지만 연락을 끊은 사이 상대도 혼자 결론을 내리기 시작했다.", trust: -10, affection: -12, conflict: 17, calm: 2, days: 7, cost: 350000, costLabel: "별도 숙소", flag: "leftAfterFight" },
      after_hire_check: checkSuccess ? (partnerScam ? { title: "결혼 뒤 이어진 연결을 확인했다", text: "송금 계좌와 야간 일정이 결혼 전 사건의 연락처와 이어졌다. 이제 수상한 느낌이 아니라 설명해야 할 자료가 생겼다.", trust: -6, affection: -5, conflict: 10, calm: 1, days: 10, cost: 1800000, costLabel: "결혼 뒤 독립 조사", evidence: { id: "post_marriage_link", title: "결혼 전후를 잇는 계좌·연락 기록", type: "fact", text: "결혼 전 업체 또는 다른 상대와 결혼 뒤 송금·일정이 직접 연결된다.", source: "독립 조사·원본 대조", quality: 3 } } : { title: "숨긴 일은 있었지만 사기 연결은 없었다", text: "야간근무나 교육을 숨긴 사실은 확인됐다. 그러나 다른 상대, 업체와 함께 짠 계획, 비자 계획으로 이어지는 자료는 없었다.", trust: 3, affection: 1, conflict: -4, days: 10, cost: 1800000, costLabel: "결혼 뒤 독립 조사", evidence: { id: "post_marriage_work", title: "실제 야간근무·교육 기록", type: "fact", text: "근무처와 급여, 귀가 시간이 실제 기록과 일치한다. 숨긴 일은 관계 문제지만 사기 연결은 없다.", source: "독립 조사·근무 기록", quality: 3 } }) : { title: "조사 범위를 잘못 잡았다", text: "확인할 계좌와 날짜를 좁히지 못해 비용만 쓰고 소문이 섞인 보고서를 받았다.", trust: -5, conflict: 7, stress: 7, days: 10, cost: 1800000, costLabel: "결혼 뒤 독립 조사", bad: true },
      after_ask_direct: checkSuccess ? { title: "숨긴 이유와 사실을 나눠 들었다", text: partnerScam ? "설명 중 송금 날짜와 만난 사람이 두 번 바뀌었다. 다음 확인에 쓸 구체적인 진술이 남았다." : "일을 숨긴 것은 비난받을까 두려웠기 때문이라고 말했다. 근무처와 급여 기록을 직접 보여 주겠다고 했다.", trust: partnerScam ? -3 : 8, affection: partnerScam ? -2 : 7, conflict: -6, days: 3, evidence: { id: "post_marriage_statement", title: "숨긴 생활에 대한 직접 설명", type: "clue", text: partnerScam ? "송금과 만남의 날짜에 설명이 바뀌었다." : "근무처와 급여 기록을 공개하겠다는 설명을 들었다.", source: "부부 대화", quality: 2 } } : { title: "질문이 비난으로 새어 나갔다", text: "처음부터 목소리가 높아졌고 설명은 중간에서 멈췄다.", trust: -9, affection: -10, conflict: 16, days: 2, bad: true },
      after_believe: { title: "이번에는 그녀의 말을 믿었다", text: partnerScam ? "더 확인하지 않자 숨긴 계좌와 일정은 이어졌다. 관계는 잠시 평온했지만 위험도 남았다." : "숨긴 일에 대한 사과와 근무 기록을 받아들였다. 감시 대신 앞으로 공개할 기준을 정했다.", trust: 9, affection: 8, conflict: -7, days: 7, flag: "believedAfterMarriage" },
      after_accuse: partnerScam ? { title: "의심은 맞을 수 있어도 입증은 부족했다", text: "그녀는 자료를 정리할 틈도 주지 않고 관계를 끊으려 했다. 사실을 밝힐 통로도 일부 닫혔다.", trust: -16, affection: -18, conflict: 28, days: 2, flag: "postMarriageAccusation" } : { title: "숨긴 일과 결혼 사기를 같은 말로 만들었다", text: "야간근무를 숨긴 잘못은 있었지만 업체와 함께 짠 사기나 돈 사기를 입증할 자료는 없었다. 공개적인 비난으로 관계는 파탄 직전이 됐다.", trust: -38, affection: -35, conflict: 48, stress: 16, days: 2, flag: "postMarriageFalseAccusation", bad: true },
      anniversary_check: checkSuccess ? (partnerScam ? { title: "마지막 빈칸이 연결됐다", text: "결혼 전과 뒤의 계좌, 업체 연락, 거짓 진술이 하나의 흐름으로 이어졌다. 이제 공개 지목에 필요한 강한 자료가 생겼다.", trust: -5, conflict: 6, calm: 1, days: 7, cost: 700000, costLabel: "1주년 최종 확인", evidence: { id: "anniversary_proof", title: "결혼 전후 계획을 잇는 최종 원본", type: "fact", text: "업체·송금·체류 계획이 결혼 전부터 이어졌다는 원본 기록이다.", source: "원본 계좌·연락 기록", quality: 3 } } : { title: "마지막 확인도 생활과 일치했다", text: "돈을 받는 사람과 근무처, 일정이 지금까지의 설명과 맞았다. 숨긴 감정과 갈등은 있었지만 계획된 사기 자료는 나오지 않았다.", trust: 8, affection: 7, conflict: -6, days: 7, cost: 700000, costLabel: "1주년 최종 확인", evidence: { id: "anniversary_clear", title: "1년 생활과 일치한 원본 기록", type: "fact", text: "근무·송금·거주 기록이 배우자의 설명과 일치한다.", source: "원본 대조", quality: 3 } }) : { title: "핵심을 좁히지 못했다", text: "여러 의심을 한꺼번에 확인하려다 어느 것도 끝까지 보지 못했다.", trust: -4, conflict: 6, stress: 6, days: 7, cost: 700000, costLabel: "1주년 최종 확인", bad: true },
      anniversary_believe: { title: "함께 산 시간을 믿기로 했다", text: partnerScam ? "좋았던 기억은 진짜였을 수 있지만 숨긴 계획도 사라지지 않았다. 최종 선택에는 이 위험이 남는다." : "모든 불안을 없앤 것은 아니지만 지난 1년의 행동이 설명과 맞았다는 사실을 선택했다.", trust: 10, affection: 12, conflict: -10, intimacy: 6, days: 7, flag: "anniversaryBelief" },
      anniversary_counsel: checkSuccess ? { title: "의심과 사실을 다시 나눴다", text: "상담에서 확인된 자료, 아직 모르는 사실, 과거 상처가 섞인 불안을 따로 적었다.", trust: 8, affection: 8, conflict: -18, calm: 2, days: 7, cost: 400000, costLabel: "1주년 부부 상담", flag: "anniversaryCounsel" } : { title: "상담에서도 판결만 원했다", text: "상담사에게 누가 거짓말쟁이인지 정해 달라고 하며 서로의 말을 듣지 못했다.", trust: -5, affection: -5, conflict: 10, days: 7, cost: 400000, costLabel: "1주년 부부 상담", bad: true }
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
      showResult({ title: "이 증거로는 진술을 반박할 수 없었다", text: `${evidence.title}은(는) 방금 한 말을 직접 틀렸다고 증명하지 못한다. ${evidence.type === "rumor" ? "출처가 약한 소문을 사실처럼 꺼내 신뢰를 크게 잃었다." : "관련은 있어 보여도 다른 설명이 가능했다."}`, bad: true, days: 1, noApply: true });
    }
  }

  function showResult(result) {
    if (state.stress >= 100) return finishEarly("burnout");
    if (state.trust <= 0) return finishEarly("breakup");
    if (state.conflict >= CONFLICT_LIMIT) return finishEarly("divorce");
    const feedback = $("#feedback-box");
    feedback.hidden = false;
    feedback.classList.toggle("is-bad", Boolean(result.bad || (result.trust || 0) < -5));
    const reaction = result.reaction ? `<div class="reaction-panel"><span>${escapeHtml(getPartner().name)}의 반응</span><p>${escapeHtml(result.reaction)}</p></div>` : "";
    const report = result.report ? `<div class="investigation-report"><strong>조사 보고서</strong><dl><div><dt>확인한 대상</dt><dd>${escapeHtml(result.report.target)}</dd></div><div><dt>확인된 사실</dt><dd>${escapeHtml(result.report.found)}</dd></div><div><dt>아직 모르는 것</dt><dd>${escapeHtml(result.report.unknown)}</dd></div><div><dt>다음 확인</dt><dd>${escapeHtml(result.report.next)}</dd></div></dl></div>` : "";
    feedback.innerHTML = `<strong>${escapeHtml(result.title)}</strong><div class="result-copy">${escapeHtml(result.text).replace(/\n/g, "<br>")}</div>${reaction}${report}`;
    renderChoices([choice("continue_scene", "다음 장면으로", "이 선택의 결과를 반영하고 이야기를 이어 간다.", `호감 ${state.affection} · 신뢰 ${state.trust} · 갈등 ${state.conflict} · 스트레스 ${state.stress}`, 0, "plain")]);
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
      const cost = getRoute().id === "broker" ? Math.max(0, 19320000 - (getPlan()?.price || 0) - (state.flags.paidReservation ? 3000000 : 0)) : 2000000;
      spend(cost, getRoute().id === "broker" ? "중개 잔금·부대비용" : "혼인 서류·번역·비자 준비");
      if (state.ending) return;
      state.married = true;
      state.affection = clamp(state.affection + 10, 0, 100);
      state.trust = clamp(state.trust + 5, 0, 100);
      state.flags.marriedWithStrongEvidence = enough;
      passTime(14);
      if (state.ending) return;
      return showResult({ title: "결혼을 약속했다", text: `${getPartner().name}과 결혼 준비를 시작했다. 하지만 게임은 끝나지 않는다. 이제 결혼식 장소와 예산, 살 나라, 생활비, 아이 계획을 실제로 정해야 한다.`, noApply: true });
    }
    if (id === "decide_postpone") return finishGame((mystery.culprit === "none" || (state.flags.reformed && mystery.culprit === "partner")) ? "cautious_love" : "safe_exit");
    if (id === "decide_partner") {
      if (mystery.culprit === "partner" || mystery.culprit === "both") return finishGame(enough ? "case_solved" : "unproven_accusation");
      return finishGame("false_accusation");
    }
    if (id === "decide_broker") {
      if (mystery.culprit === "broker" || mystery.culprit === "both") return finishGame(enough ? "broker_exposed" : "unproven_accusation");
      return finishGame("false_broker_accusation");
    }
  }

  function resolveFamilyDecision(id) {
    const mystery = getCase();
    const partnerScam = partnerScamActive();
    const strong = state.evidence.filter(item => item.quality >= 3 && item.type !== "rumor").length;
    const postProof = state.evidence.some(item => ["post_marriage_link", "anniversary_proof"].includes(item.id));
    const enough = state.confirmed >= 1 && strong >= 3 && (postProof || mystery.culprit === "none");
    if (id === "family_stay") {
      if (partnerScam && !enough) return finishGame("marriage_trap");
      if (partnerScam) return finishGame("unsafe_stay");
      if (state.conflict >= 65 || state.debt >= DEBT_LIMIT * .8) return finishGame("fragile_family");
      return finishGame(state.children ? "family_happy" : "couple_happy");
    }
    if (id === "family_separate") return finishGame(partnerScam ? "safe_divorce" : "sad_separation");
    if (id === "family_accuse") {
      if (partnerScam) return finishGame(enough ? "case_solved_after" : "unproven_after");
      return finishGame("false_accusation_after");
    }
  }

  function finishEarly(type) {
    if (!state || state.ending) return;
    const endings = {
      debt: ["GAME OVER · 급전 한도 초과", "사랑보다 이자가 먼저 찾아왔다", "급전과 잔금이 겹치며 고금리 빚이 1,200만원을 넘었다. 조사를 이어 갈 선택지도, 관계를 정리할 여유도 사라졌다.", "nightlife-secret"],
      burnout: ["GAME OVER · 번아웃", "의심이 모든 하루를 삼켰다", "잠과 판단력을 잃은 채 같은 메시지만 반복해서 읽었다. 결론을 내리기 전에 일상과 건강이 먼저 무너졌다.", "broker-suspicion"],
      breakup: ["GAME OVER · 관계 파탄", "확인보다 심문이 앞섰다", "신뢰가 바닥나며 상대는 더 이상 대화에 응하지 않았다. 진실이 무엇이든 확인할 길도 함께 닫혔다.", "airport"],
      divorce: ["GAME OVER · 결혼 생활 파탄", "갈등이 돌아올 수 없는 선을 넘었다", "돈, 가족, 잠자리, 아이 문제를 해결하지 못한 채 싸움이 반복됐다. 갈등이 100에 닿으며 별거와 이혼 절차가 시작됐다.", "nightlife-secret"]
    };
    renderEnding(endings[type], type);
  }

  function finishGame(type) {
    const partner = getPartner();
    const mystery = getCase();
    const endings = {
      happy: ["TRUE END · 함께 확인한 사랑", `${partner.name}과 결혼을 선택했다`, "모든 불안을 없앤 뒤 결혼한 것은 아니었다. 둘은 모르는 것을 모른다고 말하고, 돈·일·가족·아이 계획을 계속 확인하는 규칙을 만들었다.", state.trust >= 70 ? "newborn" : "wedding"],
      cautious_love: ["GOOD END · 아직 끝내지 않은 대화", "결혼을 미뤘지만 사랑을 끝내진 않았다", "성급한 결론 대신 장거리 연애와 독립된 재정으로 시간을 더 보기로 했다. 진심인 상대에게 ‘보류’는 거절이 아니라 안전한 약속이 되었다.", "airport"],
      safe_exit: ["SAFE END · 증명 전에는 멈춤", "사기라고 외치지 않고 절차를 중단했다", "혼인·송금·비자 절차를 멈춰 큰 피해는 피했다. 범인을 공개 지목할 정도의 증거는 없었지만, 결혼하지 않을 권리에는 유죄판결이 필요하지 않다.", "airport"],
      case_solved: ["BEST END · 진술 붕괴", "진짜 모순을 증거로 무너뜨렸다", "외모나 소문이 아니라 날짜·계좌·원본·독립 진술을 연결했다. 성급한 의심이 아닌 입증으로 사기 계획을 멈췄다.", "broker-suspicion"],
      broker_exposed: ["BEST END · 배후 확인", "두 사람 사이에 끼어든 구조를 밝혀냈다", "상대를 범인으로 몰지 않고 계약·송금·대본의 연결을 입증했다. 피해자와 함께 사기를 꾸민 사람을 구분한 판단이었다.", "broker-suspicion"],
      escape_together: ["GOOD END · 업체 밖의 두 사람", "사랑은 남기고 업체와 계약은 끊었다", "업체의 개입을 충분히 의심해 잔금과 중간 송금을 중단했다. 둘은 서둘러 결혼하지 않고 직접 절차를 다시 밟기로 했다.", "romance-start"],
      broker_loss: ["BAD END · 새는 돈", "사랑은 진짜였지만 계약은 아니었다", "그녀를 믿는 것과 업체 비용을 검증하는 일을 같은 선택으로 묶었다. 관계는 남았지만 중간 송금과 추가비용은 돌아오지 않았다.", "broker-suspicion"],
      married_scam: ["GAME OVER · 결혼 뒤 드러난 계획", "사랑이라 믿은 채 모든 절차를 끝냈다", "확인되지 않은 모순을 설렘으로 덮었다. 입국·송금·이탈 계획이 실행되면서 큰 금전 손실과 법적 분쟁이 시작됐다.", getCase().id === "hidden_nightlife" ? "nightlife-secret" : "airport"],
      unproven_accusation: ["BAD END · 맞았지만 입증하지 못했다", "의심은 맞았고 방식은 틀렸다", "실제로 뒤가 구린 사건이었지만 제시한 자료가 직접 모순을 입증하지 못했다. 공개 비난이 앞서며 증거는 사라지고 역으로 분쟁에 휘말렸다.", "broker-suspicion"],
      false_accusation: ["GAME OVER · 거짓 결론", "진심인 사람을 사기꾼으로 만들었다", "불편한 동기와 소문을 범죄의 증거처럼 연결했다. 상대는 큰 상처를 입었고 관계는 물론 주변의 신뢰도 함께 잃었다.", "airport"],
      false_broker_accusation: ["BAD END · 잘못 겨눈 고발", "불리한 계약과 범죄를 구분하지 못했다", "업체 진행이 거칠고 비쌌다는 사실만으로 상대와 업체가 함께 사기를 꾸몄다고 단정했다. 계약 분쟁은 남았지만 범죄를 입증할 연결은 없었다.", "broker-suspicion"]
      ,family_happy: ["TRUE END · 함께 키운 가족", `${partner.name}과 아이의 다음 해를 시작했다`, "결혼식 뒤의 돈, 잠 못 드는 밤, 가족 송금과 부부싸움을 지나서도 두 사람은 같은 편으로 남았다. 사기를 찾는 일보다 더 어려웠던 것은 매일 신뢰를 다시 만드는 일이었다.", "newborn"],
      couple_happy: ["TRUE END · 둘이 만든 가족", `${partner.name}과 둘의 다음 해를 선택했다`, "출산 여부가 결혼의 성공을 대신하지 않았다. 두 사람은 서로의 아이 계획과 몸, 일, 돈을 강요 없이 다시 합의하며 함께 살기로 했다.", "romance-start"],
      fragile_family: ["BITTER END · 아직 무너지지 않은 집", "사랑은 남았지만 돈과 갈등도 남았다", "두 사람은 함께 있기로 했지만 빚과 반복되는 싸움이 해결된 것은 아니다. 다음 해에는 사랑보다 구체적인 생활 변화가 필요하다.", "nightlife-secret"],
      marriage_trap: ["GAME OVER · 결혼 뒤 완성된 계획", "좋았던 기억 사이로 피해가 계속됐다", "결혼 전과 뒤의 모순을 끝내 확인하지 못했다. 송금과 체류 계획이 실행되며 돈과 관계, 양육 문제까지 큰 분쟁으로 번졌다.", mystery.id === "hidden_nightlife" ? "nightlife-secret" : "airport"],
      unsafe_stay: ["BAD END · 증거를 보고도 멈추지 못했다", "진실을 알았지만 관계를 안전하게 바꾸지 못했다", "계획된 속임수의 연결을 확인하고도 아무 조건 없이 함께 있기로 했다. 사랑과 안전을 같은 선택으로 묶은 대가로 피해 위험이 남았다.", "broker-suspicion"],
      safe_divorce: ["SAFE END · 결혼 뒤의 안전한 이별", "범죄 단정 전에 돈과 거주를 분리했다", "의심과 갈등이 커지자 공동계좌와 체류 절차를 멈추고 법률 도움을 받아 별거했다. 추가 피해를 막으며 남은 증거를 보존했다.", "airport"],
      sad_separation: ["SAD END · 사랑만으로는 맞지 않았던 생활", "사기는 없었지만 결혼은 끝났다", "진심이었던 관계도 아이, 돈, 가족, 친밀감의 차이를 견디지 못할 수 있다. 상대를 범죄자로 만들지 않고 각자의 삶으로 돌아갔다.", "airport"],
      case_solved_after: ["BEST END · 결혼 전후의 연결", "1년의 거짓말을 원본으로 입증했다", "야간근무나 국적, 외모가 아니라 계좌·업체 연락·서로 다른 진술을 연결했다. 결혼 뒤에도 증거를 지키며 피해 확산을 멈췄다.", "broker-suspicion"],
      unproven_after: ["BAD END · 의심은 맞았지만 증거가 모자랐다", "공개 고발이 확인보다 앞섰다", "실제 속임수는 있었지만 결혼 전후를 직접 잇는 원본이 부족했다. 상대와 업체가 자료를 없애며 분쟁이 길어졌다.", "nightlife-secret"],
      false_accusation_after: ["GAME OVER · 함께 산 사람을 잘못 고발했다", "숨긴 갈등을 계획된 사기로 단정했다", "야간근무, 아이를 원하지 않는 마음, 잠자리를 피한 행동은 관계 문제였지만 사기 입증은 아니었다. 공개 고발로 가족과 평판이 함께 무너졌다.", "airport"]
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
      ["호감", `${state.affection} / 100`], ["신뢰", `${state.trust} / 100`], ["갈등", `${state.conflict} / 100`], ["스트레스", `${state.stress} / 100`], ["아이", `${state.children}명`], ["총지출", formatWon(state.spent)], ["남은 빚", state.debt ? formatWon(state.debt) : "없음"], ["수집 자료", `${state.evidence.length}개`]
    ].map(([label, value]) => `<div class="ending-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
    const mystery = getCase();
    $("#truth-report-body").innerHTML = `<h3>${mystery.label}</h3><p>${mystery.truth}</p><p><strong>처음부터 속인 쪽:</strong> ${mystery.culprit === "none" ? "없음" : mystery.culprit === "partner" ? "상대방" : mystery.culprit === "broker" ? "업체" : "상대방과 업체가 함께 꾸밈"}</p>${state.flags.reformed ? "<p><strong>관계 중 변화:</strong> 상대가 초기 계획을 자발적으로 고백하고 실행을 중단하는 쪽으로 마음을 바꿨습니다.</p>" : ""}<p><strong>이번 판에 모은 핵심 자료:</strong> ${state.evidence.filter(item => Object.values(mystery.clues).some(cl => cl.id === item.id) || item.id === "reform_confession").map(item => item.title).join(", ") || "없음"}</p>`;
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

  function openPlayerProfile() {
    const player = getPlayer();
    const stats = [["charm", "말재주"], ["empathy", "공감"], ["reason", "판단"], ["courage", "배짱"], ["calm", "침착"]];
    const growth = state.growthLog.length ? state.growthLog.slice(0, 6).map(item => `<li><b>${escapeHtml(statLabel(item.stat))} +${item.amount}</b><span>${escapeHtml(item.reason)} · ${item.day}일째</span></li>`).join("") : "<li><span>아직 능력치가 오른 기록은 없습니다. 판정 성공 3회 또는 자기계발로 성장합니다.</span></li>";
    openModal("주인공 프로필", `${player.name} · ${player.age}세`, `<div class="player-profile"><div class="player-profile-head"><div class="player-profile-photo" style="${photoStyle(player.art, "man")}"></div><div><h3>${escapeHtml(player.job)}</h3><p>${escapeHtml(player.hook)}</p><small>약점: ${escapeHtml(player.flaw)}</small></div></div><div class="profile-finance"><span>월수입 <b>${formatWon(player.income * (state.playerIncomeFactor || 1))}</b></span><span>현금 <b>${formatWon(state.cash)}</b></span><span>빚 <b>${formatWon(state.debt)}</b></span><span>스트레스 <b>${state.stress}/100</b></span></div><h3 class="modal-section-title">현재 능력</h3><div class="profile-stat-list">${stats.map(([id, label]) => `<div><span>${label}</span><div class="profile-stat-track"><i style="width:${state[id] * 10}%"></i></div><b>${state[id]}</b><small>처음 ${player[id]}</small></div>`).join("")}</div><h3 class="modal-section-title">관계와 소통</h3><dl class="profile-detail-list"><div><dt>만난 경로</dt><dd>${escapeHtml(getRoute().name)} · ${escapeHtml(getPlan()?.name || "기본")}</dd></div><div><dt>대화 방식</dt><dd>${escapeHtml(state.communicationMode || "아직 정하지 않음")}</dd></div><div><dt>소통 정확도</dt><dd>${state.communicationClarity}/100</dd></div><div><dt>현재 관계</dt><dd>${escapeHtml(relationshipLabel())}</dd></div></dl><h3 class="modal-section-title">최근 성장</h3><ul class="growth-log">${growth}</ul></div>`);
  }

  function openMoney() {
    const player = getPlayer();
    const rows = state.moneyLog.length ? state.moneyLog.map(item => `<div class="money-row"><span>${item.label} · ${item.day}일째</span><strong>${item.amount < 0 ? "+" : "-"}${formatWon(Math.abs(item.amount))}</strong></div>`).join("") : "<p>아직 지출이 없습니다.</p>";
    const playerIncome = player.income * (state.playerIncomeFactor || 1);
    const childCost = state.children * 785000;
    openModal("재정 상세", "빚과 생활비는 매달 반영됩니다", `<div class="money-breakdown"><div class="money-row"><span>현재 현금</span><strong>${formatWon(state.cash)}</strong></div><div class="money-row"><span>현재 빚</span><strong>${formatWon(state.debt)}</strong></div><div class="money-row"><span>내 월수입</span><strong>${formatWon(playerIncome)}</strong></div><div class="money-row"><span>배우자 월수입</span><strong>${formatWon(state.partnerIncome || 0)}</strong></div><div class="money-row"><span>기본 생활비</span><strong>-${formatWon(state.monthlyLiving || 0)}</strong></div><div class="money-row"><span>가족 정기송금</span><strong>-${formatWon(state.monthlyRemittance || 0)}</strong></div><div class="money-row"><span>아이 월양육비</span><strong>-${formatWon(childCost)}</strong></div><div class="money-row"><span>누적 지출</span><strong>${formatWon(state.spent)}</strong></div>${rows}</div><p class="warning-box">게임은 한 달이 지날 때 가구 수입과 생활비를 모두 반영합니다. 영유아 1명당 기본 양육비는 최근 조사 범위를 참고해 월 78만5천원으로 계산했습니다. 급전에는 월이 넘어갈 때 게임상 이자가 붙고, 빚 1,200만원 또는 스트레스 100이면 게임오버입니다.</p>`);
  }

  function openHowTo() {
    openModal("게임 방법", "사랑과 의심 사이에서 1년을 살아 보세요", `<ol class="guide-list"><li><strong>주인공마다 잘하는 일이 다릅니다</strong><span>말재주, 공감, 판단, 배짱이 선택의 성공 확률을 바꿉니다. 확률이 있는 선택은 누르기 전에 수치가 보입니다.</span></li><li><strong>믿는 것도 실제 선택입니다</strong><span>심문에서 증거를 내지 않고 설명을 믿을 수 있습니다. 맞으면 관계가 좋아지지만 거짓이라면 위험을 놓칠 수 있습니다.</span></li><li><strong>국적·외모·직업과 증거를 구분하세요</strong><span>문신, 야간근무, 아이를 원치 않는 마음, 잠자리를 피하는 행동만으로 사기를 확정할 수 없습니다. 계좌·날짜·원본·서로 다른 진술을 연결해야 합니다.</span></li><li><strong>결혼 뒤에도 게임은 계속됩니다</strong><span>결혼식 장소와 규모, 살 나라, 배우자의 일, 가족 송금, 아이 계획, 출산과 육아를 정합니다.</span></li><li><strong>돈·스트레스·갈등이 모두 생존 조건입니다</strong><span>빚 1,200만원, 스트레스 100, 신뢰 0, 갈등 100 중 하나에 닿으면 중간에도 게임오버가 됩니다.</span></li></ol>`);
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
      if (!saved || saved.version !== 3) throw new Error("invalid save");
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
    setup.planId = state.planId;
    setup.partnerId = state.partnerId;
    setup.partnerSnapshot = state.partnerSnapshot;
    setup.candidates = [state.partnerSnapshot];
    startGame();
  }

  $("#new-game").addEventListener("click", () => { resetSetup(); showScreen("setup"); });
  $("#continue-game").addEventListener("click", continueGame);
  $("#how-to").addEventListener("click", openHowTo);
  $("#setup-next").addEventListener("click", () => {
    if (setup.step === 3) return openPlanCheckout();
    if (setup.step < 4) { setup.step += 1; renderSetup(); window.scrollTo({ top: 0 }); }
    else startGame();
  });
  $$('[data-action="back-title"]').forEach(button => button.addEventListener("click", () => showScreen("title")));
  $("#open-notebook").addEventListener("click", openNotebook);
  $("#mobile-notebook").addEventListener("click", openNotebook);
  $("#open-player-profile").addEventListener("click", openPlayerProfile);
  $("#mobile-player").addEventListener("click", openPlayerProfile);
  $("#money-pill").addEventListener("click", openMoney);
  $("#mobile-status").addEventListener("click", openMoney);
  $("#save-button").addEventListener("click", () => saveGame(true));
  $("#mobile-save").addEventListener("click", () => saveGame(true));
  $("#restart-button").addEventListener("click", restartCurrent);
  $("#close-modal").addEventListener("click", closeModal);
  $("#overlay").addEventListener("click", event => { if (event.target === $("#overlay")) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("#overlay").hidden) closeModal(); });
  $("#retry-case").addEventListener("click", () => {
    setup.playerId = state.playerId; setup.countryId = state.countryId; setup.routeId = state.routeId; setup.planId = state.planId; setup.partnerId = state.partnerId; setup.partnerSnapshot = state.partnerSnapshot; setup.candidates = [state.partnerSnapshot];
    startGame();
  });
  $("#back-title-end").addEventListener("click", () => { state = null; setSavedButton(); showScreen("title"); });

  setSavedButton();
  if (navigator.serviceWorker && typeof navigator.serviceWorker.register === "function") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" }).catch(() => {}));
  }
})();
