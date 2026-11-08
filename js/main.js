// Sound feedback
let audioCtx = null;
let isAudioMuted = true;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
}

function playUiSound(type) {
    if (isAudioMuted) return;
    try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'node') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'push') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(650, now);
            osc.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    } catch (e) {
        // Audio safely bypassed
    }
}

function toggleAudioFeedback() {
    isAudioMuted = !isAudioMuted;
    const icon = document.getElementById('soundIcon');
    const text = document.getElementById('soundStateText');
    if (icon) {
        if (isAudioMuted) {
            icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        } else {
            icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path class="sound-wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path class="sound-wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
        }
    }
    if (text) text.innerText = isAudioMuted ? 'Выкл' : 'Вкл';
    document.getElementById('soundToggleBtn').classList.toggle('muted', isAudioMuted);
    if (!isAudioMuted) playUiSound('click');
}

function showToast(message, icon = '✦') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    const icoEl = document.getElementById('toastIcon');
    const msgEl = document.getElementById('toastMessage');
    if (icoEl) icoEl.innerText = icon;
    if (msgEl) msgEl.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// N8N WORKFLOWS DATA
const WORKFLOWS_DATA = [
    {
        name: "n8n-workflows/lead-funnel.json",
        download: "n8n-workflows/lead-funnel.json",
        nodes: [
            { name: "Webhook: Заявка с сайта", sub: "POST /lead-capture", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', color: "#ff6d5a" },
            { name: "Code: Валидация & Скоринг", sub: "Clean Phone, Geo, High Intent", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', color: "#ffb800" },
            { name: "CRM: Создание сделки", sub: "Bitrix24 / AmoCRM Deals", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>', color: "#3b82f6" },
            { name: "Telegram: Push руководителю", sub: "Inline Buttons, Instant Alert", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>', color: "#06b6d4" }
        ],
        tg: {
            header: "✦ НОВАЯ ЗАЯВКА С САЙТА",
            body: "<b>Клиент:</b> Екатерина Михайлова<br><b>Телефон:</b> +7 (926) 840-12-99<br><b>Услуга:</b> Холодная гидратация<br><b>Бюджет:</b> 4 500 ₽<br><b>Отклик шины:</b> 0.38с",
            buttons: [
                { text: "Взять в работу ✓", action: "accept" },
                { text: "Набрать клиенту →", action: "call" },
                { text: "Открыть в CRM (#LEAD-8841) ↗", action: "crm", full: true }
            ]
        },
        logs: [
            { tag: "event", msg: "POST /webhook/lead-funnel HTTP/1.1 200 OK (Payload: 1.4KB)" },
            { tag: "code", msg: "Sanitized phone format to +79268401299, Priority: HIGH" },
            { tag: "crm", msg: "Deal #8841 created in 'Первичный контакт' (Bitrix24)" },
            { tag: "tg", msg: "Dispatched message with 3 inline buttons. Latency: 180ms" }
        ]
    },
    {
        name: "n8n-workflows/review-collector.json",
        download: "n8n-workflows/review-collector.json",
        nodes: [
            { name: "Trigger: Завершение визита", sub: "Webhook от CRM (Статус: Выполнено)", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>', color: "#ff6d5a" },
            { name: "Code: NPS Сегментация", sub: "Оценка 1-10: Логический фильтр", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', color: "#ffb800" },
            { name: "Smart Routing Hub", sub: "9-10 -> Яндекс.Карты; <7 -> Директор", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>', color: "#3b82f6" },
            { name: "Telegram: Контроль качества", sub: "Апелляция или публикация отзыва", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>', color: "#06b6d4" }
        ],
        tg: {
            header: "✦ ПОЛУЧЕН ОТЗЫВ NPS (10/10)",
            body: "<b>Клиент:</b> Алексей Власов<br><i>«Идеальное качество печати каталогов, сдали на день раньше!»</i><br><b>Оценка:</b> 10 из 10<br><b>Действие:</b> Клиент перенаправлен на Яндекс.Карты",
            buttons: [
                { text: "Посмотреть на Картах ↗", action: "yandex" },
                { text: "Начислить 500 бонусов ✓", action: "bonus" },
                { text: "История клиента в CRM →", action: "crm", full: true }
            ]
        },
        logs: [
            { tag: "event", msg: "TRIGGER: Order #3928 marked 'Completed'" },
            { tag: "code", msg: "Received NPS survey response: Score 10 (Promoter)" },
            { tag: "crm", msg: "Logged positive rating to client profile in database" },
            { tag: "tg", msg: "Sent review card to @reviews_monitoring. Total rating: 4.98" }
        ]
    },
    {
        name: "n8n-workflows/order-invoice.json",
        download: "n8n-workflows/order-invoice.json",
        nodes: [
            { name: "Webhook: Расчёт калькулятора", sub: "1 000 каталогов A4, КБС", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>', color: "#ff6d5a" },
            { name: "Code: Генерация QR СБП", sub: "Связка с банком Тинькофф / Точка", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', color: "#ffb800" },
            { name: "Bank Webhook: Оплата", sub: "Счёт 42 500 ₽ оплачен за 28 сек", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>', color: "#3b82f6" },
            { name: "Telegram: Запуск в печать", sub: "Уведомление начальника цеха", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>', color: "#06b6d4" }
        ],
        tg: {
            header: "✦ ОПЛАТА СЧЁТА #INV-5902 (СБП)",
            body: "<b>ООО «Медиа Групп»</b><br><b>Заказ:</b> Каталоги А4, 1000 шт.<br><b>Сумма:</b> 42 500 ₽ (Оплачено через СБП)<br><b>Статус:</b> Файлы макета отправлены на CTP-вывод",
            buttons: [
                { text: "Запустить печатный цех ↗", action: "print" },
                { text: "Скачать УПД и счёт ↓", action: "invoice" },
                { text: "Назначить курьера →", action: "delivery", full: true }
            ]
        },
        logs: [
            { tag: "event", msg: "INVOICE_GENERATED: Total 42,500 RUB with dynamic SBP QR" },
            { tag: "code", msg: "Bank Webhook confirmed 200 OK. Transaction ID: #TX-94021" },
            { tag: "crm", msg: "Deal stage advanced to 'Оплачено. В производстве'" },
            { tag: "tg", msg: "Notified production team channel. Files queued for printing." }
        ]
    }
];

let currentWfIdx = 0;
let isSimRunning = false;

function switchN8nWorkflow(idx, btn) {
    if (isSimRunning) return;
    currentWfIdx = idx;
    playUiSound('click');

    document.querySelectorAll('.workflow-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const wf = WORKFLOWS_DATA[idx];
    const fileTitle = document.getElementById('n8nFilename');
    if (fileTitle) fileTitle.innerHTML = wf.name + ' <span class="pill">PRODUCTION</span>';
    const dlLink = document.getElementById('n8nDownloadLink');
    if (dlLink) dlLink.setAttribute('href', wf.download);

    for (let i = 1; i <= 4; i++) {
        const nodeData = wf.nodes[i - 1];
        const nameEl = document.getElementById('simNode' + i + 'Name');
        const subEl = document.getElementById('simNode' + i + 'Sub');
        const iconEl = document.getElementById('simNode' + i + 'Icon');
        const statusEl = document.getElementById('simNode' + i + 'Status');
        const cardEl = document.getElementById('simNode' + i);
        
        if (nameEl) nameEl.innerText = nodeData.name;
        if (subEl) subEl.innerText = nodeData.sub;
        if (iconEl) {
            iconEl.innerHTML = nodeData.icon;
            if (nodeData.color) iconEl.style.color = nodeData.color;
        }
        if (cardEl && nodeData.color) {
            cardEl.style.setProperty('--node-color', nodeData.color);
        }
        if (statusEl) {
            statusEl.innerText = "Ожидание";
            statusEl.className = "node-status-pill";
        }
        if (cardEl) cardEl.classList.remove('active', 'success');
    }

    document.querySelectorAll('.flow-cable-path').forEach(c => c.classList.remove('active'));

    const tg = wf.tg;
    const tgHead = document.getElementById('tgCardHeader');
    const tgBody = document.getElementById('tgCardBody');
    if (tgHead) tgHead.innerText = tg.header;
    if (tgBody) tgBody.innerHTML = tg.body;
    
    let btnHtml = '';
    tg.buttons.forEach(b => {
        btnHtml += '<button class="tg-inline-btn ' + (b.full ? 'full-width' : '') + '" onclick="handleTgAction(\'' + b.action + '\', this)">' + b.text + '</button>';
    });
    const tgBtns = document.getElementById('tgButtonsContainer');
    if (tgBtns) tgBtns.innerHTML = btnHtml;

    const tgMsgCard = document.getElementById('tgMessageCard');
    if (tgMsgCard) tgMsgCard.classList.remove('show');
    const island = document.getElementById('dynamicIsland');
    if (island) island.classList.remove('expand');

    const logsBox = document.getElementById('telemetryLogs');
    if (logsBox) {
        logsBox.innerHTML = '<div class="log-entry"><span class="log-time">[System]</span><span class="log-msg">Воркфлоу переключен на: ' + wf.name + '. Готов к запуску.</span></div>';
    }
}

async function runN8nSimulation() {
    if (isSimRunning) return;
    isSimRunning = true;
    playUiSound('click');

    const runBtn = document.getElementById('btnRunSim');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.style.opacity = '0.7';
    }
    const simIco = document.getElementById('simPlayIco');
    if (simIco) simIco.innerText = '↻';

    const wf = WORKFLOWS_DATA[currentWfIdx];
    const logsBox = document.getElementById('telemetryLogs');
    if (logsBox) logsBox.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const cardEl = document.getElementById('simNode' + i);
        const statusEl = document.getElementById('simNode' + i + 'Status');
        if (cardEl) cardEl.classList.remove('active', 'success');
        if (statusEl) {
            statusEl.innerText = "Ожидание";
            statusEl.className = "node-status-pill";
        }
    }
    document.querySelectorAll('.flow-cable-path').forEach(c => c.classList.remove('active'));
    const tgMsgCard = document.getElementById('tgMessageCard');
    if (tgMsgCard) tgMsgCard.classList.remove('show');
    const island = document.getElementById('dynamicIsland');
    if (island) island.classList.remove('expand');

    const stepDelay = 380;

    for (let i = 1; i <= 4; i++) {
        const nodeCard = document.getElementById('simNode' + i);
        const statusPill = document.getElementById('simNode' + i + 'Status');
        
        if (nodeCard) nodeCard.classList.add('active');
        if (statusPill) {
            statusPill.innerText = "В работе...";
            statusPill.className = "node-status-pill running";
        }
        playUiSound('node');

        const now = new Date();
        const timeStr = '[' + now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0') + ']';
        const logData = wf.logs[i - 1];

        if (logsBox) {
            const logRow = document.createElement('div');
            logRow.className = 'log-entry';
            logRow.innerHTML = '<span class="log-time">' + timeStr + '</span><span class="log-tag-' + logData.tag + '">[' + logData.tag.toUpperCase() + ']</span><span class="log-msg">' + logData.msg + '</span>';
            logsBox.appendChild(logRow);
            logsBox.scrollTop = logsBox.scrollHeight;
        }

        await new Promise(r => setTimeout(r, stepDelay));

        if (nodeCard) {
            nodeCard.classList.remove('active');
            nodeCard.classList.add('success');
        }
        if (statusPill) {
            statusPill.innerText = "200 OK";
            statusPill.className = "node-status-pill done";
        }

        if (i < 4) {
            const cable = document.getElementById('cable' + i);
            if (cable) cable.classList.add('active');
        }
    }

    playUiSound('push');
    if (island) island.classList.add('expand');

    setTimeout(() => {
        if (island) island.classList.remove('expand');
        if (tgMsgCard) tgMsgCard.classList.add('show');
        showToast("Новое уведомление n8n доставлено в Telegram!", "✦");
    }, 300);

    if (runBtn) {
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
    }
    if (simIco) simIco.innerText = '▶';
    isSimRunning = false;
}

function handleTgAction(action, btnEl) {
    playUiSound('click');
    if (action === 'accept') {
        if (btnEl) {
            btnEl.innerText = '✓ В работе у менеджера';
            btnEl.style.background = 'rgba(16, 185, 129, 0.25)';
            btnEl.style.color = '#34d399';
        }
        showToast("Заявка принята в работу! Статус в Bitrix24 обновлён.", "✓");
    } else if (action === 'call') {
        if (btnEl) btnEl.innerText = 'Вызов через SIP...';
        showToast("Инициирован быстрый звонок клиенту через телефонию.", "✦");
    } else if (action === 'crm') {
        showToast("Открывается карточка сделки #LEAD-8841 в CRM...", "↗");
    } else if (action === 'yandex') {
        showToast("⭐️ Открыт профиль компании на Яндекс.Картах (Рейтинг: 4.98)", "⭐️");
    } else if (action === 'bonus') {
        if (btnEl) btnEl.innerText = '500 бонусов начислено ✓';
        showToast("Клиенту отправлено SMS с начислением 500 бонусов.", "✦");
    } else if (action === 'print') {
        if (btnEl) {
            btnEl.innerText = 'Отправлено на CTP ✓';
            btnEl.style.color = '#34d399';
        }
        showToast("Файлы переданы в печатный цех. Статус: В печати.", "✦");
    } else {
        showToast("Действие успешно выполнено в n8n!", "✦");
    }
}

// AI ASSISTANTS DATA
// AI ASSISTANTS DATA (FLAGSHIP MULTI-MODEL CLUSTER: CLAUDE 3.7, GEMINI 2.5 PRO, GPT-4O & CODEX, DEEPSEEK-R1)
// AI ASSISTANTS DATA (FRONTIER MODELS: CLAUDE OPUS 5.5, CLAUDE FABLE 5.1, GEMINI ARGON, VEO, CODEX 6.1, KIMI 3.1, ANTIGRAVITY)
const AGENTS_DATA = [
    {
        name: "Dr. Anna AI",
        title: "Dr. Anna AI — Консультант клиники",
        specs: "RAG: 14 протоколов · Gemini Argon + Google VEO Video",
        avatar: '<span style="color:#f472b6;font-weight:700;">DA</span>',
        model: "Gemini Argon & VEO",
        latency: "180ms",
        tokens: "420",
        greeting: "Здравствуйте! Я клинический AI-консультант студии косметологии Анны Михайленко на базе Gemini Argon и генеративной видеосистемы VEO. Подскажите, что вас беспокоит: сухость кожи, высыпания, или вы хотите подобрать атравматичную процедуру, например, холодную гидратацию?",
        reasoning: [
            "<b>[1. Intent Analysis]</b>: Первичный визит клиента в онлайн-клинику.",
            "<b>[2. Gemini Argon Retrieval]</b>: Извлечены клинические протоколы (чистка, пилинг, гидратация).",
            "<b>[3. VEO Video Pipeline]</b>: Готовность генерации персонального 3D-видеоролика ухода."
        ],
        prompts: [
            "Как Gemini Argon и VEO помогают клиенту?",
            "Какие показания к холодной гидратации?",
            "Сколько стоит атравматическая чистка?",
            "Хочу записаться на консультацию"
        ],
        answers: {
            "Как Gemini Argon и VEO помогают клиенту?": "Gemini Argon мгновенно анализирует тип кожи и симптоматику по 14 протоколам студии, а видеомодель VEO генерирует персональную 3D-визуализацию домашнего ухода и этапов процедуры без травматизации.",
            "Какие показания к холодной гидратации?": "Холодная гидратация — это авторская методика подготовки кожи без термического распаривания на базе Gemini Argon. Показана при: чувствительной коже, куперозе, розацеа, комедонах и обезвоженности. Занимает 60 минут, стоимость 4 500 ₽.",
            "Сколько стоит атравматическая чистка?": "Стоимость комбинированной атравматической чистки по протоколу Анны Михайленко — 4 500 ₽. В процедуру входит: демакияж, холодное гидрирование, ультразвуковая чистка, ручная доработка ложкой Уно, успокаивающая поросуживающая маска и финишная SPF-защита.",
            "Хочу записаться на консультацию": "С удовольствием помогу подобрать удобное время! Ближайшие свободные слоты у Анны Михайленко: завтра в 14:00 и в 17:30. Оставьте ваш телефон или ник в Telegram, и я забронирую слот за вами."
        },
        defaultAnswer: "Спасибо за вопрос! По клиническому протоколу Анны Михайленко данный случай требует индивидуального осмотра эпидермального барьера. Пройдите онлайн-диагностику с визуализацией через VEO или запишитесь на 15-минутный приём."
    },
    {
        name: "Riol Sales AI",
        title: "Riol Sales AI — Менеджер типографии",
        specs: "RAG: Прайс 2026 · OpenAI Codex 6.1 Tool Calling",
        avatar: '<span style="color:#38bdf8;font-weight:700;">RP</span>',
        model: "Codex 6.1",
        latency: "160ms",
        tokens: "510",
        greeting: "Приветствую! Я AI-инженер типографии Riol Print на базе Codex 6.1. Мгновенно компилирую сметы тиражей любой сложности: каталоги, упаковка, буклеты с автоматической проверкой CMYK/DPI. Какой тираж вас интересует?",
        reasoning: [
            "<b>[1. Entity Extraction]</b>: Определение вида полиграфии, плотности бумаги и тиража.",
            "<b>[2. Codex 6.1 Compilation]</b>: Автоматическое вычисление расхода краски и постпечати за 0.16с.",
            "<b>[3. Stock Validation]</b>: Проверка остатков на складе и отправка сметы в цех."
        ],
        prompts: [
            "Как Codex 6.1 считает смету?",
            "Посчитай 1 000 каталогов А4 на мелованной бумаге",
            "Какие требования к макету для печати?",
            "Нужна упаковка с тиснением фольгой"
        ],
        answers: {
            "Как Codex 6.1 считает смету?": "Codex 6.1 вызывает калькулятор по прайсу типографии (tool calling): расход красок, листопрогоны и ламинация считаются формулами, а не «на глаз». Ошибок ручного счёта нет, ТЗ сразу уходит в печатный цех.",
            "Посчитай 1 000 каталогов А4 на мелованной бумаге": "Расчёт для 1 000 каталогов А4 (16 полос, обложка 250г/м² с матовой ламинацией, блок 130г/м², сборка на 2 скрепки): 42 500 ₽ (42.5 ₽/шт). Срок изготовления: 3 рабочих дня. Бесплатная доставка по Москве при заказе от 30 000 ₽!",
            "Какие требования к макету для печати?": "Стандартные требования типографии Riol Print: формат PDF/X-1a, цветовая модель CMYK, разрешение растровых элементов строго 300 DPI, вылеты под обрез по 2 мм с каждой стороны, значимые элементы на расстоянии 4 мм от края реза.",
            "Нужна упаковка с тиснением фольгой": "Мы производим самосборные коробки и упаковку из картона плотностью до 400г/м² с кашированием. Тиснение золотой, серебряной или голографической фольгой рассчитывается индивидуально в зависимости от площади штампа. Пришлите макет развёртки для точной сметы!"
        },
        defaultAnswer: "Принял параметры в расчёт! Для точного составления коммерческого предложения подскажите: планируемый тираж, цветность (4+4 или 4+0) и нужна ли защитная ламинация? Сгенерирую смету за 3 секунды."
    },
    {
        name: "Prostor Broker AI",
        title: "Prostor Broker AI — Консьерж элитной недвижимости",
        specs: "RAG: Каталог ЖК · Anthropic Claude Opus 5.5 (Deep Reasoning)",
        avatar: '<span style="color:#f59e0b;font-weight:700;">PR</span>',
        model: "Claude Opus 5.5",
        latency: "240ms",
        tokens: "680",
        greeting: "Здравствуйте. Я инвестиционный брокер агентства «Простор» на флагманской архитектуре Claude Opus 5.5 с максимальной глубиной рассуждений. Подберу премиальную резиденцию, рассчитаю доходность аренды (ROI) или подберу выгодную программу субсидированной ипотеки. Какой бюджет рассматриваете?",
        reasoning: [
            "<b>[1. Investor Scoring]</b>: Оценка цели покупки (жильё для себя vs доходность).",
            "<b>[2. Claude Opus 5.5 CoT]</b>: Глубокое финансовое моделирование аннуитета и инфляции.",
            "<b>[3. Inventory Match]</b>: Фильтрация закрытой базы апартаментов с отделкой."
        ],
        prompts: [
            "В чём преимущество Claude Opus 5.5 для инвестиций?",
            "Подбери 2-комнатную квартиру до 25 млн ₽",
            "Какая ставка по IT-ипотеке сейчас?",
            "Хочу записаться на закрытый показ"
        ],
        answers: {
            "В чём преимущество Claude Opus 5.5 для инвестиций?": "Claude Opus 5.5 задействует глубокий когнитивный reasoning: модель просчитывает капитализацию объектов с учётом инфляции, градостроительных планов Москвы и налоговой нагрузки, выдавая точную финмодель на 5-10 лет вперёд.",
            "Подбери 2-комнатную квартиру до 25 млн ₽": "В бюджете до 25 млн ₽ рекомендую обратить внимание на клубный дом в районе Пресни: 2-комнатный апартамент 64 м² с панорамными окнами в пол, предчистовой отделкой White Box и подземным паркингом. Сдача в IV кв. 2026. Оформить закрытую презентацию лота?",
            "Какая ставка по IT-ипотеке сейчас?": "По действующей программе IT-ипотеки ставка составляет до 6% годовых при первоначальном взносе от 20%. Максимальная сумма кредита — до 9 млн ₽ (с возможностью расширения комбо-ипотекой до 18 млн ₽). Могу рассчитать ежемесячный платёж под ваш объект.",
            "Хочу записаться на закрытый показ": "С удовольствием организуем персональный трансфер на автомобиле представительского класса и встречу с ведущим брокером проекта. Оставьте контактный номер — согласуем удобное время доступа на закрытую территорию объекта."
        },
        defaultAnswer: "Отличный инвестиционный критерий. В закрытой базе нашего агентства есть 18 подходящих лотов, включая эксклюзивные пентхаусы до официального старта продаж. Напишите желаемый район или бюджет, и я выгружу подборку планировок."
    },
    {
        name: "Nexus Architect AI",
        title: "Nexus Architect AI — Системный AI-Инженер",
        specs: "Multi-Model Router · Claude Fable 5.1 + Kimi 3.1 Long-Context",
        avatar: '<span style="color:#10b981;font-weight:700;">NX</span>',
        model: "Claude Fable 5.1 + Kimi 3.1",
        latency: "140ms",
        tokens: "750",
        greeting: "Приветствую! Я системный AI-инженер melevskiystudio. Отвечаю за синтез архитектуры, объединяя сверхдлинный контекст Kimi 3.1 (миллионы токенов документации) и генерацию сценариев на Claude Fable 5.1 с оркестрацией в n8n. Какой процесс автоматизации требуется спроектировать?",
        reasoning: [
            "<b>[1. Kimi 3.1 Context Ingestion]</b>: Загрузка полных регламентов компании и дампов CRM.",
            "<b>[2. Claude Fable 5.1 Logic]</b>: Построение дерева логических условий и обработка исключений.",
            "<b>[3. n8n Orchestration]</b>: Сборка n8n-вебхуков и Docker-манифестов."
        ],
        prompts: [
            "Как Kimi 3.1 и Claude Fable 5.1 работают вместе?",
            "Как n8n распределяет запросы между моделями?",
            "Как VEO генерирует динамический контент?",
            "Спроектируй n8n конвейер под ключ"
        ],
        answers: {
            "Как Kimi 3.1 и Claude Fable 5.1 работают вместе?": "Kimi 3.1 удерживает в активной памяти гигантские базы данных, регламенты компании и дампы CRM без компрессии, а Claude Fable 5.1 извлекает точные инсайты и формирует логические ветки для n8n без потери контекста.",
            "Как n8n распределяет запросы между моделями?": "n8n работает как роутер: по типу задачи отправляет запрос в Claude Opus 5.5 (сложные рассуждения), Gemini Argon (быстрые мультимодальные ответы), Codex 6.1 (расчёты и вызов инструментов) или Kimi 3.1 (длинные документы). Если одна модель недоступна, запрос уходит на резервную.",
            "Как VEO генерирует динамический контент?": "Google VEO интегрируется в воронку через n8n-вебхуки, создавая персонализированные видео-презентации и визуализации продуктов прямо под запрос клиента за считанные секунды.",
            "Спроектируй n8n конвейер под ключ": "Типовой стек студии: Веб-форма Next.js → Webhook n8n (POST) → Code Node (Codex 6.1 валидация + антиспам) → LLM Router (Claude Opus 5.5 / Gemini Argon) → PostgreSQL/Bitrix24 Deal → Telegram Push руководителю за 0.38 секунды. 0 ₽ ежемесячных комиссий SaaS."
        },
        defaultAnswer: "Архитектурная задача принята! Для точного подбора связки (Claude Opus 5.5, Claude Fable 5.1, Gemini Argon, VEO, Codex 6.1 или Kimi 3.1) уточните: какой объём базы знаний компании и требуется ли генерация динамических смет?"
    }
];

let currentAgentIdx = 0;
let isAiStreaming = false;

function switchAiAgent(idx, cardEl) {
    if (isAiStreaming) return;
    currentAgentIdx = idx;
    playUiSound('click');

    document.querySelectorAll('.agent-picker-card').forEach(c => c.classList.remove('active'));
    if (cardEl) cardEl.classList.add('active');

    const agent = AGENTS_DATA[idx];
    const chatAvatar = document.getElementById('currentChatAvatar');
    const chatName = document.getElementById('currentChatName');
    const chatSpecs = document.getElementById('currentChatSpecs');
    const latDisplay = document.getElementById('agentLatencyDisplay');
    const tokDisplay = document.getElementById('agentTokensDisplay');
    const modelBadge = document.getElementById('agentModelBadge');

    if (chatAvatar) chatAvatar.innerHTML = agent.avatar;
    if (chatName) chatName.innerText = agent.title;
    if (chatSpecs) chatSpecs.innerText = agent.specs;
    if (latDisplay) latDisplay.innerText = agent.latency;
    if (tokDisplay) tokDisplay.innerText = agent.tokens;
    if (modelBadge) modelBadge.innerText = agent.model;

    renderQuickPrompts(agent.prompts);
    resetCurrentChat();
}

function renderQuickPrompts(prompts) {
    const bar = document.getElementById('quickPromptsContainer');
    if (!bar) return;
    bar.innerHTML = '';
    prompts.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'prompt-chip-btn';
        btn.innerText = p;
        btn.onclick = () => {
            const input = document.getElementById('userChatInput');
            if (input) input.value = p;
            sendChatMessage();
        };
        bar.appendChild(btn);
    });
}

function toggleCot(btn) {
    playUiSound('click');
    const body = btn.nextElementSibling;
    if (!body) return;
    body.classList.toggle('open');
    const toggleSpan = btn.querySelector('span:last-child');
    if (toggleSpan) {
        toggleSpan.innerText = body.classList.contains('open') ? 'Свернуть ▴' : 'Развернуть ▾';
    }
}

function resetCurrentChat() {
    if (isAiStreaming) return;
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;
    const agent = AGENTS_DATA[currentAgentIdx];
    
    let reasoningHtml = '';
    agent.reasoning.forEach(step => {
        reasoningHtml += '<div class="cot-step-item">' + step + '</div>';
    });

    container.innerHTML = '<div class="message-bubble-row bot">' +
        '<div class="msg-avatar">' + agent.avatar + '</div>' +
        '<div class="msg-bubble-card">' +
            '<div class="cot-reasoning-drawer">' +
                '<button class="cot-header-btn" onclick="toggleCot(this)">' +
                    '<span>▸ Ход рассуждений AI (Reasoning: 1.1s)</span>' +
                    '<span style="font-size: 10px;">Развернуть ▾</span>' +
                '</button>' +
                '<div class="cot-body-text">' + reasoningHtml + '</div>' +
            '</div>' +
            '<div class="msg-text-content">' + agent.greeting + '</div>' +
        '</div>' +
    '</div>';
}

async function sendChatMessage() {
    if (isAiStreaming) return;
    const input = document.getElementById('userChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    isAiStreaming = true;
    playUiSound('click');
    input.value = '';

    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const userRow = document.createElement('div');
    userRow.className = 'message-bubble-row user';
    userRow.innerHTML = '<div class="msg-avatar" style="background: rgba(56, 189, 248, 0.2);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>' +
                        '<div class="msg-bubble-card"></div>';
    userRow.querySelector('.msg-bubble-card').textContent = text;
    container.appendChild(userRow);
    container.scrollTop = container.scrollHeight;

    const agent = AGENTS_DATA[currentAgentIdx];
    const answer = agent.answers[text] || agent.defaultAnswer;

    const botRow = document.createElement('div');
    botRow.className = 'message-bubble-row bot';
    
    const randomLatency = (Math.random() * 0.4 + 0.8).toFixed(1);

    botRow.innerHTML = '<div class="msg-avatar">' + agent.avatar + '</div>' +
        '<div class="msg-bubble-card">' +
            '<div class="cot-reasoning-drawer">' +
                '<button class="cot-header-btn" onclick="toggleCot(this)">' +
                    '<span>▸ Ход рассуждений AI (Reasoning: ' + randomLatency + 's)</span>' +
                    '<span style="font-size: 10px;">Развернуть ▾</span>' +
                '</button>' +
                '<div class="cot-body-text open">' +
                    '<div class="cot-step-item"><b>[1. Prompt Analysis]</b>: Распознан запрос: <i class="cot-user-query"></i></div>' +
                    '<div class="cot-step-item"><b>[2. Context Lookup]</b>: Найдено совпадение в локальном индексе RAG.</div>' +
                    '<div class="cot-step-item"><b>[3. Synthesis]</b>: Сгенерирован ответ в тоне бренда ' + agent.name + '.</div>' +
                '</div>' +
            '</div>' +
            '<div class="msg-text-content stream-text"></div>' +
        '</div>';
    botRow.querySelector('.cot-user-query').textContent = `"${text}"`;
    container.appendChild(botRow);
    container.scrollTop = container.scrollHeight;

    const textEl = botRow.querySelector('.stream-text');
    for (let i = 0; i < answer.length; i++) {
        textEl.textContent += answer[i];
        container.scrollTop = container.scrollHeight;
        await new Promise(r => setTimeout(r, 12));
    }

    const tokEl = document.getElementById('agentTokensDisplay');
    if (tokEl) {
        const currentTokens = parseInt(tokEl.innerText) || 380;
        tokEl.innerText = String(currentTokens + Math.floor(answer.length / 3));
    }

    isAiStreaming = false;
}

function openEmbedModal() {
    playUiSound('click');
    const modal = document.getElementById('embedModalOverlay');
    if (modal) modal.classList.add('open');
}

function closeEmbedModal() {
    playUiSound('click');
    const modal = document.getElementById('embedModalOverlay');
    if (modal) modal.classList.remove('open');
}

function openContactModal(service) {
    playUiSound('click');
    document.getElementById('portfolioContactForm').style.display = 'flex';
    document.getElementById('formSuccessMessage').style.display = 'none';
    if (typeof service === 'string') document.getElementById('formService').value = service;
    const modal = document.getElementById('contactModalOverlay');
    if (modal) modal.classList.add('open');
}

function closeContactModal() {
    playUiSound('click');
    const modal = document.getElementById('contactModalOverlay');
    if (modal) modal.classList.remove('open');
}

const TELEGRAM_USERNAME = 'xtulnss';

function buildLeadMessage() {
    const field = id => document.getElementById(id).value.trim();
    const lines = [
        'Здравствуйте! Заявка с сайта melevskiystudio',
        `Имя: ${field('formName')}`,
        `Контакт: ${field('formContact')}`,
        `Услуга: ${field('formService')}`
    ];
    const task = field('formTask');
    if (task) lines.push(`Задача: ${task}`);
    return lines.join('\n');
}

function handleContactSubmit(e) {
    e.preventDefault();
    playUiSound('click');

    const text = buildLeadMessage();
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
    // Copy as a fallback: older Telegram clients ignore the ?text= prefill
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    window.open(url, '_blank', 'noopener');

    document.getElementById('formTelegramLink').href = url;
    document.getElementById('portfolioContactForm').style.display = 'none';
    document.getElementById('formSuccessMessage').style.display = 'block';
    playUiSound('push');
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleMobileNav(forceOpen) {
    const nav = document.getElementById('navbar');
    const isOpen = nav.classList.toggle('menu-open', forceOpen);
    document.getElementById('navBurger').setAttribute('aria-expanded', String(isOpen));
}

function cablePath(fromEl, toEl, base) {
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    const sameRow = Math.abs(from.top - to.top) < from.height / 2;
    if (sameRow) {
        const x1 = from.right - base.left, y1 = from.top + from.height / 2 - base.top;
        const x2 = to.left - base.left, y2 = to.top + to.height / 2 - base.top;
        const mx = (x1 + x2) / 2;
        return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    }
    const x1 = from.left + from.width / 2 - base.left, y1 = from.bottom - base.top;
    const x2 = to.left + to.width / 2 - base.left, y2 = to.top - base.top;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
}

function drawFlowCables() {
    const base = document.getElementById('n8nCanvas').getBoundingClientRect();
    for (let i = 1; i <= 3; i++) {
        const d = cablePath(document.getElementById(`simNode${i}`), document.getElementById(`simNode${i + 1}`), base);
        document.getElementById(`cable${i}`).setAttribute('d', d);
    }
}

function initLazyVideos() {
    const videos = document.querySelectorAll('.project-video');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.play().catch(() => {});
            else entry.target.pause();
        });
    }, { rootMargin: '200px 0px' });
    videos.forEach(v => observer.observe(v));
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starfieldCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const STAR_COUNT = 160;
        let mouseX = 0, mouseY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.8 + 0.4,
                    baseAlpha: Math.random() * 0.7 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    phase: Math.random() * Math.PI * 2,
                    depth: Math.random() * 0.6 + 0.2
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.phase += star.twinkleSpeed;
                const alpha = star.baseAlpha + Math.sin(star.phase) * 0.25;
                const shiftX = (mouseX - canvas.width / 2) * star.depth * 0.03;
                const shiftY = (mouseY - canvas.height / 2) * star.depth * 0.03;

                ctx.beginPath();
                ctx.arc(star.x + shiftX, star.y + shiftY, star.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(224, 231, 255, ' + Math.max(0.1, Math.min(1, alpha)) + ')';
                ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
                ctx.shadowColor = 'rgba(126, 232, 250, 0.8)';
                ctx.fill();
            });
            if (!prefersReducedMotion) requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            if (prefersReducedMotion) drawStars();
        });
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        resizeCanvas();
        requestAnimationFrame(drawStars);
    }

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    renderQuickPrompts(AGENTS_DATA[0].prompts);

    document.querySelectorAll('.nav-center .nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMobileNav(false));
    });

    drawFlowCables();
    window.addEventListener('resize', drawFlowCables);
    // Web fonts change card heights after DOMContentLoaded
    window.addEventListener('load', drawFlowCables);

    initLazyVideos();
});
