import { useCallback, useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import ChatPopup from "./ChatPopup.jsx";

function ChatButton({ theme, variant = "desktop", onOpen }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const activeTheme = theme ?? { primary: "#a855f7", from: "#7b2cbf", via: "#a855f7" };
  const isMobile = variant === "mobile";

  const openChat = () => {
    setChatVisible(true);
    setChatOpen(true);
    onOpen?.();
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  const handleExited = useCallback(() => {
    setChatVisible(false);
  }, []);

  return (
    <>
      {isMobile ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onClick={openChat}
          className="group relative flex flex-col items-start rounded-3xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-6 transition-all hover:border-fuchsia-400/60 hover:bg-fuchsia-500/15"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-4xl font-black uppercase tracking-tighter text-white">Chat</span>
            <MessageCircle className="text-fuchsia-400" size={24} />
          </div>
          <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            Study Assistant Preview
          </span>
        </motion.button>
      ) : (
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.08, rotate: 1 }}
          whileTap={{ scale: 0.96 }}
          onClick={openChat}
          aria-label="Open chat"
          title="Open chat"
          className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 text-white transition-all duration-300 hover:border-white/25"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.18), ${activeTheme.from} 42%, ${activeTheme.via})`,
            boxShadow: `0 18px 36px ${activeTheme.primary}38, inset 0 1px 0 rgba(255,255,255,0.32)`,
          }}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.5),transparent_34%)] opacity-80" />
          <span className="absolute inset-px rounded-2xl border border-white/10" />
          <span className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-white/24 blur-lg transition-transform duration-500 group-hover:scale-150" />
          <span className="absolute inset-0 translate-x-[-130%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[130%]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.95)]" />
          <span className="relative z-10 grid h-8 w-8 place-items-center rounded-xl bg-black/12 ring-1 ring-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
            <MessageCircle size={20} strokeWidth={2.4} />
          </span>
        </motion.button>
      )}

      {chatVisible && (
        <ChatPopup open={chatOpen} onClose={closeChat} onExited={handleExited} />
      )}
    </>
  );
}

export default ChatButton;
