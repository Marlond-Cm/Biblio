const pool = require("../config/database");


// Récupérer tous les emprunts.

const getAllEmprunts = async () => {
    const result = await pool.query(`
        SELECT
            emprunts.id,
            emprunts.adherent_id,
            adherents.nom AS adherent,
            emprunts.livre_id,
            livres.titre AS livre,
            auteurs.nom AS auteur,
            emprunts.date_emprunt,
            emprunts.date_retour_prevue,
            emprunts.date_retour_effective
        FROM emprunts
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        INNER JOIN livres
            ON emprunts.livre_id = livres.id
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        ORDER BY emprunts.id DESC
    `);

    return result.rows;
};


// Récupérer un emprunt par son ID.

const getEmpruntById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            emprunts.id,
            emprunts.adherent_id,
            adherents.nom AS adherent,
            emprunts.livre_id,
            livres.titre AS livre,
            auteurs.nom AS auteur,
            emprunts.date_emprunt,
            emprunts.date_retour_prevue,
            emprunts.date_retour_effective
        FROM emprunts
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        INNER JOIN livres
            ON emprunts.livre_id = livres.id
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE emprunts.id = $1
        `,
        [id]
    );

    return result.rows[0];
};


// Créer un emprunt
// Cette opération utilise une transaction PostgreSQL
const createEmprunt = async (
    adherentId,
    livreId,
    dateRetourPrevue
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        
        // Vérifier que le livre existe
        // et verrouiller sa ligne pendant la transaction
        const livreResult = await client.query(
            `
            SELECT
                id,
                statut
            FROM livres
            WHERE id = $1
            FOR UPDATE
            `,
            [livreId]
        );


        if (livreResult.rows.length === 0) {
            const error = new Error("Livre introuvable.");
            error.status = 404;
            throw error;
        }


        const livre = livreResult.rows[0];


        
        // Vérifier que le livre est disponible
        if (livre.statut !== "disponible") {
            const error = new Error(
                "Ce livre est déjà emprunté."
            );

            error.status = 409;
            throw error;
        }


        
        // Vérifier que l'adhérent existe
        
        const adherentResult = await client.query(
            `
            SELECT id
            FROM adherents
            WHERE id = $1
            `,
            [adherentId]
        );


        if (adherentResult.rows.length === 0) {
            const error = new Error(
                "Adhérent introuvable."
            );

            error.status = 404;
            throw error;
        }


        // Créer l'emprunt.
         
        const empruntResult = await client.query(
            `
            INSERT INTO emprunts (
                adherent_id,
                livre_id,
                date_retour_prevue
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                adherent_id,
                livre_id,
                date_emprunt,
                date_retour_prevue,
                date_retour_effective
            `,
            [
                adherentId,
                livreId,
                dateRetourPrevue
            ]
        );


        // Passer le livre à "emprunte"
        await client.query(
            `
            UPDATE livres
            SET
                statut = 'emprunte',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
            [livreId]
        );


        // Valider toute la transaction
        await client.query("COMMIT");


        return empruntResult.rows[0];

    } catch (error) {

        
        // Annuler toutes les modifications
        // si une erreur survient.
         
        await client.query("ROLLBACK");

        throw error;

    } finally {

        
        //libérer la connexion
        
        client.release();
    }
};



// Retourner un livre
const returnEmprunt = async (id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        
        //Récupérer l'emprunt et verrouiller sa ligne.
         
        const empruntResult = await client.query(
            `
            SELECT
                id,
                livre_id,
                date_retour_effective
            FROM emprunts
            WHERE id = $1
            FOR UPDATE
            `,
            [id]
        );


        if (empruntResult.rows.length === 0) {
            const error = new Error(
                "Emprunt introuvable."
            );

            error.status = 404;
            throw error;
        }


        const emprunt = empruntResult.rows[0];


        
        // Vérifier que le livre n'est pas déjà retourné
        
        if (emprunt.date_retour_effective !== null) {
            const error = new Error(
                "Cet emprunt est déjà retourné."
            );

            error.status = 409;
            throw error;
        }


        
        // Enregistrer la date de retour.
         
        const updateEmprunt = await client.query(
            `
            UPDATE emprunts
            SET
                date_retour_effective = CURRENT_DATE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING
                id,
                adherent_id,
                livre_id,
                date_emprunt,
                date_retour_prevue,
                date_retour_effective
            `,
            [id]
        );


        
        // Rendre le livre disponible.
        
        await client.query(
            `
            UPDATE livres
            SET
                statut = 'disponible',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
            [emprunt.livre_id]
        );


        
        // Valider la transaction
        
        await client.query("COMMIT");


        return updateEmprunt.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};



// Récupérer les emprunts actuellement en cours.

const getCurrentEmprunts = async () => {
    const result = await pool.query(`
        SELECT
            emprunts.id,
            emprunts.adherent_id,
            adherents.nom AS adherent,
            emprunts.livre_id,
            livres.titre AS livre,
            auteurs.nom AS auteur,
            emprunts.date_emprunt,
            emprunts.date_retour_prevue
        FROM emprunts
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        INNER JOIN livres
            ON emprunts.livre_id = livres.id
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE emprunts.date_retour_effective IS NULL
        ORDER BY emprunts.date_retour_prevue ASC
    `);

    return result.rows;
};



// Récupérer les emprunts en retard
 
const getOverdueEmprunts = async () => {
    const result = await pool.query(`
        SELECT
            emprunts.id,
            emprunts.adherent_id,
            adherents.nom AS adherent,
            emprunts.livre_id,
            livres.titre AS livre,
            auteurs.nom AS auteur,
            emprunts.date_emprunt,
            emprunts.date_retour_prevue,
            CURRENT_DATE - emprunts.date_retour_prevue AS jours_retard
        FROM emprunts
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        INNER JOIN livres
            ON emprunts.livre_id = livres.id
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE
            emprunts.date_retour_effective IS NULL
            AND emprunts.date_retour_prevue < CURRENT_DATE
        ORDER BY emprunts.date_retour_prevue ASC
    `);

    return result.rows;
};



// Récupérer l'historique des emprunts d'un adhérent.

const getAdherentEmprunts = async (adherentId) => {
    const result = await pool.query(
        `
        SELECT
            emprunts.id,
            emprunts.livre_id,
            livres.titre AS livre,
            adherents.nom AS adherent,
            auteurs.nom AS auteur,
            emprunts.date_emprunt,
            emprunts.date_retour_prevue,
            emprunts.date_retour_effective
        FROM emprunts
        INNER JOIN livres
            ON emprunts.livre_id = livres.id
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE emprunts.adherent_id = $1
        ORDER BY emprunts.date_emprunt DESC
        `,
        [adherentId]
    );

    return result.rows;
};




module.exports = {
    getAllEmprunts,
    getEmpruntById,

    createEmprunt,
    returnEmprunt,

    getCurrentEmprunts,
    getOverdueEmprunts,
    getAdherentEmprunts
};

