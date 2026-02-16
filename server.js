require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});
const PORT = 3050;

function getRiskLabel(score) {
    if (score > 70) return "HIGH RISK";
    if (score > 35) return "MED RISK";
    return "LOW RISK";
}

app.use(express.static('public'));
app.use(express.json());

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

// Socket Lifecycle
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Send immediate pulse to confirm link
    const initialScore = 15;
    socket.emit('ztna-log', {
        type: 'INFO',
        user: "SYS_HEALTH",
        role: "Monitor",
        dept: "CORE",
        ip: "127.0.0.1",
        riskScore: "0.0",
        riskLabel: "LOW RISK",
        coords: { x: 50, y: 50 },
        factors: { geo: 5, velocity: 3, integrity: 98 },
        msg: "SOC Connection Established. Monitoring Live...",
        status: "VERIFIED",
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
});

// Background Automated Pulse
setInterval(() => {
    try {
        const user = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];

        // IP LOGIC: 10.62.x.x is LOCAL
        const subnets = ["10.62.8", "10.62.30", "10.62.150", "172.16.10", "192.168.1"];
        const subnet = subnets[Math.floor(Math.random() * subnets.length)];
        const ip = `${subnet}.${Math.floor(Math.random() * 254)}`;
        const isLocal = ip.startsWith("10.62.");

        // RISK LOGIC: Anomaly if NOT 10.62.x.x
        let baseScore = isLocal ? (5 + Math.random() * 30) : (40 + Math.random() * 50);

        // POLICY LOGIC: HR has lower baseline risk for certain accesses
        if (user.dept === "HR") baseScore -= 5;

        const score = Math.max(0, Math.min(100, baseScore)).toFixed(1);
        const riskLabel = getRiskLabel(score);

        // LOGIC: DYNAMIC FACTORS based on IP Trust
        const factors = {
            geo: isLocal ? Math.max(2, Math.floor(Math.random() * 10)) : Math.max(30, Math.floor((score * 0.6) + Math.random() * 15)),
            velocity: Math.max(5, Math.floor((score * 0.45) + Math.random() * 10)),
            integrity: Math.min(100, Math.max(0, 100 - Math.floor((score * 0.7) + Math.random() * 5)))
        };

        const data = {
            type: score > 70 ? 'CRITICAL' : (score > 35 ? 'WARN' : 'INFO'),
            user: user.name,
            role: user.role,
            dept: user.dept,
            ip: ip,
            riskScore: score,
            riskLabel: riskLabel,
            coords: { x: 20 + Math.random() * 60, y: 30 + Math.random() * 40 },
            factors: factors,
            msg: isLocal ? `[TRUSTED_IP] Access from internal subnet 10.62.0.0/16.` : `[ANOMALY_IP] Unusual access from external subnet ${subnet}.0/24.`,
            status: score > 70 ? 'DENIED' : (score > 35 ? 'MFA_REQUIRED' : 'VERIFIED'),
            timestamp: new Date().toLocaleTimeString('id-ID')
        };

        io.emit('ztna-log', data);
        console.log(`📡 PULSE: ${user.name} (${ip}) [${riskLabel}] RBA: ${factors.geo}/${factors.velocity}/${factors.integrity}`);
    } catch (e) {
        console.error("❌ Pulse Error:", e);
    }
}, 3000);

app.get('/simulate/:scenario', (req, res) => {
    const scenario = req.params.scenario;
    const action = req.query.action || 'READ';
    const user = USERNAMES.find(u => u.dept.toLowerCase().includes(scenario)) || USERNAMES[0];

    // PERMISSION LOGIC: Only HR has Full Read/Write
    // Others are restricted on WRITE
    let score = (action === 'READ') ? 15 : 45;
    let msg = `[GPO_CHECK] User ${user.name} allowed ${action} access to Dept Folder.`;
    let status = (score > 35) ? 'PENDING_MFA' : 'VERIFIED';

    if (action === 'WRITE' && user.dept !== 'HR') {
        score = 82.5; // High Risk violation
        msg = `[ZTNA_BLOCK] GPO Policy violation: ${user.name} (${user.dept}) has no WRITE permission.`;
        status = 'DENIED';
    }

    if (scenario === 'rd') {
        score = Math.max(score, 75);
        msg = `[CRITICAL_UNIT] Access to R&D Cloud requires elevated verification.`;
    }

    const riskLabel = getRiskLabel(score);
    const data = {
        type: score > 70 ? 'CRITICAL' : (score > 35 ? 'WARN' : 'INFO'),
        user: user.name,
        role: user.role,
        dept: user.dept,
        ip: `10.62.8.${Math.floor(Math.random() * 254)}`,
        riskScore: score,
        riskLabel: riskLabel,
        coords: { x: 20 + Math.random() * 60, y: 30 + Math.random() * 40 },
        factors: {
            geo: Math.max(5, Math.floor((score * 0.45) + Math.random() * 15)),
            velocity: Math.max(3, Math.floor((score * 0.45) + Math.random() * 15)),
            integrity: Math.min(100, Math.max(0, 100 - Math.floor((score * 0.7) + Math.random() * 10)))
        },
        msg: msg,
        status: status,
        timestamp: new Date().toLocaleTimeString('id-ID')
    };

    io.emit('ztna-log', data);
    res.json({ success: true, data: data });
});

app.post('/soc/action', (req, res) => {
    const { action, ip } = req.body;
    io.emit('ztna-log', {
        type: 'CRITICAL',
        user: "SOC_SYSTEM",
        role: "Operator",
        dept: "CORE",
        ip: "127.0.0.1",
        riskLabel: "NONE",
        status: "INTERVENED",
        msg: `MANUAL ${action} APPLIED TO ${ip}`,
        timestamp: new Date().toLocaleTimeString('id-ID')
    });
    res.json({ success: true });
});

server.listen(PORT, () => {
    console.log(`🚀 v4.5 STABLE ZTNA ENGINE running on http://localhost:${PORT}`);
});
