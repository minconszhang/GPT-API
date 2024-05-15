import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const backendUrl = "http://127.0.0.1:5000";

const MODELS = ["gpt-3.5-turbo", "gpt-4o"];

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
    <div className="container">
      <div className="header">
        <select
          className="select-model"
          value={selectedModel}
          onChange={handleChangeModel}
        >
          {MODELS.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="dialogue-container">
        <div className="dialogue">
          <h2>Dialogue:</h2>
          <p className="user-message">You: {userMessage}</p>
          <p className="bot-message">Bot: {responseMessage}</p>
        </div>
      </div>

      <div className="input-container">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Message:
            <input
              className="form-input"
              type="text"
              value={userMessage}
              onChange={handleUserInput}
            />
          </label>
          <button className="form-button" type="submit">
            Send
          </button>
        </form>
      </div>

      <div className="token-container">
        <p className="token-info">Prompt tokens: {promptTokens}</p>
        <p className="token-info">Completion tokens: {completionTokens}</p>
      </div>
    </div>
  );
};

export default App;
