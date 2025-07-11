const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const db = require('../config/db');

router.post('/', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    try {
        const newArticle = { title, content, author_id: req.user.id };
        const [result] = await db.query('INSERT INTO kb_articles SET ?', newArticle);
        res.status(201).json({ id: result.insertId, ...newArticle });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let sql = 'SELECT id, title, LEFT(content, 150) as snippet, created_at, updated_at FROM kb_articles';
        const params = [];

        if (searchTerm) {
            sql += ' WHERE title LIKE ? OR content LIKE ?';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        sql += ' ORDER BY updated_at DESC';

        const [articles] = await db.query(sql, params);
        res.json(articles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const [articles] = await db.query('SELECT * FROM kb_articles WHERE id = ?', [req.params.id]);
        if (articles.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(articles[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
    const { title, content } = req.body;
     if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    try {
        const updatedArticle = { title, content };
        const [result] = await db.query('UPDATE kb_articles SET ? WHERE id = ?', [updatedArticle, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', [auth, checkRole(['staff', 'admin'])], async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM kb_articles WHERE id = ?', [req.params.id]);
         if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;