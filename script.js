let cart = JSON.parse(localStorage.getItem('eatzyCart')) || [];

function saveCart() {
    localStorage.setItem('eatzyCart', JSON.stringify(cart));
}

function updateCartCount() {
    const countEls = document.querySelectorAll('#cart-count');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEls.forEach(el => {
        el.textContent = total || '';
        el.style.display = total > 0 ? 'inline' : 'none';
    });
}

function addItemToCart(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) item.quantity++;
    else cart.push({ name, price: Number(price), quantity: 1 });
    saveCart();
    updateCartCount();
    // alert(`Added ${name} to cart! 🍔`);
}

function handleBuyNow(name, price) {
    addItemToCart(name, price);
    window.location.href = 'order.html';
}

function renderOrderItems() {
    const container = document.getElementById('order-items');
    if (!container) return;

    container.innerHTML = '';
    cart.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity">
                <button class="qty-btn" onclick="changeQty(${i}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
            </div>
            <button class="remove" onclick="removeItem(${i})">Remove</button>
        `;
        container.appendChild(div);
    });
    updatePricing();
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) removeItem(index);
    else {
        saveCart();
        renderOrderItems();
        updateCartCount();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderOrderItems();
    updateCartCount();
}

function updatePricing() {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    if (!subtotalEl) return;

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.07;
    const delivery = 3.99;
    const total = subtotal + tax + delivery;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.food-card');
            const name = card.querySelector('h3').textContent.trim();
            const price = card.querySelector('.price').textContent.replace('$', '').trim();
            addItemToCart(name, price);
        });
    });

    document.querySelectorAll('.buy-now').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.food-card');
            const name = card.querySelector('h3').textContent.trim();
            const price = card.querySelector('.price').textContent.replace('$', '').trim();
            handleBuyNow(name, price);
        });
    });

    renderOrderItems();
});

window.changeQty = changeQty;
window.removeItem = removeItem;