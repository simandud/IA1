import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { FaPaperPlane, FaSearch } from 'react-icons/fa';
import { getInitials, formatRelativeTime } from '../utils/helpers';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  // Mock conversations
  const conversations = [
    {
      id: 1,
      participants: [{ name: 'John Doe', avatar: null }],
      lastMessage: { content: 'Hey, how are you?', createdAt: new Date() },
    },
    {
      id: 2,
      participants: [{ name: 'Jane Smith', avatar: null }],
      lastMessage: { content: 'Meeting at 3 PM', createdAt: new Date() },
    },
  ];

  // Mock messages
  const messages = [
    { id: 1, sender: { name: 'John Doe' }, content: 'Hey, how are you?', createdAt: new Date() },
    { id: 2, sender: { name: 'Me' }, content: 'I am good, thanks!', createdAt: new Date() },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-12rem)] flex card overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 py-2"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 ${
                  selectedConversation === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {getInitials(conv.participants[0].name)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conv.participants[0].name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage.content}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(conv.lastMessage.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500">Active now</p>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender.name === 'Me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender.name === 'Me'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender.name === 'Me' ? 'text-primary-100' : 'text-gray-500'}`}>
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <button type="submit" className="btn btn-primary">
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
