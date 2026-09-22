const { body, param, validationResult } = require("express-validator");

// Vérifie les erreurs produits pqr express-validator
const  handleValidationErrors = ( req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message:"Données invalides",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    
    next();
}


// Validation de l'id présent dans l'url.
const validateId = [
    param("id")
        .isInt({ min: 1})
        .withMessage("L'identifiant doit être un entier positif."),

    handleValidationErrors
];

// Validation lors de la création d'un auteur.
const validateAuteurCreation = [
    body("nom")
        .trim()
        .notEmpty()
        .withMessage("Le nom de l'auteur est obligatoire.")
        .isLength({ max: 150})
        .withMessage("Le nom de l'auteur ne doit pas dépasser 150 caractères."),

    body("nationalite")
        .optional({ values: "null"})
        .trim()
        .isLength({ max: 100})
        .withMessage("La nationalité ne doit pas dépasser 100 caractères."),
    
    handleValidationErrors

];

//Validation lors de la modification d'un auteur.
const validateAuteurUpdate = [ 
    body("nom") 
        .trim() 
        .notEmpty() 
        .withMessage("Le nom de l'auteur est obligatoire.") 
        .isLength({ max: 150 }) 
        .withMessage("Le nom de l'auteur ne doit pas dépasser 150 caractères."), 
        
    body("nationalite") 
        .optional({ values: "null" }) 
        .trim() 
        .isLength({ max: 100 }) 
        .withMessage("La nationalité ne doit pas dépasser 100 caractères."), 
        
    handleValidationErrors 
];


// Validation lors de la création d'un adhérent.
const validateAdherentCreation = [ 
    body("nom") 
        .trim() 
        .notEmpty() 
        .withMessage("Le nom de l'adhérent est obligatoire.") 
        .isLength({ max: 150 }) 
        .withMessage("Le nom de l'adhérent ne doit pas dépasser 150 caractères."), 
    
    body("contact") 
        .trim() 
        .notEmpty() 
        .withMessage("Le contact de l'adhérent est obligatoire.") 
        .isLength({ max: 150 }) 
        .withMessage("Le contact ne doit pas dépasser 150 caractères."), 
    
    handleValidationErrors 
];

// Validation lors des modifications d'un adherent.
const validateAdherentUpdate = [
    body("nom")
        .trim()
        .notEmpty()
        .withMessage("Le nom de l'adhérent est obligatoire.")
        .isLength({ max: 150 })
        .withMessage("Le contact ne doit pas dépasser 150 caractères."),
    
    body("contact")
        .trim()
        .notEmpty()
        .withMessage("Le contact de l'adhérent est obligatoire.")
        .isLength({ max: 150 })
        .withMessage("Le contact ne doit pas dépasser 150 caractères."),

    handleValidationErrors

];

// Validation lors de la création d'un livre
const validateLivreCreation = [
    body("titre")
        .trim()
        .notEmpty()
        .withMessage("Le titre du livre est obligatoire.")
        .isLength({ max: 255 })
        .withMessage("Le titre du livre ne doit pas dépasser 255 caractères."),

    body("auteur_id")
        .notEmpty()
        .withMessage("L'identifiant de l'auteur est obligatoire.")
        .isInt({ min: 1 })
        .withMessage("L'identifiant de l'auteur doit être un entier positif."),

    body("annee_publication")
        .optional({ values: "null" })
        .isInt({ min: 1000, max: 2100 })
        .withMessage("L'année de publication doit être comprise entre 1000 et 2100."),

    handleValidationErrors
];


// Validation lors de la modification d'un livre
const validateLivreUpdate = [
    body("titre")
        .trim()
        .notEmpty()
        .withMessage("Le titre du livre est obligatoire.")
        .isLength({ max: 255 })
        .withMessage("Le titre du livre ne doit pas dépasser 255 caractères."),

    body("auteur_id")
        .notEmpty()
        .withMessage("L'identifiant de l'auteur est obligatoire.")
        .isInt({ min: 1 })
        .withMessage("L'identifiant de l'auteur doit être un entier positif."),

    body("annee_publication")
        .optional({ values: "null" })
        .isInt({ min: 1000, max: 2100 })
        .withMessage("L'année de publication doit être comprise entre 1000 et 2100."),

    handleValidationErrors
];


// Validation lors de la création d'un emprunt

const validateEmpruntCreation = [
    body("adherent_id")
        .notEmpty()
        .withMessage("L'identifiant de l'adhérent est obligatoire.")
        .isInt({ min: 1 })
        .withMessage("L'identifiant de l'adhérent doit être un entier positif."),

    body("livre_id")
        .notEmpty()
        .withMessage("L'identifiant du livre est obligatoire.")
        .isInt({ min: 1 })
        .withMessage("L'identifiant du livre doit être un entier positif."),

    
    body("date_retour_prevue")
        .notEmpty()
        .withMessage("La date de retour prévue est obligatoire.")

        .isISO8601({
            strict: true
        })
        .withMessage(
            "La date de retour prévue doit être au format YYYY-MM-DD."
        )

        .custom((value) => {
            const dateRetour = new Date(`${value}T00:00:00`);
            const aujourdHui = new Date();

            aujourdHui.setHours(0, 0, 0, 0);

            if (dateRetour < aujourdHui) {
                throw new Error(
                    "La date de retour prévue ne peut pas être dans le passé."
                );
            }

            return true;
        }),


    handleValidationErrors
];



// Validation d'un ID personnalisé présent dans l'URL.
const validateIdParam = (paramName) => [
    param(paramName)
        .isInt({ min: 1 })
        .withMessage(
            "L'identifiant doit être un entier positif."
        ),

    handleValidationErrors
];





module.exports = { 
    handleValidationErrors, 
    validateId,
    validateIdParam,

    validateAuteurCreation, 
    validateAuteurUpdate,

    validateAdherentCreation,
    validateAdherentUpdate,

    validateLivreCreation,
    validateLivreUpdate,

    validateEmpruntCreation
};