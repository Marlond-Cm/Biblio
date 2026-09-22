
const empruntService = require("../model/empruntService");



// Récupérer tous les emprunts

const getEmprunts = async (req, res, next) => {
    try {
        const emprunts = await empruntService.getAllEmprunts();

        res.status(200).json({
            success: true,
            data: emprunts
        });
    } catch (error) {
        next(error);
    }
};



// Récupérer un emprunt par son ID

const getEmprunt = async (req, res, next) => {
    try {
        const { id } = req.params;

        const emprunt = await empruntService.getEmpruntById(id);

        if (!emprunt) {
            return res.status(404).json({
                success: false,
                message: "Emprunt introuvable."
            });
        }

        res.status(200).json({
            success: true,
            data: emprunt
        });
    } catch (error) {
        next(error);
    }
};



// Créer un emprunt
const createEmprunt = async (req, res, next) => {
    try {
        const {
            adherent_id,
            livre_id,
            date_retour_prevue
        } = req.body;

        const emprunt = await empruntService.createEmprunt(
            adherent_id,
            livre_id,
            date_retour_prevue
        );

        res.status(201).json({
            success: true,
            message: "Emprunt enregistré avec succès.",
            data: emprunt
        });
    } catch (error) {
        next(error);
    }
};



// Retourner un livre

const returnEmprunt = async (req, res, next) => {
    try {
        const { id } = req.params;

        const emprunt = await empruntService.returnEmprunt(id);

        res.status(200).json({
            success: true,
            message: "Livre retourné avec succès.",
            data: emprunt
        });
    } catch (error) {
        next(error);
    }
};



// Récupérer les emprunts en cours.

const getCurrentEmprunts = async (req, res, next) => {
    try {
        const emprunts = await empruntService.getCurrentEmprunts();

        res.status(200).json({
            success: true,
            data: emprunts
        });
    } catch (error) {
        next(error);
    }
};



// Récupérer les emprunts en retard.

const getOverdueEmprunts = async (req, res, next) => {
    try {
        const emprunts = await empruntService.getOverdueEmprunts();

        res.status(200).json({
            success: true,
            data: emprunts
        });
    } catch (error) {
        next(error);
    }
};


// Récupérer l'historique d'un adhérent.

const getAdherentEmprunts = async (req, res, next) => {
    try {
        const { adherentId } = req.params;

        const emprunts = await empruntService.getAdherentEmprunts(
            adherentId
        );

        res.status(200).json({
            success: true,
            data: emprunts
        });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getEmprunts,
    getEmprunt,

    createEmprunt,
    returnEmprunt,

    getCurrentEmprunts,
    getOverdueEmprunts,
    getAdherentEmprunts
};
