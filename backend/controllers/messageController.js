const db = require('../database/sqlite');

// Send a new message
const sendMessage = (req, res) => {
  try {
    const senderId = req.userId; // Assuming isAdmin/auth middleware sets this
    const { receiverId, itemId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Receiver ID and content are required' });
    }

    const info = db.prepare(`
      INSERT INTO messages (sender_id, receiver_id, item_id, content) 
      VALUES (?, ?, ?, ?)
    `).run(senderId, receiverId, itemId || null, content);

    const newMessage = db.prepare(`
      SELECT m.*, u.name as sender_name, u.avatar as sender_avatar 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: { message: newMessage } });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// Get all conversations list for the current user (inbox view)
const getConversations = (req, res) => {
  try {
    const userId = req.userId;

    // A fairly complex query to get distinct conversations and the latest message
    const conversations = db.prepare(`
      SELECT 
          CASE 
              WHEN m.sender_id = ? THEN m.receiver_id 
              ELSE m.sender_id 
          END as other_user_id,
          u.name as other_user_name,
          u.avatar as other_user_avatar,
          m.content as last_message,
          m.created_at as last_message_date,
          m.is_read,
          m.sender_id
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
      WHERE m.id IN (
          SELECT MAX(id)
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
          GROUP BY 
              CASE 
                  WHEN sender_id = ? THEN receiver_id 
                  ELSE sender_id 
              END
      )
      ORDER BY m.created_at DESC
    `).all(userId, userId, userId, userId, userId);

    res.status(200).json({ success: true, data: { conversations } });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching conversations' });
  }
};

// Get specific message history with a user
const getConversationHistory = (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `).all(userId, otherUserId, otherUserId, userId);

    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
};

// Mark messages from a specific user as read
const markAsRead = (req, res) => {
  try {
    const userId = req.userId;
    const senderId = req.params.senderId;

    db.prepare(`
      UPDATE messages 
      SET is_read = 1 
      WHERE receiver_id = ? AND sender_id = ? AND is_read = 0
    `).run(userId, senderId);

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, message: 'Server error marking messages as read' });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getConversationHistory,
  markAsRead
};
