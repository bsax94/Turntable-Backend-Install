# VinylStream Pro-Link: Raspberry Pi OS Installation Guide

Welcome to the **VinylStream Pro-Link** installer and streaming controller dashboard. This project provides an automated, interactive, single-command installation process to stream high-fidelity vinyl audio from a USB audio interface connected to a Raspberry Pi over your local network using Icecast2 and DarkIce.

---

## 🚀 One-Command Interactive Installation

To deploy the entire streaming stack (Icecast2 + DarkIce Encoder + Systemd Services) automatically onto your Raspberry Pi running **Raspberry Pi OS (Debian/Raspbian)**, run the following command in your terminal:

```bash
curl -sL https://ais-pre-aal7j4lufgg3zanqcr5exw-498219560730.us-west2.run.app/install.sh | sudo bash
```

> 💡 **Note:** Replace the URL above with your custom deployment URL if you are running a self-hosted instance of the control dashboard.

---

## 🛠️ Step-by-Step Interactive Setup

When you run the command above, the installer will guide you through the following setup steps:

1. **Icecast2 Port Configuration:** Choose the port for the stream broadcasting server (Default: `8000`).
2. **Icecast2 Security:** Enter a source/admin password for your streaming server (Default: `hackme`).
3. **Mount Point Definition:** Configure the stream endpoint path (Default: `/vinyl`).
4. **USB Audio Interface Detection:** The script automatically scans for connected ALSA sound cards (e.g., Behringer UCA202) and lets you choose the hardware address (Default: `hw:1,0`).
5. **Streaming Quality:** Specify the constant bitrate (CBR) for MP3 compression (Default: `320` kbps).

Once completed, the script automatically generates configurations, provisions the required systemd background tasks, and boots the streaming server.

---

## 🎛️ Managing the Streaming Service

After a successful installation, you can control the DarkIce encoder and Icecast2 server using standard systemd commands:

| Action | Command |
| :--- | :--- |
| **Start Streaming** | `sudo systemctl start darkice` |
| **Stop Streaming** | `sudo systemctl stop darkice` |
| **Check Stream Status** | `sudo systemctl status darkice` |
| **View Encoder Logs** | `sudo journalctl -u darkice -f` |
| **Restart Icecast Server** | `sudo systemctl restart icecast2` |

---

## 🎵 How to Listen and Cast to Chromecast

Your turntable will stream raw, high-fidelity MP3 audio over your local area network (LAN).

### 1. Direct Stream Address
Once the service starts, the stream is accessible at:
```text
http://<your-raspberry-pi-ip>:8000/vinyl
```
*(Replace `8000` and `vinyl` with your custom port and mount point if modified during setup).*

### 2. Casting to Chromecast / Smart Speakers
To stream the audio feed to your Chromecast, Google Home, or smart speakers, you can use any of the following methods:
* **VLC Media Player (Desktop & Mobile):** Go to `Media` ➔ `Open Network Stream...`, paste the stream URL, and use VLC's built-in "Renderer" menu to cast to any Chromecast on your network.
* **Cast-Vinyl Utility:** Use the lightweight open-source node utility [Cast-Vinyl](https://github.com/dguineau/cast-vinyl) to automatically direct the Icecast mount point to your Google Cast speaker groups.
* **Mobile Casting Apps:** Apps like *BubbleUPnP* (Android) or *LocalCast* (iOS) can capture the raw HTTP MP3 stream and broadcast it directly to active smart speaker groups.
