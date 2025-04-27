from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config

app = Flask(__name__)
CORS(app)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model')
    user_message = data.get('userMessage')

    

    response_message = model
    prompt_tokens = 10
    completion_tokens = 20

    return jsonify({
        'message': response_message,
        'promptTokens': prompt_tokens,
        'completionTokens': completion_tokens
    })


if __name__ == '__main__':
    app.run(debug=True)
