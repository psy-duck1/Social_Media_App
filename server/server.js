import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';

import http from 'http';
import { Server } from 'socket.io';


dotenv.config();

const port = process.env.PORT || 8000; 
const app = express();
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type'],
  }
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for messages from the client
  socket.on('sendMessage', async (messageData) => {
    try {
      // Save message to the database (assuming Message model exists)
      // const newMessage = new Message({
      //   from: messageData.from,
      //   to: messageData.to,
      //   text: messageData.text,
      // });
      // const savedMessage = await new Message.save();

      // Emit the saved message to the sender and receiver
      io.to(messageData.to).emit('message', messageData); // Emit to receiver
      io.to(messageData.from).emit('message', messageData); // Emit to sender
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE, {
  
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.log(err);
  });

// Middleware to parse JSON requests
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// Autoload routes
const __dirname = path.resolve();
readdirSync('./routes').forEach(async (file) => {
  const route = await import(`./routes/${file}`);
  app.use('/api', route.default);
});
