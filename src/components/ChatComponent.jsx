import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ChatComponent.css'; // Import the CSS file
import { chat, resetChat } from '../api';

function ChatComponent({ yfInfo, portfolio, open, setOpen }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;
        const response = await chat(inputMessage, [portfolio, yfInfo])
    
        setMessages([...messages, { role: 'user', content: inputMessage }, { role: 'assistant', content: response.data.response }]);
        setInputMessage('');
    };

    const resetConversation = async () => {
        await resetChat();
        setMessages([]);
    };

    const scrollToBottom = () => {
        messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const createMarkup = (content) => {
        const rawMarkup = marked(content);
        const cleanMarkup = DOMPurify.sanitize(rawMarkup);
        return { __html: cleanMarkup };
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="chat-modal-title"
            aria-describedby="chat-modal-description"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Paper 
                elevation={3} 
                className="chat-container" 
                style={{ 
                    width: '100%', 
                    maxWidth: '1200px', 
                    height: '80%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    position: 'relative', 
                    outline: 'none' 
                }}
            >
                <Box 
                    className="chat-header" 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 20px', 
                        borderBottom: '1px solid #ddd' 
                    }}
                >
                    <Typography variant="h5" component="div">
                        Ticker Chat with Y-Analysis
                    </Typography>
                    <button 
                        aria-label="close" 
                        onClick={() => setOpen(false)} 
                        style={{ 
                          background:'red',
                          color: 'white',
                          borderRadius:'100%',
                          border: 'none',
                          padding: '5px',
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontWeight: 'bolder'

                        }}
                    >
                      <span>X</span>
                    </button>
                </Box>
                <Box 
                    className="messages-container" 
                    style={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        padding: '10px' 
                    }} 
                    ref={messagesContainerRef}
                >
                    {messages.map((msg, index) => (
                        <Box key={index} className={`message ${msg.role}`} p={2} mb={1} borderRadius={1}>
                            <Typography variant="body1" component="div">
                                <strong>{msg.role === 'assistant' ? 'Y-Analysis' : msg.role}:</strong>
                                <div dangerouslySetInnerHTML={createMarkup(msg.content)} />
                            </Typography>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
                <Box className="input-container" mt={2} display="flex" p={2}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="input-field"
                    />
                    <Box>
                        <Button variant="contained" color="primary" onClick={sendMessage} className="send-button" sx={{ ml: 1 }}>
                            Send
                        </Button>
                        <Button variant="contained" color="secondary" onClick={resetConversation} className="reset-button" sx={{ ml: 1 }}>
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
}

export default ChatComponent;