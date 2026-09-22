const adherentService = require("../model/adherentService");


// GET /api/adherents
const getAdherents = async (req, res, next) => {
    try {
        const adherents = await adherentService.getAllAdherents();

        res.status(200).json({
            success: true,
            data: adherents
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/adherents/:id
const getAdherent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const adherent = await adherentService.getAdherentById(id);

        if (!adherent) {
            return res.status(404).json({
                success: false,
                message: "Adhérent introuvable."
            });
        }

        res.status(200).json({
            success: true,
            data: adherent
        });
    } catch (error) {
        next(error);
    }
};


// POST /api/adherents

const createAdherent = async (req, res, next) => {
    try {
        const { nom, contact } = req.body;

        const adherent = await adherentService.createAdherent(
            nom,
            contact
        );

        res.status(201).json({
            success: true,
            message: "Adhérent créé avec succès.",
            data: adherent
        });
    } catch (error) {
        next(error);
    }
};


// PUT /api/adherents/:id

const updateAdherent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nom, contact } = req.body;

        const adherent = await adherentService.updateAdherent(
            id,
            nom,
            contact
        );

        if (!adherent) {
            return res.status(404).json({
                success: false,
                message: "Adhérent introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Adhérent modifié avec succès.",
            data: adherent
        });
    } catch (error) {
        next(error);
    }
};


// DELETE /api/adherents/:id

const deleteAdherent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const adherent = await adherentService.deleteAdherent(id);

        if (!adherent) {
            return res.status(404).json({
                success: false,
                message: "Adhérent introuvable."
            });
        }

        res.status(200).json({
            success: true,
            message: "Adhérent supprimé avec succès."
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAdherents,
    getAdherent,
    createAdherent,
    updateAdherent,
    deleteAdherent
};
