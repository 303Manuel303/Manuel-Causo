document.addEventListener('DOMContentLoaded',()=>{
  const yearEl=document.querySelector('#year'); if(yearEl) yearEl.textContent=new Date().getFullYear();
  const toTop=document.createElement('button'); toTop.textContent='↑';
  Object.assign(toTop.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:60,padding:'8px 12px',borderRadius:'10px',border:'1px solid #252525',background:'#111',color:'#ffd000',cursor:'pointer',display:'none'});
  document.body.appendChild(toTop);
  window.addEventListener('scroll',()=>{toTop.style.display=window.scrollY>400?'block':'none'});
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
});