from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model')
    user_message = data.get('userMessage')

    # 在这里处理模型响应
    # 你可以调用模型来生成响应，然后将响应和使用情况数据返回给前端

    response_message = "This is a sample response."
    prompt_tokens = 10
    completion_tokens = 20

    return jsonify({
        'message': response_message,
        'promptTokens': prompt_tokens,
        'completionTokens': completion_tokens
    })


if __name__ == '__main__':
    app.run(debug=True)
