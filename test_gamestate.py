import requests
import json
import time

url = "http://localhost:3000/"

mock_data = {
    "hero": {
        "name": "npc_dota_hero_pudge",
        "health": 800,
        "max_health": 800,
        "mana": 400,
        "max_mana": 400,
        "level": 12
    },
    "player": {
        "gold": 2500,
        "gold_reliable": 800
    }
}

print("Dota 2 Mock Data Sender")
print("=" * 50)
print("Sending mock game data to http://localhost:3000/")
print("This simulates Dota 2 sending game state data")
print("=" * 50)
print()

# Send initial mock data
try:
    response = requests.post(url, json=mock_data)
    print(f"✓ Sent initial mock data. Response: {response.status_code}")
    print(f"  Hero: {mock_data['hero']['name']}")
    print(f"  Health: {mock_data['hero']['health']}/{mock_data['hero']['max_health']}")
    print(f"  Gold: {mock_data['player']['gold']}")
    print()
except Exception as e:
    print(f"✗ Error sending data: {e}")
    print("Make sure the Python server is running!")
    exit(1)

# Gradually decrease health to test C++ monitor
print("Now decreasing health to test the C++ health monitor...")
print("(The C++ app should trigger an alert when health drops below 20%)")
print()

for i in range(15):
    # Decrease health
    mock_data["hero"]["health"] -= 60
    if mock_data["hero"]["health"] < 0:
        mock_data["hero"]["health"] = 0
    
    # Vary gold a bit
    mock_data["player"]["gold"] += 50
    
    # Send update
    try:
        requests.post(url, json=mock_data)
        health_percent = (mock_data["hero"]["health"] / mock_data["hero"]["max_health"]) * 100
        print(f"Update {i+1}: Health = {mock_data['hero']['health']} ({health_percent:.1f}%)")
        
        if health_percent <= 20 and health_percent > 0:
            print("  ⚠️  CRITICAL HEALTH - C++ monitor should alert!")
        elif mock_data["hero"]["health"] == 0:
            print("  ☠️  DEAD")
    except Exception as e:
        print(f"Error: {e}")
    
    time.sleep(2)

print()
print("Test complete! Your dashboard and C++ monitor should have updated.")
