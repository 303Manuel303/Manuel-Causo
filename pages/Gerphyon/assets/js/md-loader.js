export async function renderMarkdownInto(selector, mdUrl) {
  const container = document.querySelector(selector); if (!container) return;
  try {
    const res = await fetch(mdUrl); if (!res.ok) throw new Error('Impossibile caricare: ' + mdUrl);
    const md = await res.text();
    const html = md
      .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^\-\s(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br/><br/>' );
    container.innerHTML = html;
  } catch(err) {
    container.innerHTML = `<div class="card">Errore nel caricamento del contenuto: ${err.message}</div>`;
  }
}