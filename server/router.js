const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Servidor está rodando');
})

module.exports = router;