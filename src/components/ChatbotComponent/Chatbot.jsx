import React, { useEffect, useRef, useState } from "react";

const Chatbot = () => {
  useEffect(() => {
    // Nhúng script Dialogflow vào React
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <df-messenger
      intent="WELCOME"
      chat-title="WebPhone"
      agent-id="dbb32cb8-3cfd-444c-a587-69b94e4bce03"
      language-code="en"
      style={{
        "--df-messenger-button-titlebar-color": "#42c8b7",
        "--df-messenger-send-icon": "#42c8b7",
      }}
    ></df-messenger>
  );
};

export default Chatbot;
