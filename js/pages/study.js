import { enhanceSheet } from '../core/sheet.js';
// Guided study: read, recall without notes, then evaluate with linked exercises.
import { SECTIONS } from '../cours/index.js';
import { getGen } from '../core/registry.js';
import { makePicker } from '../core/seen.js';
import { runQuiz, summaryHTML, fmtClock } from '../core/quiz.js';
import { store } from '../core/store.js';
import { esc } from '../core/ui.js';

export function studyCatalog(sections = SECTIONS, lookup = getGen) {
  return sections.flatMap(s => s.fiches.map(f => {
    const id = lookup(f.key) ? f.key : f.train?.match(/^#\/train\/(.+)$/)?.[1];
    return { s, f, id };
  })).filter(x => x.id && lookup(x.id) && x.s.id !== 'entretien');
}
export function studyPlan(catalog, minutes, section, progress = {}) {
  const pool = catalog.filter(x => section === 'all' || x.s.id === section);
  return pool.sort((a,b) => (progress[a.f.key]?.studyAt || 0) - (progress[b.f.key]?.studyAt || 0))
    .slice(0, Math.max(1, Math.floor(minutes / 8)));
}
export function renderStudy(root) {
  const catalog = studyCatalog();
  let timer, disposed = false, minutes = 30, section = 'all';
  const clear = () => clearInterval(timer);
  function setup() {
    clear();
    root.innerHTML = '<h1>Étude guidée</h1><p class="muted">Lis les cours sélectionnés, restitue de mémoire, puis passe le test lié aux fiches. La durée choisie couvre les deux phases.</p><div class="card"><label>Durée totale</label><select data-min>' + [15,30,45,60,90,120].map(m=>'<option value="'+m+'" '+(m===minutes?'selected':'')+'>'+m+' min</option>').join('')+'</select><label>Matière</label><select data-sec><option value="all">Toutes les matières disponibles</option>'+SECTIONS.filter(s=>catalog.some(x=>x.s.id===s.id)).map(s=>'<option value="'+esc(s.id)+'">'+esc(s.title)+'</option>').join('')+'</select><p class="small muted">Les fiches sans exercice associé ne sont pas incluses. Environ 60 % du temps pour les cours, 40 % pour le test.</p><button class="btn primary block" data-start>Commencer</button></div>';
    root.querySelector('[data-sec]').value=section;
    root.querySelector('[data-start]').onclick=()=>{
      minutes=Number(root.querySelector('[data-min]').value); section=root.querySelector('[data-sec]').value; start();
    };
  }
  function start() {
    const plan=studyPlan(catalog,minutes,section,store.data.progress);
    if(!plan.length) return;
    const begin=Date.now(), end=begin+minutes*60000, studyEnd=begin+minutes*36000;
    let i=0, recall=false, completed=[], testing=false;
    const fresh=makePicker(), repeat=makePicker(null,{excludeSeen:false});
    function test() {
      if(testing||disposed)return; testing=true; clear();
      const specs=[], owners=[], reviews=[];
      for(let round=0;round<Math.max(3,Math.floor(minutes/plan.length/2));round++){
        for(const x of completed){
          const g=getGen(x.id), level=g.bank?0:Math.min(2,g.levels||1);
          let spec=fresh(x.id,level), review=false;
          if(!spec){spec=repeat(x.id,level);review=true;}
          if(spec&&!specs.some(s=>s.gen===spec.gen&&s.level===spec.level&&s.seed===spec.seed)){specs.push(spec);owners.push(x);reviews.push(review);}
        }
      }
      function result(history,meta={}) {
        document.body.classList.remove('in-quiz');
        const rows=completed.map(x=>{
          const indices=owners.map((o,j)=>o===x?j:-1).filter(j=>j>=0);
          const n=indices.length, ok=indices.filter(j=>history[j]?.ok).length;
          return '<div class="row-link"><span class="grow">'+esc(x.f.title)+'</span><b>'+(n?ok+'/'+n:'Non évalué')+'</b></div>';
        }).join('');
        root.innerHTML='<h1>Bilan étude guidée</h1><div class="card"><p>'+completed.length+' fiche(s) travaillée(s) · '+history.filter(h=>h.ok).length+'/'+specs.length+' réponses correctes prévues</p><p class="small muted">Les questions non traitées ne sont pas validées. Un résultat immédiat ne garantit pas une mémorisation durable.</p>'+rows+'</div>'+(history.length?summaryHTML(history):'')+'<button class="btn primary block" data-again>Nouvelle séance</button>';
        root.querySelector('[data-again]').onclick=setup;
      }
      if(!specs.length||Date.now()>=end)return result([]);
      document.body.classList.add('in-quiz');
      runQuiz(root,{title:'Test des cours étudiés',mode:'train',total:specs.length,wallDeadline:end,noTimer:true,isReview:j=>reviews[j],next:j=>specs[j]||null,onFinish:result,onQuit:()=>result([])});
    }
    function draw() {
      if(disposed)return;
      if(i>=plan.length||Date.now()>=studyEnd)return test();
      const x=plan[i];
      root.innerHTML='<div class="quiz-head"><div class="quiz-title">Étude '+(i+1)+' / '+plan.length+'</div><div data-clock></div></div><h1>'+esc(x.f.title)+'</h1>'+(recall?'<div class="card"><h3>Restitution sans le cours</h3><p>Explique à voix haute les idées principales, les définitions et les méthodes. Note ce que tu as oublié.</p><textarea rows="5" aria-label="Restitution personnelle" placeholder="Écris ce dont tu te souviens (facultatif)"></textarea></div>':'<article class="card course fiche">'+x.f.html+'</article>')+'<button class="btn primary block" data-next>'+(recall?'Terminer cette fiche':'Masquer le cours et restituer')+'</button><button class="btn block" data-skip>Passer la fiche</button><button class="btn block" data-test>Passer au test maintenant</button>';
      enhanceSheet(root.querySelector('.fiche'), { recall: false });
      root.querySelector('[data-next]').onclick=()=>{
        if(!recall){recall=true;return draw();}
        completed.push(x);store.update(s=>{const p=(s.progress[x.f.key]||={});p.read=true;p.studyAt=Date.now();});i++;recall=false;draw();
      };
      root.querySelector('[data-skip]').onclick=()=>{i++;recall=false;draw();};
      root.querySelector('[data-test]').onclick=test;
      scrollTo(0,0);
    }
    draw();
    if(!testing)timer=setInterval(()=>{
      if(Date.now()>=studyEnd)return test();
      const clock=root.querySelector('[data-clock]');if(clock)clock.textContent=fmtClock(studyEnd-Date.now());
    },250);
  }
  setup();
  return ()=>{disposed=true;clear();};
}
