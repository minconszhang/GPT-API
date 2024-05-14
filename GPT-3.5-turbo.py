from openai import OpenAI


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

    messages.append({"role": "system", "content": "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture.\nKnowledge cutoff: 2022-01\nCurrent date: 2023-11-01"})

    print("I am ChatGPT 3.5 turbo, a large language model trained by OpenAI. I can help you with a variety of tasks. How can I assist you today?")

    while True:
        user_message = get_user_input("")
        if user_message.lower() == "exit":
            print("Exiting...")
            break

        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        print(response.choices[0].message.content)

        messages.append(
            {"role": "assistant", "content": response.choices[0].message.content})

        prompt_tokens += response.usage.prompt_tokens
        completion_tokens += response.usage.completion_tokens

        print("Prompt tokens: {}".format(prompt_tokens))
        print("Completion tokens: {}".format(completion_tokens))
        print("Type 'exit' to quit.")


if __name__ == "__main__":
    main()
