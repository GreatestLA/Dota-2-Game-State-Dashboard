## 🎮 Project Overview

This project demonstrates:
- **Backend:** Python Flask server receiving game data via Dota 2 GSI
- **Frontend:** Modern web dashboard with live health/mana/gold tracking
- **Systems Programming:** C++ health monitoring with critical health alerts


## 🚀 Quick Start Guide

### Prerequisites

**Python:**
- Python 3.8 or higher
- pip package manager

**C++ Compiler:**
- **Windows:** Visual Studio or MinGW-w64


**Dota 2:**
- Installed via Steam

---

### Step 1: Configure Dota 2 GSI

1. Locate your Dota 2 config folder:
   - **Windows:** `C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota\cfg\gamestate_integration\`
   
2. Create the `gamestate_integration` folder if it doesn't exist

3. Copy `gamestate_integration_copilot.cfg` to this folder

4. Restart Dota 2

---

### Step 2: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

### Step 3: Start the Flask Server

```bash
cd backend
python server.py
```

You should see:
```
==================================================
Dota 2 Game State Dashboard - Server Starting
==================================================
Server running on: http://localhost:3000
Waiting for Dota 2 game data...
==================================================
```

**Keep this terminal open!**

---

### Step 4: Open the Dashboard

**Direct File Opening**

Double-click `frontend/index.html` or:
```bash
```
---

### Step 5: Start Playing Dota 2

1. Launch **Dota 2**
2. Start a game (bot match, demo hero, or real match)
3. Watch your dashboard update in real-time!

---

## 🎯 Features

### Web Dashboard
- ✅ Real-time health and mana bars
- ✅ Hero level tracking
- ✅ Gold economy display (Total/Reliable/Unreliable)
- ✅ Buyback cost calculator
- ✅ Dark mode gamer aesthetic
- ✅ Responsive design

### Backend API
- ✅ Receives Dota 2 GSI data
- ✅ RESTful API endpoints
- ✅ CORS support for frontend
- ✅ Real-time data updates

---


**Happy gaming! ⚔️🎮**
