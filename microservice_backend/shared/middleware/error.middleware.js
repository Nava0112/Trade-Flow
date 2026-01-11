export const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Default to 500 if not specified
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : message
    });
};
