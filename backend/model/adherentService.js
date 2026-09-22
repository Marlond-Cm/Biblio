const pool = require("../config/database");

// Récupérer tous les adhérents
const getAllAdherents = async () => { 
    const result = await pool.query(` 
        SELECT 
        id, 
        nom, 
        contact, 
        created_at, 
        updated_at 
        FROM adherents ORDER BY id ASC 
        `); 
        return result.rows; 
};

// Récupérer un adhérent par son ID
const getAdherentById = async (id) => { 
    const result = await pool.query( ` 
        SELECT 
        id, 
        nom, 
        contact, 
        created_at, 
        updated_at 
        FROM adherents WHERE id = $1 
        `, 
        [id] 
    ); 
    return result.rows[0]; 
};

// Créer un adhérent
const createAdherent = async (nom, contact) => { 
    const result = await pool.query( ` 
        INSERT INTO adherents (nom, contact) 
        VALUES ($1, $2) 
        RETURNING 
        id, 
        nom, 
        contact, 
        created_at, 
        updated_at 
        `, 
        [nom, contact] 
    ); 
    return result.rows[0]; 
};

// Modifier un adhérent
const updateAdherent = async (id, nom, contact) => { 
    const result = await pool.query( ` 
        UPDATE adherents 
        SET 
            nom = $1, 
            contact = $2, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 
        RETURNING 
            id, 
            nom, 
            contact, 
            created_at, 
            updated_at 
            `, 
            [nom, contact, id] 
        );
        return result.rows[0];
};

// Supprimer un adhérent
const deleteAdherent = async (id) => { 
    const result = await pool.query( ` 
        DELETE FROM adherents 
        WHERE id = $1 
        RETURNING id 
        `, 
        [id] 
    ); 
    return result.rows[0]; 
};

module.exports = { 
    getAllAdherents, 
    getAdherentById, 
    createAdherent, 
    updateAdherent, 
    deleteAdherent };