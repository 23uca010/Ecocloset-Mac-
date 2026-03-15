const db = require('../database/sqlite');

const getUserDashboardData = async (req, res) => {
    const { userId } = req.params;

    // Self-healing migration check
    try {
        db.prepare("SELECT eco_score, xp, level, streak, next_level_xp FROM users LIMIT 1").get();
    } catch (e) {
        if (e.message.includes("no such column")) {
            console.log("Migration: Adding missing columns to users table...");
            const cols = [
                { name: 'eco_score', type: 'INTEGER DEFAULT 0' },
                { name: 'xp', type: 'INTEGER DEFAULT 0' },
                { name: 'level', type: 'INTEGER DEFAULT 1' },
                { name: 'streak', type: 'INTEGER DEFAULT 0' },
                { name: 'next_level_xp', type: 'INTEGER DEFAULT 100' }
            ];
            cols.forEach(col => {
                try {
                    db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                } catch (err) {
                    if (!err.message.includes('duplicate column name')) {
                        console.error(`Migration error adding ${col.name}:`, err.message);
                    }
                }
            });
        }
    }

    try {
        // 1. Fetch User Profile
        const user = db.prepare("SELECT name, eco_score, xp, level, streak, next_level_xp FROM users WHERE id = ?").get(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Fetch Stats
        const itemsRow = db.prepare("SELECT COUNT(*) as count FROM items WHERE user_id = ?").get(userId);
        const totalItems = itemsRow ? itemsRow.count : 0;
        
        const activeSwapsRow = db.prepare("SELECT COUNT(*) as count FROM swaps WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'pending'").get(userId, userId);
        const activeSwaps = activeSwapsRow ? activeSwapsRow.count : 0;
        
        const completedSwapsRow = db.prepare("SELECT COUNT(*) as count FROM swaps WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'completed'").get(userId, userId);
        const completedSwaps = completedSwapsRow ? completedSwapsRow.count : 0;
        
        const donationsRow = db.prepare("SELECT SUM(items_count) as count FROM donations WHERE user_id = ?").get(userId);
        const donations = (donationsRow && donationsRow.count) ? donationsRow.count : 0;

        // 3. Recent Activity (Last 5 items, swaps, donations)
        const recentItems = db.prepare("SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC LIMIT 5").all(userId);
        
        const recentSwaps = db.prepare(`
            SELECT s.*, i_a.title as item_a_title, i_b.title as item_b_title
            FROM swaps s
            JOIN items i_a ON s.item_a_id = i_a.id
            JOIN items i_b ON s.item_b_id = i_b.id
            WHERE s.user_a_id = ? OR s.user_b_id = ?
            ORDER BY s.created_at DESC LIMIT 5
        `).all(userId, userId);

        // 4. Rewards (Achievements & Badges)
        const rewards = db.prepare(`
            SELECT d.*, ur.earned_at
            FROM user_rewards ur
            JOIN definitions d ON ur.definition_id = d.id
            WHERE ur.user_id = ?
        `).all(userId);

        const achievements = rewards.filter(r => r.type === 'achievement');
        const badges = rewards.filter(r => r.type === 'badge');

        res.json({
            success: true,
            data: {
                user: {
                    ...user,
                    firstName: (user.name || '').split(' ')[0]
                },
                stats: {
                    totalItems,
                    activeSwaps,
                    completedSwaps,
                    donations,
                    ecoScore: user.eco_score || 0
                },
                recentItems,
                recentSwaps,
                achievements,
                badges
            }
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ success: false, message: "Error fetching dashboard data", error: error.message });
    }
};

module.exports = {
    getUserDashboardData
};
