const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit")
const morgan = require("morgan");

const auteurRoutes = require("./routes/auteursRoutes");
const adherentRoutes = require("./routes/adherentRoutes");
const livreRoutes = require("./routes/livreRoutes");
const empruntRoutes = require("./routes/empruntsRoutes");
const statistiqueRoutes = require("./routes/statistiqueRoutes");

const errorHandler = require("./middlewares/errorHandler");


const app= express();

// Sécurité HTTP
app.use(helmet());

// Autoriser les requtes cross-origin
app.use(cors());

// Lire les requetes JSON
app.use(express.json({ limit: "10kb"}));

// logger HTTP 
app.use(morgan("dev"));

// limitation générale des requetes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false 
});

app.use("/api", limiter);

// Route de test
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "API Biblitheque Fonctionne"
    });
});

// Routes Auteurs
app.use("/api/auteurs", auteurRoutes);
// Routes Adherents
app.use("/api/adherents", adherentRoutes);
// Routes livres
app.use("/api/livres", livreRoutes);
// Routes emprunts
app.use("/api/emprunts", empruntRoutes);
// Routes statistiques
app.use("/api/statistiques", statistiqueRoutes);

// Gestion centralisée des erreurs
app.use(errorHandler);

module.exports = app;