/**
 * TRASHURE SOC ENGINE - v5.2 (BULLETPROOF STATIC VERSION)
 * Designed for reliability on GitHub Pages.
 */

let currentDept = null;
let currentIP = null;
let trafficChart = null;

const USERNAMES = [
    { name: "Rina S.", role: "Staff", dept: "Logistics" },
    { name: "Bambang W.", role: "Manager", dept: "Production" },
    { name: "Siti A.", role: "Staff", dept: "Warehouse" },
    { name: "John Doe", role: "Expert Advisor", dept: "R&D" },
    { name: "Yuki Tanaka", role: "System Engineer", dept: "Engineering" },
    { name: "Agus Pratama", role: "Head of Finance", dept: "Finance" },
    { name: "Sari Dewi", role: "HR Specialist", dept: "HR" },
    { name: "Budi Santoso", role: "Security Officer", dept: "Core" },
    { name: "Mega Putri", role: "Logistics Admin", dept: "Logistics" },
    { name: "Andi Wijaya", role: "Foreman", dept: "Production" },
    { name: "Sarah Connor", role: "IT Infrastructure", dept: "Engineering" },
    { name: "Michael V.", role: "Operations Mgr", dept: "Warehouse" },
    { name: "Linda Kusuma", role: "Quality Control", dept: "Production" },
    { name: "Hendra Setiawan", role: "Legal Counsel", dept: "HR" },
    { name: "Fanya Utami", role: "Marketing Lead", dept: "R&D" },
    { name: "Kevin Hart", role: "External Consultant", dept: "Engineering" },
    { name: "Dewi Sartika", role: "Admin Staff", dept: "Logistics" },
    { name: "Eko Prasetyo", role: "Plant Manager", dept: "Production" }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log("🛠️ Starting Bulletproof Initialization...");

    // 1. Clock init
    try { initClock(); } catch (e) { console.warn("Clock failed:", e); }

    // 2. Charts init (The most common point of failure)
    try { initCharts(); } catch (e) { console.warn("Charts failed (continuing without chart):", e); }

    // 3. Data Stream (The most important part)
    try { initLocalStream(); } catch (e) { console.error("CRITICAL: Stream failed!", e); }

    console.log("✅ SOC v5.2 INITIALIZED.");
});

function initClock() {
    setInterval(() => {
        const fullClock = document.getElementById('socClock');
        if (fullClock) fullClock.innerText = new Date().toLocaleTimeString('id-ID');

        // Also update phone time
        const phoneTime = document.getElementById('phoneTime');
        if (phoneTime) phoneTime.innerText = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

function getRiskLabel(score) {
    if (score > 70) return "HIGH RISK";
    if (score > 35) return "MED RISK";
    return "LOW RISK";
}

function initLocalStream() {
    console.log("📡 Starting Live Simulation Engine...");
    const dot = document.querySelector('.status-dot');
    if (dot) dot.style.background = '#22c55e';

    // Immediate first pulse
    generatePulse();

    // Start interval
    setInterval(generatePulse, 3000);
}

function generatePulse() {
    try {
        const user = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
        const localSubnets = ["10.62.8", "10.62.30", "10.62.150"];
        const anomalySubnets = ["172.16.10", "192.168.1", "103.11.24", "45.76.12"];
        const isAnomaly = Math.random() < 0.3;
        const subList = isAnomaly ? anomalySubnets : localSubnets;
        const subnet = subList[Math.floor(Math.random() * subList.length)];
        const ip = `${subnet}.${Math.floor(Math.random() * 254)}`;
        const isLocal = ip.startsWith("10.62.");

        let baseScore = isLocal ? (5 + Math.random() * 25) : (50 + Math.random() * 45);
        if (user.dept === "HR") baseScore -= 5;

        const score = Math.max(0, Math.min(100, baseScore)).toFixed(1);
        const riskLabel = getRiskLabel(score);

        const factors = {
            geo: isLocal ? Math.max(2, Math.floor(Math.random() * 8)) : Math.max(45, Math.floor((score * 0.7) + Math.random() * 20)),
            velocity: Math.max(4, Math.floor((score * 0.45) + Math.random() * 12)),
            integrity: Math.min(100, Math.max(0, 100 - Math.floor((score * 0.75) + Math.random() * 8)))
        };

        const data = {
            user: user.name, role: user.role, dept: user.dept, ip: ip,
            riskScore: score, riskLabel: riskLabel, factors: factors,
            coords: { x: 20 + Math.random() * 60, y: 30 + Math.random() * 40 },
            msg: isLocal ? `[TRUSTED_IDENTITY] Access via secure enterprise subnet 10.62.0.0.` : `[SUSPICIOUS_IP] External connection attempt from ${subnet}.0 subnet.`,
            status: score > 70 ? 'DENIED' : (score > 35 ? 'MFA_REQUIRED' : 'VERIFIED'),
            timestamp: new Date().toLocaleTimeString('id-ID')
        };

        handleInboundData(data);
    } catch (e) {
        console.error("Pulse Generation Error:", e);
    }
}

function handleInboundData(data) {
    renderAuditLog(data);
    updateStats(data);
    const mon = document.getElementById('rawMonitor');
    if (mon) mon.innerText = JSON.stringify(data, null, 2);
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
    try {
        const req = document.getElementById('reqTotal');
        if (req) req.innerText = (parseInt(req.innerText.replace(/,/g, '')) + 1).toLocaleString();

        if (data.riskLabel === 'HIGH RISK') {
            const th = document.getElementById('threatTotal');
            if (th) th.innerText = (parseInt(th.innerText.replace(/,/g, '')) + 1).toLocaleString();
        }

        const riskAvg = document.getElementById('riskAvg');
        if (riskAvg && data.riskScore) riskAvg.innerText = data.riskScore + '%';

        if (data.factors) {
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
        if (data.coords) renderMapPoint(data.coords);

        if (trafficChart && typeof trafficChart.update === 'function') {
            trafficChart.data.datasets[0].data.shift();
            trafficChart.data.datasets[0].data.push(Math.floor(Math.random() * 100));
            trafficChart.update('none');
        }
    } catch (e) { console.error("Stats update failed:", e); }
}

function initCharts() {
    const ctx = document.getElementById('trafficChart')?.getContext('2d');
    if (!ctx) return;

    // Check if Chart.js is actually loaded
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js Not Found. Retrying in 2s...");
        setTimeout(initCharts, 2000);
        return;
    }

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

function renderMapPoint(coords) {
    const map = document.getElementById('worldMap');
    if (!map) return;
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
    const user = USERNAMES.find(u => u.dept.toLowerCase().includes(currentDept.toLowerCase())) || USERNAMES[0];
    let score = (action === 'READ') ? 15 : 45;
    let msg = `[GPO_CHECK] User ${user.name} allowed ${action} access to Dept Folder.`;
    let status = (score > 35) ? 'PENDING_MFA' : 'VERIFIED';
    if (action === 'WRITE' && user.dept !== 'HR') {
        score = 82.5;
        msg = `[ZTNA_BLOCK] GPO Policy violation: ${user.name} (${user.dept}) has no WRITE permission.`;
        status = 'DENIED';
    }
    const data = {
        user: user.name, role: user.role, dept: user.dept,
        ip: `10.62.8.${Math.floor(Math.random() * 254)}`,
        riskScore: score, riskLabel: getRiskLabel(score),
        factors: { geo: 5, velocity: 5, integrity: 95 },
        msg: msg, status: status, coords: { x: 50, y: 50 },
        timestamp: new Date().toLocaleTimeString('id-ID')
    };
    handleInboundData(data);
    if (status === 'PENDING_MFA') {
        triggerPhoneAuth(`REQ: ${action} for ${data.user} [${data.riskLabel}]`);
    }
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
            handleInboundData({
                user: "SYSTEM", role: "ZTNA", dept: "GATEWAY", riskScore: "5.0",
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
        user: "SOC_ADMIN", role: "Operator", dept: "CORE", riskScore: score,
        ip: "127.0.0.1", riskLabel: "MANUAL", status: "CHALLENGING",
        msg: `SOC-Triggered MFA Challenge sent to ${user}.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
}

window.manualBlock = function (ip) {
    handleInboundData({
        user: "SOC_SYSTEM", role: "Operator", dept: "CORE", riskScore: "100",
        ip: "127.0.0.1", riskLabel: "NONE", status: "INTERVENED",
        msg: `MANUAL BLOCK APPLIED TO ${ip}`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
}

window.showPolicyModal = () => document.getElementById('policyModal').classList.remove('hidden');
window.hidePolicyModal = () => document.getElementById('policyModal').classList.add('hidden');
window.trySystemSettings = () => {
    if (!currentDept) return alert("Pilih Unit Department Dulu Bang!");
    handleInboundData({
        user: "SYS_LOCAL", role: "User", dept: currentDept, riskScore: "95.0",
        ip: "127.0.0.1", riskLabel: "CRITICAL", status: "GPO_BLOCK",
        msg: `[GPO_VIOLATION] Access to System Settings Blocked by trashure.local Policy.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
};
