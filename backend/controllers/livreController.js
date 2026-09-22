const livreService = require("../model/livreService");


//Récupérer les livres avec recherche et pagination.

const getLivres = async (req, res, next) => {
    try {
        const search = req.query.search || "";

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(req.query.limit) || 10,
                1
            ),
            100
        );

        const result = await livreService.getAllLivres(
            search,
            page,
            limit
        );

        res.status(200).json({
            success: true,
            data: result.livres,
            pagination: result.pagination
        });

    } catch (error) {
        next(error);
    }
};




// Récupérer un livre par son ID
const getLivre = async (req, res, next) => {
    try {
        const { id } = req.params;

        const livre = await livreService.getLivreById(id);

        if (!livre) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.status(200).json({
            success: true,
            data: livre
        });
    } catch (error) {
        next(error);
    }
};


// Créer un livre
const createLivre = async (req, res, next) => {
    try {
        const {
            titre,
            auteur_id,
            annee_publication
        } = req.body;

        const livre = await livreService.createLivre(
            titre,
            auteur_id,
            annee_publication
        );

        res.status(201).json({
            success: true,
            message: "Livre créé avec succès.",
            data: livre
        });
    } catch (error) {
        next(error);
    }
};


// Modifier un livre
const updateLivre = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            titre,
            auteur_id,
            annee_publication
        } = req.body;

        const livre = await livreService.updateLivre(
            id,
            titre,
            auteur_id,
            annee_publication
        );

        if (!livre) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Livre modifié avec succès.",
            data: livre
        });
    } catch (error) {
        next(error);
    }
};


// Supprimer un livre

const deleteLivre = async (req, res, next) => {
    try {
        const { id } = req.params;

        const livre = await livreService.deleteLivre(id);

        if (!livre) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Livre supprimé avec succès."
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getLivres,
    getLivre,
    createLivre,
    updateLivre,
    deleteLivre
};

