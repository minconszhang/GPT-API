class Config:
    PROMPTS = {
        "gpt-4.1-mini": """
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
        """,
        "gpt-4.1-nano": """
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
        You are trained on data up to October 2023.
        """,
        "gpt-4o": """You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Knowledge cutoff: 2023-10
        Current date: 2024-05-14
        Image input capabilities: Enabled
        Personality: v2""",
    }

    MODELS = {
        "1": "gpt-4.1-mini",
        "2": "gpt-4.1-nano",
    }

    PRICES = {
        "gpt-4.1-mini": {
            "prompt_tokens": 0.4,
            "completion_tokens": 1.6,
        },
        "gpt-4.1-nano": {
            "prompt_tokens": 0.1,
            "completion_tokens": 0.4,
        },
    }
