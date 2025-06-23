import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// --- Global Brand Colors (consistent with your other components) ---
const primaryColor = "#593E2F"; // A rich, deep brown
const secondaryColor = "#D2B48C"; // A warm, sandy beige

// --- Constants for Message Types and their colors ---
const MESSAGE_TYPES = {
  success: {
    icon: CheckCircleOutlined,
    color: "#52c41a", // Ant Green
  },
  error: {
    icon: CloseCircleOutlined,
    color: "#ff4d4f", // Ant Red
  },
  info: {
    icon: InfoCircleOutlined,
    color: "#1890ff", // Ant Blue
  },
  warning: {
    icon: ExclamationCircleOutlined,
    color: "#faad14", // Ant Gold
  },
  loading: {
    icon: LoadingOutlined,
    color: primaryColor, // Use your brand primary color for loading
  },
};

// --- Message Context Setup ---
const MessageContext = createContext(null);
let addMessageRef = null; // Ref to hold the addMessage function
let removeMessageRef = null; // Ref to hold the removeMessage function

// --- Individual Message Toast Component ---
const MessageToast = ({ messageData, onDismiss }) => {
  const { id, type, content, duration, closable = true } = messageData;
  const [isVisible, setIsVisible] = useState(true);

  // Determine message-specific styles
  const messageTypeConfig = MESSAGE_TYPES[type] || MESSAGE_TYPES.info;
  const iconColor = messageTypeConfig.color;
  const IconComponent = messageTypeConfig.icon;

  useEffect(() => {
    if (duration && type !== "loading") {
      const timer = setTimeout(() => {
        setIsVisible(false); // Start fade-out animation
        setTimeout(() => onDismiss(id), 300); // Match CSS fade-out duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss, type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300); // Match CSS fade-out duration
  };

  return (
    <div
      className={`custom-message-wrapper ${isVisible ? 'is-visible' : 'is-hidden'} type-${type}`}
      style={{
        borderLeft: `5px solid ${iconColor}`,
      }}
    >
      <div className={`custom-message-icon ${type === 'loading' ? 'jiggle-animation' : ''}`} style={{ color: iconColor }}>
        {IconComponent && <IconComponent />}
      </div>
      <div className="custom-message-text-content">{content}</div>
      {closable && type !== "loading" && (
        <button className="custom-message-close-button" onClick={handleClose}>
          <CloseOutlined />
        </button>
      )}
    </div>
  );
};

// --- Message Provider Component ---
export const CustomMessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const messageCounter = useRef(0);

  const addMessage = useCallback((type, content, duration = 3000, key = null) => {
    messageCounter.current += 1;
    const id = key || `msg-${messageCounter.current}`;
    const newMessage = { id, type, content, duration, closable: true };

    setMessages((prevMessages) => {
      const existingIndex = prevMessages.findIndex((msg) => msg.id === id);
      if (existingIndex > -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[existingIndex] = newMessage;
        return updatedMessages;
      }
      return [...prevMessages, newMessage];
    });

    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  }, []);

  useEffect(() => {
    addMessageRef = addMessage;
    removeMessageRef = removeMessage;
  }, [addMessage, removeMessage]);

  const portalRoot = useRef(document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(portalRoot.current);
    return () => {
      document.body.removeChild(portalRoot.current);
    };
  }, []);

  return (
    <MessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}
      {ReactDOM.createPortal(
        <div className="custom-message-container">
          {messages.map((msg) => (
            <MessageToast key={msg.id} messageData={msg} onDismiss={removeMessage} />
          ))}
        </div>,
        portalRoot.current
      )}
    </MessageContext.Provider>
  );
};

// --- Custom Message API (mimicking Ant Design) ---
const customMessage = {
  _add: (type, content, duration, key) => {
    if (addMessageRef) {
      return addMessageRef(type, content, duration, key);
    } else {
      console.warn("CustomMessageProvider not yet mounted. Message could not be displayed:", content);
      return null;
    }
  },

  success: (content, duration, key) =>
    customMessage._add("success", content, duration, key),
  error: (content, duration, key) =>
    customMessage._add("error", content, duration, key),
  info: (content, duration, key) =>
    customMessage._add("info", content, duration, key),
  warning: (content, duration, key) =>
    customMessage._add("warning", content, duration, key),
  loading: (content, duration = 0, key) =>
    customMessage._add("loading", content, duration, key),

  destroy: (key) => {
    if (removeMessageRef) {
      removeMessageRef(key);
    } else {
      console.warn("CustomMessageProvider not yet mounted. Cannot destroy message.");
    }
  },
};

export default customMessage;
