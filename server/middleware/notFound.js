export function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.originalUrl
    });
}
