/* ===== RENDERIZAR CARRITO ===== */
function renderCart() {
  const items = Cart.get();
  const cartList = $("#cartList");
  const cartSummary = $("#cartSummary");
  const emptyCart = $("#emptyCart");

  if (items.length === 0) {
    cartList.innerHTML = "";
    emptyCart.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  emptyCart.hidden = true;
  cartSummary.hidden = false;

  cartList.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align: center;">Cantidad</th>
          <th style="text-align: right;">Precio</th>
          <th style="text-align: right;">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const product = PRODUCTS.find(p => p.id == item.id);
          if (!product) return "";
          return `
            <tr class="cart-row">
              <td>
                <div class="item-info">
                  ${product.img ? `<img src="${product.img}" alt="${item.name}" class="item-img">` : `<span class="icon" style="font-size: 2rem;">${product.icon}</span>`}
                  <div>
                    <p class="item-name">${item.name}</p>
                    <p class="muted small-text">${catNames[item.cat]}</p>
                  </div>
                </div>
              </td>
              <td style="text-align: center;">
                <input type="number" min="1" max="99" value="${item.qty}" 
                  onchange="updateQty(${item.id}, this.value)" class="qty-input">
              </td>
              <td style="text-align: right;">${money(item.price)}</td>
              <td style="text-align: right; font-weight: 600;">${money(item.price * item.qty)}</td>
              <td style="text-align: right;">
                <button onclick="removeItem(${item.id})" class="btn-remove" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  updateSummary(items);
}

function updateQty(id, qty) {
  const newQty = Math.max(0, Math.min(parseInt(qty) || 0, 99));
  if (newQty === 0) {
    if (confirm("¿Eliminar este producto del carrito?")) {
      Cart.remove(id);
      renderCart();
    }
  } else {
    Cart.setQty(id, newQty);
    renderCart();
  }
}

function removeItem(id) {
  if (confirm("¿Eliminar este producto del carrito?")) {
    Cart.remove(id);
    renderCart();
  }
}

function updateSummary(items) {
  const subtotal = Cart.total();
  const taxes = Math.round(subtotal * 0.19);
  const total = subtotal + taxes;

  $("#subtotal").textContent = money(subtotal);
  $("#taxes").textContent = money(taxes);
  $("#total").textContent = money(total);
}

function continueShopping() {
  window.location.href = "index.html#shop";
}

// Renderizar al cargar
renderCart();