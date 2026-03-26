const db = require('../database/sqlite');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard/user/:userId  (protected — isAuth sets req.userId)
// ─────────────────────────────────────────────────────────────────────────────
const getUserDashboardData = (req, res) => {
    // ONLY use the userId from isAuth middleware — never trust req.params alone
    // isAuth parses the Bearer token and sets req.userId as a string e.g. "3"
    const rawId = req.userId;  // always set by isAuth before this handler runs

    console.log('[Dashboard] Request received. req.userId =', rawId);

    // Validate — must be a truthy, numeric value
    if (!rawId || isNaN(Number(rawId))) {
        console.error('[Dashboard] Invalid or missing userId:', rawId);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: valid user ID not found in token.'
        });
    }

    // Normalise to Number so SQLite INTEGER comparisons are reliable
    const userId = Number(rawId);
    console.log('[Dashboard] Querying for userId:', userId);

    // ── Self-healing migration ───────────────────────────────────────────────
    try {
        db.prepare('SELECT eco_score, xp, level, streak, next_level_xp FROM users LIMIT 1').get();
    } catch (e) {
        if (e.message.includes('no such column')) {
            console.log('[Dashboard] Migration: adding gamification columns...');
            [
                { name: 'eco_score',     type: 'INTEGER DEFAULT 0'   },
                { name: 'xp',           type: 'INTEGER DEFAULT 0'   },
                { name: 'level',        type: 'INTEGER DEFAULT 1'   },
                { name: 'streak',       type: 'INTEGER DEFAULT 0'   },
                { name: 'next_level_xp', type: 'INTEGER DEFAULT 100' }
            ].forEach(col => {
                try {
                    db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                } catch (err) {
                    if (!err.message.includes('duplicate column name')) {
                        console.error(`[Dashboard] Migration error (${col.name}):`, err.message);
                    }
                }
            });
        }
    }

    // ── Main data fetch ──────────────────────────────────────────────────────
    try {
        // 1. User profile
        console.log('[Dashboard] Fetching user profile...');
        const user = db.prepare(
            'SELECT name, email, eco_score, xp, level, streak, next_level_xp FROM users WHERE id = ?'
        ).get(userId);

        if (!user) {
            console.warn('[Dashboard] User not found for id:', userId);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        console.log('[Dashboard] User found:', user.name || '(no name)');

        // 2. Items count
        const totalItems = db.prepare(
            'SELECT COUNT(*) as count FROM items WHERE user_id = ?'
        ).get(userId)?.count ?? 0;
        console.log('[Dashboard] totalItems:', totalItems);

        // 3. Swap counts
        const activeSwaps = db.prepare(
            "SELECT COUNT(*) as count FROM swaps WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'pending'"
        ).get(userId, userId)?.count ?? 0;

        const completedSwaps = db.prepare(
            "SELECT COUNT(*) as count FROM swaps WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'completed'"
        ).get(userId, userId)?.count ?? 0;
        console.log('[Dashboard] swaps — active:', activeSwaps, 'completed:', completedSwaps);

        // 4. Donations count — matched by email since the donations table has no user_id
        let donations = 0;
        try {
            const emailRow = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
            if (emailRow?.email) {
                donations = db.prepare(
                    'SELECT COUNT(*) as count FROM donations WHERE email = ?'
                ).get(emailRow.email)?.count ?? 0;
            }
        } catch (donErr) {
            console.warn('[Dashboard] Could not count donations (schema mismatch?):', donErr.message);
        }
        console.log('[Dashboard] donations:', donations);

        // 5. Recent items (last 5)
        const recentItems = db.prepare(
            'SELECT id, title, price, listingType, status, image, created_at FROM items WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
        ).all(userId) || [];
        console.log('[Dashboard] recentItems count:', recentItems.length);

        // 6. Recent swaps — LEFT JOIN so NULL item_a_id rows are kept
        let recentSwaps = [];
        try {
            recentSwaps = db.prepare(`
                SELECT s.id, s.status, s.created_at,
                       i_a.title AS item_a_title,
                       i_b.title AS item_b_title
                FROM swaps s
                LEFT JOIN items i_a ON s.item_a_id = i_a.id
                LEFT JOIN items i_b ON s.item_b_id = i_b.id
                WHERE s.user_a_id = ? OR s.user_b_id = ?
                ORDER BY s.created_at DESC
                LIMIT 5
            `).all(userId, userId) || [];
        } catch (swapErr) {
            console.warn('[Dashboard] Could not fetch recent swaps:', swapErr.message);
        }
        console.log('[Dashboard] recentSwaps count:', recentSwaps.length);

        // 7. Achievements & badges
        let achievements = [];
        let badges = [];
        try {
            const rewards = db.prepare(`
                SELECT d.id, d.name, d.description, d.icon, d.type, d.color, ur.earned_at
                FROM user_rewards ur
                JOIN definitions d ON ur.definition_id = d.id
                WHERE ur.user_id = ?
            `).all(userId) || [];
            achievements = rewards.filter(r => r.type === 'achievement');
            badges       = rewards.filter(r => r.type === 'badge');
        } catch (rewardErr) {
            console.warn('[Dashboard] Could not fetch rewards:', rewardErr.message);
        }

        console.log('[Dashboard] Sending success response for userId:', userId);
        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: userId,
                    name: user.name || '',
                    email: user.email || '',
                    firstName: (user.name || '').split(' ')[0] || 'User',
                    eco_score:     user.eco_score     || 0,
                    xp:            user.xp            || 0,
                    level:         user.level         || 1,
                    streak:        user.streak        || 0,
                    next_level_xp: user.next_level_xp || 100
                },
                stats: {
                    totalItems:      totalItems,
                    activeSwaps:     activeSwaps,
                    completedSwaps:  completedSwaps,
                    donations:       donations,
                    ecoScore:        user.eco_score || 0
                },
                recentItems,
                recentSwaps,
                achievements,
                badges
            }
        });

    } catch (error) {
        console.error('[Dashboard] FATAL error for userId', userId, '—', error.message);
        console.error(error.stack);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data.',
            detail: error.message
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard  — public site-wide stats
// ─────────────────────────────────────────────────────────────────────────────
const getGeneralStats = (req, res) => {
    console.log('[Dashboard] General stats API called');
    try {
        const itemsCount    = db.prepare('SELECT COUNT(*) as c FROM items').get()?.c    ?? 0;
        const usersCount    = db.prepare('SELECT COUNT(*) as c FROM users').get()?.c    ?? 0;
        const swapsCount    = db.prepare('SELECT COUNT(*) as c FROM swaps').get()?.c    ?? 0;
        const donationsCount= db.prepare('SELECT COUNT(*) as c FROM donations').get()?.c ?? 0;
        const activeCount   = db.prepare("SELECT COUNT(*) as c FROM items WHERE status = 'active'").get()?.c ?? 0;

        console.log('[Dashboard] General stats — items:', itemsCount, 'users:', usersCount);
        return res.json({
            success: true,
            itemsCount,
            usersCount,
            swapsCount,
            donationsCount,
            activeItemsCount: activeCount
        });
    } catch (error) {
        console.error('[Dashboard] DASHBOARD ERROR:', error);
        return res.status(500).json({
            success: false,
            message: 'Dashboard failed',
            error: error.message
        });
    }
};

module.exports = { getUserDashboardData, getGeneralStats };
