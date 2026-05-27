const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const LLAVE_JWT = 'super_secret_avengers_jwt';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'shield' && password === 'avengers2026') {
    const token = jwt.sign(
      { user: username, role: 'ADMIN' },
      LLAVE_JWT,
      { expiresIn: '2h' }
    );
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciales inválidas.' });
});

module.exports = router;