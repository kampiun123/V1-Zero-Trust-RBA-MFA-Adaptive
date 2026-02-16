/**
 * TRASHURE SOC ENGINE - v4.5 (STABLE & INTERACTIVE)
 */

let currentDept = null;
let currentIP = null;
let trafficChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCharts();
    setupSocket();
    console.log("🚀 ZTNA SOC v4.5 READY.");
});

function initClock() {
    setInterval(() => {
        const fullClock = document.getElementById('socClock');
        if (fullClock) fullClock.innerText = new Date().toLocaleTimeString('id-ID');
    }, 1000);
}

// 🛡️ ZTNA & GPO Logic (Thesis Alignment)
window.showPolicyModal = () => document.getElementById('policyModal').classList.remove('hidden');
window.hidePolicyModal = () => document.getElementById('policyModal').classList.add('hidden');

window.trySystemSettings = () => {
    if (!currentDept) return alert("Pilih Unit Department Dulu Bang!");

    // Simulate GPO Check
    const data = {
        user: "SYS_LOCAL", role: "User", dept: currentDept,
        ip: "127.0.0.1", riskLabel: "CRITICAL", status: "GPO_BLOCK",
        msg: `[GPO_VIOLATION] Access to System Settings Blocked by trashure.local Policy.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    };
    renderAuditLog(data);
    updateStats(data);
};

function initCharts() {
    const ctx = document.getElementById('trafficChart')?.getContext('2d');
    if (!ctx) return;
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['-3h', '-2h', '-1h', 'Now'],
            datasets: [{
                label: 'Traffic Pulse',
                data: [30, 45, 25, 60],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#64748b' } } }
        }
    });
}

function setupSocket() {
    console.log("🔗 Connecting to ZTNA Stream...");
    if (typeof io === 'undefined') {
        console.error("❌ Socket.io NOT LOADED!");
        return;
    }
    const socket = io();
    socket.on('connect', () => {
        console.log("✅ SOC LINK ESTABLISHED!");
        const dot = document.querySelector('.status-dot');
        if (dot) dot.style.background = '#22c55e';
    });
    socket.on('ztna-log', (data) => {
        renderAuditLog(data);
        updateStats(data);
        const mon = document.getElementById('rawMonitor');
        if (mon) mon.innerText = JSON.stringify(data, null, 2);
    });
}

function renderAuditLog(data) {
    const stream = document.getElementById('auditStream');
    if (!stream) return;
    const row = document.createElement('div');
    row.className = 'log-row';

    const riskColor = data.riskLabel === 'HIGH RISK' || data.riskLabel === 'CRITICAL' ? 'var(--accent-danger)' :
        (data.riskLabel === 'MED RISK' || data.riskLabel === 'WARN' ? 'var(--accent-warning)' : 'var(--accent-success)');

    const statusColor = (data.status === 'VERIFIED' || data.status === 'ACCEPTED') ? 'var(--accent-success)' :
        (data.status === 'DENIED' || data.status === 'GPO_BLOCK' ? 'var(--accent-danger)' : 'var(--accent-warning)');

    row.innerHTML = `
        <span style="color:#64748b; font-size:0.55rem; width:55px;">[${data.timestamp || new Date().toLocaleTimeString('id-ID')}]</span>
        <span style="color:${statusColor}; width:100px; font-weight:bold;">[ZTNA] ${data.status}</span>
        <span style="color:#fff; width:90px; overflow:hidden; text-overflow:ellipsis;">${data.user}</span>
        <span style="color:#94a3b8; width:70px;">${data.dept}</span>
        <span style="background: rgba(255,255,255,0.05); color: ${riskColor}; width: 45px; text-align: center; border-radius: 3px; font-weight: bold; margin-right: 10px;">${data.riskScore}%</span>
        <span style="flex:1; color: var(--text-muted); font-size: 0.55rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${data.msg}</span>
        <div style="display: flex; gap: 4px;">
            <button onclick="triggerManualMFA('${data.user}', '${data.riskScore}')" style="background:var(--accent-warning); color:black; border:none; padding:2px 4px; border-radius:3px; cursor:pointer; font-size:0.45rem; font-weight:bold;">MFA</button>
            <button onclick="manualBlock('${data.ip}')" style="background:#ef4444; color:white; border:none; padding:2px 4px; border-radius:3px; cursor:pointer; font-size:0.45rem;">BLOCK</button>
        </div>
    `;
    stream.prepend(row);
    if (stream.children.length > 30) stream.lastChild.remove();
}

function updateStats(data) {
    console.log("📊 STATS UPDATE RECEIVED:", data.user, data.riskScore, data.factors);

    const req = document.getElementById('reqTotal');
    if (req) req.innerText = (parseInt(req.innerText) + 1).toLocaleString();

    if (data.riskLabel === 'HIGH RISK') {
        const th = document.getElementById('threatTotal');
        if (th) th.innerText = (parseInt(th.innerText) + 1).toLocaleString();
    }

    const riskAvg = document.getElementById('riskAvg');
    if (riskAvg && data.riskScore) riskAvg.innerText = data.riskScore + '%';

    // 📊 Update RBA Factors
    if (data.factors) {
        console.log("⚡ UPDATING RBA PANEL:", data.factors);

        const updateElem = (id, val, isBar = false) => {
            const el = document.getElementById(id);
            if (el) {
                if (isBar) el.style.width = val + '%';
                else el.innerText = val + '%';
            }
        };

        updateElem('valGeo', data.factors.geo);
        updateElem('valVelocity', data.factors.velocity);
        updateElem('valIntegrity', data.factors.integrity);

        updateElem('barGeo', data.factors.geo, true);
        updateElem('barVelocity', data.factors.velocity, true);
        updateElem('barIntegrity', data.factors.integrity, true);
    }

    // 🌍 Update Map Point
    if (data.coords) renderMapPoint(data.coords);

    // Update chart randomly
    if (trafficChart) {
        trafficChart.data.datasets[0].data.shift();
        trafficChart.data.datasets[0].data.push(Math.floor(Math.random() * 100));
        trafficChart.update('none');
    }
}

function renderMapPoint(coords) {
    const map = document.getElementById('worldMap');
    if (!map) return;
    if (map.children.length > 5) map.innerHTML = '';
    const point = document.createElement('div');
    point.className = 'map-point';
    point.style.left = coords.x + '%';
    point.style.top = coords.y + '%';
    const ring = document.createElement('div');
    ring.className = 'pulse-ring';
    ring.style.left = coords.x + '%';
    ring.style.top = coords.y + '%';
    map.appendChild(point);
    map.appendChild(ring);
    setTimeout(() => { point.remove(); ring.remove(); }, 3000);
}

window.selectDept = function (name, ip) {
    currentDept = name;
    currentIP = ip;
    const label = document.getElementById('activeDeptLabel');
    if (label) label.innerText = `UNIT: ${name} | ${ip}`;
    document.querySelectorAll('.dept-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(name)));
}

window.tryAccess = function (action) {
    if (!currentDept) return alert("Pilih Unit Dulu Bang!");
    const target = currentDept.toLowerCase().includes('r&d') ? 'rd' : currentDept.toLowerCase();
    fetch(`/simulate/${target}?action=${action}`).then(res => res.json()).then(res => {
        const data = res.data;
        if (data && data.status === 'PENDING_MFA') {
            triggerPhoneAuth(`REQ: ${action} for ${data.user} [${data.riskLabel}]`);
        }
    });
}

window.triggerPhoneAuth = function (msg) {
    const phoneIdle = document.getElementById('phoneIdle');
    const phoneAuth = document.getElementById('phoneAuth');
    const authMsg = document.getElementById('authMsg');
    if (phoneIdle) phoneIdle.classList.add('hidden');
    if (phoneAuth) phoneAuth.classList.remove('hidden');
    if (authMsg) authMsg.innerText = msg;
}

window.phoneAction = function (type) {
    const phoneAuth = document.getElementById('phoneAuth');
    const phoneSuccess = document.getElementById('phoneSuccess');
    if (type === 'APPROVE') {
        if (phoneAuth) phoneAuth.classList.add('hidden');
        if (phoneSuccess) phoneSuccess.classList.remove('hidden');
        setTimeout(() => {
            if (phoneSuccess) phoneSuccess.classList.add('hidden');
            const phoneIdle = document.getElementById('phoneIdle');
            if (phoneIdle) phoneIdle.classList.remove('hidden');
            renderAuditLog({
                user: "SYSTEM", role: "ZTNA", dept: "GATEWAY",
                ip: "10.62.8.200", riskLabel: "LOW RISK", status: "VERIFIED",
                msg: "MFA APPROVED BY DEVICE", timestamp: new Date().toLocaleTimeString('id-ID')
            });
        }, 1500);
    } else {
        const phoneIdle = document.getElementById('phoneIdle');
        if (phoneAuth) phoneAuth.classList.add('hidden');
        if (phoneIdle) phoneIdle.classList.remove('hidden');
    }
}

window.triggerManualMFA = function (user, score) {
    triggerPhoneAuth(`SOC CHALLENGE: Verify Identity for ${user} (Risk: ${score}%)`);
    renderAuditLog({
        user: "SOC_ADMIN", role: "Operator", dept: "CORE",
        ip: "127.0.0.1", riskLabel: "MANUAL", riskScore: score, status: "CHALLENGING",
        msg: `SOC-Triggered MFA Challenge sent to ${user}.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
}

window.manualBlock = function (ip) {
    fetch('/soc/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BLOCK', ip: ip })
    });
}

window.hideMFA = function () {
    const overlay = document.getElementById('mfaOverlay');
    if (overlay) overlay.classList.add('hidden');
}

window.verifyMFA = function () {
    hideMFA();
    renderAuditLog({
        user: "SYSTEM", role: "SOC", dept: "CORE",
        ip: "127.0.0.1", riskLabel: "NONE", status: "VERIFIED",
        msg: "MFA Token Accepted", timestamp: new Date().toLocaleTimeString('id-ID')
    });
}
