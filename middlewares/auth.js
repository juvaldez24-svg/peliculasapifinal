const jwt = require('jsonwebtoken');

const LLAVE_API_KEY = 'avengers_secret_key';
const LLAVE_JWT = 'super_secret_avengers_jwt';

const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== LLAVE_API_KEY) {
    return res.status(403).json({ error: 'Acceso prohibido: API Key inválida o no provista.' });
  }
  next();
};

const validarTokenJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no provisto.' });
  }

  try {
    const verificado = jwt.verify(token, LLAVE_JWT);
    req.user = verificado;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

export { validarTokenJWT };
//module.exports = { validarApiKey, validarTokenJWT };
