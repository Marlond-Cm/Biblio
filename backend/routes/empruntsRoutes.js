const express = require("express");

const empruntController = require("../controllers/empruntController");

const {
    validateId,
    validateIdParam,
    validateEmpruntCreation
    
} = require("../middlewares/validation");

const router = express.Router();



// GET /api/emprunts
// Récupérer tous les emprunts
router.get(
    "/",
    empruntController.getEmprunts
);


// GET /api/emprunts/current
// Empurent actuellement en cours 
router.get(
    "/current",
    empruntController.getCurrentEmprunts
);

// GET /api/emprunts/overdue
// Emprunts en retard
router.get(
    "/overdue",
    empruntController.getOverdueEmprunts
);

// GET /api/emprunts/adherent/:adherentsId
// Historique d'un adhérent
router.get(
    "/adherent/:adherentId",
    validateIdParam("adherentId"),
    empruntController.getAdherentEmprunts
);



// GET /api/emprunts/:id
// Récupérer un emprunt

router.get(
    "/:id",
    validateId,
    empruntController.getEmprunt
);



// POST /api/emprunts
// Créer un emprunt

router.post(
    "/",
    validateEmpruntCreation,
    empruntController.createEmprunt
);


// PATCH /api/emprunts/:id/retour
// Retourner un livre

router.patch(
    "/:id/retour",
    validateId,
    empruntController.returnEmprunt
);


module.exports = router;
