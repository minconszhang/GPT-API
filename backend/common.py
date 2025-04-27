from openai import OpenAI
from config import Config

client = OpenAI()

def get_response(model, messages):
    response = client.chat.completions.create(
        model=model,
        messages=messages
    )

    return response

