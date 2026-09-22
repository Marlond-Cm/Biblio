const pool = require("../config/database");

// Recupérer tous les auteurs

const getAllAuteurs = async() =>{
    const result = await pool.query(`
        SELECT
            id,
            nom,
            nationalite,
            created_at,
            updated_at
        FROM auteurs
        ORDER BY nom ASC
    `);
    return result.rows;
};

// recupérer un auteur par son ID
const getAuteurById = async (id) => {
    const result = await pool.query(`
        SELECT
            id,
            nom,
            nationalite,
            created_at,
            updated_at
        FROM auteurs
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

// Créer un auteur
const createAuteur = async (nom, nationalite) =>{
    const result = await pool.query(
        `
        INSERT INTO auteurs (nom, nationalite)
        VALUES ($1, $2)
        RETURNING
            id,
            nom,
            nationalite,
            created_at,
            updated_at
        `,
        [nom, nationalite]

    );
    return result.rows[0];
};

// Modifier un auteur
const updateAuteur = async (id, nom, nationalite) => {
    const result = await pool.query(
        `
        UPDATE auteurs
        SET
            nom = $1,
            nationalite = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING
            id,
            nom,
            nationalite,
            created_at,
            updated_at
        `,
        [nom, nationalite, id]
    );

    return result.rows[0];
};

// Supprimer un auteur
const deleteAuteur = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM auteurs
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0];
};


module.exports = {
    getAllAuteurs,
    getAuteurById,
    createAuteur,
    updateAuteur,
    deleteAuteur
};