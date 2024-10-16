# SOCIAL MEDIA WEBSITE

## Description

This project is a social media web application designed to enable users to interact with each other in real-time through chat functionality. It includes both frontend and backend components, offering a comprehensive user experience.

## Features

- Real-time chat functionality: Users can initiate real-time chats with other users they follow.
Chat interface supports real-time message sending and receiving.
- User authentication: Secure user login and registration using JSON Web Tokens (JWT).
- Follow/unfollow users
- Like/Unlike posts
- Image uploads via Cloudinary
- The chat interface is designed to be user-friendly and responsive.
Sidebar with a list of followed users allows easy chat initiation.

## Technologies Used

- Frontend: React, Next.js, Ant Design, Socket.io-client,bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/psy-duck1/Social_Media_App.git
cd your-repo
```
2. Setup Environment Variables:
 Create .env files in both the client and server directories with the following variables:
```bash
# In server/.env
DATABASE="your-mongodb-connection-string"
PORT=8001
JWT_SECRET="your-jwt-secret"
CLOUDINARY_NAME="your-cloudinary-name"
CLOUDINARY_KEY="your-cloudinary-key"
CLOUDINARY_SECRET="your-cloudinary-secret"
CLIENT_URL="http://localhost:3000"

# In client/.env.local
NEXT_PUBLIC_API=http://localhost:8001/api
NEXT_PUBLIC_SOCKETIO="http://localhost:8001"
```
3. Install Dependencies
```bash
# In the root directory
cd client
npm install

cd ../server
npm install
```
4.Run the Application: 
Start the backend server
```bash
cd server
npm start

```
Start the frontend development server:
```bash
cd ../client
npm run dev

```
5. Access the Application: Open your browser and navigate to http://localhost:3000/

### Usage
- Register and log in to the application.
- Update your profile with a profile picture.
- Follow other users to enable chat functionality.
- Initiate chats with followed users and enjoy real-time messaging.
- search users to connect with them and view their profile







