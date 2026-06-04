// НАСТРОЙКА ТОВАРОВ И ДРУГИХ МАГАЗИНОВ
// Измените параметр enabled: true на enabled: false, чтобы зачеркнуть товар
const shopsData = {
        "Мой магазин": [
        // Обычные предметы
        { id: "elytra", name: "Элитры", type: "fixed", price: 15, enabled: true },
        { id: "mending", name: "Книга: Починка", type: "fixed", price: 10, enabled: true },
        { id: "shalker", name: "Шалкер", type: "fixed", price: 8, enabled: true },
        { id: "silk", name: "Книга: Шёлковое касание", type: "fixed", price: 5, enabled: true },
        { id: "netherite", name: "Незеритовый слиток", type: "fixed", price: 15, enabled: true },
        { id: "totem", name: "Тотем бессмертия", type: "fixed", price: 12, enabled: true }, // Добавлен тотем
        { id: "dia_armor", name: "Алмазная броня (предмет)", type: "fixed", price: 5, enabled: true },
        { id: "iron_armor", name: "Железная броня (предмет)", type: "fixed", price: 2, enabled: true },
        { id: "gold_armor", name: "Золотая броня (предмет)", type: "fixed", price: 1, enabled: true },
        { id: "aqua_affinity", name: "Книга: Подводник", type: "fixed", price: 2, enabled: true }, // Подводник без уровней
        { id: "infinity", name: "Книга: Бесконечность", type: "fixed", price: 1, enabled: true }, // Бесконечность без уровней
        
        // Зачарования с изменяемым уровнем (калькуляторы)
        { id: "eff", name: "Книга: Эффективность (1-10)", type: "level", base: 1, step: 5, max: 10, enabled: true },
        { id: "unb", name: "Книга: Прочность (1-10)", type: "level", base: 1, step: 3, max: 10, enabled: true },
        { id: "fire_prot", name: "Книга: Огнеупорность (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "knock", name: "Книга: Отдача (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "fortune", name: "Книга: Удача (1-10)", type: "level", base: 5, step: 3, max: 10, enabled: true },
        { id: "sharp", name: "Книга: Острота (1-10)", type: "level", base: 2, step: 3, max: 10, enabled: true },
        
        // Обновленные и новые чары из вашего запроса
        { id: "prot", name: "Книга: Защита (1-10)", type: "level", base: 5, step: 2, max: 10, enabled: true }, // Новая цена: 5 + 2 за ур.
        { id: "fire_asp", name: "Книга: Заговор огня (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true }, // ТЕПЕРЬ ВКЛЮЧЕН (не зачёркнут)
        { id: "riptide", name: "Книга: Тягун (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "smite", name: "Книга: Небесная кара (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        { id: "blast_prot", name: "Книга: Взрывоустойчивость (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "thorns", name: "Книга: Шипы (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        { id: "depth_strider", name: "Книга: Подводная ходьба (1-10)", type: "level", base: 3, step: 1, max: 10, enabled: true },
        { id: "power", name: "Книга: Сила (1-10)", type: "level", base: 1, step: 1, max: 10, enabled: true },
        { id: "sweeping", name: "Книга: Разящий клинок (1-10)", type: "level", base: 2, step: 1, max: 10, enabled: true },
        { id: "proj_prot", name: "Книга: Защита от снарядов (1-10)", type: "level", base: 3, step: 2, max: 10, enabled: true },
        
        // Оставленный зачеркнутым товар
        { id: "looting", name: "Книга: Добыча (1-10)", type: "level", base: 5, step: 3, max: 10, enabled: false }
    ],
    "Магазин Игрока_2": [
        { id: "p2_iron", name: "Железный блок", type: "fixed", price: 1, enabled: true },
        { id: "p2_gold", name: "Золотой блок", type: "fixed", price: 4, enabled: true },
        { id: "p2_totem", name: "Тотем бессмертия", type: "fixed", price: 12, enabled: false }
    ],
    "Магазин Игрока_3": [
        { id: "p3_obsidian", name: "Обсидиан (64 шт)", type: "fixed", price: 3, enabled: true }
    ]
};

// Промокоды на скидку
const promoCodes = {
    "SUPER50": 0.50, // Скидка 50%
    "MINE20": 0.20,  // Скидка 20%
    "FREEAR": 0.10   // Скидка 10%
        // Процентные промокоды
    "HELLONEW": 0.15,    // Скидка 15% для новых покупателей
    "NETHER25": 0.25,    // Скидка 25% на товары из Незера
    "WEEKENDRUSH": 0.35, // Скидка 35% для покупок на выходных
    "DIAMONDCHIEF": 0.40,// Скидка 40% для постоянных клиентов
    "ENDERDRAGON": 0.60, // Скидка 60% в честь победы над драконом
};

let currentShop = "Мой магазин";
let cart = [];
let activeDiscount = 0;

// Умный расчет курса валют (1 АР = 5 Алмазов = 25 Изумрудов)
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value) || 0;
    const from = document.getElementById('currency-from').value;
    const resultDiv = document.getElementById('currency-result');

    let totalInDiamonds = 0;

    // Сначала переводим всё в базовую единицу (алмазы)
    if (from === "AR") {
        totalInDiamonds = amount * 5;
    } else if (from === "DIA") {
        totalInDiamonds = amount;
    } else if (from === "EM") {
        totalInDiamonds = amount / 5;
    }

    // Рассчитываем эквиваленты
    const arResult = (totalInDiamonds / 5).toFixed(2);
    const diaResult = totalInDiamonds.toFixed(1);
    const emResult = (totalInDiamonds * 5).toFixed(0);

    // Выводим красивый блок с результатами
    if (from === "AR") {
        resultDiv.innerHTML = `💎 <b>${diaResult}</b> Алмазов<br>🟢 <b>${emResult}</b> Изумрудов`;
    } else if (from === "DIA") {
        resultDiv.innerHTML = `📦 <b>${arResult}</b> АР (Руды)<br>🟢 <b>${emResult}</b> Изумрудов`;
    } else if (from === "EM") {
        resultDiv.innerHTML = `📦 <b>${arResult}</b> АР (Руды)<br>💎 <b>${diaResult}</b> Алмазов`;
    }
}

// Отображение вкладок магазинов
function renderTabs() {
    const tabsContainer = document.getElementById('shop-tabs');
    tabsContainer.innerHTML = '';
    Object.keys(shopsData).forEach(shopName => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${shopName === currentShop ? 'active' : ''}`;
        btn.innerText = shopName;
        btn.onclick = () => {
            currentShop = shopName;
            renderTabs();
            renderProducts();
        };
        tabsContainer.appendChild(btn);
    });
}

// Формула для уровней: Базовая цена + (Уровень - 1) * Шаг цены
function calculateLevelPrice(base, step, lvl) {
    return base + (lvl - 1) * step;
}

// Изменение отображения цены при выборе уровня в выпадающем списке
function updateLvlPriceDisplay(id, base, step) {
    const select = document.getElementById(`select-${id}`);
    const priceSpan = document.getElementById(`price-display-${id}`);
    if(select && priceSpan) {
        const currentLvl = parseInt(select.value);
        priceSpan.innerText = calculateLevelPrice(base, step, currentLvl);
    }
}

// Отрисовка товаров на витрине
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    shopsData[currentShop].forEach(prod => {
        const card = document.createElement('div');
        card.className = `product-card ${!prod.enabled ? 'disabled' : ''}`;

        if (prod.type === "fixed") {
            card.innerHTML = `
                <div class="product-title">${prod.name}</div>
                <div class="product-price"><span class="price-val">${prod.price}</span> АР</div>
                ${prod.enabled ? `<button class="btn-add" onclick="addToCart('${prod.id}', '${prod.name}', ${prod.price})">В корзину</button>` : '<div>[Нет в наличии]</div>'}
            `;
        } else if (prod.type === "level") {
            let selectOptions = '';
            for(let i = 1; i <= prod.max; i++) {
                selectOptions += `<option value="${i}">Уровень ${i}</option>`;
            }

            const initialPrice = calculateLevelPrice(prod.base, prod.step, 1);

            card.innerHTML = `
                <div class="product-title">${prod.name}</div>
                <div style="margin: 5px 0;">
                    <label style="font-size:12px; color:#aaa;">Выберите уровень:</label>
                    <select id="select-${prod.id}" onchange="updateLvlPriceDisplay('${prod.id}', ${prod.base}, ${prod.step})">
                        ${selectOptions}
                    </select>
                </div>
                <div class="product-price"><span id="price-display-${prod.id}">${initialPrice}</span> АР</div>
                ${prod.enabled ? `<button class="btn-add" onclick="addLeveledToCart('${prod.id}', '${prod.name}', ${prod.base}, ${prod.step})">В корзину</button>` : '<div>[Нет в наличии]</div>'}
            `;
        }
        container.appendChild(card);
    });
}

// Добавление обычного товара в корзину
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    renderCart();
}

// Добавление уровневого товара в корзину
function addLeveledToCart(id, name, base, step) {
    const select = document.getElementById(`select-${id}`);
    const lvl = parseInt(select.value);
    const price = calculateLevelPrice(base, step, lvl);
    const uniqueId = `${id}_lvl_${lvl}`;
    const fullName = `${name} [${lvl} Ур.]`;

    const existing = cart.find(item => item.id === uniqueId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: uniqueId, name: fullName, price: price, qty: 1 });
    }
    renderCart();
}

// Удаление из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Активация купона на скидку
function applyPromo() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    const msgDiv = document.getElementById('promo-msg');

    if (promoCodes[code] !== undefined) {
        activeDiscount = promoCodes[code];
        msgDiv.style.color = "var(--accent-green)";
        msgDiv.innerText = `Промокод активирован! Скидка ${activeDiscount * 100}%`;
    } else {
        activeDiscount = 0;
        msgDiv.style.color = "#ff5252";
        msgDiv.innerText = "Неверный промокод";
    }
    renderCart();
}

// Обновление всей корзины с учетом нового тройного курса
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    const totalDiaSpan = document.getElementById('total-dia');
    const totalEmSpan = document.getElementById('total-em');

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #888;">Корзина пуста</p>';
        totalSpan.innerText = '0';
        totalDiaSpan.innerText = '(0 алмазов)';
        totalEmSpan.innerText = '(0 изумрудов)';
        return;
    }

    container.innerHTML = '';
    let totalAR = 0;

    cart.forEach(item => {
        const itemCost = item.price * item.qty;
        totalAR += itemCost;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <div>${item.name}</div>
                <small style="color: #aaa;">${item.price} АР x ${item.qty}</small>
            </div>
            <div>
                <span style="font-weight:bold; margin-right: 10px;">${itemCost} АР</span>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (activeDiscount > 0) {
        totalAR = totalAR * (1 - activeDiscount);
    }

    // Точный расчет под новый курс
    totalAR = Math.round(totalAR * 100) / 100;
    if (activeDiscount > 0) {
        totalAR = totalAR * (1 - activeDiscount);
    }

    // Точный расчет под новый курс
    totalAR = Math.round(totalAR * 100) / 100;
    const totalDiamonds = Math.round(totalAR * 5 * 100) / 100;
    const totalEmeralds = Math.round(totalDiamonds * 5 * 100) / 100;

    totalSpan.innerText = totalAR;
    totalDiaSpan.innerText = `(${totalDiamonds} алмазов)`;
    totalEmSpan.innerText = `(${totalEmeralds} изумрудов)`;
}

// Инициализация при открытии страницы
renderTabs();
renderProducts();
convertCurrency(); // Инициализация калькулятора валют по умолчанию
