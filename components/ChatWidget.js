"use client"
import React, { useEffect } from "react";

const ChatWidget = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.id = "live-chat-init";
        script.defer = true;
        script.src = "https://veestore.ladesk.com/scripts/track.js";
        script.onload = () => {
            LiveAgent.createButton('2uu9zqsg');
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup code if needed
            document.getElementById("live-chat-init")?.remove();
        };
    }, []);

    return null;
};

export default ChatWidget;
