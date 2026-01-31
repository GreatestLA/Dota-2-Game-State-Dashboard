from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Store the latest game state
latest_gamestate = None
last_update = None


@app.route('/', methods=['POST'])
def receive_gamestate():
    """
    Endpoint that receives POST requests from Dota 2 client
    """
    global latest_gamestate, last_update
    
    try:
        # Get JSON data from Dota 2
        data = request.get_json()
        
        if data:
            latest_gamestate = data
            last_update = datetime.now()
            print(f"[{last_update.strftime('%H:%M:%S')}] Game state updated")
            return '', 200
        else:
            return 'No data received', 400
            
    except Exception as e:
        print(f"Error receiving game state: {e}")
        return str(e), 500


@app.route('/api/gamestate', methods=['GET'])
def get_gamestate():
    """
    API endpoint for frontend and C++ app to fetch latest game state
    """
    global latest_gamestate, last_update
    
    if latest_gamestate is None:
        return jsonify({
            'status': 'waiting',
            'message': 'No game data received yet. Start Dota 2!'
        }), 200
    
    # Add metadata to response
    response = {
        'status': 'active',
        'last_update': last_update.isoformat() if last_update else None,
        'data': latest_gamestate
    }
    
    return jsonify(response), 200


@app.route('/api/health', methods=['GET'])
def get_health_only():
    """
    Simplified endpoint for C++ app - returns only health data
    """
    if latest_gamestate is None:
        return jsonify({'health': None, 'max_health': None}), 200
    
    try:
        hero_data = latest_gamestate.get('hero', {})
        health = hero_data.get('health', 0)
        max_health = hero_data.get('max_health', 1)
        
        return jsonify({
            'health': health,
            'max_health': max_health,
            'health_percent': (health / max_health * 100) if max_health > 0 else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("=" * 50)
    print("Dota 2 Game State Dashboard - Server Starting")
    print("=" * 50)
    print("Server running on: http://localhost:3000")
    print("Waiting for Dota 2 game data...")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=3000, debug=True)
