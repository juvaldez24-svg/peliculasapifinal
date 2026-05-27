import express from 'express';
import sequelize from './database.js';
import Pelicula from './model/pelicula.js'; 
import { validarTokenJWT } from './middlewares/auth.js'; 

const app = express();
app.use(express.json());

try {
  await sequelize.authenticate();
  console.log('Conexión con PostgreSQL establecida correctamente.');
  await sequelize.sync(); 
} catch (error) {
  console.error('Error al inicializar la base de datos:', error);
}

// --- CONTROLES DE ACCESO CON JWT ---
// Aplicamos el candado del Token de forma global a partir de aquí
app.use('/peliculas', validarTokenJWT);

// --- CRUD BÁSICO DE PELÍCULAS ---
app.get('/peliculas', async (req, res) => {
  const peliculas = await Pelicula.findAll();
  res.json(peliculas);
});

app.get('/peliculas/:id', async (req, res) => {
  const pelicula = await Pelicula.findByPk(req.params.id);
  pelicula ? res.json(pelicula) : res.status(404).json({ error: 'Película no encontrada' });
});

app.post('/peliculas', async (req, res) => {
  try {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json(nuevaPelicula);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/peliculas/:id', async (req, res) => {
  const pelicula = await Pelicula.findByPk(req.params.id);
  if (pelicula) {
    await pelicula.update(req.body);
    res.json(pelicula);
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

app.delete('/peliculas/:id', async (req, res) => {
  const borrado = await Pelicula.destroy({ where: { id: req.params.id } });
  res.json({ eliminado: !!borrado });
});

// --- ENRUTAMIENTO BASE ---
app.get('/', (req, res) => {
  res.send('API de Avengers funcionando...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API lista en el puerto ${PORT}`));
