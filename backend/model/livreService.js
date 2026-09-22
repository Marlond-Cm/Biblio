const { search } = require("../app");
const pool = require("../config/database");

// Récupérer tous les livres avec le nom de l'auteur
const  getAllLivres = async (search = "", page = 1, limit = 10) =>{
    const offset = (page - 1) * limit;

    const searchValue = `%${search}%`;

    const  result = await pool.query(`
        SELECT
            livres.id,
            livres.titre,
            livres.auteur_id,
            auteurs.nom AS auteur,
            livres.annee_publication,
            livres.statut,
            livres.created_at,
            livres.updated_at
        FROM livres
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE
            livres.titre ILIKE $1
            OR auteurs.nom ILIKE $1
        ORDER BY livres.id ASC
        LIMIT $2
        OFFSET $3

        `,
        [
            searchValue,
            limit,
            offset
        ]
    );

    const countResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM livres
        INNER JOIN auteurs
            ON livres.auteur_id = auteurs.id
        WHERE 
            livres.titre ILIKE $1
            OR auteurs.nom ILIKE $1
        `,
        [searchValue]
    );

    const total = Number(countResult.rows[0].total);

    return {
        livres: result.rows,
        pagination : {
            page,
            limit,
            total,
            totalPages : Math.ceil(total / limit)
        }
    };
}


// Récupére un livre par ID

const getLivreById = async (id) => { 
    const result = await pool.query( ` 
        SELECT 
            livres.id, 
            livres.titre, 
            livres.auteur_id, 
            auteurs.nom AS auteur, 
            livres.annee_publication, 
            livres.statut, 
            livres.created_at, 
            livres.updated_at 
            FROM livres 
            INNER JOIN auteurs 
            ON livres.auteur_id = auteurs.id 
            WHERE livres.id = $1 
            `, 
            [id] 
    ); 
    return result.rows[0]; 
};

// Créer un livre 
const createLivre = async (
    titre, 
    auteur_id,
    annee_publication
) => {
    const result = await pool.query(`
        INSERT INTO livres (
            titre,
            auteur_id,
            annee_publication
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            titre,
            auteur_id,
            annee_publication,
            statut,
            created_at,
            updated_at
        `,
        [
            titre,
            auteur_id,
            annee_publication
        ]
    );

    return result.rows[0];
};

// Modifier un livre
const updateLivre = async ( 
    id, 
    titre, 
    auteur_id, 
    annee_publication 
) => { 
    const result = await pool.query( 
        ` 
        UPDATE livres 
        SET 
            titre = $1, 
            auteur_id = $2, 
            annee_publication = $3, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $4 
        RETURNING 
            id, 
            titre, 
            auteur_id, 
            annee_publication, 
            statut, 
            created_at, 
            updated_at 
        `, 
        [ 
            titre, 
            auteur_id, 
            annee_publication, 
            id 
        ] 
    ); 
    
    return result.rows[0]; 
};

// Supprimer un livre
const deleteLivre = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM livres
        WHERE id = $1
        RETURNING id
        
        `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
};