/* ===== VERIFICACIÓN DE DATA ===== */
if (typeof PRODUCTS === "undefined") {
  $("#products").innerHTML = '<p style="grid-column:1/-1;padding:24px;background:#fff;border:1px solid #e5e1da;border-radius:12px">❌ No se encontró <b>js/data.js</b></p>';
  throw new Error("Falta js/data.js");
}

/* ===== RENDERIZAR PRODUCTOS ===== */
const imgOrIcon = p => `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'icon',textContent:'${p.icon}'}))">`;

function renderProducts(cat = "todos") {
  const list = cat === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  $("#products").innerHTML = list.map(p => `
    <article class="card">
      <div class="img" data-view="${p.id}">${imgOrIcon(p)}</div>
      <div class="info">
        <span class="cat">${catNames[p.cat]}</span>
        <h3 data-view="${p.id}">${p.name}</h3>
        <p class="price">${money(p.price)}</p>
        <div class="actions">
          <button data-add="${p.id}">Agregar</button>
          <button class="btn-view" data-view="${p.id}">Ver</button>
        </div>
      </div>
    </article>`).join("");
}

renderProducts();

// Filtros
$("#filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderProducts(chip.dataset.cat);
});

/* ===== MODAL DE PRODUCTO ===== */
let current = null;

function setModalImage(src) {
  $("#mImg").innerHTML = src
    ? `<img src="${src}" alt="${current.name}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'icon',textContent:'${current.icon}'}))">` 
    : `<span class="icon">${current.icon}</span>`;
}

function openModal(id) {
  current = PRODUCTS.find(p => p.id == id);
  if (!current) return;
  
  const pics = current.gallery?.length ? current.gallery : [current.img];
  setModalImage(pics[0]);
  
  $("#mThumbs").innerHTML = pics.length > 1
    ? pics.map((s, i) => `<img src="${s}" class="${i === 0 ? "active" : ""}" data-src="${s}" alt="Vista ${i + 1}">`).join("")
    : "";
  
  $("#mCat").textContent = catNames[current.cat];
  $("#mName").textContent = current.name;
  $("#mPrice").textContent = money(current.price);
  $("#mDesc").textContent = current.desc || "";
  
  const modal = $("#modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = $("#modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Eventos del modal
$("#products").addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(add.dataset.add);
  
  const view = e.target.closest("[data-view]");
  if (view) openModal(view.dataset.view);
});

$("#mAdd").addEventListener("click", () => {
  addToCart(current.id);
  closeModal();
});

$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

$("#mThumbs").addEventListener("click", e => {
  const t = e.target.closest("img[data-src]");
  if (!t) return;
  setModalImage(t.dataset.src);
  $$("#mThumbs img").forEach(i => i.classList.toggle("active", i === t));
});

/* ===== FUNCIÓN AGREGAR AL CARRITO ===== */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id == id);
  if (product) {
    Cart.add(product);
    toast("✓ Agregado al carrito");
  }
}

/* ===== CONTACTO ===== */
$("#contactForm")?.addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  toast("✓ Mensaje enviado correctamente");
});