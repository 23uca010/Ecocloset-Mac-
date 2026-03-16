import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, User as UserIcon, MessageSquare, Clock } from 'lucide-react';

const Messages = () => {
  const { user, api } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Check if we arrived with an intent to message someone specific
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user_id');
    if (userId) {
      setActiveChatId(parseInt(userId, 10));
    }
  }, [location.search]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
      // Mark as read
      api.put(`/messages/read/${activeChatId}`);
      
      const interval = setInterval(() => fetchMessages(activeChatId), 5000); // refresh every 5s
      return () => clearInterval(interval);
    }
  }, [activeChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/history/${userId}`);
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    try {
      const response = await api.post('/messages/send', {
        receiverId: activeChatId,
        content: newMessage
      });
      
      if (response.data && response.data.success) {
        setMessages([...messages, response.data.data.message]);
        setNewMessage('');
        fetchConversations(); // update last message snippet
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeConversation = conversations.find(c => c.other_user_id === activeChatId);
  const chatPartnerName = activeConversation?.other_user_name || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex h-[80vh] overflow-hidden">
        
        {/* Left Pane - Conversations List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
              Messages
            </h2>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p>No conversations yet.</p>
                <p className="text-sm mt-1">Message sellers from their item listings to start a chat!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.other_user_id}
                  onClick={() => setActiveChatId(conv.other_user_id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                    activeChatId === conv.other_user_id 
                      ? 'bg-indigo-50 border-indigo-100' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shrink-0">
                      {conv.other_user_avatar ? (
                        <img src={conv.other_user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.other_user_name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conv.last_message_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${!conv.is_read && conv.sender_id !== user.id ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        {conv.last_message}
                      </p>
                    </div>
                    {!conv.is_read && conv.sender_id !== user.id && (
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Active Chat View */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChatId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center shadow-sm z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{chatPartnerName}</h3>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                    <p>Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white text-gray-900 border border-gray-100 shadow-sm rounded-tl-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          <div className={`text-[10px] mt-1 text-right flex items-center justify-end ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            <Clock className="w-3 h-3 mr-1 inline" />
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-11 h-11"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600 mb-1">Your Inbox</p>
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
