const errorHandler = (error, req, res, next) => {
    console.error("Erreur :", error);

    // Erreur PostgreSQL : violation d'une contrainte
    if (error.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "Cette donnée existe déjà."
        });
    }

    // Erreur PostgreSQL : clé étrangère
    if (error.code === "23503") {
        return res.status(409).json({
            success: false,
            message: "Cette opération est impossible car cette donnée est utilisée ailleurs."
        });
    }

    // Erreur JSON mal formé
    if (error instanceof SyntaxError && error.status === 400 && error.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Le JSON envoyé est invalide."
        });
    }

    // Erreur générale
    return res.status(error.status || 500).json({
        success: false,
        message: "Une erreur interne est survenue."
    });
};

module.exports = errorHandler;
