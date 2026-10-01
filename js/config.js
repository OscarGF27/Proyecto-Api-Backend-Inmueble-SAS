/* ===== CONFIGURACIÓN GLOBAL ===== */

// Selector simplificado
const $ = id => document.querySelector(id);
const $$ = sel => document.querySelectorAll(sel);

// Configuración de moneda y WhatsApp
const CURRENCY = { code: "USD", locale: "en-US" };  // Para COP: { code: "COP", locale: "es-CO" }
const WHATSAPP_NUMBER = "573000000000"; // Cambiar por tu número

// Nombres de categorías
const catNames = { todos: "Todos", sala: "Sala", comedor: "Comedor", dormitorio: "Dormitorio" };

// Funciones de utilidad
const money = n => new Intl.NumberFormat(CURRENCY.locale, {
  style: "currency",
  currency: CURRENCY.code,
  maximumFractionDigits: 0
}).format(n);

const toast = msg => {
  $(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
};

/* ===== CARRITO ===== */
const Cart = {
  key: "mf_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.key, JSON.stringify(items)); }
    catch { }
    this.updateBadge();
  },
  add(p) {
    const items = this.get();
    const found = items.find(i => i.id === p.id);
    if (found) found.qty = Math.min(found.qty + 1, 99);
    else items.push({ id: p.id, name: p.name, cat: p.cat, price: p.price, img: p.img, qty: 1 });
    this.save(items);
  },
  setQty(id, qty) {
    let items = this.get();
    items = qty <= 0 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, qty: Math.min(qty, 99) } : i);
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((n, i) => n + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
  updateBadge() {
    $$("[data-cart-count]").forEach(b => b.textContent = this.count());
  }
};

/* ===== INICIALIZACIÓN AL CARGAR ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Actualizar badge del carrito
  if ($('#cartCount')) Cart.updateBadge();
  
  // Menú mobile
  const burger = $("#burger"), menu = $("#menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // WhatsApp link
  const wa = $("#whatsapp");
  if (wa) wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quisiera más información sobre sus muebles.")}`;

  // Scroll del navbar
  window.addEventListener("scroll", () => {
    const navbar = $("#navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
});