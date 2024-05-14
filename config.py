class Config:
    PROMPTS = {
        "gpt-3.5-turbo": """You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture.
        Knowledge cutoff: 2022-01
        Current date: 2023-11-01""",
        "gpt-4o": """You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Knowledge cutoff: 2023-04
        Current date: 2023-11-16""",
    }

    MODELS = {
        "1": "gpt-3.5-turbo",
        "2": "gpt-4o",
    }

    PRICES = {
        "gpt-3.5-turbo": {
            "prompt_tokens": 0.5,
            "completion_tokens": 1.5,
        },
        "gpt-4o": {
            "prompt_tokens": 5,
            "completion_tokens": 15,
        },
    }
