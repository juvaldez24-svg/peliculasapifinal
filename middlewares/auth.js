import jwt from 'jsonwebtoken';

const LLAVE_JWT = process.env.JWT_SECRET || 'super_secret_avengers_jwt';

export const validarTokenJWT = (req, res, next) => {
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