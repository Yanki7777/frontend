import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ChatComponent.css'; // Import the CSS file
import marketBackground from '../utils/markets.png';

function ChatComponent({ yfInfo, portfolio }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const response = await axios.post('http://localhost:5000/api/chat', { portfolio: portfolio, yfInfo: yfInfo, message: inputMessage });
    setMessages([...messages, { role: 'user', content: inputMessage }, { role: 'assistant', content: response.data.response }]);
    setInputMessage('');
  };

  const resetConversation = async () => {
    await axios.post('http://localhost:5000/api/reset-chat');
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <Container maxWidth="sm" className="chat-container">
      <Paper elevation={3} className="messages-container">
        {messages.map((msg, index) => (
          <Box
            key={index} className={`message ${msg.role}`} p={2} mb={1} borderRadius={1}>
            <Typography variant="body1" component="div">
              <strong>{msg.role === 'assistant' ? 'Y-Analysis' : msg.role}:</strong>
              <div dangerouslySetInnerHTML={createMarkup(msg.content)} />
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Box className="input-container" mt={2} display="flex" >
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
    </Container>
  );
}

export default ChatComponent;