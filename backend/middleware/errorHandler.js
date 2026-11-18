function errorHandler(err, req, res, next) {
  console.error(err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Eroare internă a serverului.'
  });
}

module.exports = errorHandler;
