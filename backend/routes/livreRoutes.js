const express = require("express");

const livreController = require("../controllers/livreController");

const {
    validateId,
    validateLivreCreation,
    validateLivreUpdate
} = require("../middlewares/validation");

const router = express.Router();


// GET /api/livres
//Récupérer tous les livres

router.get(
    "/",
    livreController.getLivres
);


// GET /api/livres/:id
// Récupérer un livre par son ID
 
router.get(
    "/:id",
    validateId,
    livreController.getLivre
);



// POST /api/livres
// Créer un livre
 
router.post(
    "/",
    validateLivreCreation,
    livreController.createLivre
);



// PUT /api/livres/:id
// Modifier un livre
router.put(
    "/:id",
    validateId,
    validateLivreUpdate,
    livreController.updateLivre
);



// DELETE /api/livres/:id
// Supprimer un livre
router.delete(
    "/:id",
    validateId,
    livreController.deleteLivre
);


module.exports = router;

