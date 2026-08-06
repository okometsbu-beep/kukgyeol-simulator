(function () {
  "use strict";

  const D = window.GAME_DATA;
  const SAVE_KEY = "truth-translation-save-v18";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const ui = {
    title: $("#title-screen"), game: $("#game-screen"), ending: $("#ending-screen"),
    start: $("#start-btn"), resume: $("#continue-btn"), home: $("#home-btn"), save: $("#save-btn"),
    phase: $("#phase-label"), objective: $("#objective-text"), trust: $("#trust-pips"),
    stage: $("#stage"), bg: $("#stage-bg"), hotspots: $("#hotspots"),
    portraitWrap: $("#portrait-wrap"), portrait: $("#portrait"),
    chapter: $("#chapter-card"), chapterEyebrow: $("#chapter-eyebrow"), chapterTitle: $("#chapter-title"), chapterSubtitle: $("#chapter-subtitle"),
    impact: $("#impact-flash"),
    dialogue: $("#dialogue-panel"), speaker: $("#speaker-name"), speakerNote: $("#speaker-note"), text: $("#dialogue-text"), dialogueActions: $("#dialogue-actions"),
    investigation: $("#investigation-panel"), location: $("#location-name"), invProgress: $("#investigation-progress"), invActions: $("#investigation-actions"),
    cross: $("#cross-panel"), crossTitle: $("#cross-title"), crossInstruction: $("#cross-instruction"),
    statementCount: $("#statement-count"), statementSpeaker: $("#statement-speaker"), statementText: $("#statement-text"), statementPressed: $("#statement-pressed"),
    statementPrev: $("#statement-prev"), statementNext: $("#statement-next"), press: $("#press-btn"), present: $("#present-btn"),
    reconstruct: $("#reconstruct-panel"), timeline: $("#timeline-slots"), timelineSubmit: $("#timeline-submit"),
    dock: $("#dock"), evidenceCount: $("#evidence-count"),
    drawer: $("#drawer"), drawerBackdrop: $("#drawer-backdrop"), drawerClose: $("#drawer-close"), drawerKicker: $("#drawer-kicker"), drawerTitle: $("#drawer-title"), drawerBody: $("#drawer-body"),
    toast: $("#toast"),
    endingGrade: $("#ending-grade"), endingTitle: $("#ending-title"), endingCopy: $("#ending-copy"), endingSummary: $("#ending-summary"), replay: $("#replay-btn"), endingHome: $("#ending-home-btn")
  };

  let state = freshState();
  let drawerSelect = null;
  let dialogueDone = null;
  let toastTimer = 0;
  let audioCtx = null;

  function freshState() {
    return {
      version: D.version,
      phase: "intro",
      trust: 5,
      evidence: [],
      unseen: [],
      actionsDone: {},
      presses: {},
      crossIndex: 0,
      timeline: [null, null, null],
      mistakes: 0,
      startedAt: Date.now(),
      ending: null
    };
  }

  function showScreen(name) {
    ui.title.hidden = name !== "title";
    ui.game.hidden = name !== "game";
    ui.ending.hidden = name !== "ending";
    if (name !== "game") closeDrawer();
  }

  function showMode(name) {
    ui.dialogue.hidden = name !== "dialogue";
    ui.investigation.hidden = name !== "investigation";
    ui.cross.hidden = name !== "cross";
    ui.reconstruct.hidden = name !== "reconstruct";
  }

  function updateHud() {
    ui.trust.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < state.trust ? "on" : ""}"></i>`).join("");
    ui.evidenceCount.textContent = state.evidence.length;
  }

  function phaseMeta(label, objective) {
    ui.phase.textContent = label;
    ui.objective.textContent = objective;
  }

  function setStage(locationId, characterId = null, explicitBg = null) {
    const location = D.locations[locationId];
    const bg = explicitBg || location?.bg || D.locations.agency.bg;
    ui.bg.src = bg;
    ui.bg.alt = location?.name || "장면 배경";
    ui.bg.style.objectPosition = location?.fullPortrait ? "center 24%" : "center";
    ui.hotspots.innerHTML = "";

    const character = characterId ? D.characters[characterId] : null;
    if (character?.portrait && !location?.fullPortrait) {
      ui.portrait.src = character.portrait;
      ui.portrait.alt = character.name;
      ui.portraitWrap.hidden = false;
    } else {
      ui.portraitWrap.hidden = true;
    }
  }

  function setSpeaker(who, note = "") {
    const c = D.characters[who] || D.characters.narrator;
    ui.speaker.textContent = c.name;
    ui.speakerNote.textContent = note || c.note || "";
    if (c.portrait && state.phase !== "video1" && state.phase !== "cross_linh") {
      ui.portrait.src = c.portrait;
      ui.portrait.alt = c.name;
      ui.portraitWrap.hidden = false;
    } else if (state.phase !== "video1" && state.phase !== "cross_linh") {
      ui.portraitWrap.hidden = true;
    }
  }

  function runDialogue(lines, onDone, buttonLabel = "다음") {
    showMode("dialogue");
    ui.hotspots.innerHTML = "";
    let index = 0;
    dialogueDone = onDone || null;

    const render = () => {
      const line = lines[index];
      setSpeaker(line.who, line.note || "");
      ui.text.textContent = line.text;
      ui.dialogueActions.innerHTML = "";
      const next = document.createElement("button");
      next.type = "button";
      next.className = "btn btn-ghost";
      next.textContent = index === lines.length - 1 ? (buttonLabel === "다음" ? "계속" : buttonLabel) : buttonLabel;
      next.addEventListener("click", () => {
        sfx("click");
        if (index < lines.length - 1) {
          index += 1;
          render();
        } else {
          dialogueDone?.();
          dialogueDone = null;
        }
      });
      ui.dialogueActions.appendChild(next);
    };
    render();
  }

  function showChapter(eyebrow, title, subtitle, onDone) {
    ui.chapterEyebrow.textContent = eyebrow;
    ui.chapterTitle.textContent = title;
    ui.chapterSubtitle.textContent = subtitle;
    ui.chapter.hidden = false;
    setTimeout(() => {
      ui.chapter.hidden = true;
      onDone?.();
    }, 1050);
  }

  function toast(text) {
    clearTimeout(toastTimer);
    ui.toast.textContent = text;
    ui.toast.hidden = false;
    toastTimer = setTimeout(() => { ui.toast.hidden = true; }, 2200);
  }

  function flash(text, good = true) {
    ui.impact.textContent = text;
    ui.impact.className = `impact-flash ${good ? "good" : "bad"}`;
    ui.impact.hidden = false;
    sfx(good ? "good" : "bad");
    setTimeout(() => { ui.impact.hidden = true; }, 720);
  }

  function sfx(kind) {
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      if (kind === "good") { osc.frequency.setValueAtTime(440, now); osc.frequency.exponentialRampToValueAtTime(880, now + .14); }
      else if (kind === "bad") { osc.frequency.setValueAtTime(170, now); osc.frequency.exponentialRampToValueAtTime(90, now + .18); }
      else { osc.frequency.setValueAtTime(250, now); }
      gain.gain.setValueAtTime(.035, now); gain.gain.exponentialRampToValueAtTime(.001, now + (kind === "click" ? .045 : .2));
      osc.start(now); osc.stop(now + (kind === "click" ? .05 : .22));
    } catch (_) { /* audio is optional */ }
  }

  function addEvidence(id) {
    if (!D.evidence[id] || state.evidence.includes(id)) return false;
    state.evidence.push(id);
    state.unseen.push(id);
    updateHud();
    toast(`검증 파일 추가 · ${D.evidence[id].title}`);
    sfx("good");
    return true;
  }

  function hasEvidence(id) { return state.evidence.includes(id); }

  function markDone(phase, id) {
    state.actionsDone[phase] ||= [];
    if (!state.actionsDone[phase].includes(id)) state.actionsDone[phase].push(id);
  }

  function isDone(phase, id) { return (state.actionsDone[phase] || []).includes(id); }

  function investigationReady(inv) { return inv.required.every(hasEvidence); }

  function enterPhase(id, skipCard = false) {
    state.phase = id;
    state.crossIndex = 0;
    updateHud();
    saveState(true);

    if (id === "intro") {
      showScreen("game");
      setStage("agency", "minjae");
      phaseMeta("프롤로그", "중개인이 건넨 설명을 확인한다.");
      runDialogue(D.intro, () => enterInvestigation("agency1"));
      return;
    }
    if (D.investigations[id]) { enterInvestigation(id, skipCard); return; }
    if (D.crosses[id]) { enterCross(id, skipCard); return; }
    if (id === "reconstruct") { enterReconstruction(skipCard); }
  }

  function enterInvestigation(id, skipCard = false) {
    state.phase = id;
    const inv = D.investigations[id];
    const loc = D.locations[inv.location];
    setStage(inv.location);
    phaseMeta(inv.phase, inv.objective);
    const start = () => renderInvestigation("talk");
    if (skipCard) start();
    else showChapter("INVESTIGATION", inv.phase.split("/").pop().trim(), loc.name, start);
  }

  function renderInvestigation(mode = "talk") {
    const inv = D.investigations[state.phase];
    if (!inv) return;
    showMode("investigation");
    ui.portraitWrap.hidden = true;
    const loc = D.locations[inv.location];
    ui.location.textContent = loc.name;
    const found = inv.required.filter(hasEvidence).length;
    ui.invProgress.textContent = `핵심 기록 ${found} / ${inv.required.length}`;
    $$(".dock-btn").forEach(b => b.classList.toggle("active", b.dataset.dock === mode));

    ui.hotspots.innerHTML = "";
    inv.examine.forEach(action => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `hotspot ${isDone(state.phase, action.id) ? "done" : "unseen"}`;
      btn.style.left = action.x + "%"; btn.style.top = action.y + "%"; btn.style.width = action.w + "%"; btn.style.height = action.h + "%";
      btn.setAttribute("aria-label", action.title);
      btn.title = action.title;
      btn.addEventListener("click", () => performInvestigationAction(action));
      ui.hotspots.appendChild(btn);
    });

    ui.invActions.innerHTML = "";
    const list = mode === "examine" ? inv.examine : inv.talk;
    list.forEach(action => ui.invActions.appendChild(investigationButton(action)));
    if (mode === "examine" && list.length === 0) {
      ui.invActions.innerHTML = `<div class="notes-card"><strong>지금은 화면보다 대화가 중요하다.</strong><p>하단의 ‘대화’를 눌러 린에게 직접 확인해.</p></div>`;
    }
    if (investigationReady(inv)) {
      const ready = document.createElement("button");
      ready.type = "button";
      ready.className = "action-card ready-action";
      ready.innerHTML = `<em>READY</em><strong>${inv.readyTitle}</strong><span>${inv.readyDesc}</span>`;
      ready.addEventListener("click", () => enterPhase(inv.next));
      ui.invActions.appendChild(ready);
    }
  }

  function investigationButton(action) {
    const btn = document.createElement("button");
    btn.type = "button";
    const done = isDone(state.phase, action.id);
    btn.className = `action-card ${done ? "done" : ""}`;
    btn.innerHTML = `${done ? "<em>확인함</em>" : "<em>미확인</em>"}<strong>${action.title}</strong><span>${action.desc}</span>`;
    btn.addEventListener("click", () => performInvestigationAction(action));
    return btn;
  }

  function performInvestigationAction(action) {
    const phase = state.phase;
    const wasDone = isDone(phase, action.id);
    markDone(phase, action.id);
    if (action.evidence) addEvidence(action.evidence);
    runDialogue(action.lines, () => {
      saveState(true);
      renderInvestigation(wasDone ? "talk" : (D.investigations[phase].talk.includes(action) ? "talk" : "examine"));
    });
  }

  function enterCross(id, skipCard = false) {
    state.phase = id;
    state.crossIndex = 0;
    const cross = D.crosses[id];
    const locId = id === "cross_linh" ? "video" : "agency";
    setStage(locId, cross.character, cross.bg);
    phaseMeta(cross.phase, cross.objective);
    const start = () => renderCross();
    if (skipCard) start();
    else showChapter("STATEMENT CHECK", "말을 한 줄씩 다시 듣는다", "더 묻기에는 페널티가 없다. 지적에는 근거가 필요하다.", start);
  }

  function renderCross() {
    const cross = D.crosses[state.phase];
    if (!cross) return;
    showMode("cross");
    const i = state.crossIndex;
    const st = cross.statements[i];
    ui.crossTitle.textContent = cross.title;
    ui.statementCount.textContent = `${i + 1} / ${cross.statements.length}`;
    ui.statementSpeaker.textContent = cross.character ? D.characters[cross.character].name : D.characters.linh.name;
    ui.statementText.textContent = st.text;
    const pressKey = `${state.phase}:${i}`;
    const pressed = Boolean(state.presses[pressKey]);
    ui.statementPressed.hidden = !pressed;
    ui.statementPressed.textContent = pressed ? `더 묻기 · ${st.press}` : "";
    ui.hotspots.innerHTML = "";
    $$(".dock-btn").forEach(b => b.classList.remove("active"));
  }

  function moveStatement(delta) {
    const cross = D.crosses[state.phase];
    state.crossIndex = (state.crossIndex + delta + cross.statements.length) % cross.statements.length;
    sfx("click");
    renderCross();
  }

  function pressStatement() {
    const cross = D.crosses[state.phase];
    const key = `${state.phase}:${state.crossIndex}`;
    state.presses[key] = true;
    ui.statementPressed.hidden = false;
    ui.statementPressed.textContent = `더 묻기 · ${cross.statements[state.crossIndex].press}`;
    sfx("click");
  }

  function presentEvidence() {
    openEvidenceDrawer((id) => resolvePresentation(id));
  }

  function resolvePresentation(evidenceId) {
    const crossId = state.phase;
    const cross = D.crosses[crossId];
    closeDrawer();
    if (state.crossIndex === cross.correctIndex && evidenceId === cross.correctEvidence) {
      flash("기록이 어긋난다", true);
      if (cross.successEvidence) addEvidence(cross.successEvidence);
      setTimeout(() => runDialogue(cross.success, () => enterPhase(cross.next)), 500);
      return;
    }

    state.trust = Math.max(0, state.trust - 1);
    state.mistakes += 1;
    updateHud();
    flash("근거가 맞지 않는다", false);
    toast("사람을 지적할 땐 문장과 기록이 정확히 맞아야 한다. 신뢰 -1");
    saveState(true);
    if (state.trust === 0) setTimeout(() => showEnding("trustbreak"), 850);
  }

  function enterReconstruction(skipCard = false) {
    state.phase = "reconstruct";
    setStage("agency");
    phaseMeta("최종 복원", D.reconstruction.objective);
    const start = () => renderReconstruction();
    if (skipCard) start();
    else showChapter("RECONSTRUCT", "세 개의 기록, 하나의 흐름", "누가 거짓말했는지가 아니라 무엇이 어떻게 바뀌었는지 증명한다.", start);
  }

  function renderReconstruction() {
    showMode("reconstruct");
    ui.timeline.innerHTML = "";
    D.reconstruction.slots.forEach((slot, index) => {
      const selected = state.timeline[index] ? D.evidence[state.timeline[index]] : null;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "timeline-slot";
      btn.innerHTML = `<span>${slot.label}</span><strong>${selected ? selected.title : slot.prompt}</strong><small>${selected ? selected.short : "눌러서 기록 선택"}</small>`;
      btn.addEventListener("click", () => openEvidenceDrawer((id) => {
        state.timeline[index] = id;
        closeDrawer();
        renderReconstruction();
      }));
      ui.timeline.appendChild(btn);
    });
  }

  function submitTimeline() {
    const answers = D.reconstruction.slots.map(x => x.answer);
    const right = answers.filter((answer, i) => state.timeline[i] === answer).length;
    if (right !== answers.length) {
      flash(`${right} / ${answers.length} 연결`, false);
      toast("순서를 다시 보자. 이 퍼즐은 신뢰를 깎지 않는다.");
      return;
    }
    flash("흐름 복원", true);
    setTimeout(() => runDialogue(D.reconstruction.success, renderDecision), 450);
  }

  function renderDecision() {
    showMode("dialogue");
    setSpeaker("player", "최종 결정");
    ui.text.textContent = "사실관계는 확인됐다. 하지만 진실이 결혼 여부까지 대신 결정해 주지는 않는다. 이제 내가 선택할 차례다.";
    ui.dialogueActions.innerHTML = "";
    D.decisions.forEach(decision => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.title = decision.desc;
      btn.textContent = decision.title;
      btn.addEventListener("click", () => showEnding(decision.id));
      ui.dialogueActions.appendChild(btn);
    });
  }

  function showEnding(id) {
    state.ending = id;
    const ending = D.endings[id];
    const grade = id === "trustbreak" ? "D" : state.mistakes === 0 ? "S" : state.mistakes <= 2 ? "A" : "B";
    ui.endingGrade.textContent = grade;
    ui.endingTitle.textContent = ending.title;
    ui.endingCopy.textContent = ending.copy;
    const elapsedMin = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
    ui.endingSummary.innerHTML = `
      <div class="ending-stat"><span>검증 정확도</span><strong>${Math.max(0, 100 - state.mistakes * 15)}%</strong></div>
      <div class="ending-stat"><span>수집 기록</span><strong>${state.evidence.length} / ${Object.keys(D.evidence).length}</strong></div>
      <div class="ending-stat"><span>플레이 시간</span><strong>${elapsedMin}분</strong></div>`;
    localStorage.removeItem(SAVE_KEY);
    refreshContinue();
    showScreen("ending");
  }

  function openEvidenceDrawer(onSelect = null) {
    drawerSelect = onSelect;
    ui.drawerKicker.textContent = onSelect ? "SELECT RECORD" : "CASE FILE";
    ui.drawerTitle.textContent = onSelect ? "대조할 기록 선택" : "검증 파일";
    ui.drawerBody.innerHTML = "";
    if (!state.evidence.length) {
      ui.drawerBody.innerHTML = `<div class="notes-card"><strong>아직 기록이 없다.</strong><p>장면을 살펴보고 사람에게 직접 물어 증거를 모아.</p></div>`;
    }
    state.evidence.forEach(id => {
      const ev = D.evidence[id];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "evidence-card";
      card.innerHTML = `${state.unseen.includes(id) ? "<span class=\"evidence-new\">NEW</span>" : ""}<span class="evidence-type">${ev.type}</span><strong>${ev.title}</strong><p>${ev.detail}</p>`;
      card.addEventListener("click", () => {
        if (drawerSelect) drawerSelect(id);
        else toast(ev.note);
      });
      ui.drawerBody.appendChild(card);
    });
    state.unseen = [];
    ui.drawer.classList.add("open");
    ui.drawer.setAttribute("aria-hidden", "false");
  }

  function openNotesDrawer() {
    drawerSelect = null;
    ui.drawerKicker.textContent = "INVESTIGATION NOTES";
    ui.drawerTitle.textContent = "수사 메모";
    const notes = state.evidence.map(id => D.evidence[id]).filter(Boolean);
    ui.drawerBody.innerHTML = notes.length ? notes.map(ev => `<div class="notes-card"><strong>${ev.title}</strong><p>${ev.note}</p></div>`).join("") : `<div class="notes-card"><strong>아직 가설을 세우지 마.</strong><p>첫 기록을 얻기 전에는 사람보다 문서를 먼저 보자.</p></div>`;
    ui.drawer.classList.add("open");
    ui.drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    ui.drawer.classList.remove("open");
    ui.drawer.setAttribute("aria-hidden", "true");
    drawerSelect = null;
  }

  function saveState(silent = false) {
    if (state.ending) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    refreshContinue();
    if (!silent) toast("현재 조사 상태를 저장했다.");
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== D.version || !parsed.phase) return null;
      return { ...freshState(), ...parsed };
    } catch (_) { return null; }
  }

  function refreshContinue() { ui.resume.hidden = !loadState(); }

  function startNew() {
    state = freshState();
    localStorage.removeItem(SAVE_KEY);
    showScreen("game");
    updateHud();
    enterPhase("intro");
  }

  function resumeGame() {
    const loaded = loadState();
    if (!loaded) { startNew(); return; }
    state = loaded;
    showScreen("game");
    updateHud();
    enterPhase(state.phase, true);
  }

  function goTitle() {
    if (!state.ending && !ui.game.hidden) saveState(true);
    showScreen("title");
    refreshContinue();
  }

  ui.start.addEventListener("click", startNew);
  ui.resume.addEventListener("click", resumeGame);
  ui.home.addEventListener("click", goTitle);
  ui.save.addEventListener("click", () => saveState(false));
  ui.statementPrev.addEventListener("click", () => moveStatement(-1));
  ui.statementNext.addEventListener("click", () => moveStatement(1));
  ui.press.addEventListener("click", pressStatement);
  ui.present.addEventListener("click", presentEvidence);
  ui.timelineSubmit.addEventListener("click", submitTimeline);
  ui.drawerBackdrop.addEventListener("click", closeDrawer);
  ui.drawerClose.addEventListener("click", closeDrawer);
  ui.replay.addEventListener("click", startNew);
  ui.endingHome.addEventListener("click", () => showScreen("title"));

  ui.dock.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-dock]");
    if (!btn) return;
    const action = btn.dataset.dock;
    if (action === "record") { openEvidenceDrawer(); return; }
    if (action === "notes") { openNotesDrawer(); return; }
    if (!D.investigations[state.phase]) { toast("지금은 진술에 집중할 때다."); return; }
    renderInvestigation(action === "examine" ? "examine" : "talk");
  });

  document.addEventListener("keydown", (event) => {
    if (ui.game.hidden || ui.cross.hidden || ui.drawer.classList.contains("open")) return;
    if (event.key === "ArrowLeft") moveStatement(-1);
    if (event.key === "ArrowRight") moveStatement(1);
    if (event.key.toLowerCase() === "q") pressStatement();
    if (event.key.toLowerCase() === "e") presentEvidence();
  });

  refreshContinue();
  updateHud();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js?v=18").catch(() => {}));
  }
})();
