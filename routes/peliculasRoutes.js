const express = require('express');
const router = express.Router();
const peliculasService = require('../services/peliculasService');
const { validarTokenJWT, validarApiKey } = require('./middlewares/auth');

router.use(validarApiKey);
router.use(validarTokenJWT);

router.get('/', async (req, res) => {
  const peliculas = await peliculasService.obtenerTodas();
  res.json(peliculas);
});

router.get('/:id', async (req, res) => {
  const pelicula = await peliculasService.obtenerPorId(req.params.id);
  if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
  res.json(pelicula);
});

router.post('/', async (req, res) => {
  try {
    const nueva = await peliculasService.crear(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const actualizada = await peliculasService.actualizar(req.params.id, req.body);
  if (!actualizada) return res.status(404).json({ error: 'Película no encontrada' });
  res.json(actualizada);
});

router.delete('/:id', async (req, res) => {
  const eliminado = await peliculasService.eliminar(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Película no encontrada' });
  res.json({ message: 'Película eliminada correctamente.' });
});

module.exports = router;
