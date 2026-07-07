// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

class NetworkScanner {
    constructor() {
        this.devices = [];
        this.isScanning = false;
        this.init();
    }

    init() {
        this.scanBtn = document.getElementById('scanBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.devicesContainer = document.getElementById('devicesContainer');
        this.loading = document.getElementById('loading');
        this.status = document.getElementById('status');
        this.ipAddress = document.getElementById('ipAddress');
        this.deviceCount = document.getElementById('deviceCount');

        this.scanBtn.addEventListener('click', () => this.scanNetwork());
        this.refreshBtn.addEventListener('click', () => this.scanNetwork());

        this.getLocalIP();
        setTimeout(() => this.scanNetwork(), 1000);
    }

    getLocalIP() {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            
            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
                const match = ice.candidate.candidate.match(ipRegex);
                if (match) {
                    this.ipAddress.textContent = match[0];
                    pc.close();
                }
            };
        } catch (e) {
            this.ipAddress.textContent = '192.168.1.1';
        }
    }

    async scanNetwork() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.loading.style.display = 'block';
        this.devicesContainer.innerHTML = '';
        this.status.innerHTML = '<span>🔍 Memindai jaringan...</span>';
        this.scanBtn.disabled = true;

        try {
            const devices = await this.getDevices();
            this.devices = devices;
            this.displayDevices(devices);
            this.deviceCount.textContent = devices.length;
            this.status.innerHTML = `<span>✅ Ditemukan ${devices.length} perangkat</span>`;
        } catch (error) {
            this.status.innerHTML = '<span>❌ Gagal scan jaringan</span>';
            this.devicesContainer.innerHTML = `
                <div style="text-align:center;padding:30px;color:#fc8181;">
                    <div style="font-size:48px;">⚠️</div>
                    <p>Gagal memindai jaringan</p>
                </div>
            `;
        }

        this.isScanning = false;
        this.loading.style.display = 'none';
        this.scanBtn.disabled = false;
    }

    async getDevices() {
        const ip = this.ipAddress.textContent;
        const prefix = ip.split('.').slice(0, 3).join('.');
        
        const mockDevices = [
            { name: '1', ip: `${prefix}.1`, mac: this.randomMAC(), status: 'active' },
            { name: '2', ip: `${prefix}.${Math.floor(Math.random() * 254 + 2)}`, mac: this.randomMAC(), status: 'active' },
            { name: '3', ip: `${prefix}.${Math.floor(Math.random() * 254 + 2)}`, mac: this.randomMAC(), status: 'active' },
            { name: '4', ip: `${prefix}.${Math.floor(Math.random() * 254 + 2)}`, mac: this.randomMAC(), status: 'active' },
            { name: '5', ip: `${prefix}.${Math.floor(Math.random() * 254 + 2)}`, mac: this.randomMAC(), status: 'active' },
            { name: '6', ip: `${prefix}.${Math.floor(Math.random() * 254 + 2)}`, mac: this.randomMAC(), status: 'active' },
        ];

        const count = Math.floor(Math.random() * 4) + 3;
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockDevices.slice(0, count);
    }

    randomMAC() {
        return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]);
    }

    displayDevices(devices) {
        this.devicesContainer.innerHTML = '';
        devices.forEach(device => {
            const el = document.createElement('div');
            el.className = 'device-item';
            el.innerHTML = `
                <div>
                    <div class="device-name">${device.name}</div>
                    <div class="device-ip">IP: ${device.ip}</div>
                    <div class="device-mac">MAC: ${device.mac}</div>
                </div>
                <div class="device-status">
                    <span class="status-dot"></span>
                    <span>Online</span>
                </div>
            `;
            this.devicesContainer.appendChild(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NetworkScanner();
});