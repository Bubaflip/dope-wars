// ============================================================
// DOPE WARS — game.js
// ============================================================

// --- Constants -----------------------------------------------

const DRUGS = [
    { id: 'weed',     name: 'Weed',     min: 15,  max: 90,  crashMin: 5,   crashMax: 20,  spikeMin: 70,   spikeMax: 140,  spikeChance: 0.12 },
    { id: 'hashish',  name: 'Hashish',  min: 30,  max: 120, crashMin: 10,  crashMax: 35,  spikeMin: 100,  spikeMax: 200,  spikeChance: 0.12 },
    { id: 'shrooms',  name: 'Shrooms',  min: 25,  max: 200, crashMin: 10,  crashMax: 30,  spikeMin: 150,  spikeMax: 350,  spikeChance: 0.15 },
    { id: 'speed',    name: 'Speed',    min: 20,  max: 150, crashMin: 8,   crashMax: 25,  spikeMin: 120,  spikeMax: 280,  spikeChance: 0.14 },
    { id: 'acid',     name: 'Acid',     min: 50,  max: 350, crashMin: 20,  crashMax: 60,  spikeMin: 280,  spikeMax: 550,  spikeChance: 0.15 },
    { id: 'mdma',     name: 'MDMA',     min: 40,  max: 250, crashMin: 15,  crashMax: 50,  spikeMin: 200,  spikeMax: 450,  spikeChance: 0.14 },
    { id: 'ketamine', name: 'Ketamine', min: 60,  max: 300, crashMin: 25,  crashMax: 70,  spikeMin: 240,  spikeMax: 500,  spikeChance: 0.14 },
    { id: 'cocaine',  name: 'Cocaine',  min: 100, max: 600, crashMin: 40,  crashMax: 120, spikeMin: 450,  spikeMax: 900,  spikeChance: 0.18 },
    { id: 'heroin',   name: 'Heroin',   min: 80,  max: 500, crashMin: 30,  crashMax: 100, spikeMin: 380,  spikeMax: 800,  spikeChance: 0.18 },
    { id: 'fentanyl', name: 'Fentanyl', min: 150, max: 900, crashMin: 60,  crashMax: 180, spikeMin: 700,  spikeMax: 1400, spikeChance: 0.18 },
];

const BOROUGHS = [
    { id: 'brooklyn',  name: 'Brooklyn',  buyMult: 1.0,  sellMult: 1.0,  desc: 'Balanced prices', robberyBonus: 0 },
    { id: 'manhattan', name: 'Manhattan', buyMult: 1.2,  sellMult: 1.2,  desc: 'Premium prices',  robberyBonus: 0 },
    { id: 'bronx',     name: 'The Bronx', buyMult: 0.8,  sellMult: 0.85, desc: 'Cheap buys, risky', robberyBonus: 0.10 },
    { id: 'harlem',    name: 'Harlem',    buyMult: 1.0,  sellMult: 1.1,  desc: 'Strong hard drugs', robberyBonus: 0 },
    { id: 'queens',    name: 'Queens',    buyMult: 0.95, sellMult: 1.05, desc: 'Party drug hub',   robberyBonus: 0 },
];

const SPECIAL_LOCATIONS = [
    { id: 'connect', name: 'The Connect', desc: 'Buy connection cards' },
    { id: 'bank',    name: 'The Bank',    desc: 'Deposit / withdraw' },
    { id: 'shark',   name: 'The Shark',   desc: 'Borrow / repay' },
];

const RANKS = [
    { rank: 1, title: 'Corner Boy', target: 2000,    unlocks: ['weed', 'hashish', 'shrooms'] },
    { rank: 2, title: 'Runner',     target: 5000,    unlocks: ['speed', 'acid'] },
    { rank: 3, title: 'Pusher',     target: 15000,   unlocks: ['mdma', 'ketamine'] },
    { rank: 4, title: 'Lieutenant', target: 40000,   unlocks: ['cocaine'] },
    { rank: 5, title: 'Underboss',  target: 100000,  unlocks: ['heroin'] },
    { rank: 6, title: 'Right Hand', target: 250000,  unlocks: ['fentanyl'] },
    { rank: 7, title: 'Boss',       target: 600000,  unlocks: [] },
    { rank: 8, title: 'Kingpin',    target: 1500000, unlocks: [] },
];

const CARD_PRICES = {
    common:   [200, 500, 1200, 3000, 7500, 18000, 45000, 110000],
    uncommon: [500, 1200, 3000, 7500, 18000, 45000, 110000, 275000],
    rare:     [1000, 2500, 6000, 15000, 37000, 90000, 225000, 550000],
};

const BAG_UPGRADE_PRICES = [200, 500, 1200, 3000, 7500, 18000, 45000, 110000];
const BAG_UPGRADE_CHANCE = 0.10;

const CONNECTIONS = [
    { id: 'BIGGER_STASH',  name: 'Bigger Stash',  rarity: 'common',   desc: '+5 bag slots' },
    { id: 'CORNER_BOY',    name: 'Corner Boy',    rarity: 'common',   desc: '+10% sell at Brooklyn' },
    { id: 'LOOKOUT',       name: 'Lookout',       rarity: 'common',   desc: 'Warned before bust' },
    { id: 'HAGGLER',       name: 'Haggler',       rarity: 'common',   desc: 'Buy drugs 10% cheaper' },
    { id: 'QUICK_FEET',    name: 'Quick Feet',    rarity: 'common',   desc: '30% escape robbery' },
    { id: 'FAKE_ID',       name: 'Fake ID',       rarity: 'common',   desc: 'Halve bust cash loss' },
    { id: 'SUPPLIER_TIP',  name: 'Supplier Tip',  rarity: 'common',   desc: 'See tomorrow\'s spike' },
    { id: 'SUBWAY_PASS',   name: 'Subway Pass',   rarity: 'common',   desc: '2 locations/day (1x/rnd)' },
    { id: 'STREET_CRED',   name: 'Street Cred',   rarity: 'common',   desc: '+5% sell everywhere' },
    { id: 'POCKET_STASH',  name: 'Pocket Stash',  rarity: 'common',   desc: 'Hide 3 units from bust' },
    { id: 'MUSCLE',        name: 'Muscle',        rarity: 'common',   desc: 'Immune to robbery' },
    { id: 'ACCOUNTANT',    name: 'Accountant',    rarity: 'common',   desc: 'Shark interest -30%' },
    { id: 'DIRTY_COP',     name: 'Dirty Cop',     rarity: 'uncommon', desc: 'Bust chance -50%' },
    { id: 'TRAP_HOUSE',    name: 'Trap House',    rarity: 'uncommon', desc: 'Drugs safe from robbery' },
    { id: 'BANK_INSIDER',  name: 'Bank Insider',  rarity: 'uncommon', desc: 'Bank interest 5%' },
    { id: 'CARTEL_LINK',   name: 'Cartel Link',   rarity: 'rare',     desc: 'Cocaine & heroin -40%' },
    { id: 'CROOKED_POL',   name: 'Crooked Politician', rarity: 'rare', desc: 'Immune to busts' },
    { id: 'KINGPIN_FAVOR', name: 'Kingpin\'s Favor', rarity: 'rare',  desc: 'Free $2k loan/round' },
    { id: 'DUFFLE_BAG',    name: 'Duffle Bag',    rarity: 'rare',     desc: 'Double bag capacity' },
    { id: 'BURNER_PHONE',  name: 'Burner Phone',  rarity: 'rare',     desc: 'See tomorrow\'s prices' },
];

const MAX_CONNECTIONS = 5;

const SPIKE_MESSAGES = [
    '{drug} drought — supply cut off!',
    '{drug} shipment seized — prices explode!',
    'Massive {drug} shortage across the city!',
    '{drug} lab busted — street price soars!',
];

const CRASH_MESSAGES = [
    '{drug} flooding the streets — prices tank!',
    'Huge {drug} shipment just landed — dirt cheap!',
    '{drug} glut — dealers dumping stock!',
    'New {drug} supplier undercuts everyone!',
];

// --- Map layout (percentage-based positions within the map area) ---

const MAP_LOCATIONS = [
    // Boroughs — matched to the map-bg.png image (uniform 16x12% boxes)
    { id: 'bronx',     name: 'THE BRONX',   type: 'borough', top: 4,  left: 58, w: 16, h: 12 },
    { id: 'harlem',    name: 'HARLEM',       type: 'borough', top: 8,  left: 42, w: 16, h: 12 },
    { id: 'manhattan', name: 'MANHATTAN',    type: 'borough', top: 28, left: 36, w: 16, h: 12 },
    { id: 'queens',    name: 'QUEENS',       type: 'borough', top: 24, left: 58, w: 16, h: 12 },
    { id: 'brooklyn',  name: 'BROOKLYN',     type: 'borough', top: 48, left: 46, w: 16, h: 12 },
    // Special locations — bottom area, above card tray
    { id: 'connect',   name: 'THE CONNECT',  type: 'special', top: 62, left: 8,  w: 16, h: 12 },
    { id: 'bank',      name: 'THE BANK',     type: 'special', top: 62, left: 34, w: 16, h: 12 },
    { id: 'shark',     name: 'THE SHARK',    type: 'special', top: 62, left: 60, w: 16, h: 12 },
];

// --- State ---------------------------------------------------

let state = {};
let pendingCardOffer = null;
let pendingDiscard = null;
let shopCards = [];
let tomorrowSpikes = [];
let tomorrowCrashes = [];
let subwaySecondVisit = false;

function newGameState() {
    return {
        day: 1,
        round: 1,
        rank: 1,
        cash: 500,
        bank: 0,
        debt: 0,
        bag: [],
        bagCapacity: 15,
        connections: [],
        prices: {},
        spikes: [],
        crashes: [],
        snitchActive: false,
        subwayUsed: false,
        kingpinLoanUsed: false,
        selectedLocation: null,
        dayTransactions: [],
    };
}

// --- Helpers --------------------------------------------------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function fmt(n) {
    return '$' + Math.floor(n).toLocaleString();
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function hasConnection(id) {
    return state.connections.some((c) => c.id === id);
}

function getUnlockedDrugs() {
    const unlocked = new Set();
    for (let i = 0; i < state.rank; i++) {
        RANKS[i].unlocks.forEach((d) => unlocked.add(d));
    }
    return DRUGS.filter((d) => unlocked.has(d.id));
}

function getBagCount() {
    return state.bag.reduce((sum, item) => sum + item.quantity, 0);
}

function getBagCapacity() {
    let cap = state.bagCapacity;
    if (hasConnection('BIGGER_STASH')) cap += 5;
    if (hasConnection('DUFFLE_BAG')) cap *= 2;
    return cap;
}

function getBagItem(drugId) {
    return state.bag.find((b) => b.drug === drugId);
}

function addToBag(drugId, qty, totalCost = 0) {
    const existing = getBagItem(drugId);
    if (existing) {
        existing.totalCost = (existing.totalCost || 0) + totalCost;
        existing.quantity += qty;
    } else {
        state.bag.push({ drug: drugId, quantity: qty, totalCost });
    }
}

function removeFromBag(drugId, qty) {
    const existing = getBagItem(drugId);
    if (!existing) return;
    if (existing.totalCost && existing.quantity > 0) {
        const costPerUnit = existing.totalCost / existing.quantity;
        existing.totalCost -= costPerUnit * qty;
    }
    existing.quantity -= qty;
    if (existing.quantity <= 0) {
        state.bag = state.bag.filter((b) => b.drug !== drugId);
    }
}

function getNetWorth() {
    let drugValue = 0;
    state.bag.forEach((item) => {
        let totalPrice = 0;
        let count = 0;
        BOROUGHS.forEach((b) => {
            if (state.prices[b.id] && state.prices[b.id][item.drug]) {
                totalPrice += state.prices[b.id][item.drug].sell;
                count++;
            }
        });
        if (count > 0) drugValue += (totalPrice / count) * item.quantity;
    });
    return Math.floor(state.cash + state.bank + drugValue);
}

function getCardPrice(rarity) {
    const roundIdx = Math.min(state.round - 1, 7);
    return CARD_PRICES[rarity][roundIdx];
}

function rollRarity() {
    const r = Math.random();
    if (r < 0.10) return 'rare';
    if (r < 0.40) return 'uncommon';
    return 'common';
}

function getRandomCard(excludeIds = []) {
    const ownedIds = state.connections.map((c) => c.id);
    const allExcluded = new Set([...ownedIds, ...excludeIds]);
    const rarity = rollRarity();
    const pool = CONNECTIONS.filter((c) => c.rarity === rarity && !allExcluded.has(c.id));
    if (pool.length === 0) {
        // Fallback: try any rarity not excluded
        const anyPool = CONNECTIONS.filter((c) => !allExcluded.has(c.id));
        if (anyPool.length === 0) return null;
        return { ...pick(anyPool) };
    }
    return { ...pick(pool) };
}

function getRankInfo() {
    return RANKS[state.rank - 1];
}

// --- HUD (always visible) ------------------------------------

function updateHud() {
    const hud = $('#hud');
    if (!state.rank) {
        hud.classList.add('hidden');
        return;
    }
    hud.classList.remove('hidden');
    const rank = getRankInfo();
    const isMobile = window.innerWidth <= 820;
    $('#hud-rank').textContent = rank.title;
    $('#hud-round-day').textContent = `R${state.round} D${state.day}/7`;
    $('#hud-target').textContent = `TARGET: ${fmt(rank.target)}`;
    $('#hud-cash').textContent = isMobile ? fmt(state.cash) : `Cash ${fmt(state.cash)}`;
    const bankEl = $('#hud-bank');
    if (isMobile && state.bank === 0) {
        bankEl.textContent = '';
    } else {
        bankEl.textContent = isMobile ? `B:${fmt(state.bank)}` : `Bank ${fmt(state.bank)}`;
    }
    const debtEl = $('#hud-debt');
    if (state.debt > 0) {
        debtEl.textContent = isMobile ? `D:${fmt(state.debt)}` : `Debt ${fmt(state.debt)}`;
        debtEl.classList.remove('hidden');
    } else {
        debtEl.textContent = '';
    }
    $('#hud-bag').textContent = `${getBagCount()}/${getBagCapacity()}`;
    updateCardTray();
}

function updateCardTray() {
    const tray = $('#card-tray');
    if (!state.rank) {
        tray.classList.add('hidden');
        return;
    }
    tray.classList.remove('hidden');
    const slots = $('#card-tray-slots');
    let html = '';
    for (let i = 0; i < MAX_CONNECTIONS; i++) {
        const card = state.connections[i];
        if (card) {
            html += `<div class="tray-slot filled card-${card.rarity}">
                <div class="tray-card-rarity">${card.rarity.toUpperCase()}</div>
                <div class="tray-card-name">${card.name}</div>
                <div class="tray-card-desc">${card.desc}</div>
                <div class="tray-tooltip card-${card.rarity}">
                    <div class="tray-tooltip-name">${card.name}</div>
                    <div class="tray-tooltip-rarity">${card.rarity.toUpperCase()}</div>
                    <div class="tray-tooltip-desc">${card.desc}</div>
                </div>
            </div>`;
        } else {
            html += `<div class="tray-slot empty"></div>`;
        }
    }
    slots.innerHTML = html;

    // Tap-to-toggle tooltips on mobile
    slots.querySelectorAll('.tray-slot.filled').forEach((slot) => {
        slot.addEventListener('click', () => {
            const wasActive = slot.classList.contains('tooltip-active');
            slots.querySelectorAll('.tray-slot.filled').forEach((s) =>
                s.classList.remove('tooltip-active'),
            );
            if (!wasActive) slot.classList.add('tooltip-active');
        });
    });
}

// --- Price Engine ---------------------------------------------

function generateDailyPrices() {
    state.prices = {};
    state.spikes = [];
    state.crashes = [];
    const drugs = getUnlockedDrugs();

    const spikedDrugs = new Set();
    const crashedDrugs = new Set();
    if (state.day >= 4) {
        drugs.forEach((drug) => {
            if (Math.random() < drug.spikeChance) {
                // 50/50 chance of spike (high) vs crash (low)
                if (Math.random() < 0.5) {
                    spikedDrugs.add(drug.id);
                    state.spikes.push(drug.id);
                } else {
                    crashedDrugs.add(drug.id);
                    state.crashes.push(drug.id);
                }
            }
        });
    }

    BOROUGHS.forEach((borough) => {
        state.prices[borough.id] = {};
        drugs.forEach((drug) => {
            const isSpiked = spikedDrugs.has(drug.id);
            const isCrashed = crashedDrugs.has(drug.id);

            let basePrice;
            if (isSpiked) {
                basePrice = randInt(drug.spikeMin, drug.spikeMax);
            } else if (isCrashed) {
                basePrice = randInt(drug.crashMin, drug.crashMax);
            } else {
                basePrice = randInt(drug.min, drug.max);
            }

            let buyPrice = Math.floor(basePrice * borough.buyMult);
            let sellPrice = Math.floor(basePrice * borough.sellMult);

            if (borough.id === 'harlem' && (drug.id === 'heroin' || drug.id === 'cocaine')) {
                sellPrice = Math.floor(sellPrice * 1.15);
            }
            if (borough.id === 'queens' && (drug.id === 'mdma' || drug.id === 'ketamine' || drug.id === 'acid')) {
                sellPrice = Math.floor(sellPrice * 1.15);
            }
            if (borough.id === 'brooklyn' && (drug.id === 'weed' || drug.id === 'hashish')) {
                sellPrice = Math.floor(sellPrice * 1.1);
            }
            if (hasConnection('STREET_CRED')) {
                sellPrice = Math.floor(sellPrice * 1.05);
            }
            if (hasConnection('CORNER_BOY') && borough.id === 'brooklyn') {
                sellPrice = Math.floor(sellPrice * 1.10);
            }

            state.prices[borough.id][drug.id] = { buy: buyPrice, sell: sellPrice };
        });
    });

    tomorrowSpikes = [];
    tomorrowCrashes = [];
    drugs.forEach((drug) => {
        if (Math.random() < drug.spikeChance) {
            if (Math.random() < 0.5) {
                tomorrowSpikes.push(drug.id);
            } else {
                tomorrowCrashes.push(drug.id);
            }
        }
    });
}

// --- Risk Engine ----------------------------------------------

function rollRiskEvents() {
    const events = [];
    if (state.day < 4) return events;

    if (Math.random() < 0.05) {
        events.push({ type: 'snitch', msg: 'A SNITCH is talking to the cops! Tomorrow\'s bust chance is doubled.' });
    }

    let bustChance = 0.10;
    if (state.snitchActive) bustChance = 0.20;
    if (hasConnection('DIRTY_COP')) bustChance *= 0.5;
    if (hasConnection('CROOKED_POL')) bustChance = 0;

    if (Math.random() < bustChance) {
        let cashLoss = 0.3;
        if (hasConnection('FAKE_ID')) cashLoss *= 0.5;

        let unitsLost = Math.floor(getBagCount() * 0.6);
        if (hasConnection('POCKET_STASH')) unitsLost = Math.max(0, unitsLost - 3);

        let toRemove = unitsLost;
        const removedDrugs = [];
        const shuffledBag = [...state.bag].sort(() => Math.random() - 0.5);
        for (const item of shuffledBag) {
            if (toRemove <= 0) break;
            const removeQty = Math.min(item.quantity, toRemove);
            removedDrugs.push(`${removeQty}x ${DRUGS.find((d) => d.id === item.drug).name}`);
            removeFromBag(item.drug, removeQty);
            toRemove -= removeQty;
        }

        const cashTaken = Math.floor(state.cash * cashLoss);
        state.cash -= cashTaken;

        let msg = `POLICE BUST! Lost ${fmt(cashTaken)} cash`;
        if (removedDrugs.length > 0) msg += ` and ${removedDrugs.join(', ')}`;
        if (hasConnection('FAKE_ID')) msg += ' (Fake ID)';
        if (hasConnection('POCKET_STASH')) msg += ' (Pocket Stash)';
        events.push({ type: 'bust', msg });
    }

    let robberyChance = 0.15;
    if (state.selectedLocation === 'bronx') robberyChance = 0.25;
    if (hasConnection('MUSCLE')) robberyChance = 0;

    if (Math.random() < robberyChance) {
        if (hasConnection('QUICK_FEET') && Math.random() < 0.3) {
            events.push({ type: 'robbery_escaped', msg: 'Robbery attempt! Quick Feet — you escaped!' });
        } else {
            const cashTaken = Math.floor(state.cash * 0.35);
            state.cash -= cashTaken;
            events.push({ type: 'robbery', msg: `ROBBED! Lost ${fmt(cashTaken)} cash.` });
        }
    }

    state.snitchActive = events.some((e) => e.type === 'snitch');
    return events;
}

// --- Screen Management ----------------------------------------

const SCREENS = [
    'screen-title', 'screen-day-start', 'screen-location-select',
    'screen-location-action', 'screen-day-end', 'screen-round-end',
    'screen-game-over', 'screen-win',
];

function showScreen(id) {
    SCREENS.forEach((s) => {
        document.getElementById(s).classList.toggle('hidden', s !== id);
    });
    $('#modal-discard').classList.add('hidden');

    const showHud = id !== 'screen-title' && id !== 'screen-game-over' && id !== 'screen-win';
    if (showHud) {
        updateHud();
    } else {
        $('#hud').classList.add('hidden');
        $('#card-tray').classList.add('hidden');
    }
}

// --- Canvas (background only) --------------------------------

const canvas = $('#game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = $('#game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function clearCanvas() {
    resizeCanvas();
    ctx.fillStyle = '#0c0c0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --- Screen: Title -------------------------------------------

function initTitle() {
    showScreen('screen-title');
    clearCanvas();
}

// --- Screen: Day Start (now embedded in the map) -------------

function initDayStart() {
    generateDailyPrices();
    state.dayTransactions = [];
    subwaySecondVisit = false;

    // Kingpin's Favor
    if (hasConnection('KINGPIN_FAVOR') && state.day === 1 && !state.kingpinLoanUsed) {
        state.cash += 2000;
        state.kingpinLoanUsed = true;
    }

    // Build events
    const riskEvents = rollRiskEvents();
    let eventsHtml = '';

    riskEvents.forEach((evt) => {
        const cls = evt.type === 'robbery_escaped' ? 'event-safe' : 'event-danger';
        eventsHtml += `<div class="event-msg ${cls}">${evt.msg}</div>`;
    });

    state.spikes.forEach((drugId) => {
        const drug = DRUGS.find((d) => d.id === drugId);
        const msg = pick(SPIKE_MESSAGES).replace('{drug}', drug.name);
        eventsHtml += `<div class="event-msg event-spike">${msg}</div>`;
    });

    state.crashes.forEach((drugId) => {
        const drug = DRUGS.find((d) => d.id === drugId);
        const msg = pick(CRASH_MESSAGES).replace('{drug}', drug.name);
        eventsHtml += `<div class="event-msg event-crash">${msg}</div>`;
    });

    if (hasConnection('KINGPIN_FAVOR') && state.day === 1 && state.kingpinLoanUsed) {
        eventsHtml += `<div class="event-msg event-info">Kingpin's Favor: +$2,000!</div>`;
    }

    if (hasConnection('SUPPLIER_TIP') && (tomorrowSpikes.length > 0 || tomorrowCrashes.length > 0)) {
        if (tomorrowSpikes.length > 0) {
            const names = tomorrowSpikes.map((id) => DRUGS.find((d) => d.id === id).name).join(', ');
            eventsHtml += `<div class="event-msg event-info">Supplier Tip: Shortage tomorrow — ${names}</div>`;
        }
        if (tomorrowCrashes.length > 0) {
            const names = tomorrowCrashes.map((id) => DRUGS.find((d) => d.id === id).name).join(', ');
            eventsHtml += `<div class="event-msg event-info">Supplier Tip: Glut tomorrow — ${names}</div>`;
        }
    }

    if (hasConnection('LOOKOUT') && state.day >= 3) {
        eventsHtml += `<div class="event-msg event-info">Lookout: Cops planning something tomorrow.</div>`;
    }

    // Random card offer (20%)
    let cardOfferHtml = '';
    pendingCardOffer = null;
    if (Math.random() < 0.20) {
        pendingCardOffer = getRandomCard();
        if (pendingCardOffer) {
            const price = getCardPrice(pendingCardOffer.rarity);
            const borderClass = `card-${pendingCardOffer.rarity}`;
            cardOfferHtml = `
                <div class="map-card-offer">
                    <div class="connection-card ${borderClass}" style="width:100%">
                        <div class="card-name">${pendingCardOffer.name}</div>
                        <div class="card-rarity">${pendingCardOffer.rarity.toUpperCase()}</div>
                        <div class="card-desc">${pendingCardOffer.desc}</div>
                        <div class="card-price">${fmt(price)}</div>
                    </div>
                    <div style="display:flex;gap:4px;margin-top:4px">
                        <button class="btn btn-buy btn-small" id="btn-buy-offer" ${state.cash < price ? 'disabled' : ''}>BUY</button>
                        <button class="btn btn-secondary btn-small" id="btn-skip-offer">SKIP</button>
                    </div>
                </div>
            `;
        }
    }

    // Random bag upgrade offer (10%)
    let bagOfferHtml = '';
    const bagPrice = BAG_UPGRADE_PRICES[Math.min(state.round - 1, 7)];
    if (Math.random() < BAG_UPGRADE_CHANCE) {
        bagOfferHtml = `
            <div class="map-card-offer">
                <div class="connection-card card-uncommon" style="width:100%">
                    <div class="card-name">Bigger Bag</div>
                    <div class="card-rarity">UPGRADE</div>
                    <div class="card-desc">+1 bag capacity</div>
                    <div class="card-price">${fmt(bagPrice)}</div>
                </div>
                <div style="display:flex;gap:4px;margin-top:4px">
                    <button class="btn btn-buy btn-small" id="btn-buy-bag" ${state.cash < bagPrice ? 'disabled' : ''}>BUY</button>
                    <button class="btn btn-secondary btn-small" id="btn-skip-bag">SKIP</button>
                </div>
            </div>
        `;
    }

    // Build bag summary
    const cap = getBagCapacity();
    const count = getBagCount();
    let bagHtml = '';
    if (state.bag.length > 0) {
        state.bag.forEach((item) => {
            const drug = DRUGS.find((d) => d.id === item.drug);
            bagHtml += `<span class="bag-item">${drug.name} x${item.quantity}</span>`;
        });
    }

    // Store simplified info for map sidebar
    state._dayInfo = { bagHtml, bagCount: count, bagCap: cap };

    // Show day-start screen
    showScreen('screen-day-start');
    $('#ds-day-title').textContent = `DAY ${state.day} OF 7`;
    $('#ds-bag').innerHTML = bagHtml
        ? `<div style="margin-bottom:4px;font-weight:bold;">BAG (${count}/${cap})</div>${bagHtml}`
        : `<div style="font-weight:bold;">BAG EMPTY (0/${cap})</div>`;
    $('#ds-events').innerHTML = eventsHtml || '<div class="event-msg event-safe">All quiet on the streets.</div>';

    const offerEl = $('#ds-card-offer');
    if (cardOfferHtml) {
        offerEl.innerHTML = cardOfferHtml;
        offerEl.classList.remove('hidden');
        const buyBtn = document.getElementById('btn-buy-offer');
        const skipBtn = document.getElementById('btn-skip-offer');
        if (buyBtn) {
            buyBtn.onclick = () => {
                buyCard(pendingCardOffer, getCardPrice(pendingCardOffer.rarity));
                pendingCardOffer = null;
                offerEl.classList.add('hidden');
                updateHud();
            };
        }
        if (skipBtn) {
            skipBtn.onclick = () => {
                pendingCardOffer = null;
                offerEl.classList.add('hidden');
            };
        }
    } else {
        offerEl.innerHTML = '';
        offerEl.classList.add('hidden');
    }

    const bagOfferEl = $('#ds-bag-offer');
    if (bagOfferHtml) {
        bagOfferEl.innerHTML = bagOfferHtml;
        bagOfferEl.classList.remove('hidden');
        const buyBagBtn = document.getElementById('btn-buy-bag');
        const skipBagBtn = document.getElementById('btn-skip-bag');
        if (buyBagBtn) {
            buyBagBtn.onclick = () => {
                if (state.cash >= bagPrice) {
                    state.cash -= bagPrice;
                    state.bagCapacity += 1;
                    state.dayTransactions.push(`Bag upgrade +1 for ${fmt(bagPrice)}`);
                    bagOfferEl.classList.add('hidden');
                    updateHud();
                }
            };
        }
        if (skipBagBtn) {
            skipBagBtn.onclick = () => {
                bagOfferEl.classList.add('hidden');
            };
        }
    } else {
        bagOfferEl.innerHTML = '';
        bagOfferEl.classList.add('hidden');
    }
}

// --- Buy Card ------------------------------------------------

function buyCard(card, price) {
    if (state.cash < price) return;
    if (state.connections.length >= MAX_CONNECTIONS) {
        pendingDiscard = { card, price };
        showDiscardModal();
        return;
    }
    state.cash -= price;
    state.connections.push({ ...card });
    state.dayTransactions.push(`Bought ${card.name} for ${fmt(price)}`);
    updateHud();
}

function showDiscardModal() {
    const modal = $('#modal-discard');
    modal.classList.remove('hidden');
    const container = $('#discard-cards');
    container.innerHTML = '';
    state.connections.forEach((c, idx) => {
        const div = document.createElement('div');
        div.className = `connection-card card-${c.rarity}`;
        div.innerHTML = `
            <div class="card-name">${c.name}</div>
            <div class="card-rarity">${c.rarity.toUpperCase()}</div>
            <div class="card-desc">${c.desc}</div>
        `;
        div.onclick = () => {
            state.connections.splice(idx, 1);
            if (pendingDiscard) {
                state.cash -= pendingDiscard.price;
                state.connections.push({ ...pendingDiscard.card });
                state.dayTransactions.push(`Bought ${pendingDiscard.card.name} for ${fmt(pendingDiscard.price)}`);
                if (pendingDiscard.shopIdx !== undefined) {
                    shopCards[pendingDiscard.shopIdx] = null;
                }
                pendingDiscard = null;
            }
            modal.classList.add('hidden');
            updateHud();
            if (!$('#screen-location-action').classList.contains('hidden')) {
                renderLocationAction(state.selectedLocation);
            }
        };
        container.appendChild(div);
    });
    $('#btn-cancel-discard').onclick = () => {
        pendingDiscard = null;
        modal.classList.add('hidden');
    };
}

// --- Screen: Location Select (HTML map with day info) --------

function initLocationSelect() {
    showScreen('screen-location-select');

    const screen = $('#screen-location-select');
    const info = state._dayInfo || {};

    let html = '<div class="map-container">';

    // Side panel with day number + bag summary
    html += '<div class="map-sidebar">';
    html += `<div class="map-sidebar-title">DAY ${state.day} OF 7</div>`;

    if (info.bagHtml) {
        html += `<div class="map-sidebar-bag">${info.bagHtml}</div>`;
    }

    html += '</div>';

    // Map regions
    MAP_LOCATIONS.forEach((loc) => {
        const cls = loc.type === 'borough' ? 'map-borough' : 'map-special';
        html += `<div class="map-region ${cls}" data-loc="${loc.id}"
            style="top:${loc.top}%;left:${loc.left}%;width:${loc.w}%;height:${loc.h}%">
            <span class="map-region-name">${loc.name}</span>
        </div>`;
    });

    html += '</div>';
    screen.innerHTML = html;

    // Click handlers for map regions
    screen.querySelectorAll('.map-region').forEach((el) => {
        el.addEventListener('click', () => {
            state.selectedLocation = el.dataset.loc;
            initLocationAction(el.dataset.loc);
        });
    });

}

// --- Screen: Location Action ---------------------------------

function initLocationAction(locId) {
    showScreen('screen-location-action');
    state.selectedLocation = locId;
    renderLocationAction(locId);
}

function renderLocationAction(locId) {
    updateHud();

    const borough = BOROUGHS.find((b) => b.id === locId);
    const special = SPECIAL_LOCATIONS.find((s) => s.id === locId);

    if (borough) {
        $('#la-location-name').textContent = borough.name;
        renderBoroughAction(locId);
    } else if (special) {
        $('#la-location-name').textContent = special.name;
        if (locId === 'connect') renderConnectAction();
        else if (locId === 'bank') renderBankAction();
        else if (locId === 'shark') renderSharkAction();
    }

    // Subway pass
    const subBtn = $('#btn-subway');
    if (hasConnection('SUBWAY_PASS') && !state.subwayUsed && !subwaySecondVisit) {
        subBtn.classList.remove('hidden');
        subBtn.onclick = () => {
            state.subwayUsed = true;
            subwaySecondVisit = true;
            subBtn.classList.add('hidden');
            initLocationSelect();
        };
    } else {
        subBtn.classList.add('hidden');
    }
}

function renderBoroughAction(boroughId) {
    const content = $('#la-content');
    const drugs = getUnlockedDrugs();
    const prices = state.prices[boroughId];

    let html = `<div class="drug-table-header">
        <span class="drug-col-name">DRUG</span>
        <span class="drug-col-price">BUY</span>
        <span class="drug-col-price">SELL</span>
        <span class="drug-col-held">HELD</span>
        <span class="drug-col-trade" style="margin-left:auto;width:180px;text-align:center">TRADE</span>
    </div>`;

    drugs.forEach((drug) => {
        const p = prices[drug.id];
        if (!p) return;
        const held = getBagItem(drug.id);
        const heldQty = held ? held.quantity : 0;
        const spiked = state.spikes.includes(drug.id);
        const crashed = state.crashes.includes(drug.id);
        const spikeClass = spiked ? 'price-spike' : crashed ? 'price-crash' : '';

        let buyPrice = p.buy;
        if (hasConnection('HAGGLER')) buyPrice = Math.floor(buyPrice * 0.9);
        if (hasConnection('CARTEL_LINK') && (drug.id === 'cocaine' || drug.id === 'heroin')) {
            buyPrice = Math.floor(buyPrice * 0.6);
        }

        const maxBuyable = Math.min(
            buyPrice > 0 ? Math.floor(state.cash / buyPrice) : 0,
            getBagCapacity() - getBagCount()
        );

        const avgPrice = held && held.totalCost && held.quantity > 0
            ? fmt(Math.floor(held.totalCost / held.quantity))
            : '';
        const avgLabel = avgPrice ? ` <span class="drug-avg">avg ${avgPrice}</span>` : '';

        html += `
            <div class="drug-row">
                <span class="drug-col-name ${spikeClass}">${drug.name}${spiked ? ' *' : crashed ? ' v' : ''}${avgLabel}</span>
                <span class="drug-col-price ${spikeClass}">${fmt(buyPrice)}</span>
                <span class="drug-col-price ${spikeClass}">${fmt(p.sell)}</span>
                <span class="drug-col-held">${heldQty}</span>
                <div class="drug-controls">
                    <button class="btn btn-max" data-drug="${drug.id}" data-price="${buyPrice}" data-action="max-buy"
                        ${maxBuyable <= 0 ? 'disabled' : ''}>MAX</button>
                    <button class="btn btn-buy" data-drug="${drug.id}" data-price="${buyPrice}" data-action="buy"
                        ${maxBuyable <= 0 ? 'disabled' : ''}>BUY</button>
                    <input type="number" class="qty-input" id="qty-${drug.id}" value="1" min="1" max="99">
                    <button class="btn btn-sell" data-drug="${drug.id}" data-sell="${p.sell}" data-action="sell"
                        ${heldQty <= 0 ? 'disabled' : ''}>SELL</button>
                    <button class="btn btn-max" data-drug="${drug.id}" data-sell="${p.sell}" data-action="max-sell"
                        ${heldQty <= 0 ? 'disabled' : ''}>MAX</button>
                </div>
            </div>
        `;
    });

    content.innerHTML = html;

    // Attach trade handlers
    content.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const drugId = btn.dataset.drug;
            const action = btn.dataset.action;

            if (action === 'buy' || action === 'max-buy') {
                const price = parseInt(btn.dataset.price);
                const maxBuyable = Math.min(
                    price > 0 ? Math.floor(state.cash / price) : 0,
                    getBagCapacity() - getBagCount()
                );
                let qty;
                if (action === 'max-buy') {
                    qty = maxBuyable;
                } else {
                    const qtyInput = document.getElementById(`qty-${drugId}`);
                    qty = Math.min(parseInt(qtyInput.value) || 1, maxBuyable);
                }
                if (qty <= 0) return;
                const cost = price * qty;
                state.cash -= cost;
                addToBag(drugId, qty, cost);
                const drugName = DRUGS.find((d) => d.id === drugId).name;
                state.dayTransactions.push(`Bought ${qty}x ${drugName} for ${fmt(price * qty)}`);
            } else if (action === 'sell' || action === 'max-sell') {
                const sellPrice = parseInt(btn.dataset.sell);
                const held = getBagItem(drugId);
                if (!held) return;
                let qty;
                if (action === 'max-sell') {
                    qty = held.quantity;
                } else {
                    const qtyInput = document.getElementById(`qty-${drugId}`);
                    qty = Math.min(parseInt(qtyInput.value) || 1, held.quantity);
                }
                if (qty <= 0) return;
                state.cash += sellPrice * qty;
                removeFromBag(drugId, qty);
                const drugName = DRUGS.find((d) => d.id === drugId).name;
                state.dayTransactions.push(`Sold ${qty}x ${drugName} for ${fmt(sellPrice * qty)}`);
            }

            renderLocationAction(state.selectedLocation);
        });
    });
}

function renderConnectAction() {
    const content = $('#la-content');
    if (shopCards.length === 0) {
        const usedIds = [];
        shopCards = Array.from({ length: 5 }, () => {
            const card = getRandomCard(usedIds);
            if (card) usedIds.push(card.id);
            return card;
        });
    }

    let html = '<div class="card-shop">';
    shopCards.forEach((card, idx) => {
        if (!card) {
            html += '<div class="connection-card" style="opacity:0.2;border-color:var(--border)"><div class="card-name">SOLD</div></div>';
            return;
        }
        const price = getCardPrice(card.rarity);
        const canBuy = state.cash >= price;
        html += `
            <div class="connection-card card-${card.rarity}">
                <div class="card-name">${card.name}</div>
                <div class="card-rarity">${card.rarity.toUpperCase()}</div>
                <div class="card-desc">${card.desc}</div>
                <div class="card-price">${fmt(price)}</div>
                <button class="btn btn-buy btn-small" data-idx="${idx}" ${!canBuy ? 'disabled' : ''}>BUY</button>
            </div>
        `;
    });
    html += '</div>';

    content.innerHTML = html;

    content.querySelectorAll('.btn-buy').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.idx);
            const card = shopCards[idx];
            if (!card) return;
            const price = getCardPrice(card.rarity);
            if (state.cash < price) return;

            if (state.connections.length >= MAX_CONNECTIONS) {
                pendingDiscard = { card, price, shopIdx: idx };
                showDiscardModal();
                return;
            }

            state.cash -= price;
            state.connections.push({ ...card });
            state.dayTransactions.push(`Bought ${card.name} for ${fmt(price)}`);
            shopCards[idx] = null;
            renderLocationAction(state.selectedLocation);
        });
    });
}

function renderBankAction() {
    const content = $('#la-content');
    const interestRate = hasConnection('BANK_INSIDER') ? 5 : 3;

    content.innerHTML = `
        <div class="bank-ui">
            <div class="info-text">Bank Balance: <span style="color:var(--green)">${fmt(state.bank)}</span></div>
            <div class="info-text">Cash on Hand: ${fmt(state.cash)}</div>
            <div class="info-text">Daily Interest: ${interestRate}% compounding</div>
            <div class="info-text" style="color:var(--text-muted);margin-top:2px">Safe from robbery and busts.</div>
            <div style="margin-top:14px">
                <div style="font-size:8px;margin-bottom:6px">DEPOSIT</div>
                <input type="range" id="deposit-slider" min="0" max="${Math.floor(state.cash)}" value="0">
                <div class="amount-display" id="deposit-amount">${fmt(0)}</div>
                <button class="btn btn-buy btn-small" id="btn-deposit">DEPOSIT</button>
                <button class="btn btn-max btn-small" id="btn-deposit-max">ALL</button>
            </div>
            <div style="margin-top:14px">
                <div style="font-size:8px;margin-bottom:6px">WITHDRAW</div>
                <input type="range" id="withdraw-slider" min="0" max="${Math.floor(state.bank)}" value="0">
                <div class="amount-display" id="withdraw-amount">${fmt(0)}</div>
                <button class="btn btn-sell btn-small" id="btn-withdraw">WITHDRAW</button>
                <button class="btn btn-max btn-small" id="btn-withdraw-max">ALL</button>
            </div>
        </div>
    `;

    const depSlider = $('#deposit-slider');
    const witSlider = $('#withdraw-slider');
    depSlider.oninput = () => { $('#deposit-amount').textContent = fmt(parseInt(depSlider.value)); };
    witSlider.oninput = () => { $('#withdraw-amount').textContent = fmt(parseInt(witSlider.value)); };

    $('#btn-deposit-max').onclick = () => {
        depSlider.value = depSlider.max;
        $('#deposit-amount').textContent = fmt(parseInt(depSlider.max));
    };
    $('#btn-withdraw-max').onclick = () => {
        witSlider.value = witSlider.max;
        $('#withdraw-amount').textContent = fmt(parseInt(witSlider.max));
    };

    $('#btn-deposit').onclick = () => {
        const amount = parseInt(depSlider.value);
        if (amount <= 0 || amount > state.cash) return;
        state.cash -= amount;
        state.bank += amount;
        state.dayTransactions.push(`Deposited ${fmt(amount)}`);
        renderLocationAction('bank');
    };

    $('#btn-withdraw').onclick = () => {
        const amount = parseInt(witSlider.value);
        if (amount <= 0 || amount > state.bank) return;
        state.bank -= amount;
        state.cash += amount;
        state.dayTransactions.push(`Withdrew ${fmt(amount)}`);
        renderLocationAction('bank');
    };
}

function renderSharkAction() {
    const content = $('#la-content');
    const netWorth = getNetWorth();
    const maxBorrow = Math.max(0, Math.floor(netWorth * 1.0) - state.debt);
    const interestRate = hasConnection('ACCOUNTANT') ? 4.9 : 7;

    content.innerHTML = `
        <div class="shark-ui">
            <div class="info-text">Current Debt: <span style="color:var(--red)">${fmt(state.debt)}</span></div>
            <div class="info-text">Cash on Hand: ${fmt(state.cash)}</div>
            <div class="info-text">Net Worth: ${fmt(netWorth)}</div>
            <div class="info-text" style="color:var(--red)">Interest: ${interestRate}%/day compounding</div>
            <div class="info-text" style="color:var(--red-dark)">Unpaid debt at round end = GAME OVER</div>
            <div style="margin-top:14px">
                <div style="font-size:8px;margin-bottom:6px">BORROW</div>
                <input type="range" id="borrow-slider" min="0" max="${maxBorrow}" value="0">
                <div class="amount-display" id="borrow-amount">${fmt(0)}</div>
                <button class="btn btn-buy btn-small" id="btn-borrow" ${maxBorrow <= 0 ? 'disabled' : ''}>BORROW</button>
                <button class="btn btn-max btn-small" id="btn-borrow-max" ${maxBorrow <= 0 ? 'disabled' : ''}>MAX</button>
            </div>
            <div style="margin-top:14px">
                <div style="font-size:8px;margin-bottom:6px">REPAY</div>
                <input type="range" id="repay-slider" min="0" max="${Math.min(Math.floor(state.cash), Math.floor(state.debt))}" value="0">
                <div class="amount-display" id="repay-amount">${fmt(0)}</div>
                <button class="btn btn-sell btn-small" id="btn-repay" ${state.debt <= 0 ? 'disabled' : ''}>REPAY</button>
                <button class="btn btn-max btn-small" id="btn-repay-max" ${state.debt <= 0 ? 'disabled' : ''}>ALL</button>
            </div>
        </div>
    `;

    const borSlider = $('#borrow-slider');
    const repSlider = $('#repay-slider');
    borSlider.oninput = () => { $('#borrow-amount').textContent = fmt(parseInt(borSlider.value)); };
    repSlider.oninput = () => { $('#repay-amount').textContent = fmt(parseInt(repSlider.value)); };

    $('#btn-borrow-max').onclick = () => {
        borSlider.value = borSlider.max;
        $('#borrow-amount').textContent = fmt(parseInt(borSlider.max));
    };
    $('#btn-repay-max').onclick = () => {
        repSlider.value = repSlider.max;
        $('#repay-amount').textContent = fmt(parseInt(repSlider.max));
    };

    $('#btn-borrow').onclick = () => {
        const amount = parseInt(borSlider.value);
        if (amount <= 0) return;
        state.cash += amount;
        state.debt += amount;
        state.dayTransactions.push(`Borrowed ${fmt(amount)}`);
        renderLocationAction('shark');
    };

    $('#btn-repay').onclick = () => {
        const amount = parseInt(repSlider.value);
        if (amount <= 0 || amount > state.cash) return;
        state.cash -= amount;
        state.debt = Math.max(0, state.debt - amount);
        state.dayTransactions.push(`Repaid ${fmt(amount)}`);
        renderLocationAction('shark');
    };
}

// --- Screen: Day End -----------------------------------------

function initDayEnd() {
    showScreen('screen-day-end');

    const bankRate = hasConnection('BANK_INSIDER') ? 0.05 : 0.03;
    const bankInterest = Math.floor(state.bank * bankRate);
    state.bank += bankInterest;

    if (state.debt > 0) {
        const sharkRate = hasConnection('ACCOUNTANT') ? 0.049 : 0.07;
        const sharkInterest = Math.floor(state.debt * sharkRate);
        state.debt += sharkInterest;
    }

    const summary = $('#de-summary');
    let html = '<div>';

    if (state.dayTransactions.length === 0) {
        html += '<div class="label">No transactions today.</div>';
    } else {
        state.dayTransactions.forEach((t) => { html += `<div>${t}</div>`; });
    }

    html += '<div style="margin-top:6px;border-top:1px solid var(--border);padding-top:6px">';
    if (bankInterest > 0) {
        html += `<div class="positive">Bank +${fmt(bankInterest)} (${fmt(state.bank)})</div>`;
    }
    if (state.debt > 0) {
        html += `<div class="negative">Shark debt: ${fmt(state.debt)}</div>`;
    }
    html += `<div style="margin-top:4px;color:var(--text)">Net Worth: ${fmt(getNetWorth())} / ${fmt(getRankInfo().target)}</div>`;
    html += '</div></div>';

    summary.innerHTML = html;
    updateHud();

    const nextBtn = $('#btn-next-day');
    nextBtn.textContent = state.day >= 7 ? 'END ROUND' : 'NEXT DAY';
}

// --- Screen: Round End ---------------------------------------

function initRoundEnd() {
    showScreen('screen-round-end');

    const netWorth = getNetWorth();
    const rank = getRankInfo();
    const target = rank.target;

    if (state.debt > 0) {
        gameOver('Unpaid debt to the Loan Shark. You sleep with the fishes.');
        return;
    }

    if (netWorth < target) {
        gameOver(`Net worth ${fmt(netWorth)} fell short of ${fmt(target)}. The organization has no use for you.`);
        return;
    }

    if (state.rank >= 8) {
        initWin();
        return;
    }

    $('#re-title').textContent = 'RANK UP!';
    const nextRank = RANKS[state.rank];
    let html = `<div>
        <div>Net Worth: <span class="positive">${fmt(netWorth)}</span> / ${fmt(target)}</div>
        <div style="margin:8px 0;font-size:10px;color:var(--gold)">You are now: ${nextRank.title}</div>
    `;
    if (nextRank.unlocks.length > 0) {
        const names = nextRank.unlocks.map((id) => DRUGS.find((d) => d.id === id).name).join(', ');
        html += `<div class="positive">New drugs: ${names}</div>`;
    }
    html += `<div style="margin-top:6px">Next target: ${fmt(nextRank.target)}</div></div>`;

    $('#re-content').innerHTML = html;
    $('#btn-next-round').classList.remove('hidden');

    state.rank++;
    state.round++;
    state.day = 1;
    state.subwayUsed = false;
    state.kingpinLoanUsed = false;
    state.snitchActive = false;
}

// --- Screen: Game Over ---------------------------------------

function gameOver(reason) {
    showScreen('screen-game-over');
    $('#go-reason').textContent = reason;
    $('#go-stats').innerHTML = `<div>
        <div>Final Rank: ${getRankInfo().title}</div>
        <div>Round ${state.round} | Day ${state.day}</div>
        <div>Cash: ${fmt(state.cash)}</div>
        <div>Bank: ${fmt(state.bank)}</div>
        <div>Net Worth: ${fmt(getNetWorth())}</div>
    </div>`;
}

// --- Screen: Win ---------------------------------------------

function initWin() {
    showScreen('screen-win');
    $('#win-stats').innerHTML = `<div>
        <div style="color:var(--gold);font-size:9px">THE KINGPIN</div>
        <div>Cash: ${fmt(state.cash)}</div>
        <div>Bank: ${fmt(state.bank)}</div>
        <div>Net Worth: ${fmt(getNetWorth())}</div>
        <div>Connections: ${state.connections.map((c) => c.name).join(', ') || 'None'}</div>
    </div>`;
}

// --- Music ---------------------------------------------------

function startMusic() {
    const music = document.getElementById('bg-music');
    if (music.paused) {
        music.volume = 0.4;
        music.play().catch(() => {});
    }
}

// --- Event Wiring --------------------------------------------

$('#btn-new-game').addEventListener('click', () => {
    startMusic();
    state = newGameState();
    shopCards = [];
    initDayStart();
});

$('#btn-end-day').addEventListener('click', () => {
    shopCards = [];
    initDayEnd();
});

$('#btn-next-day').addEventListener('click', () => {
    if (state.day >= 7) {
        initRoundEnd();
    } else {
        state.day++;
        initDayStart();
    }
});

$('#btn-next-round').addEventListener('click', () => {
    shopCards = [];
    initDayStart();
});

$('#btn-proceed').addEventListener('click', () => {
    initLocationSelect();
});

$('#btn-restart').addEventListener('click', () => {
    startMusic();
    state = newGameState();
    shopCards = [];
    initTitle();
});

$('#btn-win-restart').addEventListener('click', () => {
    startMusic();
    state = newGameState();
    shopCards = [];
    initTitle();
});

// --- Init ----------------------------------------------------
initTitle();
