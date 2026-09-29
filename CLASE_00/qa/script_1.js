
(()=>{
  const mq=window.matchMedia('(max-width:760px)');
  const shell=document.getElementById('ialp-mobile-classroom');
  const teacher=document.getElementById('teacher-panel');
  const teacherSlot=document.getElementById('mf-teacher-slot');
  const stage=document.getElementById('mf-scene-host');
  const teacherPane=document.getElementById('mf-teacher-pane');
  const lessonPane=document.getElementById('mf-lesson-pane');
  const tabs=[...document.querySelectorAll('[data-mf-pane]')];
  const next=document.getElementById('mf-next');
  const back=document.getElementById('mf-back-teacher');
  const gate=document.getElementById('mf-gate-card');
  let pane='teacher', mounted=null, placeholder=null, originalParent=null, originalNext=null, teacherAnchor=null, historyCompact=true;
  if(teacher){teacherAnchor=document.createComment('teacher-panel-desktop-anchor');teacher.parentNode.insertBefore(teacherAnchor,teacher);}

  function mobile(){return mq.matches;}
  function restoreScene(){
    if(!mounted)return;
    mounted.classList.remove('mobile-scene-node');
    if(placeholder&&placeholder.parentNode){placeholder.parentNode.replaceChild(mounted,placeholder);}else if(originalParent){originalParent.insertBefore(mounted,originalNext&&originalNext.parentNode===originalParent?originalNext:null);}
    mounted=null;placeholder=null;originalParent=null;originalNext=null;
  }
  function moveTeacher(){
    if(!teacher)return;
    if(mobile()){
      if(teacher.parentNode!==teacherSlot)teacherSlot.appendChild(teacher);
    }else if(teacherAnchor&&teacherAnchor.parentNode&&teacher.parentNode!==teacherAnchor.parentNode){teacherAnchor.parentNode.insertBefore(teacher,teacherAnchor.nextSibling);}
  }
  function sceneType(step){return step?.mobile_scene?.type||String(step?.kind||'reading').toUpperCase();}
  function mount(step,node){
    if(!mobile()||!step||!node)return;
    if(mounted!==node){
      restoreScene();
      stage.querySelector('.mf-empty')?.remove();
      originalParent=node.parentNode;originalNext=node.nextSibling;placeholder=document.createComment('mobile-scene:'+step.focus_id);originalParent.insertBefore(placeholder,node);stage.appendChild(node);mounted=node;node.classList.add('mobile-scene-node');
    }
    document.getElementById('mf-scene-title').textContent=step.focus_label||step.section_title||'Fragmento actual';
    document.getElementById('mf-scene-type').textContent=sceneType(step).replaceAll('_',' ');
    document.getElementById('mf-scene-kicker').textContent=step.required?'PUNTO OBLIGATORIO':'FRAGMENTO DIDÁCTICO';
  }
  function setPane(which){
    pane=which==='lesson'?'lesson':'teacher';
    if(!mobile())return;
    teacherPane.classList.toggle('active',pane==='teacher');lessonPane.classList.toggle('active',pane==='lesson');
    tabs.forEach(b=>b.classList.toggle('active',b.dataset.mfPane===pane));
    document.body.classList.toggle('mf-history-compact',pane==='teacher'&&historyCompact);
    window.scrollTo({top:0,behavior:'auto'});
  }
  function progress(step,pct){
    if(!step)return;document.getElementById('mf-step-count').textContent=`${step.index}/${window.__IALP_SIM_COUNT||163}`;document.getElementById('mf-progress-fill').style.width=pct+'%';document.getElementById('mf-section-title').textContent=step.section_title;
  }
  function gateState(step,state){
    if(!step?.gate){gate.hidden=true;next.disabled=false;return;}
    gate.hidden=false;gate.classList.toggle('ok',!!state.passed);gate.textContent=state.text||'';next.disabled=!state.passed;
  }
  function refreshMessages(){
    if(!mobile()||!teacher)return;
    const msgs=[...teacher.querySelectorAll('#teacher-messages .teacher-message')];msgs.forEach(x=>x.classList.remove('mf-visible-message'));
    msgs.slice(-3).forEach(x=>x.classList.add('mf-visible-message'));
    let btn=document.getElementById('mf-history-toggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.id='mf-history-toggle';const msgBox=teacher.querySelector('#teacher-messages');msgBox?.parentNode?.insertBefore(btn,msgBox);btn.addEventListener('click',()=>{historyCompact=!historyCompact;document.body.classList.toggle('mf-history-compact',historyCompact);btn.textContent=historyCompact?'Ver historial completo':'Mostrar solo mensajes recientes';});}
    if(btn)btn.textContent=historyCompact?'Ver historial completo':'Mostrar solo mensajes recientes';
  }
  const mo=new MutationObserver(()=>refreshMessages());
  const msgBox=teacher?.querySelector('#teacher-messages');if(msgBox)mo.observe(msgBox,{childList:true});
  tabs.forEach(b=>b.addEventListener('click',()=>{setPane(b.dataset.mfPane);if(b.dataset.mfPane==='lesson'){const ctl=window.IALPOfflineControls;const st=ctl?.currentStep?.();const n=st?document.querySelector(`[data-focus-id="${CSS.escape(st.focus_id)}"]`):null;if(st&&n)mount(st,n);}}));
  back.addEventListener('click',()=>setPane('teacher'));
  next.addEventListener('click',()=>window.IALPOfflineControls?.advance?.());

  function apply(){
    shell.hidden=!mobile();moveTeacher();
    if(mobile()){
      document.body.classList.add('mf-mobile-first');
      setPane(pane);
      refreshMessages();
      const ctl=window.IALPOfflineControls,st=ctl?.currentStep?.();const n=st?document.querySelector(`[data-focus-id="${CSS.escape(st.focus_id)}"]`):null;if(st&&n)mount(st,n);
    }else{
      document.body.classList.remove('mf-mobile-first','mf-history-compact');restoreScene();
    }
  }
  mq.addEventListener?.('change',apply);window.addEventListener('resize',apply,{passive:true});
  window.IALPMobileFirst={setPane,mount,progress,gate:gateState,refreshMessages,apply};
  try{const d=JSON.parse(document.getElementById('ialp-offline-sim-data').textContent);window.__IALP_SIM_COUNT=d.steps.length;}catch{window.__IALP_SIM_COUNT=163;}
  requestAnimationFrame(apply);
})();
