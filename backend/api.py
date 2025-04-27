from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from common import get_response

app = Flask(__name__)
CORS(app)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model')
    user_message = data.get('userMessage')

    prompt = Config.PROMPTS.get(model)
    messages = []

    messages.append({"role": "system", "content": prompt})
    messages.append({"role": "user", "content": user_message})

    response = get_response(model, messages)

    response_message = response.choices[0].message.content
    prompt_tokens = response.usage.prompt_tokens
    completion_tokens = response.usage.completion_tokens

    return jsonify({
        'message': response_message,
        'promptTokens': prompt_tokens,
        'completionTokens': completion_tokens
    })


if __name__ == '__main__':
    app.run(debug=True)
