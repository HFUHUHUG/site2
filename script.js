const shopsData = {
    "Мой магазин": [
        { id: "elytra", name: "Элитры", type: "fixed", price: 15, enabled: true },
        { id: "mending", name: "Книга: Починка", type: "fixed", price: 10, enabled: true },
        { id: "shalker", name: "Шалкер", type: "fixed", price: 8, enabled: true },
        { id: "silk", name: "Книга: Шёлковое касание", type: "fixed", price: 5, enabled: true },
        { id: "netherite", name: "Незеритовый слиток", type: "fixed", price: 15, enabled: true },
        { id: "totem", name: "Тотем бессмертия", type: "fixed", price: 12, enabled: true },
        { id: "dia_armor", name: "Алмазная броня (предмет)", type: "fixed", price: 5, enabled: true },
        { id: "iron_armor", name: "Железная броня (предмет)", type: "fixed", price: 2, enabled: true },
        { id: "gold_armor", name: "Золотая броня (предмет)", type: "fixed", price: 1, enabled: true },
        { id: "aqua_affinity", name: "Книга: Подводник", type: "fixed", price: 2, enabled: true },
        { id: "infinity", name: "Книга: Бесконечность", type: "fixed", price: 1, enabled: true },
        
        { id: "eff", name: "Книга: Эффективность (1-10)", type: "level", base: 1, step: 5, max: 10, enabled: true },
        { id: "unb", name: "Книга: Прочность (1-10)", type: "level", base: 1, step: 3, max: 10, enabled: true },
        { id: "fire_prot", name: "Книга: Огнеупорность (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "knock", name: "Книга: Отдача (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "fortune", name: "Книга: Удача (1-10)", type: "level", base: 5, step: 3, max: 10, enabled: true },
        { id: "sharp", name: "Книга: Острота (1-10)", type: "level", base: 2, step: 3, max: 10, enabled: true },
        
        { id: "prot", name: "Книга: Защита (1-10)", type: "level", base: 5, step: 2, max: 10, enabled: true },
        { id: "fire_asp", name: "Книга: Заговор огня (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        { id: "riptide", name: "Книга: Тягун (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "smite", name: "Книга: Небесная кара (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        { id: "blast_prot", name: "Книга: Взрывоустойчивость (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "thorns", name: "Книга: Шипы (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        { id: "depth_strider", name: "Книга: Подводная ходьба (1-10)", type: "level", base: 3, step: 1, max: 10, enabled: true },
        { id: "power", name: "Книга: Сила (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "sweeping", name: "Книга: Разящий клинок (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "proj_prot", name: "Книга: Защита от снарядов (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        
        { id: "looting", name: "Книга: Добыча (1-10)", type: "level", base: 5, step: 3, max: 10, enabled: false }
    ],
    "Магазин Игрока_2": [
        { id: "p2_iron", name: "Железный блок", type: "fixed", price: 1, enabled: true },
        { id: "p2_gold", name: "Золотой блок", type: "fixed", price: 4, enabled: true }
    ]
};

const promoCodes = {
    "HELLONEW": 0.15, "NETHER25": 0.25, "WEEKENDRUSH": 0.35, "DIAMONDCHIEF": 0.40, "ENDERDRAGON": 0.60, "CREATIVE": 1.00
};

let currentShop = "Мой магазин";
let cart = [];
let activeDiscount = 0;

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value) || 0;
    const from = document.getElementById('currency-from').value;
    const resultDiv = document.getElementById('currency-result');
    let totalInDiamonds = 0;

    if (from === "AR") totalInDiamonds = amount * 5;
    else if (from === "DIA") totalInDiamonds = amount;
    else if (from === "EM") totalInDiamonds = amount / 5;

    const arResult = (totalInDiamonds / 5).toFixed(2);
    const diaResult = totalInDiamonds.toFixed(1);
    const emResult = (totalInDiamonds * 5).toFixed(0);

    if (from === "AR") resultDiv.innerHTML = `💎 <b>${diaResult}</b> Алмазов<br>🟢 <b>${emResult}</b> Изумрудов`;
    else if (from === "DIA") resultDiv.innerHTML = `📦 <b>${arResult}</b> АР (Руды)<br>🟢 <b>${emResult}</b> Изумрудов`;
    else if (from === "EM") resultDiv.innerHTML = `📦 <b>${arResult}</b> АР (Руды)<br>💎 <b>${diaResult}</b> Алмазов`;
}

function renderTabs() {
    const tabsContainer = document.getElementById('shop-tabs');
    tabsContainer.innerHTML = '';
    Object.keys(shopsData).forEach(shopName => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${shopName === currentShop ? 'active' : ''}`;
        btn.innerText = shopName;
        btn.onclick = () => { currentShop = shopName; renderTabs(); renderProducts(); };
        tabsContainer.appendChild(btn);
    });
}

function calculateLevelPrice(base, step, lvl) { return base + (lvl - 1) * step; }

function updateLvlPriceDisplay(id, base, step) {
    const select = document.getElementById(`select-${id}`);
    const priceSpan = document.getElementById(`price-display-${id}`);
    if(select && priceSpan) {
        priceSpan.innerText = calculateLevelPrice(base, step, parseInt(select.value));
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    shopsData[currentShop].forEach(prod => {
        const card = document.createElement('div');
        card.className = `product-card ${!prod.enabled ? 'disabled' : ''}`;

        if (prod.type === "fixed") {
            card.innerHTML = `
                <div class="product-title">${prod.name}</div>
                <div class="product-price">${prod.price} АР</div>
                ${prod.enabled ? `<button class="btn-add" onclick="addToCart('${prod.id}', '${prod.name}', ${prod.price})">В корзину</button>` : '<div>[Нет в наличии]</div>'}
            `;
        } else if (prod.type === "level") {
            let selectOptions = '';
            for(let i = 1; i <= prod.max; i++) selectOptions += `<option value="${i}">Уровень ${i}</option>`;
            card.innerHTML = `
                <div class="product-title">${prod.name}</div>
                <div style="margin: 5px 0;">
                    <select id="select-${prod.id}" onchange="updateLvlPriceDisplay('${prod.id}', ${prod.base}, ${prod.step})">${selectOptions}</select>
                </div>
                <div class="product-price"><span id="price-display-${prod.id}">${calculateLevelPrice(prod.base, prod.step, 1)}</span> АР</div>
                ${prod.enabled ? `<button class="btn-add" onclick="addLeveledToCart('${prod.id}', '${prod.name}', ${prod.base}, ${prod.step})">В корзину</button>` : '<div>[Нет в наличии]</div>'}
            `;
        }
        container.appendChild(card);
    });
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++; else cart.push({ id, name, price, qty: 1 });
    renderCart();
}

function addLeveledToCart(id, name, base, step) {
    const lvl = parseInt(document.getElementById(`select-${id}`).value);
    const price = calculateLevelPrice(base, step, lvl);
    const uniqueId = `${id}_lvl_${lvl}`;
    const existing = cart.find(item => item.id === uniqueId);
    if (existing) existing.qty++; else cart.push({ id: uniqueId, name: `${name} [${lvl} Ур.]`, price, qty: 1 });
    renderCart();
}

function removeFromCart(id) { cart = cart.filter(item => item.id !== id); renderCart(); }

function applyPromo() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    const msgDiv = document.getElementById('promo-msg');
    if (promoCodes[code] !== undefined) {
        activeDiscount = promoCodes[code];
        msgDiv.style.color = "var(--accent-green)"; msgDiv.innerText = `Активирован! Скидка ${activeDiscount * 100}%`;
    } else {
        activeDiscount = 0; msgDiv.style.color = "#ff5252"; msgDiv.innerText = "Неверный промокод";
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #888;">Корзина пуста</p>';
        document.getElementById('cart-total').innerText = '0';
        document.getElementById('total-dia').innerText = '(0 алмазов)';
        document.getElementById('total-em').innerText = '(0 изумрудов)';
        return;
    }
    container.innerHTML = '';
    let totalAR = 0;
    cart.forEach(item => {
        totalAR += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<div>${item.name}<br><small>${item.price} АР x ${item.qty}</small></div><div>${item.price * item.qty} АР <button class="btn-remove" onclick="removeFromCart('${item.id}')">✕</button></div>`;
        container.appendChild(div);
    });
    if (activeDiscount > 0) totalAR *= (1 - activeDiscount);
    totalAR = Math.round(totalAR * 100) / 100;
    document.getElementById('cart-total').innerText = totalAR;
    document.getElementById('total-dia').innerText = `(${Math.round(totalAR * 5 * 10) / 10} алмазов)`;
    document.getElementById('total-em').innerText = `(${Math.round(totalAR * 25)} изумрудов)`;
}

renderTabs(); renderProducts(); convertCurrency();
