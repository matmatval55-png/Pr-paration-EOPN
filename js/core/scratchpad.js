import {store} from './store.js';
export function mountScratchpad(root,key){
 if(root.querySelector('.scratchpad'))return;
 const panel=document.createElement('aside');panel.className='scratchpad';
 panel.innerHTML='<button type="button" class="btn scratch-toggle" aria-expanded="false">Bloc-notes ✎</button><div class="scratch-body" hidden><div class="scratch-head"><strong>Mon bloc-notes</strong><button type="button" class="btn" data-close aria-label="Fermer le bloc-notes">✕</button></div><label>Formules à retenir<textarea rows="4" data-field="formulas" placeholder="Formules, unités, astuces…"></textarea></label><label>Brouillon de calcul<textarea rows="6" data-field="work" placeholder="Calculs et étapes de résolution…"></textarea></label><div class="scratch-symbols"></div><button type="button" class="btn" data-clear>Effacer le brouillon</button><small>Notes sauvegardées sur cet appareil.</small></div>';
 root.append(panel);
 const body=panel.querySelector('.scratch-body'),toggle=panel.querySelector('.scratch-toggle');
 const read=()=>store.data.academy?.scratchpads?.[key]||{};
 const save=(field,value)=>store.update(s=>{const all=((s.academy||={}).scratchpads||={});(all[key]||={})[field]=value;});
 const fields=[...panel.querySelectorAll('textarea')];let active=fields[1];
 for(const t of fields){t.value=read()[t.dataset.field]||'';t.onfocus=()=>active=t;t.oninput=()=>save(t.dataset.field,t.value);}
 function open(v){body.hidden=!v;toggle.setAttribute('aria-expanded',String(v));toggle.textContent=v?'Masquer le bloc-notes':'Bloc-notes ✎';}
 toggle.onclick=()=>open(body.hidden);panel.querySelector('[data-close]').onclick=()=>open(false);
 for(const symbol of ['×','÷','²','³','√','π','Δ','°','≈','→']){const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=symbol;b.onclick=()=>{active.setRangeText(symbol,active.selectionStart,active.selectionEnd,'end');save(active.dataset.field,active.value);active.focus();};panel.querySelector('.scratch-symbols').append(b);}
 panel.querySelector('[data-clear]').onclick=()=>{if(confirm('Effacer uniquement les calculs de ce chapitre ?')){fields[1].value='';save('work','');}};
}
