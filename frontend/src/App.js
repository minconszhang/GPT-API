import React, { useState } from "react";
import axios from "axios";

const backendUrl = "http://127.0.0.1:5000";

const App = () => {
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [userMessage, setUserMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);

  const handleChangeModel = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleUserInput = (event) => {
    setUserMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/chat`, {
        model: selectedModel,
        userMessage: userMessage,
      });

      setResponseMessage(response.data.message);
      setPromptTokens(response.data.promptTokens);
      setCompletionTokens(response.data.completionTokens);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Choose a model:</h1>
      <select value={selectedModel} onChange={handleChangeModel}>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        {/* Add more model options here */}
      </select>

      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" value={userMessage} onChange={handleUserInput} />
        </label>
        <button type="submit">Send</button>
      </form>

      <h2>Response:</h2>
      <p>{responseMessage}</p>

      <h2>Usage:</h2>
      <p>Prompt tokens: {promptTokens}</p>
      <p>Completion tokens: {completionTokens}</p>
    </div>
  );
};

export default App;
