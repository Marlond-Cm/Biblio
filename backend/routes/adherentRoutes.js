const express = require("express");

const adherentController = require("../controllers/adherentController");

const {
    validateId,
    validateAdherentCreation,
    validateAdherentUpdate
} = require("../middlewares/validation");

const router = express.Router();


// GET /api/adherents
router.get(
    "/",
    adherentController.getAdherents
);


// GET /api/adherents/:id
router.get(
    "/:id",
    validateId,
    adherentController.getAdherent
);


// POST /api/adherents
router.post(
    "/",
    validateAdherentCreation,
    adherentController.createAdherent
);


// PUT /api/adherents/:id
router.put(
    "/:id",
    validateId,
    validateAdherentUpdate,
    adherentController.updateAdherent
);


// DELETE /api/adherents/:id
router.delete(
    "/:id",
    validateId,
    adherentController.deleteAdherent
);


module.exports = router;
