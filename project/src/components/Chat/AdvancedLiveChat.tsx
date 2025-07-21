import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Phone, Video, Paperclip, Smile, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'seller';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string;
  senderAvatar?: string;
}

interface ChatRoom {
  id: string;
  type: 'support' | 'seller';
  title: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export function AdvancedLiveChat() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: 'support',
      type: 'support',
      title: 'Поддержка',
      participants: ['support'],
      unreadCount: 0
    },
    {
      id: 'seller-1',
      type: 'seller',
      title: 'TechStore',
      participants: ['seller-1'],
      unreadCount: 2
    }
  ]);

  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({
    'support': [
      {
        id: '1',
        text: 'Здравствуйте! Как дела? Чем могу помочь?',
        sender: 'support',
        timestamp: new Date(),
        senderName: 'Анна (Поддержка)',
        senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'read'
      }
    ],
    'seller-1': [
      {
        id: '2',
        text: 'Добро пожаловать в наш магазин! Есть вопросы по товарам?',
        sender: 'seller',
        timestamp: new Date(),
        senderName: 'TechStore',
        senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'delivered'
      },
      {
        id: '3',
        text: 'У нас сейчас скидки на наушники!',
        sender: 'seller',
        timestamp: new Date(),
        senderName: 'TechStore',
        senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'delivered'
      }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: state.user?.name || 'Вы',
      senderAvatar: state.user?.avatar,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), message]
    }));
    setNewMessage('');
    
    // Simulate response
    setIsTyping(true);
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: chatRooms.find(room => room.id === activeRoom)?.type === 'support' ? 'support' : 'seller',
        timestamp: new Date(),
        senderName: chatRooms.find(room => room.id === activeRoom)?.title,
        senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'delivered'
      };
      
      setMessages(prev => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), responseMessage]
      }));
      setIsTyping(false);
    }, 2000);
  };

  const getAutoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('заказ') || lowerMessage.includes('доставка')) {
      return 'Проверьте статус заказа в личном кабинете. Если нужна помощь, предоставьте номер заказа.';
    }
    if (lowerMessage.includes('возврат') || lowerMessage.includes('обмен')) {
      return 'Возврат возможен в течение 14 дней. Нужна ли помощь с оформлением возврата?';
    }
    if (lowerMessage.includes('скидка') || lowerMessage.includes('промокод')) {
      return 'Актуальные промокоды можно найти в разделе "Акции". Подпишитесь на рассылку для получения эксклюзивных предложений!';
    }
    
    return 'Спасибо за сообщение! Наш специалист ответит вам в ближайшее время.';
  };

  const quickReplies = [
    'Статус заказа',
    'Возврат товара', 
    'Способы оплаты',
    'Сроки доставки',
    'Гарантия',
    'Скидки и акции'
  ];

  const totalUnread = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-500 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">
              {activeRoom ? chatRooms.find(room => room.id === activeRoom)?.title : 'Чаты'}
            </h3>
            <p className="text-xs opacity-90">
              {isTyping ? 'Печатает...' : 'Онлайн'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {activeRoom && (
            <>
              <button className="p-1 hover:bg-orange-600 rounded transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-1 hover:bg-orange-600 rounded transition-colors">
                <Video className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!activeRoom ? (
            /* Chat Rooms List */
            <div className="p-4 h-[500px] overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-4">Ваши чаты</h4>
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      {room.type === 'support' ? (
                        <MessageCircle className="h-5 w-5 text-orange-600" />
                      ) : (
                        <User className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{room.title}</h5>
                        {room.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {room.lastMessage?.text || 'Начать чат'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <div className="p-2 border-b border-gray-100">
                <button
                  onClick={() => setActiveRoom(null)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  ← Назад к чатам
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 h-80 overflow-y-auto">
                <div className="space-y-4">
                  {(messages[activeRoom] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.sender !== 'user' && (
                          <div className="text-xs opacity-75 mb-1">{message.senderName}</div>
                        )}
                        {message.text}
                        <div className={`text-xs mt-1 flex items-center justify-between ${
                          message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {message.sender === 'user' && (
                            <span className="ml-2">
                              {message.status === 'sent' && '✓'}
                              {message.status === 'delivered' && '✓✓'}
                              {message.status === 'read' && '✓✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {quickReplies.slice(0, 3).map((reply) => (
                    <button
                      key={reply}
                      onClick={() => setNewMessage(reply)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}