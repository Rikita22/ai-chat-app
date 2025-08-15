import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css'; // External CSS for cleaner styling

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const sendMessage = async () => {
        if (message.trim()) {
            const userMessage = { user: 'You', text: message };
            setChatHistory(prev => [...prev, userMessage]);
            setMessage('');
            setLoading(true);

            try {
                const response = await axios.post('http://localhost:5000/api/chat', { message });
                const aiMessage = { user: 'AI', text: response.data.reply };
                setChatHistory(prev => [...prev, aiMessage]);
            } catch (error) {
                console.error(error);
                const errorMsg = { user: 'AI', text: 'Error communicating with server.' };
                setChatHistory(prev => [...prev, errorMsg]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setChatHistory([]);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <div className="chat-container">
            <h2 className="chat-title">AI Chat Assistant</h2>
            <div className="chat-box">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.user === 'You' ? 'user' : 'ai'}`}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
                {loading && <div className="typing-indicator">AI is typing...</div>}
                <div ref={chatEndRef}></div>
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
                <button onClick={clearChat} className="clear-btn">Clear</button>
            </div>
        </div>
    );
};

export default Chat;
