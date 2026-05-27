import express from 'express';
import jwt from 'jsonwebtoken';
import sequelize from './database.js'; 
import Pelicula from './pelicula.js';  
 
const app = express();
app.use(express.json());

const LLAVE_JWT = 'super_secret_avengers_jwt';

// Middleware de Logs para ver qué peticiones entran en la terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
  next();
});

// Middleware para proteger únicamente las acciones de escritura (POST, PUT, DELETE)
const validarTokenJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token JWT no provisto.' });
  }

  try {
    const verificado = jwt.verify(token, LLAVE_JWT);
    req.user = verificado;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// Conexión e inicio automático con la Base de Datos de Render
try {
  await sequelize.authenticate();
  console.log('¡Conexión con PostgreSQL en Render establecida correctamente!');
  await sequelize.sync(); // Esto crea la tabla "Peliculas" en la nube si aún no existe
} catch (error) {
  console.error('Error al inicializar la base de datos:', error);
}

// --- RUTA DE LOGIN (Pública) ---
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

// --- RUTAS DE VISUALIZACIÓN (¡Públicas, funcionan directo en el navegador!) ---

// Ver todas las películas
app.get('/peliculas', async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ver una sola película por su ID
app.get('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    pelicula ? res.json(pelicula) : res.status(404).json({ error: 'Película no encontrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RUTAS DE EDICIÓN (Privadas, requieren Token JWT en Postman) ---

// Agregar una película
app.post('/peliculas', validarTokenJWT, async (req, res) => {
  try {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json(nuevaPelicula);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Modificar una película
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

// Encender el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});