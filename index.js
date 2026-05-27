import express from 'express';
import jwt from 'jsonwebtoken';
import sequelize from './database.js';
import Pelicula from './Pelicula.js'; 
import { validarTokenJWT } from './auth.js'; 

const app = express();
app.use(express.json());

const LLAVE_JWT = process.env.JWT_SECRET || 'super_secret_avengers_jwt';

// Middleware para ver logs de las peticiones en consola
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
  next();
});

// Conexión automática con la Base de Datos de Render
try {
  await sequelize.authenticate();
  console.log('Conexión con PostgreSQL establecida correctamente.');
  await sequelize.sync(); 
} catch (error) {
  console.error('Error al inicializar la base de datos:', error);
}

// --- RUTA DE AUTENTICACIÓN ---
app.post('/login', (req, res) => {
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

// --- RUTAS PÚBLICAS (¡Funcionan directo en el navegador!) ---

// Obtener todas las películas
app.get('/peliculas', async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una película por ID
app.get('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    pelicula ? res.json(pelicula) : res.status(404).json({ error: 'Película no encontrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- RUTAS PRIVADAS (Requieren Token JWT enviado desde Postman) ---

// Crear una película
app.post('/peliculas', validarTokenJWT, async (req, res) => {
  try {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json(nuevaPelicula);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una película
app.put('/peliculas/:id', validarTokenJWT, async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (pelicula) {
      await pelicula.update(req.body);
      res.json(pelicula);
    } else {
      res.status(404).json({ error: 'Película no encontrada' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una película
app.delete('/peliculas/:id', validarTokenJWT, async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (pelicula) {
      await pelicula.destroy();
      res.json({ mensaje: 'Película eliminada correctamente.' });
    } else {
      res.status(404).json({ error: 'Película no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicializar el servidor en el puerto provisto por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de películas corriendo con éxito en el puerto ${PORT}`);
});