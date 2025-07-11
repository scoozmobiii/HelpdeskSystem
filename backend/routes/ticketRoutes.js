const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const db = require('../config/db');

router.get('/my', auth, async (req, res) => {
  try {
    const [tickets] = await db.query('SELECT * FROM tickets WHERE creator_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
  try {
    const sql = `
      SELECT t.*, u.name as creator_name 
      FROM tickets t
      JOIN users u ON t.creator_id = u.id
      ORDER BY t.created_at DESC
    `;
    const [tickets] = await db.query(sql);
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const user = req.user;

    const ticketSql = `
      SELECT t.*, u.name as creator_name, a.name as assignee_name
      FROM tickets t
      JOIN users u ON t.creator_id = u.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE t.id = ?
    `;
    const [tickets] = await db.query(ticketSql, [ticketId]);

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const ticket = tickets[0];

    // ตรวจสอบสิทธิ์: อนุญาตถ้าเป็น staff/admin หรือเป็นเจ้าของ ticket
    if (user.role !== 'staff' && user.role !== 'admin' && String(ticket.creator_id) !== String(user.id)) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to view this ticket' });
    }

    const commentsSql = `
      SELECT c.*, u.name as author_name, u.role as author_role
      FROM ticket_comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
    `;
    const [comments] = await db.query(commentsSql, [ticketId]);

    res.json({ ...ticket, comments });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, priority } = req.body;
  const creator_id = req.user.id;

  if (!title || !description || !priority) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newTicket = { title, description, priority, creator_id, category_id: 1 }; // Default category to 1
    const [result] = await db.query('INSERT INTO tickets SET ?', newTicket);
    res.status(201).json({ id: result.insertId, ...newTicket });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id/assign', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
  const { assigneeId } = req.body;
  const ticketId = req.params.id;

  if (!assigneeId) {
    return res.status(400).json({ message: 'Assignee ID is required' });
  }

  try {
    const fieldsToUpdate = {
      assignee_id: assigneeId,
      status: 'Assigned' 
    };
    const [result] = await db.query('UPDATE tickets SET ? WHERE id = ?', [fieldsToUpdate, ticketId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json({ message: 'Ticket assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/resolve', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
    const ticketId = req.params.id;
    try {
        const [result] = await db.query("UPDATE tickets SET status = 'Resolved' WHERE id = ?", [ticketId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket has been marked as Resolved.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/:id/close', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
    const ticketId = req.params.id;
    try {
        const [result] = await db.query("UPDATE tickets SET status = 'Closed' WHERE id = ?", [ticketId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket has been closed.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/:id/comments', auth, async (req, res) => {
  const { comment_text } = req.body;
  const ticketId = req.params.id;
  const user = req.user;

  if (!comment_text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    // ดึงข้อมูล Ticket เพื่อตรวจสอบเจ้าของ
    const [tickets] = await db.query('SELECT creator_id FROM tickets WHERE id = ?', [ticketId]);
    if (tickets.length === 0) {
        return res.status(404).json({ message: 'Ticket not found' });
    }
    const ticket = tickets[0];

    // ตรวจสอบสิทธิ์: อนุญาตถ้าเป็น staff/admin หรือเป็นเจ้าของ ticket
    if (user.role !== 'staff' && user.role !== 'admin' && String(ticket.creator_id) !== String(user.id)) {
        return res.status(403).json({ message: 'Forbidden: You cannot comment on this ticket' });
    }

    const newComment = { ticket_id: ticketId, author_id: user.id, comment_text };
    const [result] = await db.query('INSERT INTO ticket_comments SET ?', newComment);

    res.status(201).json({ id: result.insertId, ...newComment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;