import { ZodError } from 'zod';

/**
 * Middleware genérico para validar requisições com Zod schemas.
 * Exemplo de uso: router.post('/login', validate(loginSchema), handler)
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Dados de entrada inválidos',
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
