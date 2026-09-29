import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/AMTEC_Terminal_1º/Documents/IA. LA PREGUNTA/LECCIONES_IA/IALP_INTERACTIVO_CLASE_00_MOBILE_FIRST_v1_8';
const FRONTEND_HTML = path.join(ROOT, 'frontend', 'index.html');
const CAP_WEB_HTML = path.join(ROOT, 'capacitor', 'web', 'index.html');

let html = fs.readFileSync(FRONTEND_HTML, 'utf8');

// --- 1) Reemplazar CSS mobile-first v1.8 completo ---
const MOBILE_CSS = `<style id="ialp-mobile-first-v18-css">
/* =========================================================
   IALP v1.8 MOBILE-FIRST — semantic scene player
   Desktop keeps the 50/50 classroom. Mobile is a different UI.
   ========================================================= */
@media screen and (max-width:760px){
  :root{
    --mf-navy:#0d2a3d;--mf-gold:#c9a33a;--mf-ink:#17232d;--mf-muted:#65747d;
    --mf-line:#d8e2e6;--mf-soft:#f5f8f9;--mf-paper:#fffdfa;--mf-safe-top:env(safe-area-inset-top);
    --mf-safe-bottom:env(safe-area-inset-bottom);
  }
  html,body{max-width:100%;overflow-x:hidden!important;background:#f2f5f6!important;min-width:0!important}
  body.ialp-interactive{padding:0!important;margin:0!important;min-width:0!important}
  /* Desktop shell must disappear entirely on mobile. */
  body.ialp-interactive #ialp-toolbar,
  body.ialp-interactive>.cover,
  body.ialp-interactive>.toc,
  body.ialp-interactive>main,
  body.ialp-interactive #teacher-focus-arrow,
  body.ialp-interactive #ollama-panel,
  body.ialp-interactive #ialp-index,
  body.ialp-interactive #mobile-sim-switch,
  body.ialp-interactive #mobile-return-teacher{display:none!important}

  #ialp-mobile-classroom{display:flex!important;flex-direction:column!important;min-height:100dvh!important;max-width:100vw!important;background:#f2f5f6;color:var(--mf-ink)}
  .mf-topbar{position:sticky;top:0;z-index:1700;background:rgba(255,255,255,.98);backdrop-filter:blur(10px);border-bottom:1px solid var(--mf-line);padding:max(8px,var(--mf-safe-top)) 12px 8px}
  .mf-brand-row{display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:0}
  .mf-brand{min-width:0}.mf-brand b{display:block;font-size:12px;letter-spacing:.12em;color:var(--mf-navy)}.mf-brand span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px;color:var(--mf-muted);margin-top:2px}
  .mf-step{flex:0 0 auto;font-size:11px;font-weight:850;color:var(--mf-navy);background:#eef3f5;border:1px solid #d5e0e4;border-radius:999px;padding:5px 8px}
  .mf-progress{height:4px;background:#e4eaed;border-radius:999px;overflow:hidden;margin:8px 0 7px}.mf-progress>i{display:block;height:100%;width:0;background:var(--mf-gold);border-radius:inherit;transition:width .18s ease}
  .mf-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px}.mf-tabs button{min-height:44px;border:1px solid #cbd8de;background:#fff;border-radius:10px;font-size:14px;font-weight:850;color:#27495c}.mf-tabs button.active{background:var(--mf-navy);color:#fff;border-color:var(--mf-navy)}

  .mf-pane{display:none;flex:1 1 auto;min-width:0;overflow-y:auto;-webkit-overflow-scrolling:touch}.mf-pane.active{display:flex!important;flex-direction:column!important}
  #mf-teacher-pane{padding:10px 10px calc(20px + var(--mf-safe-bottom))}
  #mf-teacher-slot{min-width:0}
  body.ialp-interactive #teacher-panel{
    display:flex!important;position:static!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;
    margin:0!important;border:1px solid var(--mf-line)!important;border-radius:16px!important;box-shadow:none!important;background:#f8fafb!important;overflow:visible!important
  }
  body.ialp-interactive #teacher-panel[hidden]{display:none!important}
  body.ialp-interactive #teacher-panel .teacher-dock-head{padding:14px 14px 12px;border-radius:15px 15px 0 0}
  body.ialp-interactive #teacher-panel .teacher-identity strong{font-size:20px}
  body.ialp-interactive #teacher-panel .teacher-now{padding:10px 12px}
  body.ialp-interactive #teacher-panel .teacher-tools summary{min-height:44px;padding:9px 12px;font-size:12px}
  body.ialp-interactive #teacher-panel .teacher-guide-actions{gap:6px!important;padding:0 10px 10px!important}
  body.ialp-interactive #teacher-panel .teacher-guide-actions button{min-height:40px!important;font-size:12px!important;padding:8px 10px!important}
  body.ialp-interactive #teacher-panel #offline-sim-progress{padding:9px 12px}
  body.ialp-interactive #teacher-panel #offline-sim-gate{padding:10px 12px;font-size:12px}
  body.ialp-interactive #teacher-panel #teacher-messages{overflow:visible!important;max-height:none!important;padding:10px!important;gap:9px!important}
  body.ialp-interactive #teacher-panel .teacher-message{font-size:var(--teacher-chat-font-size)!important;line-height:1.52!important;overflow-wrap:break-word!important;word-break:normal!important;hyphens:none!important}
  body.ialp-interactive #teacher-panel .teacher-message-tools button,
  body.ialp-interactive #teacher-panel .offline-sim-tools button{min-height:40px!important;padding:8px 10px!important;font-size:12px!important}
  #mf-history-toggle{width:100%;min-height:44px;margin:0 0 8px;border:1px solid #cfdadf;background:#fff;border-radius:10px;font-size:12px;font-weight:800;color:#315062}
  body.mf-history-compact #teacher-messages .teacher-message{display:none!important}
  body.mf-history-compact #teacher-messages .teacher-message.mf-visible-message{display:block!important}

  #mf-lesson-pane{padding:10px 10px calc(20px + var(--mf-safe-bottom))}
  .mf-scene-card{background:#fff;border:1px solid var(--mf-line);border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(15,43,64,.06);flex:0 0 auto}
  .mf-scene-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px 14px 10px;border-bottom:1px solid #e2e8eb;background:#fbfcfc}
  .mf-scene-meta{min-width:0}.mf-scene-kicker{font-size:9px;letter-spacing:.12em;font-weight:900;color:#7a672a;text-transform:uppercase}.mf-scene-title{font-size:15px;line-height:1.25;font-weight:850;color:var(--mf-navy);margin-top:3px;overflow-wrap:break-word}.mf-scene-type{flex:0 0 auto;font-size:9px;font-weight:900;color:#315062;background:#edf3f5;border:1px solid #d4e0e4;border-radius:999px;padding:5px 7px}
  #mf-scene-host{display:block!important;width:auto!important;max-width:none!important;margin:0!important;padding:14px!important;border:0!important;box-shadow:none!important;background:#fff!important;min-height:0!important;overflow:visible!important}
  #mf-scene-host>.teacher-focusable{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;opacity:1!important;filter:none!important;pointer-events:auto!important;box-shadow:none!important;outline:0!important;background:transparent!important;padding:0!important}
  #mf-scene-host>.teacher-focusable::before{display:none!important}
  #mf-scene-host, #mf-scene-host *{min-width:0;box-sizing:border-box;word-break:normal!important;hyphens:none!important}
  #mf-scene-host p,#mf-scene-host li,#mf-scene-host blockquote,#mf-scene-host td,#mf-scene-host dd,#mf-scene-host .student-note,#mf-scene-host .case-study p{font-size:var(--lesson-text-font-size)!important;line-height:1.56!important;overflow-wrap:break-word!important}
  #mf-scene-host h1{font-size:clamp(28px,8.2vw,40px)!important;line-height:1.04!important;overflow-wrap:break-word!important}
  #mf-scene-host h2{font-size:clamp(22px,6.5vw,30px)!important;line-height:1.12!important;overflow-wrap:break-word!important}
  #mf-scene-host h3{font-size:clamp(18px,5.1vw,23px)!important;line-height:1.18!important;overflow-wrap:break-word!important}
  #mf-scene-host input,#mf-scene-host textarea,#mf-scene-host select{font-size:max(16px,var(--lesson-input-font-size))!important;max-width:100%!important;width:100%!important}
  #mf-scene-host textarea{min-height:120px;resize:vertical}
  #mf-scene-host img,#mf-scene-host svg,#mf-scene-host canvas{display:block!important;max-width:100%!important;height:auto!important;margin-left:auto!important;margin-right:auto!important}
  #mf-scene-host pre,#mf-scene-host code{white-space:pre-wrap!important;overflow-wrap:break-word!important;word-break:normal!important;max-width:100%!important}
  #mf-scene-host table{display:block!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch;white-space:normal!important}
  #mf-scene-host .objectives,#mf-scene-host .simlab-grid,#mf-scene-host .scene-grid,#mf-scene-host .transition-cases,#mf-scene-host .interpretation-options,#mf-scene-host .interpretation-spectrum,#mf-scene-host .course-roadmap,#mf-scene-host .cognitive-flow,#mf-scene-host .before-after,#mf-scene-host .scope-row,#mf-scene-host .observation-grid,#mf-scene-host .worksheet-grid,#mf-scene-host .context-grid,#mf-scene-host .future-grid,#mf-scene-host .action-grid,#mf-scene-host .state-pair-grid,#mf-scene-host .closing-grid-v2,#mf-scene-host .closing-row-v2,#mf-scene-host .deconstruct-steps-v3,#mf-scene-host .deconstruct-row-v3,#mf-scene-host .sequence-compare,#mf-scene-host .state-strip,#mf-scene-host .scaffold-strip{display:grid!important;grid-template-columns:1fr!important;gap:9px!important;width:100%!important}
  #mf-scene-host .choice-cloud,#mf-scene-host .criterion-grid,#mf-scene-host .needs-grid,#mf-scene-host .evidence-grid,#mf-scene-host .reconstruction-grid,#mf-scene-host .workshop-cards,#mf-scene-host .learning-triplet{display:grid!important;grid-template-columns:1fr!important;gap:9px!important;width:100%!important}
  #mf-scene-host .transition-card,#mf-scene-host .scene-card,#mf-scene-host .interpretation-option,#mf-scene-host .spectrum-zone,#mf-scene-host .road-step,#mf-scene-host .cognitive-step,#mf-scene-host .before-card,#mf-scene-host .after-card,#mf-scene-host .scope-card,#mf-scene-host .simlab-card,#mf-scene-host .choice-card,#mf-scene-host .criterion-card,#mf-scene-host .action-card,#mf-scene-host .context-card,#mf-scene-host .needs-card,#mf-scene-host .evidence-card,#mf-scene-host .reconstruction-card,#mf-scene-host .learning-card,#mf-scene-host .workshop-card,#mf-scene-host .state-pair,#mf-scene-host .command-card,#mf-scene-host .future-card,#mf-scene-host .sequence-step,#mf-scene-host .state-step,#mf-scene-host .scaffold-step,#mf-scene-host .closing-beat,#mf-scene-host .closing-node-v2,#mf-scene-host .deconstruct-step{display:block!important;width:100%!important;min-height:0!important;margin:0!important}
  #mf-scene-host .lesson-masthead{display:grid!important;grid-template-columns:52px minmax(0,1fr)!important;gap:10px!important;align-items:end!important}.mf-scene-card .progress-rail{display:none!important}
  #mf-scene-host .opening-question{margin:0!important;border-radius:12px!important;padding:18px 16px!important}.mf-scene-card .opening-q{font-size:clamp(30px,10vw,44px)!important}
  #mf-scene-host .cover-v3{min-height:0!important;height:auto!important;padding:18px!important;border-radius:12px!important}.mf-scene-card .cover-v3 .cover-title{font-size:clamp(34px,11vw,48px)!important}
  #mf-scene-host .interactive-workspace,#mf-scene-host .try-box,#mf-scene-host .lab-box,#mf-scene-host .worksheet,#mf-scene-host .self-check{break-inside:auto!important;page-break-inside:auto!important}
  #mf-scene-host .workspace-actions{display:flex!important;flex-wrap:wrap!important;gap:8px!important}.mf-scene-card button,.mf-scene-card .workspace-actions button{min-height:44px!important;max-width:100%!important;white-space:normal!important}
  #mf-scene-host .inline-exercise{display:flex!important;flex-wrap:wrap!important;gap:8px!important}
  #mf-scene-host .inline-exercise select{width:100%!important;min-width:0!important}

  .mf-gate-card{margin-top:10px;padding:11px 12px;border:1px solid #ead79a;background:#fff8e8;border-radius:12px;color:#6b5318;font-size:12px;line-height:1.42}.mf-gate-card.ok{border-color:#c9dfcf;background:#eef6f0;color:#2f6c4b}.mf-gate-card[hidden]{display:none!important}
  .mf-empty{padding:28px 18px;text-align:center;color:var(--mf-muted)}

  /* Make sure no desktop panels leak on mobile. */
  body.ialp-interactive #ialp-toolbar,
  body.ialp-interactive #ialp-index,
  body.ialp-interactive #ollama-panel,
  body.ialp-interactive #teacher-focus-arrow,
  body.ialp-interactive #toast{z-index:0!important}
}
@media screen and (min-width:761px){#ialp-mobile-classroom{display:none!important}}
</style>`;

html = replaceBlock(html, '<style id="ialp-mobile-first-v18-css">', '</style>', MOBILE_CSS);

// --- 2) Reemplazar CSS offline-sim: quitar el hack mobile legacy y dejar desktop intacto ---
const OFFLINE_SIM_CSS = `<style id="ialp-offline-sim-style">
/* IALP v1.8 OFFLINE SIMULATION — deterministic teacher + gates */
body.offline-simulation{--sim-lock:#8b5e16;--sim-ok:#2f6c4b;--sim-soft:#f5f7f8}
body.offline-simulation #teacher-panel{display:flex!important}
body.offline-simulation #teacher-panel[hidden]{display:flex!important}
body.offline-simulation #teacher-form{display:none!important}
body.offline-simulation .teacher-dock-head{flex:0 0 auto}
body.offline-simulation #teacher-messages{flex:1 1 auto;min-height:0}
body.offline-simulation .teacher-guide-actions{grid-template-columns:repeat(4,minmax(0,1fr))}
body.offline-simulation .teacher-guide-actions button{min-width:0;padding:7px 6px;font-size:11px}
body.offline-simulation #teacher-next:disabled{opacity:.42;cursor:not-allowed;background:#7a858b;border-color:#7a858b}
#offline-sim-progress{display:grid;gap:6px;padding:9px 14px;background:#fff;border-bottom:1px solid #e1e7ea;font-size:11px;color:#5d6d77}
#offline-sim-progress .sim-progress-row{display:flex;justify-content:space-between;gap:12px;align-items:center}
#offline-sim-progress .sim-progress-track{height:5px;background:#e5ebee;border-radius:999px;overflow:hidden}
#offline-sim-progress .sim-progress-track>i{display:block;height:100%;width:0;background:#315d73;border-radius:inherit;transition:width .18s ease}
#offline-sim-gate{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:9px 14px;background:#fff8e8;border-bottom:1px solid #ead79a;font-size:11px;line-height:1.35;color:#6b5318}
#offline-sim-gate.ok{background:#eef6f0;border-color:#c9dfcf;color:#2f6c4b}
#offline-sim-gate[hidden]{display:none!important}
#offline-sim-gate button{font-size:11px;padding:6px 8px;background:#fff;border:1px solid currentColor;border-radius:8px}
#offline-sim-gate button:disabled{opacity:.45;cursor:not-allowed}
.offline-sim-message-meta{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#76858e;margin-bottom:5px}
.offline-sim-tools{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.offline-sim-tools button{font-size:11px;padding:6px 8px;border-radius:8px;background:#fff;border:1px solid #cbd8de;color:#24485c}
.offline-sim-tools .sim-next-inline{background:#0d2a3d;color:#fff;border-color:#0d2a3d}
.offline-sim-lock-note{padding:9px 10px;border-radius:9px;background:#fff8e8;border:1px solid #ead79a;color:#6b5318;font-size:12px}
.offline-lab-simulation{margin:10px 0 12px;padding:12px;border:1px solid #cbd8de;border-radius:12px;background:#f7fafb}
.offline-lab-simulation .simlab-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:8px}
.offline-lab-simulation .simlab-title{font-weight:800;color:#0d2a3d;font-size:13px}
.offline-lab-simulation .simlab-note{font-size:11px;color:#64747e;margin-bottom:8px}
.offline-lab-simulation .simlab-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.offline-lab-simulation .simlab-card{min-width:0;padding:9px;background:#fff;border:1px solid #d8e3e8;border-radius:10px}
.offline-lab-simulation .simlab-card b{display:block;margin-bottom:5px;color:#315d73}
.offline-lab-simulation .simlab-card p{font-size:12px;line-height:1.4;margin:0 0 6px;overflow-wrap:anywhere}
.offline-lab-simulation .simlab-card dl{margin:0;display:grid;gap:4px;font-size:10.5px;color:#596974}.offline-lab-simulation .simlab-card dt{font-weight:800;color:#315062}.offline-lab-simulation .simlab-card dd{margin:0}
body.offline-simulation #interactive-nav a.sim-locked{opacity:.45;cursor:not-allowed}.sim-lock-mark{font-size:10px;margin-left:6px;color:#8b5e16}
body.offline-simulation .teacher-focusable.sim-future-locked{opacity:.20!important;filter:grayscale(.4);pointer-events:none}
body.offline-simulation .teacher-focusable.sim-visited{opacity:.55}
body.offline-simulation .teacher-focusable.teacher-focus-target{opacity:1!important;filter:none!important;pointer-events:auto!important}
/* Mobile layout is handled exclusively by #ialp-mobile-classroom v1.8 */
#mobile-sim-switch{display:none!important}
#mobile-return-teacher{display:none!important}
.offline-mode-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;background:#eef6f0;border:1px solid #c9dfcf;color:#2f6c4b;font-size:11px;font-weight:800}
@media(max-width:760px){
  body.offline-simulation{padding-left:0!important;padding-top:0!important;overflow-x:hidden}
  /* Legacy mobile pane overrides removed: #ialp-mobile-classroom owns mobile. */
}
@media print{#mobile-sim-switch,#offline-sim-progress,#offline-sim-gate,#mobile-return-teacher{display:none!important}}
</style>`;

html = replaceBlock(html, '<style id="ialp-offline-sim-style">', '</style>', OFFLINE_SIM_CSS);

// --- 3) Reemplazar runtime mobile-first v1.8 ---
const MOBILE_RUNTIME = `<script id="ialp-mobile-first-v18-runtime">
(()=>{
  const mq=window.matchMedia('(max-width:760px)');
  const shell=document.getElementById('ialp-mobile-classroom');
  const teacher=document.getElementById('teacher-panel');
  const teacherSlot=document.getElementById('mf-teacher-slot');
  const stage=document.getElementById('mf-scene-host');
  const teacherPane=document.getElementById('mf-teacher-pane');
  const lessonPane=document.getElementById('mf-lesson-pane');
  const tabs=[...document.querySelectorAll('[data-mf-pane]')];
  const titleEl=document.getElementById('mf-section-title');
  const countEl=document.getElementById('mf-step-count');
  const fillEl=document.getElementById('mf-progress-fill');
  const sceneTitle=document.getElementById('mf-scene-title');
  const sceneType=document.getElementById('mf-scene-type');
  const sceneKicker=document.getElementById('mf-scene-kicker');
  const gateCard=document.getElementById('mf-gate-card');
  const backBtn=document.getElementById('mf-back-teacher');
  const nextBtn=document.getElementById('mf-next');
  const KEY='ialp.mobilefirst.v18.pane';
  let pane=localStorage.getItem(KEY)||'teacher';
  let mounted=null, placeholder=null, originalParent=null, originalNext=null, teacherAnchor=null, historyCompact=true;
  if(teacher){teacherAnchor=document.createComment('teacher-panel-desktop-anchor');teacher.parentNode.insertBefore(teacherAnchor,teacher);}

  function mobile(){return mq.matches;}
  function restoreScene(){
    if(!mounted)return;
    mounted.classList.remove('mobile-scene-node');
    if(placeholder&&placeholder.parentNode){placeholder.parentNode.replaceChild(mounted,placeholder);}
    else if(originalParent){originalParent.insertBefore(mounted,originalNext&&originalNext.parentNode===originalParent?originalNext:null);}
    mounted=null;placeholder=null;originalParent=null;originalNext=null;
  }
  function moveTeacher(){
    if(!teacher)return;
    if(mobile()){if(teacher.parentNode!==teacherSlot)teacherSlot.appendChild(teacher);}
    else if(teacherAnchor&&teacherAnchor.parentNode&&teacher.parentNode!==teacherAnchor.parentNode){teacherAnchor.parentNode.insertBefore(teacher,teacherAnchor.nextSibling);}
  }
  function sceneType(step){return step?.mobile_scene?.type||String(step?.kind||'LECTURA').toUpperCase().replace(/_/g,' ');}
  function mount(step,node){
    if(!mobile()||!step||!node)return;
    if(mounted!==node){
      restoreScene();
      stage.querySelector('.mf-empty')?.remove();
      originalParent=node.parentNode;originalNext=node.nextSibling;placeholder=document.createComment('mobile-scene:'+step.focus_id);originalParent.insertBefore(placeholder,node);stage.appendChild(node);mounted=node;node.classList.add('mobile-scene-node');
    }
    if(sceneTitle)sceneTitle.textContent=step.focus_label||step.section_title||'Fragmento actual';
    if(sceneType)sceneType.textContent=sceneType(step).replaceAll('_',' ');
    if(sceneKicker)sceneKicker.textContent=step.required?'PUNTO OBLIGATORIO':'FRAGMENTO DIDÁCTICO';
  }
  function setPane(which){
    pane=which==='lesson'?'lesson':'teacher';
    if(!mobile())return;
    localStorage.setItem(KEY,pane);
    teacherPane.classList.toggle('active',pane==='teacher');lessonPane.classList.toggle('active',pane==='lesson');
    tabs.forEach(b=>b.classList.toggle('active',b.dataset.mfPane===pane));
    document.body.classList.toggle('mf-history-compact',pane==='teacher'&&historyCompact);
    window.scrollTo({top:0,behavior:'auto'});
  }
  function progress(step,pct){
    if(!step)return;
    if(countEl)countEl.textContent=\`\${step.index}/\${window.__IALP_SIM_COUNT||163}\`;
    if(fillEl)fillEl.style.width=pct+'%';
    if(titleEl)titleEl.textContent=step.section_title;
  }
  function gate(step,state){
    if(!gateCard)return;
    if(!step?.gate){gateCard.hidden=true;nextBtn.disabled=false;return;}
    gateCard.hidden=false;gateCard.classList.toggle('ok',!!state.passed);
    gateCard.textContent=state.text||'';
    nextBtn.disabled=!state.passed;
  }
  function refreshMessages(){
    if(!mobile()||!teacher)return;
    const msgs=[...teacher.querySelectorAll('#teacher-messages .teacher-message')];
    msgs.forEach(x=>x.classList.remove('mf-visible-message'));
    msgs.slice(-3).forEach(x=>x.classList.add('mf-visible-message'));
    let btn=document.getElementById('mf-history-toggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.id='mf-history-toggle';const msgBox=teacher.querySelector('#teacher-messages');msgBox?.parentNode?.insertBefore(btn,msgBox);btn.addEventListener('click',()=>{historyCompact=!historyCompact;document.body.classList.toggle('mf-history-compact',historyCompact);btn.textContent=historyCompact?'Ver historial completo':'Mostrar solo mensajes recientes';});}
    if(btn)btn.textContent=historyCompact?'Ver historial completo':'Mostrar solo mensajes recientes';
  }
  const mo=new MutationObserver(()=>refreshMessages());
  const msgBox=teacher?.querySelector('#teacher-messages');if(msgBox)mo.observe(msgBox,{childList:true});
  tabs.forEach(b=>b.addEventListener('click',()=>{
    setPane(b.dataset.mfPane);
    if(b.dataset.mfPane==='lesson'){
      const ctl=window.IALPOfflineControls;
      const st=ctl?.currentStep?.();
      const n=st?document.querySelector(\`[data-focus-id="\${CSS.escape(st.focus_id)}"]\`):null;
      if(st&&n){mount(st,n);setTimeout(()=>n.scrollIntoView({block:'start',behavior:'smooth'}),0);}
    }
  }));
  backBtn?.addEventListener('click',()=>setPane('teacher'));
  nextBtn?.addEventListener('click',()=>window.IALPOfflineControls?.advance?.());

  function apply(){
    if(!shell)return;
    shell.hidden=!mobile();moveTeacher();
    if(mobile()){
      document.body.classList.add('mf-mobile-first');
      setPane(pane);
      refreshMessages();
      const ctl=window.IALPOfflineControls,st=ctl?.currentStep?.();
      const n=st?document.querySelector(\`[data-focus-id="\${CSS.escape(st.focus_id)}"]\`):null;
      if(st&&n)mount(st,n);
    }else{
      document.body.classList.remove('mf-mobile-first','mf-history-compact');restoreScene();
    }
  }
  mq.addEventListener?.('change',apply);window.addEventListener('resize',apply,{passive:true});
  window.IALPMobileFirst={setPane,mount,progress,gate,refreshMessages,apply};
  try{const d=JSON.parse(document.getElementById('ialp-offline-sim-data')?.textContent||'{}');window.__IALP_SIM_COUNT=d.steps?.length||163;}catch{window.__IALP_SIM_COUNT=163;}
  // Watch offline controls appearing later.
  let lastStep=null;
  setInterval(()=>{
    if(!mobile())return;
    const ctl=window.IALPOfflineControls;
    const st=ctl?.currentStep?.(); if(!st)return;
    if(st!==lastStep){lastStep=st;const n=document.querySelector(\`[data-focus-id="\${CSS.escape(st.focus_id)}"]\`);if(n)mount(st,n);progress(st,Math.round(st.index/window.__IALP_SIM_COUNT*100));gate(st,{passed:ctl.gatePassed?.(st),text:''});setPane('teacher');}
  },250);
  requestAnimationFrame(apply);
})();
</script>`;

html = replaceBlock(html, '<script id="ialp-mobile-first-v18-runtime">', '</script>', MOBILE_RUNTIME);

// --- 4) Parches en runtime offline-sim para usar mobile-first shell ---
// El script offline-sim es grande; hacemos reemplazos quirúrgicos.

// 4a) Inicialmente el offline-sim oculta #ialp-mobile-classroom; lo desocultamos para que mobile-first lo gestione.
html = html.replace(
  /#ialp-mobile-classroom\{display:block!important;min-height:100%;/g,
  '#ialp-mobile-classroom{display:block!important;min-height:100%;'
);

// 4b) Cuando el usuario pulsa "Mira aquí" en offline-sim, en móvil cambiamos a Lección.
html = html.replace(
  /look\.addEventListener\('click',\(\)=>\{if\(isMobile\(\)\)setMobilePane\('lesson'\);focusCurrent\(\{scroll:true,source:look\}\);\}\);/,
  `look.addEventListener('click',()=>{if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.setPane('lesson');}else if(isMobile()){setMobilePane('lesson');}focusCurrent({scroll:true,source:look});});`
);

// 4c) En focusCurrent, si estamos en móvil, dejar que IALPMobileFirst haga el montaje.
html = html.replace(
  /if\(window\.IALPMobileFirst&&isMobile\(\)\)\{window\.IALPMobileFirst\.mount\(step,node\);\}else if\(scroll\)\{node\.scrollIntoView\(\{behavior:'smooth',block:'center'\}\);\}/,
  `if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.mount(step,node);}else if(scroll){node.scrollIntoView({behavior:'smooth',block:'center'});}`
);

// 4d) Al avanzar (advance), terminar en Maestro, no en Lección (teacher_first_on_step_change).
html = html.replace(
  /if\(isMobile\(\)\)setMobilePane\('teacher'\);\}\n\s*function previous\(\)/,
  `if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.setPane('teacher');}else if(isMobile()){setMobilePane('teacher');}\n  window.dispatchEvent(new Event('resize'));\n  }\n  function previous()`
);

// 4e) Al ir a un paso con goTo, terminar en Maestro.
html = html.replace(
  /if\(isMobile\(\)\)setMobilePane\('teacher'\);return true;\}/,
  `if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.setPane('teacher');}else if(isMobile()){setMobilePane('teacher');}\n    return true;\n  }`
);

// 4f) updateProgress: pasar progreso a mobile-first.
html = html.replace(
  /if\(window\.IALPMobileFirst\)window\.IALPMobileFirst\.progress\(step,pct\);/,
  `if(window.IALPMobileFirst)window.IALPMobileFirst.progress(step,pct);`
);

// 4g) updateGate: pasar gate a mobile-first.
html = html.replace(
  /if\(window\.IALPMobileFirst\)window\.IALPMobileFirst\.gate\(step,\{passed,text:gateText\.textContent\}\);/,
  `if(window.IALPMobileFirst)window.IALPMobileFirst.gate(step,{passed,text:gateText.textContent});`
);

// 4h) Crear mobileSwitch y returnTeacher legacy? No, los ocultamos en CSS. Pero offline-sim intenta insertarlos. Lo dejamos; están ocultos.

fs.writeFileSync(FRONTEND_HTML, html, 'utf8');
fs.writeFileSync(CAP_WEB_HTML, html, 'utf8');
console.log('PASS: mobile-first v1.8 integrated into frontend and capacitor/web');

function replaceBlock(text, startMarker, endMarker, replacement){
  const s=text.indexOf(startMarker);
  if(s===-1)throw new Error('start marker not found: '+startMarker);
  let e=text.indexOf(endMarker,s);
  if(e===-1)throw new Error('end marker not found after '+startMarker);
  e+=endMarker.length;
  return text.slice(0,s)+replacement+text.slice(e);
}
