import { renderMarkdownInto } from './md-loader.js';
function compareSemverDesc(a,b){ const pa=a.replace('.md','').split('-').map(Number); const pb=b.replace('.md','').split('-').map(Number); for (let i=0;i<3;i++){ if((pb[i]||0)!==(pa[i]||0)) return (pb[i]||0)-(pa[i]||0); } return 0; }

// "+ voce" / "++ sotto-voce" / "= modifica" / "- rimosso" → etichette colorate
const KINDS={ '+':['add','Aggiunto'], '=':['mod','Modificato'], '-':['del','Rimosso'] };
function decorateChanges(root){
  root.querySelectorAll('li').forEach(li=>{
    const m=li.innerHTML.match(/^\s*(\+\+|\+|==|=|-)\s*/); if(!m) return;
    const sign=m[1]; const [kind,label]=KINDS[sign[0]];
    li.classList.add('chg','chg-'+kind); if(sign.length===2) li.classList.add('chg-sub');
    li.innerHTML=`<span class="chg-sign" aria-hidden="true">${sign}</span><span class="sr-only">${label}: </span>`+li.innerHTML.slice(m[0].length);
  });
}

async function toggleItem(item){
  const body=item.querySelector('.version-body'); const mdTarget=item.querySelector('.md'); const badge=item.querySelector('.version-header .badge');
  const open=body.classList.toggle('active'); item.classList.toggle('is-open',open);
  item.querySelector('.version-header').setAttribute('aria-expanded',String(open));
  badge.textContent=open?'Chiudi':'Apri';
  if(open && !mdTarget.dataset.loaded){ await renderMarkdownInto(`#${mdTarget.id}`, `./versions/${item.dataset.file}`); decorateChanges(mdTarget); mdTarget.dataset.loaded='1'; }
}

async function loadVersions(){
  const listEl=document.querySelector('#versions-list'); const countEl=document.querySelector('#versions-count'); if(!listEl) return;
  try{
    const res=await fetch('./versions/manifest.json'); const data=await res.json(); const items=data.versions||[];
    items.sort((a,b)=>compareSemverDesc(a.file,b.file)); if(countEl) countEl.textContent=items.length;
    items.forEach((v,idx)=>{ const el=document.createElement('article'); el.className='version-item'; el.dataset.file=v.file; el.innerHTML=`
      ${idx===0?'<span class="tag version-new">Ultima</span>':''}
      <div class="version-header" data-file="${v.file}" role="button" tabindex="0" aria-expanded="false" aria-controls="body-${idx}">
        <div>
          <div class="version-title">${v.title||v.file.replace('.md','').split('-').join('.')}</div>
          <div class="version-date">${v.date||''}</div>
        </div>
        <div class="badge">Apri</div>
      </div>
      <div class="version-body" id="body-${idx}">
        <div class="divider"></div>
        <div class="md" id="md-${idx}">Caricamento...</div>
      </div>`; listEl.appendChild(el); });
    listEl.addEventListener('click',(e)=>{ const header=e.target.closest('.version-header'); if(header) toggleItem(header.parentElement); });
    listEl.addEventListener('keydown',(e)=>{ const header=e.target.closest('.version-header'); if(header && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); toggleItem(header.parentElement); } });
    const first=listEl.querySelector('.version-item'); if(first) toggleItem(first);
  }catch(err){ listEl.innerHTML = `<div class="card">Errore nel caricare le versioni: ${err.message}</div>`; }
}
document.addEventListener('DOMContentLoaded', loadVersions);
