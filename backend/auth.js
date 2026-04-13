import jwt from 'jsonwebtoken';

export const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Em produção, use variável de ambiente

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }
    
    req.userId = decoded.id;
    next();
  });
};
