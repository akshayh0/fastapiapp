import { useState } from "react";
import { sendMessage } from "../Services/chatService";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSend = async () => {
    if (!question.trim()) return;

    try {
      const response = await sendMessage({
        question,
      });

      setAnswer(response.answer);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1>AI Career Assistant</h1>

      <textarea
        rows={5}
        style={{ width: "100%" }}
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSend}>Send</button>

      <br />
      <br />

      <h2>Response</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          minHeight: "100px",
        }}
      >
        {answer}
      </div>
    </div>
  );
};

export default Chat;