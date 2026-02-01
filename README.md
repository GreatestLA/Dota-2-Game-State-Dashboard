# 🛡️ Dota 2 Game State Dashboard

A real-time second-screen dashboard for Dota 2 players. This application connects to the Dota 2 Game State Integration (GSI) interface to display live health, mana, gold economy, and buyback status on a separate web interface.

## ✨ Features

### 🖥️ Frontend Dashboard
* **Live Status Bars**: Real-time visual tracking of Health and Mana.
* **Economy Tracker**: Breakdown of Total, Reliable, and Unreliable gold.
* **Buyback Calculator**: Instantly see if you have enough gold to buy back.
* **Adaptive UI**: Dark mode aesthetic designed for gamers.

### ⚙️ Backend API
* **GSI Receiver**: Accepts raw data packets from the Dota 2 client.
* **REST API**: Serves processed game state data to the frontend.
* **Cross-Origin Support**: Fully configured CORS for seamless local development.

## 🛠️ Tech Stack
* **Backend**: Python (Flask)
* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Integration**: Valve Game State Integration (GSI)

## 🚀 Installation & Setup

### Prerequisites
* Python 3.8+
* Dota 2 (Installed via Steam)

### 1. Configure Dota 2

To allow the game to send data to this application, you must add the configuration file.

1. Navigate to your Dota 2 configuration folder:
   * Path: `C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota\cfg\gamestate_integration\`
   * **Note**: If the `gamestate_integration` folder does not exist, create it.
2. Copy the file `gamestate_integration_copilot.cfg` from this repository into that folder.
3. Restart Dota 2 to apply changes.

### 2. Install Dependencies

Open your terminal and run:
```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Server

Launch the Flask backend:
```bash
python server.py
```

You should see the message:
```
Waiting for Dota 2 game data...
```

### 4. Launch Dashboard

Open the frontend interface by double-clicking `frontend/index.html` in your file explorer, or by hosting it on a local server.

## 🎮 Usage

1. Ensure the Flask Server is running (`python server.py`).
2. Open Dota 2 and enter a match (Bot match, Demo Hero, or Online).
3. Keep the dashboard open on a second monitor or separate window.
4. Watch the stats update in real-time as you play!

## ❓ Troubleshooting

**The dashboard isn't updating?**
* Ensure the Flask server is running and says "Waiting for data".
* Verify that `gamestate_integration_copilot.cfg` is in the correct `cfg/gamestate_integration` folder.
* Check that the file extension is `.cfg` and not `.cfg.txt`.

**"404 Not Found" in console?**
* Make sure you are running the server from the `backend/` directory so it can find the correct paths.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Note: Portions of this code were generated with the assistance of Claude AI. All code has been verified by a human developer.
