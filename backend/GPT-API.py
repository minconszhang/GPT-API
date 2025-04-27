from openai import OpenAI
from config import Config


def get_user_input(prompt):
    while True:
        user_input = input(prompt)
        if user_input.strip():
            return user_input.strip()
        else:
            print("Please enter a non-empty message.")


def main():
    client = OpenAI()
    messages = []

    prompt_tokens = 0
    completion_tokens = 0

    print("Choose a model:")
    for model_name in Config.MODELS:
        print(f"{model_name}: {Config.MODELS[model_name]}")

    selected_model = input(
        "Enter the number of the model you want to use (gpt-4.1-mini): ").strip().lower()
    model = Config.MODELS.get(selected_model, Config.MODELS["1"])
    prompt = Config.PROMPTS.get(model, Config.PROMPTS["gpt-4.1-mini"])

    messages.append({"role": "system", "content": prompt})

    print(f"I am ChatGPT {model}. How can I assist you today? (Type 'exit' to quit.)")

    while True:
        user_message = get_user_input("")
        if user_message.lower() == "exit":
            print("Exiting...")
            break

        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=model,
            messages=messages
        )

        print(response.choices[0].message.content)

        messages.append(
            {"role": "assistant", "content": response.choices[0].message.content})

        prompt_tokens += response.usage.prompt_tokens
        completion_tokens += response.usage.completion_tokens

    total_price = (Config.PRICES[model]["prompt_tokens"] * prompt_tokens / 1000000 +
                   Config.PRICES[model]["completion_tokens"] * completion_tokens / 1000000)

    print("Prompt tokens: {}".format(prompt_tokens))
    print("Completion tokens: {}".format(completion_tokens))
    print(f"Total price: ${total_price:.5f}")


if __name__ == "__main__":
    main()
