const auteurService = require("../model/auteursService");

// GET ( /api/ auteurs)
const getAuteurs = async (req, res, next) => {
    try{
        const auteurs = await auteurService.getAllAuteurs();

        res.status(200).json({
            success: true,
            data: auteurs
        });
    } catch (error){
        next(error);
    }
};

// GET ( /api/auteurs/:id )
const getAuteur = async (req, res, next) => {
    try {
        const auteur = await auteurService.getAuteurById(
            req.params.id
        );

        if (!auteur) {
            return res.status(404).json({
                success: false,
                message: "Auteur introuvable."
            });
        }

        res.status(200).json({
            success: true,
            data: auteur
        });
    } catch (error) {
        next(error);
    }
};

// POST ( /api/auteurs )
const createAuteur = async (req, res, next) => {
    try {
        const { nom, nationalite } = req.body;

        const auteur = await auteurService.createAuteur(
            nom,
            nationalite
        );

        res.status(201).json({
            success: true,
            message: "Auteur créé avec succès.",
            data: auteur
        });
    } catch (error) {
        next(error);
    }
};

// PUT ( /api/auteurs/:id )
const updateAuteur = async (req, res, next) => {
    try {
        const { nom, nationalite } = req.body;

        const auteur = await auteurService.updateAuteur(
            req.params.id,
            nom,
            nationalite
        );

        if (!auteur) {
            return res.status(404).json({
                success: false,
                message: "Auteur introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Auteur modifié avec succès.",
            data: auteur
        });
    } catch (error) {
        next(error);
    }
};

// DELETE ( /api/auteurs/:id )
const deleteAuteur = async (req, res, next) => {
    try {
        const auteur = await auteurService.deleteAuteur(
            req.params.id
        );

        if (!auteur) {
            return res.status(404).json({
                success: false,
                message: "Auteur introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Auteur supprimé avec succès."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuteurs,
    getAuteur,
    createAuteur,
    updateAuteur,
    deleteAuteur
};