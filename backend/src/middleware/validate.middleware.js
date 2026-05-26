/**
 * Runs a Joi schema against req[property] (body, query, or params).
 * Replaces the request slice with the validated value on success.
 */
export const validate =
  (schema, property = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message,
      });
    }

    req[property] = value;
    next();
  };
