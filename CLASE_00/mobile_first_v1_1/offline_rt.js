
(()=>{
  const SIM=JSON.parse(document.getElementById('ialp-offline-sim-data').textContent);
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const body=document.body, teacherPanel=$('#teacher-panel'), messages=$('#teacher-messages');
  const OFFLINE_KEY='ialp.clase00.mobilefirst.sim.v1.1';
  let simState={stepIndex:0,completed:{},maxUnlocked:0,mobilePane:'home'};
  try{simState=Object.assign(simState,JSON.parse(localStorage.getItem(OFFLINE_KEY)||'{}'));}catch{}
  if(!Number.isInteger(simState.stepIndex)||simState.stepIndex<0||simState.stepIndex>=SIM.steps.length)simState.stepIndex=0;
  if(!simState.completed||typeof simState.completed!=='object')simState.completed={};
  simState.maxUnlocked=Math.max(0,Math.min(Number(simState.maxUnlocked)||0,SIM.steps.length-1));

  body.classList.add('teacher-docked','teacher-focus-mode','offline-simulation');
  teacherPanel.hidden=false;
  $('#teacher-model-badge').textContent='Guion pregenerado';
  $('.teacher-eyebrow').textContent='PROFESOR · SIMULACIÓN OFFLINE';
  $('#teacher-status').textContent='Clase grabada · avance manual';
  $('#teacher-status').className='teacher-status ok';
  $('#teacher-form').hidden=true;

  // Configuration remains for typography; live AI controls are hidden in this edition.
  const cfgTitles=$$('.config-section-title','#ollama-panel');
  if(cfgTitles[0])cfgTitles[0].textContent='MODO DE CLASE';
  const url=$('#ollama-url'); if(url?.closest('label'))url.closest('label').hidden=true;
  $('.ai-connect-row','#ollama-panel')?.setAttribute('hidden','');
  if($('#ollama-model')?.closest('label'))$('#ollama-model').closest('label').hidden=true;
  if($('#ollama-temperature')?.closest('label'))$('#ollama-temperature').closest('label').hidden=true;
  const privacy=$('.ai-privacy','#ollama-panel'); if(privacy){privacy.innerHTML='<span class="offline-mode-badge">OFFLINE · SIN IA</span> Esta edición reproduce un guion docente pregenerado. No necesita Ollama ni conexión a red.';}

  // Remove old AI/runtime handlers from teacher controls by cloning the buttons.
  function freshButton(id,label){const old=$(id);if(!old)return null;const b=old.cloneNode(true);b.textContent=label;old.replaceWith(b);return b;}
  const prevBtn=freshButton('#teacher-start','Anterior');
  const repeatBtn=freshButton('#teacher-repeat','Repetir');
  const restartBtn=freshButton('#teacher-exercise','Reiniciar');
  const nextBtn=freshButton('#teacher-next','Siguiente');

  // Add deterministic progress and gate blocks.
  const tools=$('#teacher-tools');
  const progress=document.createElement('div');progress.id='offline-sim-progress';progress.innerHTML='<div class="sim-progress-row"><strong id="offline-step-label">Paso 1</strong><span id="offline-section-label">Introducción</span></div><div class="sim-progress-track"><i id="offline-progress-fill"></i></div>';
  tools.insertAdjacentElement('afterend',progress);
  const gate=document.createElement('div');gate.id='offline-sim-gate';gate.hidden=true;gate.innerHTML='<span id="offline-gate-text"></span>';
  progress.insertAdjacentElement('afterend',gate);
  const gateText=$('#offline-gate-text');

  // Mobile two-surface switch: Maestro <-> Lección.
  const mobileSwitch=document.createElement('div');mobileSwitch.id='mobile-sim-switch';mobileSwitch.innerHTML='<button type="button" data-pane="teacher">Maestro</button><button type="button" data-pane="lesson">Lección</button><span class="mobile-step" id="mobile-step-label">1/'+SIM.steps.length+'</span>';
  $('#ialp-toolbar').insertAdjacentElement('afterend',mobileSwitch);
  const returnTeacher=document.createElement('button');returnTeacher.id='mobile-return-teacher';returnTeacher.type='button';returnTeacher.textContent='← Volver al Maestro';$('main').appendChild(returnTeacher);
  function isMobile(){return window.matchMedia('(max-width:760px)').matches;}
  function setMobilePane(pane){pane=pane==='lesson'?'lesson':pane==='teacher'?'teacher':'home';simState.mobilePane=pane;body.classList.toggle('mobile-pane-teacher',pane==='teacher');body.classList.toggle('mobile-pane-lesson',pane==='lesson');$$('#mobile-sim-switch button').forEach(b=>b.classList.toggle('active',b.dataset.pane===pane));persist();if(window.IALPMobileFirst){window.IALPMobileFirst.setPane(pane);}else if(pane==='lesson')requestAnimationFrame(()=>focusCurrent({scroll:true}));}
  $$('#mobile-sim-switch button').forEach(b=>b.addEventListener('click',()=>setMobilePane(b.dataset.pane)));
  returnTeacher.addEventListener('click',()=>setMobilePane('teacher'));
  setMobilePane(isMobile()?simState.mobilePane:'teacher');

  function persist(){localStorage.setItem(OFFLINE_KEY,JSON.stringify(simState));}
  function focusNode(step){return document.querySelector(`[data-focus-id="${CSS.escape(step.focus_id)}"]`);}
  function currentStep(){return SIM.steps[simState.stepIndex];}
  function stepByFocus(fid){return SIM.steps.find(s=>s.focus_id===fid);}
  function focusCurrent({scroll=false,source=null}={}){
    const step=currentStep(), node=focusNode(step); if(!node)return;
    $$('.teacher-focus-target').forEach(n=>n.classList.remove('teacher-focus-target'));
    $$('.teacher-current-section').forEach(n=>n.classList.remove('teacher-current-section'));
    node.classList.add('teacher-focus-target');
    const sec=node.closest('.learning-section');sec?.classList.add('teacher-current-section');
    $('#teacher-current').textContent=step.section_title;
    $('#teacher-focus-label').textContent=step.focus_label;
    if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.mount(step,node);}else if(scroll){node.scrollIntoView({behavior:'smooth',block:'center'});}
    if(source&&!isMobile())drawArrow(source,node);else clearArrow();
  }
  function clearArrow(){const p=$('#teacher-focus-path');if(p)p.setAttribute('d','');}
  function drawArrow(source,target){const p=$('#teacher-focus-path'),svg=$('#teacher-focus-arrow');if(!p||!svg||!source||!target)return;setTimeout(()=>{const s=source.getBoundingClientRect(),t=target.getBoundingClientRect(),panel=teacherPanel.getBoundingClientRect();const x1=panel.right-3,y1=s.top+s.height/2,x2=Math.max(x1+35,t.left-10),y2=t.top+Math.min(t.height/2,48);const c1=x1+Math.max(45,(x2-x1)*.35),c2=x2-Math.max(30,(x2-x1)*.22);svg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);p.setAttribute('d',`M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`);},80);}

  function rich(parent,text){
    const re=/(\*\*[^*]+\*\*|`[^`]+`)/g;let last=0,m;
    while((m=re.exec(text))){if(m.index>last)parent.append(document.createTextNode(text.slice(last,m.index)));const tok=m[0];if(tok.startsWith('**')){const b=document.createElement('strong');b.textContent=tok.slice(2,-2);parent.append(b);}else{const c=document.createElement('code');c.textContent=tok.slice(1,-1);parent.append(c);}last=re.lastIndex;}
    if(last<text.length)parent.append(document.createTextNode(text.slice(last)));
  }
  function addMessage(role,text,step,{tools=true,meta=true}={}){
    const wrap=document.createElement('div');wrap.className='teacher-message '+role;wrap.dataset.simStep=String(step?.index||'');
    if(meta&&step){const m=document.createElement('div');m.className='offline-sim-message-meta';m.textContent=`PASO ${step.index} · ${step.section_title}`;wrap.append(m);}
    const p=document.createElement('p');rich(p,text);wrap.append(p);
    if(role==='assistant'&&tools&&step){const bar=document.createElement('div');bar.className='offline-sim-tools';const look=document.createElement('button');look.type='button';look.textContent='Mira aquí →';look.addEventListener('click',()=>{if(window.IALPMobileFirst&&isMobile()){window.IALPMobileFirst.setPane('lesson');}else if(isMobile()){setMobilePane('lesson');}focusCurrent({scroll:true,source:look});});bar.append(look);if(step.gate){const hint=document.createElement('button');hint.type='button';hint.textContent='Pista';hint.addEventListener('click',()=>addMessage('assistant',step.hint||'Relee la consigna y completa solo lo que puedas justificar.',step,{tools:false,meta:false}));bar.append(hint);}const n=document.createElement('button');n.type='button';n.className='sim-next-inline';n.textContent='Siguiente';n.addEventListener('click',advance);bar.append(n);wrap.append(bar);}
    messages.append(wrap);messages.scrollTop=messages.scrollHeight;return wrap;
  }
  function ensureMessageForStep(step,{repeat=false}={}){
    if(!repeat){const existing=messages.querySelector(`[data-sim-step="${step.index}"]`);if(existing){existing.scrollIntoView({block:'nearest'});return existing;}}
    return addMessage('assistant',step.message,step,{tools:true,meta:true});
  }

  function fieldByKey(key){return document.querySelector(`[data-store="${CSS.escape(key)}"]`);}
  function textReady(key,minChars){const f=fieldByKey(key);return !!f&&String(f.value||'').trim().length>=minChars;}
  function rawGateStatus(step){
    const g=step.gate;if(!g)return{ready:true,detail:'Listo'};
    const missing=[];
    if(g.selects){for(const x of g.selects){const f=fieldByKey(x.key);if(!f||!f.value)missing.push('selección pendiente');else if(x.correct&&f.value!==x.correct)missing.push('selección incorrecta');}}
    if(g.text_keys){for(const k of g.text_keys){const min=(g.reflection_keys||[]).includes(k)?(g.reflection_min_chars||g.min_chars||1):(g.min_chars||1);if(!textReady(k,min))missing.push('respuesta incompleta');}}
    if(g.check_keys){for(const k of g.check_keys){const f=fieldByKey(k);if(!f||!f.checked)missing.push('casilla pendiente');}}
    return{ready:missing.length===0,detail:missing.length?`${missing.length} requisito(s) pendientes`:'Actividad completa'};
  }
  function gatePassed(step){if(!step.gate)return true;if(step.gate.mode==='auto_correct'||step.gate.mode==='auto_checklist')return rawGateStatus(step).ready;return !!simState.completed[step.index];}
  function commitIfReady(step){if(!step.gate)return;const raw=rawGateStatus(step);if(raw.ready){simState.completed[step.index]=true;persist();}}
  function updateGate(){
    const step=currentStep();commitIfReady(step);const raw=rawGateStatus(step);const passed=gatePassed(step);
    gate.hidden=true;gate.classList.remove('ok');gateText.textContent=passed?'Punto obligatorio superado. Puedes continuar.':(step.gate?`${step.gate.description} ${raw.detail}.`:'');
    nextBtn.disabled=!passed;if(window.IALPMobileFirst)window.IALPMobileFirst.gate(step,{passed,text:gateText.textContent});
    $$('.sim-next-inline',messages).forEach(b=>{const msg=b.closest('[data-sim-step]');if(Number(msg?.dataset.simStep)===step.index)b.disabled=!passed;});
  }

  function markLocks(){
    const cur=simState.stepIndex;$$('[data-focus-id]').forEach(el=>{const st=stepByFocus(el.dataset.focusId);if(!st)return;const idx=st.index-1;el.classList.toggle('sim-future-locked',idx>simState.maxUnlocked);el.classList.toggle('sim-visited',idx<cur);});
    const nav=$('#interactive-nav');if(nav){nav.innerHTML='';const sections=[...new Map(SIM.steps.map(s=>[s.section_id,s.section_title])).entries()];for(const [sid,title] of sections){const first=SIM.steps.findIndex(s=>s.section_id===sid);const sectionSteps=SIM.steps.filter(s=>s.section_id===sid);const heading=document.createElement('div');heading.className='sim-nav-section';const headingButton=document.createElement('button');headingButton.type='button';headingButton.className='sim-nav-section-title';headingButton.textContent=title;const sectionLocked=first>simState.maxUnlocked;if(sectionLocked){headingButton.classList.add('sim-locked');headingButton.append(' 🔒');}headingButton.addEventListener('click',()=>{if(sectionLocked){toastOffline('Esta lección todavía está bloqueada. Continúa con el Maestro.');return;}$('#ialp-index').hidden=true;goTo(first,{narrate:true,allowBackward:true});});heading.append(headingButton);const list=document.createElement('div');list.className='sim-nav-steps';for(const step of sectionSteps){const index=step.index-1;const locked=index>simState.maxUnlocked;const item=document.createElement('button');item.type='button';item.className='sim-nav-step';item.textContent=`${step.index}. ${step.focus_label||step.kind||'Ejercicio'}`;if(index===simState.stepIndex)item.classList.add('sim-nav-current');if(index<simState.stepIndex)item.classList.add('sim-nav-visited');if(locked){item.classList.add('sim-locked');item.append(' 🔒');}item.addEventListener('click',()=>{if(locked){toastOffline('Este ejercicio todavía está bloqueado. Continúa con el Maestro.');return;}$('#ialp-index').hidden=true;goTo(index,{narrate:true,allowBackward:true});});list.append(item);}heading.append(list);nav.append(heading);}}}
  }
  function toastOffline(text){const t=$('#toast');if(!t)return;t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}

  function updateProgress(){const step=currentStep(),pct=Math.round(step.index/SIM.steps.length*100);$('#offline-step-label').textContent=`Paso ${step.index} de ${SIM.steps.length}`;$('#offline-section-label').textContent=step.section_title;$('#offline-progress-fill').style.width=pct+'%';$('#mobile-step-label').textContent=`${step.index}/${SIM.steps.length}`;prevBtn.disabled=simState.stepIndex===0;if(window.IALPMobileFirst)window.IALPMobileFirst.progress(step,pct);}
  function goTo(index,{narrate=true,allowBackward=false}={}){
    index=Math.max(0,Math.min(SIM.steps.length-1,index));
    if(index>simState.maxUnlocked&&!allowBackward){toastOffline('Ese paso aún está bloqueado.');return false;}
    simState.stepIndex=index;persist();focusCurrent({scroll:!isMobile()});markLocks();updateProgress();updateGate();if(narrate)ensureMessageForStep(currentStep());if(isMobile())setMobilePane('teacher');return true;
  }
  function advance(){
    const step=currentStep();updateGate();if(!gatePassed(step)){addMessage('assistant','Este punto es obligatorio y todavía no está superado. **Mira aquí**: termina la actividad y regístrala antes de continuar.',step,{tools:false,meta:false});if(isMobile())setMobilePane('lesson');focusCurrent({scroll:true});return;}
    if(simState.stepIndex>=SIM.steps.length-1){addMessage('assistant','Has completado la Clase 00. El recorrido ha terminado y todos los puntos obligatorios que encontraste han quedado registrados.',step,{tools:false,meta:false});return;}
    const next=simState.stepIndex+1;simState.maxUnlocked=Math.max(simState.maxUnlocked,next);simState.stepIndex=next;persist();markLocks();updateProgress();updateGate();focusCurrent({scroll:!isMobile()});ensureMessageForStep(currentStep());if(isMobile())setMobilePane('teacher');
  }
  function previous(){if(simState.stepIndex<=0)return;goTo(simState.stepIndex-1,{narrate:true,allowBackward:true});}
  prevBtn.addEventListener('click',previous);
  repeatBtn.addEventListener('click',()=>ensureMessageForStep(currentStep(),{repeat:true}));
  restartBtn.addEventListener('click',()=>{if(!confirm('¿Reiniciar la simulación de la clase desde el principio? Se conservarán tus respuestas, pero se reiniciará el recorrido del profesor.'))return;simState.stepIndex=0;simState.maxUnlocked=0;simState.completed={};messages.innerHTML='';persist();goTo(0,{narrate:true,allowBackward:true});});
  nextBtn.addEventListener('click',advance);window.IALPOfflineControls={advance,previous,goTo,currentStep,gatePassed};

  // Insert pre-generated lab material and prefill the observation matrix where appropriate.
  for(const step of SIM.steps){if(!step.simulated_lab)continue;const node=focusNode(step);if(!node||node.querySelector('.offline-lab-simulation'))continue;const lab=step.simulated_lab;const box=document.createElement('div');box.className='offline-lab-simulation';const cards=lab.responses.map(r=>`<div class="simlab-card"><b>${escapeHtml(r.name)}</b><p>${escapeHtml(r.text)}</p><dl><dt>Lectura</dt><dd>${escapeHtml(r.reading)}</dd><dt>Evidencia</dt><dd>${escapeHtml(r.evidence)}</dd><dt>Suposición</dt><dd>${escapeHtml(r.assumption)}</dd></dl></div>`).join('');box.innerHTML=`<div class="simlab-head"><div class="simlab-title">${escapeHtml(lab.title)}</div><span class="offline-mode-badge">PREGENERADO</span></div><div class="simlab-note">${escapeHtml(lab.note)}</div><div class="simlab-grid">${cards}</div>`;node.insertBefore(box,node.firstChild);if(lab.prefill){for(const [k,v] of Object.entries(lab.prefill)){const f=fieldByKey(k);if(f&&!f.value){f.value=v;f.readOnly=true;f.dispatchEvent(new Event('input',{bubbles:true}));}}}}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  // Retarget old live-AI exercise buttons to deterministic hints/review.
  $$('.ai-hint,.ai-review').forEach(old=>{const b=old.cloneNode(true);old.replaceWith(b);const node=b.closest('[data-focus-id]')||b.closest('.teacher-focusable');const step=node?stepByFocus(node.dataset.focusId):null;if(b.classList.contains('ai-hint')){b.textContent='Pista pregenerada';b.addEventListener('click',()=>{const st=step||currentStep();addMessage('assistant',st.hint||'Relee la consigna y separa lo explícito de lo inferido.',st,{tools:false,meta:false});});}else{b.textContent='Comprobar punto';b.addEventListener('click',()=>{const st=step||currentStep();if(st.index-1!==simState.stepIndex){toastOffline('Este ejercicio no es el punto activo del recorrido.');return;}const raw=rawGateStatus(st);if(!raw.ready){addMessage('assistant',`Todavía no puedo registrar este punto: ${raw.detail}.`,st,{tools:false,meta:false});focusCurrent({scroll:true});return;}if(st.gate?.mode==='manual'){simState.completed[st.index]=true;persist();}updateGate();addMessage('assistant','La actividad cumple los requisitos estructurales de esta versión offline. Punto **superado**.',st,{tools:false,meta:false});});}});

  // Any answer change immediately refreshes gate state but never advances automatically.
  document.addEventListener('input',e=>{if(e.target.matches('[data-store]'))setTimeout(updateGate,0);});
  document.addEventListener('change',e=>{if(e.target.matches('[data-store]'))setTimeout(updateGate,0);});

  // Start from the dedicated simulation state, not from old v1.6 currentFocus.
  simState.maxUnlocked=Math.max(simState.maxUnlocked,simState.stepIndex);
  markLocks();updateProgress();updateGate();focusCurrent({scroll:false});ensureMessageForStep(currentStep());
  if(isMobile())setMobilePane(simState.mobilePane||'home');
  window.addEventListener('resize',()=>{if(!isMobile()){body.classList.remove('mobile-pane-teacher','mobile-pane-lesson');}else if(!body.classList.contains('mobile-pane-teacher')&&!body.classList.contains('mobile-pane-lesson'))setMobilePane(simState.mobilePane||'teacher');});
})();
