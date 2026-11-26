import {store} from '../core/store.js';
import {listGens,getGen} from '../core/registry.js';
import {genSummary,moduleSummary} from '../core/stats.js';
import {SECTIONS} from '../cours/index.js';
import {esc} from '../core/ui.js';
const modules=[['psycho','Psycho'],['maths','Maths'],['physique','Physique'],['anglais','Anglais'],['culture','Culture']];
const save=fn=>store.update(s=>fn(s.academy||={}));
export function radarHTML(scores){
 const p=(i,r)=>[150+80*r*Math.sin(i*2*Math.PI/scores.length),115-80*r*Math.cos(i*2*Math.PI/scores.length)];
 const poly=r=>scores.map((s,i)=>p(i,r).join(',')).join(' ');
 return '<svg viewBox="0 0 300 235" role="img" aria-label="Radar des résultats" style="width:100%;max-width:480px;display:block;margin:auto">'+[.25,.5,.75,1].map(r=>'<polygon points="'+poly(r)+'" fill="none" stroke="currentColor" opacity=".2"/>').join('')+scores.map((s,i)=>{const [x,y]=p(i,1.3),[a,b]=p(i,1);return '<line x1="150" y1="115" x2="'+a+'" y2="'+b+'" stroke="currentColor" opacity=".2"/><text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="10" fill="currentColor">'+esc(s.label)+'</text>';}).join('')+(scores.every(s=>s.n>=20)?'<polygon points="'+scores.map((s,i)=>p(i,s.rate).join(',')).join(' ')+'" fill="#527fae" fill-opacity=".25" stroke="#527fae" stroke-width="2"/>':'')+scores.map((s,i)=>{if(s.n<20)return '';const [x,y]=p(i,s.rate);return '<circle cx="'+x+'" cy="'+y+'" r="4" fill="#527fae"/>';}).join('')+'</svg>';
}
export function renderTree(root){
 const scores=modules.map(([id,label])=>({id,label,...moduleSummary(id,30)}));
 root.innerHTML='<h1>Carte des compétences</h1><div class="card">'+radarHTML(scores)+'<p class="small muted">Points affichés dès 20 réponses par matière. Le polygone apparaît lorsque toutes les matières sont évaluées.</p></div>'+modules.map(([id,label])=>'<section class="card"><h2>'+label+'</h2><div class="skill-tree">'+listGens(id).map(g=>{const s=genSummary(g.id,30),stage=s.n<20?0:s.rate>=.9?3:s.rate>=.75?2:1;return '<a class="skill-node stage-'+stage+'" href="#/train/'+esc(g.id)+'"><b>'+esc(g.title)+'</b><small>'+['À évaluer','Fondations','Consolidation','Performance'][stage]+' · '+s.n+' réponses</small></a>';}).join('')+'</div></section>').join('');
}
export function buildCards(){
 const out=[];
 for(const s of SECTIONS)for(const f of s.fiches){
  const doc=new DOMParser().parseFromString(f.html,'text/html');
  for(const [i,li] of [...doc.querySelectorAll('li,p')].entries()){
   const term=li.querySelector('b,strong');if(!term)continue;
   const word=term.textContent.trim(),answer=li.textContent.trim();
   if(word.length<3||word.length>70||answer.length<word.length+15||answer.length>420)continue;
   out.push({id:s.id+'/'+f.id+'/'+i,section:s.id,title:f.title,front:word,back:answer});
  }
 }
 return out;
}
export function renderCards(root){
 const cards=buildCards();let section='all',queue=[],i=0,reveal=false;
 function reset(){queue=cards.filter(c=>(section==='all'||c.section===section)&&((store.data.academy?.individual?.[c.id]?.due||0)<=Date.now()));i=0;reveal=false;draw();}
 function draw(){const c=queue[i];root.innerHTML='<h1>Flashcards de cours</h1><p class="muted">Cartes extraites des passages en gras des fiches. Autoévaluation, sans validation automatique.</p><select aria-label="Matière">'+[['all','Toutes les matières'],...SECTIONS.map(s=>[s.id,s.title])].map(([id,t])=>'<option value="'+esc(id)+'">'+esc(t)+'</option>').join('')+'</select><p>'+Math.max(0,queue.length-i)+' cartes disponibles</p>'+(c?'<div class="card flash-study"><small>'+esc(c.title)+'</small><h2>'+esc(c.front)+'</h2>'+(reveal?'<p>'+esc(c.back)+'</p><button class="btn" data-rate="0">À revoir</button> <button class="btn primary" data-rate="1">Assimilé</button>':'<button class="btn primary" data-reveal>Révéler</button>')+'</div>':'<div class="card">Aucune carte due dans cette matière.</div>');const sel=root.querySelector('select');sel.value=section;sel.onchange=()=>{section=sel.value;reset();};root.querySelector('[data-reveal]')?.addEventListener('click',()=>{reveal=true;draw();});root.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{save(a=>{const all=a.individual||={},old=all[c.id],step=b.dataset.rate==='1'?Math.min(3,(old?.step??-1)+1):0;all[c.id]={step,due:Date.now()+[1,3,7,30][step]*86400000};});i++;reveal=false;draw();});}
 reset();
}
export function approachError(distance,lateral,altitude){const feet=distance*6076.12;return {loc:Math.atan2(lateral,feet)*180/Math.PI,gs:Math.atan2(altitude,feet)*180/Math.PI-3};}
export function renderApproach(root){
 let d=6,x=350,h=2100,heading=0,vs=-600,timer=null;
 root.innerHTML='<h1>Laboratoire approche</h1><p class="muted">Modèle pédagogique simplifié : axe de piste, pente 3°, vitesse sol 120 kt. Pas un simulateur certifié.</p><div class="card"><svg viewBox="0 0 240 240" style="width:100%;max-width:340px;display:block;margin:auto"><circle cx="120" cy="120" r="100" fill="#192c43"/><g stroke="#dce2e9" fill="none">'+[40,80,120,160,200].map(v=>'<circle cx="'+v+'" cy="120" r="3"/><circle cx="120" cy="'+v+'" r="3"/>').join('')+'</g><path data-loc stroke="#f4ce77" stroke-width="4"/><path data-gs stroke="#f4ce77" stroke-width="4"/><circle cx="120" cy="120" r="6" fill="white"/></svg><p data-state></p><label>Écart de cap (°)<input type="range" min="-25" max="25" value="0" data-heading></label><label>Vitesse verticale (ft/min)<input type="range" min="-1200" max="300" step="50" value="-600" data-vs></label><button class="btn primary" data-start>Démarrer</button> <button class="btn" data-reset>Réinitialiser</button></div>';
 const q=s=>root.querySelector(s);
 function paint(){const e=approachError(d,x,h),a=120-Math.max(-80,Math.min(80,e.loc*32)),b=120+Math.max(-80,Math.min(80,e.gs*100));q('[data-loc]').setAttribute('d','M'+a+' 30V210');q('[data-gs]').setAttribute('d','M30 '+b+'H210');q('[data-state]').textContent=d.toFixed(2)+' NM · '+Math.round(h)+' ft au-dessus du seuil · cap relatif '+heading+'° · '+vs+' ft/min';}
 function stop(){clearInterval(timer);timer=null;q('[data-start]').textContent='Démarrer';}
 q('[data-heading]').oninput=e=>{heading=Number(e.target.value);paint();};q('[data-vs]').oninput=e=>{vs=Number(e.target.value);paint();};
 q('[data-start]').onclick=()=>{if(timer)return stop();if(d<=.2||h<=0)return;q('[data-start]').textContent='Pause';timer=setInterval(()=>{const a=heading*Math.PI/180;d-=120*Math.cos(a)/3600;x+=120*6076.12*Math.sin(a)/3600;h+=vs/60;paint();if(d<=.2||h<=0){stop();q('[data-state]').textContent+=' · Fin de l’exercice';}},1000);};
 q('[data-reset]').onclick=()=>{stop();d=6;x=350;h=2100;heading=0;vs=-600;q('[data-heading]').value=0;q('[data-vs]').value=-600;paint();};paint();return()=>clearInterval(timer);
}
