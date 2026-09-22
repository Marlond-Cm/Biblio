const express = require("express");

const statistiqueController =
    require("../controllers/statistiqueController");

const router = express.Router();



// GET /api/statistiques

router.get(
    "/",
    statistiqueController.getStatistiques
);


module.exports = router;
