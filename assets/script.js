async function loadMedia(){
  const res = await fetch('data/media.json');
  const items = await res.json();
  window.mediaItems = items;
  renderGallery();
}

function renderGallery(){
  const gallery = document.getElementById('gallery');
  const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : 'all';
  const status = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : 'all';
  gallery.innerHTML = '';
  const items = window.mediaItems.filter(item=>{
    if(cat !== 'all' && item.category !== cat) return false;
    if(status === 'approved' && item.approved !== true) return false;
    if(status === 'not' && item.approved !== false) return false;
    return true;
  });
  if(items.length === 0){
    gallery.innerHTML = '<p style="color:#9fb6d9">Tidak ada item pada filter ini.</p>';
    return;
  }
  for(const it of items){
    const card = document.createElement('div'); card.className='card';
    let mediaElem = '';
    if(it.type === 'image'){
      mediaElem = `<img src="${it.file}" alt="${it.title}" onclick="openLightbox(${it.id})">`;
    } else if(it.type === 'video'){
      mediaElem = `<div style="height:160px;display:flex;align-items:center;justify-content:center;background:#021426;border-radius:8px"><button onclick="openLightbox(${it.id})" class="btn">Play Video</button></div>`;
    } else if(it.type === 'audio'){
      mediaElem = `<div style="height:160px;display:flex;align-items:center;justify-content:center;background:#021426;border-radius:8px"><button onclick="openLightbox(${it.id})" class="btn">Play Audio</button></div>`;
    }
    card.innerHTML = mediaElem + `<div class="meta"><strong>${it.title}</strong><div style="font-size:13px;color:var(--muted)">${it.category} · ${it.approved ? 'Approved' : 'Not Approved'}</div><p style="margin:6px 0 0;font-size:14px;color:var(--muted)">${it.description}</p></div>`;
    gallery.appendChild(card);
  }
}

function openLightbox(id){
  const item = window.mediaItems.find(x=>x.id===id);
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  content.innerHTML = '';
  if(item.type === 'image'){
    content.innerHTML = `<img src="${item.file}" style="max-width:100%;height:auto;border-radius:8px">`;
  } else if(item.type === 'video'){
    content.innerHTML = `<video controls style="max-width:100%;height:auto;border-radius:8px"><source src="${item.file}"></video>`;
  } else if(item.type === 'audio'){
    content.innerHTML = `<div style="padding:12px;background:#021426;border-radius:8px"><h3>${item.title}</h3><audio controls style="width:100%"><source src="${item.file}"></audio></div>`;
  }
  lb.classList.remove('hidden');
}

function closeLightbox(e){
  e.stopPropagation();
  const lb = document.getElementById('lightbox');
  lb.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded',()=>{
  loadMedia();
  const cat = document.getElementById('categoryFilter');
  if(cat) cat.addEventListener('change', renderGallery);
  const st = document.getElementById('statusFilter');
  if(st) st.addEventListener('change', renderGallery);
});