const db = require('../database/sqlite');

// Ensure donations table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngoName TEXT NOT NULL,
    donationType TEXT NOT NULL DEFAULT 'clothing',
    clothesDescription TEXT,
    phoneNumber TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now'))
  )
`).run();

// POST /api/donations
const createDonation = (req, res) => {
  try {
    const { ngoName, donationType, clothesDescription, phoneNumber, name, email, message } = req.body;
    if (!ngoName || !phoneNumber || !name || !email) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and NGO are required.' });
    }
    const info = db.prepare(`
      INSERT INTO donations (ngoName, donationType, clothesDescription, phoneNumber, name, email, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      ngoName,
      donationType || 'clothing',
      clothesDescription || '',
      phoneNumber,
      name,
      email,
      message || ''
    );
    res.status(201).json({ success: true, message: 'Donation request submitted successfully.', data: { id: info.lastInsertRowid } });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting donation.' });
  }
};

// GET /api/admin/donations
const getAllDonations = (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM donations';
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY createdAt DESC';
    const donations = db.prepare(query).all(...params);
    res.status(200).json({ success: true, data: { donations } });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching donations.' });
  }
};

// PATCH /api/admin/donations/:id
const updateDonationStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'approved', 'collected', 'rejected'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const existing = db.prepare('SELECT id FROM donations WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Donation not found.' });
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, id);
    res.status(200).json({ success: true, message: 'Donation status updated.' });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};

// DELETE /api/admin/donations/:id
const deleteDonation = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM donations WHERE id = ?').run(id);
    res.status(200).json({ success: true, message: 'Donation deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting donation.' });
  }
};

module.exports = { createDonation, getAllDonations, updateDonationStatus, deleteDonation };
