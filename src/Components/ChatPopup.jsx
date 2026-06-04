import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import ChatMessage from "./ChatMessage.jsx";
import "./chatbot.css";

const initialMessages = [
  {
    id: "welcome",
    sender: "bot",
    text: "Chatbot integration will be added soon.",
  },
];

function ChatPopup({ open, onClose, onExited }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const replyTimerRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current || !overlayRef.current) return;

    if (open) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { x: 56, opacity: 0, scale: 0.98 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(overlayRef.current, { opacity: 1, duration: 0.22 })
        .to(panelRef.current, { x: 0, opacity: 1, scale: 1, duration: 0.42 }, "<0.05");

      return () => timeline.kill();
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: onExited,
    });

    timeline
      .to(panelRef.current, { x: 44, opacity: 0, scale: 0.98, duration: 0.24 })
      .to(overlayRef.current, { opacity: 0, duration: 0.18 }, "<");

    return () => timeline.kill();
  }, [open, onExited]);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, open]);

  useEffect(() => {
    return () => window.clearTimeout(replyTimerRef.current);
  }, []);

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `user-${Date.now()}`, sender: "user", text },
    ]);
    setInputValue("");
    setIsTyping(true);

    replyTimerRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Thanks for your message. Chatbot integration will be added soon.",
        },
      ]);
      setIsTyping(false);
    }, 1400);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="chatbot-overlay"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <aside
        ref={panelRef}
        className="chatbot-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Study Assistant chat"
      >
        <div className="chatbot-panel__glow" aria-hidden="true" />

        <header className="chatbot-header">
          <div className="chatbot-header__identity">
            <div className="chatbot-header__icon" aria-hidden="true">
              <Bot size={22} />
            </div>
            <div>
              <p>Study Assistant</p>
              <span>
                <Sparkles size={12} />
                Frontend preview
              </span>
            </div>
          </div>

          <button
            type="button"
            className="chatbot-close"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </header>

        <div className="chatbot-messages" aria-live="polite">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="chat-message chat-message--bot">
              <div className="chat-message__avatar chat-message__avatar--bot" aria-hidden="true">
                <Bot size={16} />
              </div>
              <div className="chat-message__bubble chat-message__bubble--typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </aside>
    </div>,
    document.body
  );
}

export default ChatPopup;
