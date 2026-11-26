import {store,today} from '../core/store.js';
import {moduleSummary,weakPoints,genSummary} from '../core/stats.js';
import {listGens} from '../core/registry.js';
import {SECTIONS} from '../cours/index.js';
import {esc} from '../core/ui.js';
const mods=[['psycho','Psychotechniques'],['maths','Mathématiques'],['physique','Physique'],['anglais','Anglais'],['culture','Culture aéronautique']];
const fiches=SECTIONS.flatMap(s=>s.fiches.map(f=>({...f,section:s.id,sectionTitle:s.title})));
const data=()=>store.data.academy||{};
const update=fn=>store.update(s=>fn(s.academy||={}));
const day=()=>today();
const link=(href,label)=>'<a class="btn" href="'+href+'">'+esc(label)+'</a>';
export function missionPlan(scores,minutes=300){
 const weak=[...scores].sort((a,b)=>(a.rate??.5)-(b.rate??.5))[0]?.id||'psycho';
 const blocks=[['psycho','Psychotechniques',60],['etude','Étude guidée',60],['maths','Mathématiques',40],['physique','Physique',35],['anglais','Anglais',40],['culture','Culture aéronautique',25],[weak,'Renforcement ciblé',25],['cartes','Révisions espacées',15]];
 let left=minutes;return blocks.map(([id,label,m],i)=>{const min=i===blocks.length-1?left:Math.floor(m*minutes/300);left-=min;return {id,label,min};}).filter(b=>b.min>0);
}
export function renderAcademy(root){
 const scores=mods.map(([id,label])=>({id,label,...moduleSummary(id,30)}));
 const missionDay=day();
 if(!data().missions?.[missionDay])update(a=>{(a.missions||={})[missionDay]={blocks:missionPlan(scores,data().targetMinutes||300),done:{}};});
 const mission=data().missions[missionDay],done=mission.blocks.reduce((n,b,i)=>n+(mission.done[i]?b.min:0),0),total=mission.blocks.reduce((n,b)=>n+b.min,0);
 root.innerHTML='<span class="academy-kicker">Flight Academy Pro</span><h1>Mission du jour</h1><div class="card"><h2>'+done+' / '+total+' minutes</h2><div class="progress"><div style="width:'+done/total*100+'%"></div></div><p class="muted">Temps déclaré manuellement. Prévois des pauses en plus du temps de travail.</p>'+mission.blocks.map((b,i)=>'<div class="row-link"><input type="checkbox" aria-label="Terminer '+esc(b.label)+'" data-done="'+i+'" '+(mission.done[i]?'checked':'')+'><span class="grow"><b>'+esc(b.label)+'</b><br>'+b.min+' min</span>'+link('#/'+b.id,'Ouvrir')+'</div>').join('')+'</div><div class="grid">'+[['parcours','Parcours intelligent'],['flightlab','Flight Simulator Lab'],['pilotcenter','Pilot Training Center'],['pedagogie','Centre pédagogique'],['arbre','Carte des compétences'],['cartes','Flashcards individuelles'],['approche','Laboratoire approche'],['focus','Concentration'],['competences','Profil de compétences'],['carnet','Cahier personnel'],['memoire','Flashcards & rappels'],['favoris','Favoris'],['stats','Performances'],['erreurs','Carnet d’erreurs'],['exam/personnaliser','Examen personnalisé'],['laboratoire','Laboratoire instruments'],['coach','Coach'],['reglages','Sauvegarde / transfert']].map(([id,label])=>'<a class="tile" href="#/'+id+'"><b>'+label+'</b></a>').join('')+'</div>';
 root.querySelectorAll('[data-done]').forEach(b=>b.onchange=()=>{update(a=>a.missions[missionDay].done[b.dataset.done]=b.checked);renderAcademy(root);});
}
export function renderFocus(root){
 let end=0,remaining=25*60000,interval,phase='Travail';
 root.innerHTML='<h1>Concentration</h1><div class="card center"><label>Durée de travail<select data-duration><option>25</option><option>45</option><option>60</option><option>90</option></select></label><p data-phase>Travail</p><h1 class="focus-clock" data-clock>25:00</h1><button class="btn primary" data-toggle>Démarrer</button> <button class="btn" data-reset>Réinitialiser</button><p class="muted">Pause de 5 minutes après chaque bloc. Garde cette page ouverte.</p></div>';
 const clock=root.querySelector('[data-clock]'),toggle=root.querySelector('[data-toggle]'),select=root.querySelector('select');
 function paint(){let sec=Math.ceil(remaining/1000);clock.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}
 function tick(){if(!end)return;remaining=Math.max(0,end-Date.now());paint();if(!remaining){end=0;phase=phase==='Travail'?'Pause':'Travail';remaining=(phase==='Pause'?5:Number(select.value))*60000;root.querySelector('[data-phase]').textContent=phase;toggle.textContent='Démarrer';paint();}}
 select.onchange=()=>{if(!end&&phase==='Travail'){remaining=Number(select.value)*60000;paint();}};
 toggle.onclick=()=>{if(end){remaining=Math.max(0,end-Date.now());end=0;toggle.textContent='Reprendre';}else{end=Date.now()+remaining;toggle.textContent='Pause';}};
 root.querySelector('[data-reset]').onclick=()=>{end=0;phase='Travail';remaining=Number(select.value)*60000;root.querySelector('[data-phase]').textContent=phase;toggle.textContent='Démarrer';paint();};
 interval=setInterval(tick,250);return()=>clearInterval(interval);
}
export function renderSkills(root){
 const scores=mods.map(([id,label])=>({id,label,...moduleSummary(id,30)}));
 const groups=listGens('psycho').reduce((a,g)=>{(a[g.group||'Autres']||=[]).push(g);return a;},{});
 const bar=(label,n,ok)=>'<div class="card"><b>'+esc(label)+'</b><p>'+(!n?'Non évalué':Math.round(ok/n*100)+' % · '+n+' réponses')+'</p><div class="progress"><div style="width:'+(n?ok/n*100:0)+'%"></div></div><p class="small muted">'+(n<20?'Échantillon insuffisant':ok/n>=.9?'Performance élevée':ok/n>=.75?'Consolidation':ok/n>=.6?'Intermédiaire':'Fondations')+'</p></div>';
 root.innerHTML='<h1>Profil de compétences</h1><p class="muted">Résultats sur 30 jours, indicateurs internes non prédictifs de la sélection.</p><div class="grid">'+scores.map(s=>bar(s.label,s.n,s.ok)).join('')+'</div><h2>Psychotechniques par famille</h2><div class="grid">'+Object.entries(groups).map(([label,gs])=>{let n=0,ok=0;gs.forEach(g=>{let s=genSummary(g.id,30);n+=s.n;ok+=s.ok;});return bar(label,n,ok);}).join('')+'</div><h2>Priorités</h2>'+weakPoints(5).map(w=>link('#/train/'+w.id,w.title)).join(' ');
}
export function renderNotebook(root){
 root.innerHTML='<h1>Cahier personnel</h1><label>Fiche<select data-fiche>'+fiches.map((f,i)=>'<option value="'+i+'">'+esc(f.sectionTitle+' · '+f.title)+'</option>').join('')+'</select></label><div class="card"><textarea rows="8" placeholder="Notes et méthodes" aria-label="Notes"></textarea><canvas class="academy-canvas" width="900" height="500" aria-label="Brouillon manuscrit"></canvas><button class="btn" data-clear>Effacer le dessin</button> <button class="btn primary" data-save>Enregistrer</button><p data-status role="status"></p></div>';
 const select=root.querySelector('select'),notes=root.querySelector('textarea'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');let strokes=[],active=null;
 function redraw(){ctx.clearRect(0,0,900,500);ctx.strokeStyle='#24354c';ctx.lineWidth=3;ctx.lineCap='round';for(const line of strokes){if(!line.length)continue;ctx.beginPath();ctx.moveTo(line[0][0],line[0][1]);for(const p of line)ctx.lineTo(p[0],p[1]);if(line.length===1)ctx.lineTo(line[0][0]+.1,line[0][1]);ctx.stroke();}}
 function load(){const n=data().notes?.[fiches[Number(select.value)].key]||{};notes.value=n.text||'';strokes=JSON.parse(JSON.stringify(n.strokes||[]));active=null;redraw();}
 function save(){update(a=>{(a.notes||={})[fiches[Number(select.value)].key]={text:notes.value,strokes};});root.querySelector('[data-status]').textContent='Enregistré sur cet appareil';}
 const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*900/r.width,(e.clientY-r.top)*500/r.height];};
 canvas.onpointerdown=e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);active=[point(e)];strokes.push(active);redraw();};
 canvas.onpointermove=e=>{if(active){active.push(point(e));redraw();}};
 canvas.onpointerup=canvas.onpointercancel=()=>{active=null;save();};
 let current=select.value; select.onchange=()=>{const next=select.value;select.value=current;save();select.value=next;current=next;load();}; notes.oninput=save;root.querySelector('[data-save]').onclick=save;root.querySelector('[data-clear]').onclick=()=>{strokes=[];redraw();save();};load();
}
export function renderMemory(root){
 const cards=fiches.filter(f=>!data().recall?.[f.key]||data().recall[f.key].due<=Date.now());let i=0,reveal=false;
 function draw(){const f=cards[i];root.innerHTML='<h1>Rappel actif</h1><p>'+Math.max(0,cards.length-i)+' fiches à revoir · autoévaluation</p>'+(!f?'<div class="card">Tout est à jour.</div>':'<div class="card"><h2>'+esc(f.title)+'</h2><p>Explique les notions et méthodes sans regarder le cours.</p>'+(reveal?'<article class="course">'+f.html+'</article><div class="btn-row"><button class="btn" data-rate="0">Oublié</button><button class="btn" data-rate="1">Assimilé</button></div>':'<button class="btn primary block" data-reveal>Afficher le cours</button>')+'</div>')+link('#/flashcards','Flashcards anglais');
 if(!f)return;root.querySelector('[data-reveal]')?.addEventListener('click',()=>{reveal=true;draw();});root.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{update(a=>{const r=(a.recall||={})[f.key]||{step:0};const step=b.dataset.rate==='1'?Math.min(4,r.step+1):0;a.recall[f.key]={step,due:Date.now()+[1,1,3,7,30][step]*86400000};});i++;reveal=false;draw();});}
 draw();
}
export function renderFavorites(root){const fav=data().favorites||{};root.innerHTML='<h1>Favoris</h1><div class="list">'+fiches.filter(f=>fav[f.key]).map(f=>'<a class="row-link" href="#/fiche/'+esc(f.section)+'/'+esc(f.id)+'">'+esc(f.title)+'</a>').join('')+'</div>';if(!Object.values(fav).some(Boolean))root.innerHTML+='<p>Aucune fiche enregistrée.</p>';}
export function sheetActions(page,f){const bar=document.createElement('div');bar.className='btn-row';bar.innerHTML='<button class="btn" data-fav></button><button class="btn" data-audio>Écouter</button><button class="btn" data-print>Imprimer / PDF</button>';page.querySelector('article').before(bar);const b=bar.querySelector('[data-fav]');const paint=()=>b.textContent=data().favorites?.[f.key]?'Retirer des favoris':'Ajouter aux favoris';paint();b.onclick=()=>{update(a=>{const fav=a.favorites||={};fav[f.key]=!fav[f.key];});paint();};bar.querySelector('[data-audio]').onclick=()=>{if(!('speechSynthesis' in window))return alert('Lecture audio indisponible');if(speechSynthesis.speaking){speechSynthesis.cancel();return;}const el=document.createElement('div');el.innerHTML=f.html;const u=new SpeechSynthesisUtterance(el.textContent);u.lang='fr-FR';speechSynthesis.speak(u);};bar.querySelector('[data-print]').onclick=()=>window.print();}
