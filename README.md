# TRASHURE ZTNA SOC ENGINE (v1.0 Stable)

🛡️ **Zero Trust Network Access & Risk-Based Authentication Prototype**

This project is a production-grade simulation of a Zero Trust Security Operations Center (SOC) for a manufacturing enterprise (`trashure.local`). It was developed as a core component of a thesis research on **Enterprise Virtualization and Risk-Aware Access Control.**

## 🚀 Key Features
- **Dynamic RBA Engine**: Real-time risk scoring based on Geo Context, Velocity, and Identity Integrity.
- **AD DS & GPO Integration**: Simulated enforcement of Active Directory Group Policies (e.g., HR-only Write access).
- **Adaptive MFA**: Automatic MFA challenges triggered by risk anomalies or specific policy requirements.
- **Physical Layer Monitor**: Simulated status of physical infrastructure (RJ45/Layer-1) to bridge virtual and physical domains.
- **ZTNA Policy Matrix**: Interactive visualization of security decision logic.

## 🛠️ Technology Stack
- **Backend**: Node.js, Express, Socket.io
- **Frontend**: Vanilla JS (ES6+), Chart.js, IonIcons
- **Environment**: Optimized for Proxmox Virtualization Lab

## 📂 Project Structure
- `server.js`: The "Brain" - handles RBA logic and data pulses.
- `public/`: The "Body" - contains the interactive SOC Dashboard.
- `ztna_logic_mapping.md`: Detailed documentation of the scoring formulas.

## 🏁 Getting Started
1. `npm install`
2. `node server.js`
3. Visit `http://localhost:3050`

---
*Created by Kukuh Pratama - Ready for Defense* 🎓🇮🇩
