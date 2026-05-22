import { Bot, UserRound } from "lucide-react";

function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--bot"}`}>
      {!isUser && (
        <div className="chat-message__avatar chat-message__avatar--bot" aria-hidden="true">
          <Bot size={16} />
        </div>
      )}

      <div className="chat-message__bubble">
        <p>{message.text}</p>
      </div>

      {isUser && (
        <div className="chat-message__avatar chat-message__avatar--user" aria-hidden="true">
          <UserRound size={16} />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
