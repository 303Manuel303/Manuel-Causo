import { renderMarkdownInto } from './md-loader.js';
function compareSemverDesc(a,b){ const pa=a.replace('.md','').split('-').map(Number); const pb=b.replace('.md','').split('-').map(Number); for (let i=0;i<3;i++){ if((pb[i]||0)!==(pa[i]||0)) return (pb[i]||0)-(pa[i]||0); } return 0; }
async function loadVersions(){
  const listEl=document.querySelector('#versions-list'); const countEl=document.querySelector('#versions-count'); if(!listEl) return;
  try{
    const res=await fetch('./versions/manifest.json'); const data=await res.json(); const items=data.versions||[];
    items.sort((a,b)=>compareSemverDesc(a.file,b.file)); if(countEl) countEl.textContent=items.length;
    items.forEach((v,idx)=>{ const el=document.createElement('article'); el.className='version-item'; el.innerHTML=`
      <div class="version-header" data-file="${v.file}">
        <div>
          <div class="version-title">${v.title||v.file.replace('.md','').split('-').join('.')}</div>
          <div class="version-date">${v.date||''}</div>
        </div>
        <div class="badge">Apri ▾</div>
      </div>
      <div class="version-body" id="body-${idx}">
        <div class="divider"></div>
        <div class="md" id="md-${idx}">Caricamento...</div>
      </div>`; listEl.appendChild(el); });
    listEl.addEventListener('click', async (e)=>{ const header=e.target.closest('.version-header'); if(!header) return; const file=header.getAttribute('data-file'); const body=header.parentElement.querySelector('.version-body'); const mdTarget=header.parentElement.querySelector('.md'); body.classList.toggle('active'); if(body.classList.contains('active') && !mdTarget.dataset.loaded){ await renderMarkdownInto(`#${mdTarget.id}`, `./versions/${file}`); mdTarget.dataset.loaded='1'; } });
  }catch(err){ listEl.innerHTML = `<div class="card">Errore nel caricare le versioni: ${err.message}</div>`; }
}
document.addEventListener('DOMContentLoaded', loadVersions);