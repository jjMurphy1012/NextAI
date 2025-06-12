# Next AI

Next AI is a full-stack web application that lets users upload PDF documents, engage in AI-powered chat sessions about their contents via text or voice, and access a history of questions and answers. It employs LangChain for prompt orchestration, retrieval-augmented generation for context retrieval, and speech-to-text and text-to-speech components for an interactive experience.

## Features

1. PDF upload and vector store retrieval for context-aware AI responses  
2. AI chat interface built with LangChain and OpenAI GPT  
3. Speech recognition and synthesis using react-speech-recognition and speak-tts  
4. Voice-based interaction allowing users to speak questions and listen to answers  
5. Conversation history organized in a scrollable sidebar  
6. Responsive design implemented with Ant Design components  
7. Seamless frontend-backend integration

## Technology Stack

- **Frontend**  
  React.js  
  Ant Design  
  react-speech-recognition  
  speak-tts

- **Backend**  
  Node.js  
  Express.js  
  LangChain

- **AI**  
  OpenAI GPT model invoked via LangChain chains and prompts

- **File handling**  
  Multer for PDF uploads

- **State management**  
  React useState and Context API

## Key Dependencies

```json
{
  "name": "nextai",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "antd": "^5.8.4",
    "axios": "^1.5.0",
    "concurrently": "^8.2.1",
    "langchain": "^0.x.x",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-speech-recognition": "^3.10.0",
    "speak-tts": "^2.0.8",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "dev": "concurrently \"npm start\" \"npm run server\"",
    "server": "cd server && npm run start",
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}