import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // Endpoint to serve the installer script
  app.get("/install.sh", (req, res) => {
    const appUrl = process.env.APP_URL || `http://${req.get('host')}`;
    
    const script = `#!/bin/bash
# Vinyl Stream Installer (Interactive)
# Inspired by: https://www.instructables.com/Stream-Turntable-Vinyl-to-Chromecast/

set -e

# Colors for better output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

echo -e "\${BLUE}----------------------------------------------------\${NC}"
echo -e "\${BLUE}   Vinyl Stream Interactive Installer v2.0          \${NC}"
echo -e "\${BLUE}----------------------------------------------------\${NC}"

# 1. Check Root
if [[ \$EUID -ne 0 ]]; then
   echo -e "\${RED}Error: This script must be run as root.\${NC}"
   echo -e "Try: curl -sL \${appUrl}/install.sh | sudo bash"
   exit 1
fi

# 2. Information Gathering
echo -e "\${YELLOW}>>> Configuration Setup\${NC}"

read -p "Icecast Port [8000]: " IC_PORT
IC_PORT=\${IC_PORT:-8000}

read -p "Icecast Password [hackme]: " IC_PASS
IC_PASS=\${IC_PASS:-hackme}

read -p "Mount Point [/vinyl]: " IC_MOUNT
IC_MOUNT=\${IC_MOUNT:-vinyl}
IC_MOUNT=\${IC_MOUNT#/} # Remove leading slash if present

echo -e "\\nAvailable Audio Devices:"
arecord -l | grep "card" || echo "No cards found. Ensure USB interface is plugged in."
read -p "ALSA Device [hw:1,0]: " ALSA_DEV
ALSA_DEV=\${ALSA_DEV:-hw:1,0}

read -p "Streaming Bitrate (kbps) [320]: " BITRATE
BITRATE=\${BITRATE:-320}

echo -e "\\n\${BLUE}Settings Confirmed:\${NC}"
echo "Port: \$IC_PORT"
echo "Mount: /\$IC_MOUNT"
echo "Device: \$ALSA_DEV"
echo "Bitrate: \$BITRATE kbps"
echo "----------------------------------------------------"

# 3. Installation
echo -e "\\n\${YELLOW}[1/5] Installing Packages...\${NC}"
apt-get update
apt-get install -y icecast2 darkice libmp3lame0 alsa-utils

# 4. Configure Icecast2
echo -e "\${YELLOW}[2/5] Configuring Icecast2...\${NC}"
IC_CONFIG="/etc/icecast2/icecast.xml"

# Basic security: update passwords in the xml
sed -i "s/<source-password>.*<\\/source-password>/<source-password>\$IC_PASS<\\/source-password>/g" \$IC_CONFIG
sed -i "s/<relay-password>.*<\\/source-password>/<relay-password>\$IC_PASS<\\/source-password>/g" \$IC_CONFIG
sed -i "s/<admin-password>.*<\\/source-password>/<admin-password>\$IC_PASS<\\/source-password>/g" \$IC_CONFIG
sed -i "s/<port>.*<\\/port>/<port>\$IC_PORT<\\/port>/g" \$IC_CONFIG

# Enable service
sed -i 's/ENABLE=false/ENABLE=true/g' /etc/default/icecast2 || true

# 5. Configure DarkIce
echo -e "\${YELLOW}[3/5] Generating DarkIce Configuration...\${NC}"
cat <<EOF > /etc/darkice.cfg
[general]
duration        = 0
bufferSecs      = 2
reconnect       = yes

[input]
device          = \$ALSA_DEV
sampleRate      = 44100
bitsPerSample   = 16
channel         = 2

[icecast2-0]
bitrateMode     = cbr
format          = mp3
bitrate         = \$BITRATE
server          = localhost
port            = \$IC_PORT
password        = \$IC_PASS
mountPoint      = \$IC_MOUNT
name            = Vinyl Stream
description     = Live High Fidelity Vinyl Stream
url             = \${appUrl}
genre           = Vinyl
public          = no
EOF

# 6. Service Setup
echo -e "\${YELLOW}[4/5] Establishing DarkIce System Service...\${NC}"
cat <<EOF > /etc/systemd/system/darkice.service
[Unit]
Description=DarkIce Vinyl Encoder Service
After=network.target icecast2.service
Wants=icecast2.service

[Service]
ExecStart=/usr/bin/darkice -c /etc/darkice.cfg
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 7. Start Services
echo -e "\${YELLOW}[5/5] Finalizing Services...\${NC}"
systemctl daemon-reload
systemctl enable icecast2
systemctl restart icecast2
systemctl enable darkice
systemctl restart darkice

# 8. Success Report
IP_ADDR=\$(hostname -I | awk '{print \$1}')
echo -e "\\n\${GREEN}----------------------------------------------------\${NC}"
echo -e "\${GREEN}   SUCCESS: VINYL STREAMING ENGINE ONLINE           \${NC}"
echo -e "\${GREEN}----------------------------------------------------\${NC}"
echo -e "Stream URL: \${BLUE}http://\$IP_ADDR:\$IC_PORT/\$IC_MOUNT\${NC}"
echo ""
echo -e "\${YELLOW}Maintenance Commands:\${NC}"
echo -e "Start:  \${BLUE}sudo systemctl start darkice\${NC}"
echo -e "Stop:   \${BLUE}sudo systemctl stop darkice\${NC}"
echo -e "Status: \${BLUE}sudo systemctl status darkice\${NC}"
echo -e "Logs:   \${BLUE}sudo journalctl -u darkice -f\${NC}"
echo -e "----------------------------------------------------"
`;
    res.setHeader('Content-Type', 'text/x-shellscript');
    res.send(script);
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
