const express = require("express")

const auteurController = require("../controllers/auteurController");

const {
    validateId, 
    validateAuteurCreation, 
    validateAuteurUpdate
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", auteurController.getAuteurs);

router.get(
    "/:id", 
    validateId,
    auteurController.getAuteur
);

router.post(
    "/", 
    validateAuteurCreation,
    auteurController.createAuteur);

router.put(
    "/:id",
    validateId,
    validateAuteurUpdate, 
    auteurController.updateAuteur);

router.delete(
    "/:id",
    validateId, 
    auteurController.deleteAuteur);

module.exports = router;