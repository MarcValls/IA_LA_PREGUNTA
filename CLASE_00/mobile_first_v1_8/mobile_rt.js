
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
  let pane='teacher';
  let mounted=null, placeholder=null, originalParent=null, originalNext=null, fallbackEl=null, teacherAnchor=null, historyCompact=true;
  if(teacher){teacherAnchor=document.createComment('teacher-panel-desktop-anchor');teacher.parentNode.insertBefore(teacherAnchor,teacher);}

  function mobile(){return mq.matches;}
  function restoreScene(){
    if(!mounted)return;
    mounted.classList.remove('mobile-scene-node');
    mounted.querySelectorAll('.mf-scene-fallback').forEach(x=>x.remove());
    if(placeholder&&placeholder.parentNode){placeholder.parentNode.replaceChild(mounted,placeholder);}
    else if(originalParent){originalParent.insertBefore(mounted,originalNext&&originalNext.parentNode===originalParent?originalNext:null);}
    mounted=null;placeholder=null;originalParent=null;originalNext=null;
  }
  function moveTeacher(){
    if(!teacher)return;
    if(mobile()){if(teacher.parentNode!==teacherSlot)teacherSlot.appendChild(teacher);}
    else if(teacherAnchor&&teacherAnchor.parentNode&&teacher.parentNode!==teacherAnchor.parentNode){teacherAnchor.parentNode.insertBefore(teacher,teacherAnchor.nextSibling);}
  }
  function computeSceneType(step){return step?.mobile_scene?.type||String(step?.kind||'LECTURA').toUpperCase().replace(/_/g,' ');}
function mount(step,node){
    if(!mobile()||!step||!node)return;
    if(mounted!==node){
      restoreScene();
      stage.querySelector('.mf-empty')?.remove();
      originalParent=node.parentNode;originalNext=node.nextSibling;placeholder=document.createComment('mobile-scene:'+step.focus_id);originalParent.insertBefore(placeholder,node);stage.appendChild(node);mounted=node;node.classList.remove('mf-scene-hidden');node.classList.add('mobile-scene-node');
    }
    if(fallbackEl&&fallbackEl.parentNode){fallbackEl.remove();fallbackEl=null;}
    mounted.classList.remove('mf-scene-hidden');
    mounted.querySelectorAll('.mf-scene-hidden').forEach(h=>h.classList.remove('mf-scene-hidden'));
    const nodeText=[...node.children].map(el=>el.innerText?el.innerText.trim():'').filter(Boolean).join(' ');
    let label=step.focus_label||step.section_title||'Fragmento actual';
    // Expand truncated labels using node text
    if(label.includes('…')||label.includes('...')){
      const nodeNorm=nodeText.toLowerCase().replace(/[\s:·—-]+/g,' ').trim();
      const labelPrefix=label.replace(/[…\u2026.]+$/,'').toLowerCase().replace(/[\s:·—-]+/g,' ').trim();
      if(nodeNorm.length>10&&nodeText.length>label.length&&nodeText.length<=180&&(nodeNorm.startsWith(labelPrefix)||labelPrefix.length<=6||nodeNorm.includes(labelPrefix))){
        label=nodeText;
      }
    }
    // Dedupe title if it starts with an ALL-CAPS marker repeated in normal case: "AL PRINCIPIO Al principio..."
    const dedupe=(s)=>{
      const norm=s.replace(/[\s:·—-]+/g,' ').trim();
      const words=norm.split(' ');
      const alphaPct=(t)=>{const a=t.replace(/[^a-zA-Z]/g,''); if(!a.length)return 0; return a.replace(/[a-z]/g,'').length/a.length;};
      const isUpper=(t)=>alphaPct(t)>0.7;
      for(let len=1; len<=Math.min(Math.floor(words.length/2),8); len++){
        const firstRaw=words.slice(0,len).join(' ');
        const secondRaw=words.slice(len,len*2).join(' ');
        if(firstRaw.toLowerCase()===secondRaw.toLowerCase()){
          return words.slice(len).join(' ');
        }
      }
      for(let i=1; i<words.length; i++){
        const prefix=words.slice(0,i).join(' ');
        const rest=words.slice(i).join(' ');
        if(isUpper(prefix) && rest.toLowerCase().startsWith(prefix.toLowerCase())){
          return rest.slice(prefix.length).trim();
        }
      }
      return s;
    };
    label=dedupe(label);
    const labelNorm=label.toLowerCase().replace(/[\s:·—-]+/g,' ').trim();
    const titleText=labelNorm;
    // Fallback only for cover/toc or truly empty nodes
    const isCoverToc=node.matches('.cover,.toc')||!!node.querySelector('.cover,.toc');
    const isEmpty=nodeText.length===0&&!node.querySelector('img,svg,canvas,iframe,video,figure');
    if(isCoverToc||isEmpty){
      const msg=[...teacher.querySelectorAll('#teacher-messages .teacher-message')].pop()?.querySelector('.teacher-message-text')?.textContent||'';
      const fbLabel=label||node.textContent.trim()||'Fragmento actual';
      const fallback=document.createElement('p');fallback.className='mf-scene-fallback';
      fallback.innerHTML='<strong>'+fbLabel.replace(/:$/,'')+'</strong>: '+(msg?msg.replace(/"/g,'&quot;'):'Sigue las indicaciones del Maestro para continuar.');
      stage.appendChild(fallback);fallbackEl=fallback;
      if(isCoverToc){node.classList.add('mf-scene-hidden');}
    }
    // Hide any child element whose text is already present in the panel title
    const textChildren=[...node.children].filter(el=>{const tag=el.tagName.toLowerCase(); return !['img','svg','figure','canvas','iframe','video'].includes(tag);});
    textChildren.forEach(el=>{
      const t=el.innerText.trim().toLowerCase().replace(/[\s:·—-]+/g,' ');
      if(t.length>3&&titleText.includes(t)){el.classList.add('mf-scene-hidden');}
    });
    // Hide echo/repeat elements that duplicate a previous sibling
    const echoLike=[...node.querySelectorAll('[class*="echo"],[class*="repeat"]')];
    echoLike.forEach(el=>{const t=el.innerText.trim().toLowerCase().replace(/[\s:·—-]+/g,' '); if(t.length>3) el.classList.add('mf-scene-hidden');});
    // Hide duplicate labels/headings explicitly
    const labelLike='.visual-label,.cluster-title,.eyebrow,.story-label,.transition-tag,.transition-title,.before-label,.before-title,.key-idea-title,.source-title,.source-label,.source-ba-intro,.case-label,.section-label,.semantic-note-label,.box-title,.kicker,.panel-label,.lesson-kicker';
    const dupCandidates=[...node.querySelectorAll('h1,h2,h3,'+labelLike)].slice(0,5);
    for(const el of dupCandidates){
      const txt=el.innerText.trim().toLowerCase().replace(/[\s:·—-]+/g,' ');
      if(txt.length<=3)continue;
      const isLabel=el.matches(labelLike);
      if(isLabel&&titleText.includes(txt)){el.classList.add('mf-scene-hidden');continue;}
      if(titleText.startsWith(txt)||txt.startsWith(titleText)||titleText===txt){el.classList.add('mf-scene-hidden');}
    }
        // If every meaningful child is hidden and there is no media, hide the scene node so only the panel title remains
    const hasMedia=!!node.querySelector('img,svg,canvas,iframe,video,figure');
    const hasVisible=[...node.children].some(el=>!el.classList.contains('mf-scene-hidden')&&el.offsetHeight>0);
    if(!hasVisible&&!hasMedia){node.classList.add('mf-scene-empty');}else{node.classList.remove('mf-scene-empty');}
if(sceneTitle){sceneTitle.textContent=label;}
    if(sceneType)sceneType.textContent=computeSceneType(step).replaceAll('_',' ');
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
    if(countEl)countEl.textContent=`${step.index}/${window.__IALP_SIM_COUNT||163}`;
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
      const n=st?document.querySelector(`[data-focus-id="${CSS.escape(st.focus_id)}"]`):null;
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
      const n=st?document.querySelector(`[data-focus-id="${CSS.escape(st.focus_id)}"]`):null;
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
    if(st!==lastStep){lastStep=st;const n=document.querySelector(`[data-focus-id="${CSS.escape(st.focus_id)}"]`);if(n)mount(st,n);progress(st,Math.round(st.index/window.__IALP_SIM_COUNT*100));gate(st,{passed:ctl.gatePassed?.(st),text:''});setPane('teacher');}
  },250);
  requestAnimationFrame(apply);
})();
