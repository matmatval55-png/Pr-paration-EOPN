import {studyCatalog} from './study.js';
import {store} from '../core/store.js';
import {getGen} from '../core/registry.js';
import {makePicker} from '../core/seen.js';
import {runQuiz,summaryHTML} from '../core/quiz.js';
import {enhanceSheet} from '../core/sheet.js';
import {esc} from '../core/ui.js';
export function nextReview(previous,ok,n,now=Date.now()){
 const passed=n===10&&ok>=8;
 const stage=passed?Math.min(5,(previous?.stage||0)+1):0;
 return {stage,passed,ok,n,due:now+[1,1,3,7,14,30][stage]*86400000};
}
export function renderPathway(root){
 const catalog=studyCatalog(),data=()=>store.data.academy?.pathways||{};
 const save=(key,patch)=>store.update(s=>{const all=((s.academy||={}).pathways||={});all[key]={...all[key],...patch};});
 function home(){
 const ordered=[...catalog].sort((a,b)=>{const rank=x=>{const p=data()[x.f.key];return p?.due<=Date.now()?0:p?.step&&!p?.due?1:!p?2:3;};return rank(a)-rank(b);});
 root.innerHTML='<h1>Parcours intelligent</h1><p>Découvrir, restituer, pratiquer, valider et revoir à distance. Les rappels arrivés à échéance passent en premier.</p><div class="card">'+ordered.map((x,i)=>{const p=data()[x.f.key];return '<button class="row-link block" data-course="'+i+'"><span class="grow">'+esc(x.f.title)+'<br><small>'+(!p?'À découvrir':p.due? (p.due<=Date.now()?'À revoir maintenant':'Prochain rappel : '+new Date(p.due).toLocaleDateString('fr-FR')):'Parcours en cours')+'</small></span> →</button>';}).join('')+'</div>';
 root.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>lesson(ordered[Number(b.dataset.course)]));
 }
 function lesson(x){
 const key=x.f.key,p=data()[key]||{},step=p.step||0;
 root.innerHTML='<button class="btn" data-back>← Parcours</button><h1>'+esc(x.f.title)+'</h1><div class="card"><p>Étape '+(step+1)+' / 5</p><div class="progress"><div style="width:'+((step+1)*20)+'%"></div></div></div>';
 root.querySelector('[data-back]').onclick=home;
 const box=document.createElement('div');root.append(box);
 const advance=n=>{save(key,{step:n});lesson(x);};
 if(step===0){box.innerHTML='<article class="card course fiche">'+x.f.html+'</article><button class="btn primary block" data-next>Passer à la restitution</button>';enhanceSheet(box.querySelector('article'),{recall:false});box.querySelector('[data-next]').onclick=()=>advance(1);}
 if(step===1){box.innerHTML='<div class="card"><h2>Restitution active</h2><p>Explique les notions, les formules et les exemples sans regarder le cours.</p><textarea rows="6" aria-label="Restitution"></textarea><details><summary>Comparer avec le cours</summary>'+x.f.html+'</details></div><button class="btn primary block" data-next>Pratiquer</button>';const t=box.querySelector('textarea');t.value=p.note||'';t.oninput=()=>save(key,{note:t.value});box.querySelector('[data-next]').onclick=()=>advance(2);}
 if(step===2||step===3){const practice=step===2;box.innerHTML='<div class="card"><h2>'+(practice?'Entraînement corrigé':'Validation sans correction immédiate')+'</h2><p>'+(practice?'5 questions avec explications après chaque réponse.':'10 questions, objectif 8 bonnes réponses sur 10.')+'</p><button class="btn primary block" data-start>Commencer</button></div>';box.querySelector('[data-start]').onclick=()=>quiz(x,practice);}
 if(step===4){box.innerHTML='<div class="card"><h2>'+ (p.passed?'Validation réussie':'À consolider')+'</h2><p>'+p.ok+'/'+p.n+' · prochain rappel le '+new Date(p.due).toLocaleDateString('fr-FR')+'</p><button class="btn primary block" data-next>'+(p.passed?'Repasser le test':'Reprendre le cours')+'</button></div>';box.querySelector('[data-next]').onclick=()=>advance(p.passed?3:0);}
 }
 function quiz(x,practice){
 const g=getGen(x.id),pick=makePicker(null,{excludeSeen:false}),specs=[],n=practice?5:10;
 for(let i=0;i<100&&specs.length<n;i++){const q=pick(x.id,g.bank?0:Math.min(practice?1:2,g.levels||1));if(q&&!specs.some(s=>s.seed===q.seed&&s.level===q.level))specs.push(q);}
 if(specs.length<n)return alert('Pas assez de questions distinctes pour cette étape.');
 document.body.classList.add('in-quiz');
 runQuiz(root,{title:x.f.title,mode:practice?'train':'exam',total:n,noTimer:true,next:i=>specs[i]||null,onQuit(){document.body.classList.remove('in-quiz');lesson(x);},onFinish(h,meta){document.body.classList.remove('in-quiz');const ok=h.filter(q=>q.ok).length,complete=h.length===n&&!meta?.quit&&!meta?.generationFailed;if(complete){if(practice)save(x.f.key,{step:ok>=3?3:0});else save(x.f.key,{...nextReview(data()[x.f.key],ok,n),step:4});}root.innerHTML=summaryHTML(h)+'<div class="card"><p>'+(!complete?'Séance incomplète : étape non validée.':practice?(ok>=3?'Passe à la validation.':'Relis le cours et compare tes erreurs.'):(ok>=8?'Rappel programmé.':'Reprends le cours avant une nouvelle validation.'))+'</p><button class="btn primary block" data-return>Continuer</button></div>';root.querySelector('[data-return]').onclick=()=>lesson(x);}});
 }
 home();
}
