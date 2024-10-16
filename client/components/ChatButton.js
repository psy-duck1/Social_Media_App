import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import { UserContext } from '../context';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

const Button = dynamic(() => import('antd/lib/button'));
const Badge = dynamic(() => import('antd/lib/badge'));
const { MessageOutlined } = dynamic(() => import('@ant-design/icons'), { ssr: false });

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const ChatButton = ({ followingUsers, fetchFollowing }) => {
  const [state] = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
        setButtonVisible(true);
        setChatUser(null);
        setMessages([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (chatUser) {
      loadMessages(chatUser._id);
      socket.on('message', (message) => {
        if (message.from === chatUser._id || message.to === chatUser._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else if (message.to === state.user._id) {
          setUnreadMessages((prevUnreadMessages) => ({
            ...prevUnreadMessages,
            [message.from]: true,
          }));
        }
      });
    }
    return () => {
      socket.off('message');
    };
  }, [chatUser]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setButtonVisible(false);
  };

  const startChat = (user) => {
    fetchFollowing();
    setChatUser(user);
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [user._id]: false,
    }));
    loadMessages(user._id);
  };

  const closeChat = () => {
    setChatUser(null);
    setMessages([]);
  };

  const loadMessages = async (userId) => {
    try {
        const { data } = await axios.get(`/messages/${state.user._id}/${chatUser._id}`);
        setMessages(data);
        console.log(data);
      } catch (error) {
        console.error('Error loading messages:', error);
       
      }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatUser) return;

    const messageData = {
      from: state.user._id,
      to: chatUser._id,
      text: newMessage.trim(),
    };

    try {
      const { data } = await axios.post('/send-message', messageData);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage('');

      socket.emit('sendMessage', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className='d-flex justify-content-center mt-3 ' style={{marginLeft:"2rem"}}>
      {buttonVisible && (
        <button onClick={()=>{fetchFollowing()
       toggleSidebar();
        }}className="chat-button btn btn-primary">
           Chat
        </button>
      )}
      {sidebarOpen && (
        <div className="sidebar" stlye={{marginRight:"40px"}} ref={sidebarRef}>
          <div className={`sidebar-content ${chatUser ? 'slide-left' : ''}`}>
            <div className="following-list" >
              <h3 stlye={{marginRight:"40px"}}>Chat</h3>
              <ul>
                {followingUsers.map((user) => (
                  <li key={user._id}>
                    <span className="text-decoration-none"style={{marginRight:"40px"}} onClick={() => startChat(user)}>
                      {user.name}
                      {unreadMessages[user._id] && (
                        <Badge
                          count={<MessageOutlined />}
                          style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
                        />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {chatUser && (
              <div className="chat-window " style={{ zIndex: 2 ,
                marginRight:"30px"
              }}>
                <Button onClick={closeChat}>Back</Button>
                <h4 className='py-3'>{chatUser.name}</h4>
                <div className="list-group ">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`list-group-item ${
                        message.from._id === state.user._id ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <p className="mb-1">{message.from.name}</p>
                        <small>{moment(message.timestamp).fromNow()}</small>
                      </div>
                      <p className="mb-1">{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className="message-input mt-2">
                  <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                  />
                  <Button type="primary" className="mt-2" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 300px;
          height: 100%;
          background: white;
          border-left: 1px solid #ccc;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
   
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .sidebar-content {
          position: absolute;
          width: 600px; /* 2x the sidebar width to accommodate both views */
          display: flex;
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .following-list {
          width: 300px; /* Same as sidebar width */
          padding: 20px;
        }

        .chat-window {
          width: 300px; /* Same as sidebar width */
          padding: 20px;
        }

        .slide-left {
          transform: translateX(-300px);
        }

        .text-right {
          text-align: right;
          background-color: #dcf8c6; /* Light green for sent messages */
          border-radius: 10px;
          padding: 10px;
          margin: 5px 0;
        }

        .text-left {
          text-align: left;
          background-color: #ffffff; /* White for received messages */
          border-radius: 10px;
          padding: 10px;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default ChatButton;
