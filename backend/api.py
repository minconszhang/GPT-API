from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from config import Config
from common import get_response

app = Flask(__name__)
CORS(app)

conversations = {}


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model')
    user_msg = data.get('userMessage')
    conv_id = data.get('conversationId')

    if not conv_id:
        conv_id = str(uuid.uuid4())
        conversations[conv_id] = [
            {"role": "system", "content": Config.PROMPTS.get(model, "")}
        ]

    history = conversations.get(conv_id, [])

    history.append({"role": "user", "content": user_msg})

    response = get_response(model, history)
    bot_msg = response.choices[0].message.content

    conversations[conv_id].append({"role": "assistant", "content": bot_msg})

    return jsonify({
        'conversationId': conv_id,
        'message': bot_msg,
        'promptTokens': response.usage.prompt_tokens,
        'completionTokens': response.usage.completion_tokens
    })


if __name__ == '__main__':
    app.run(debug=True)
