const pool = require("../config/database");


// Récupérer les statistiques générales de la bibliothèque.

const getStatistiques = async () => {

    
    // Nombre total de livres
     
    const totalLivresResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM livres
    `);


    
    // Nombre total d'adhérents
     
    const totalAdherentsResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM adherents
    `);


    
    // Nombre d'emprunts actuellement en cours
    
    const empruntsEnCoursResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM emprunts
        WHERE date_retour_effective IS NULL
    `);


    
    // Nombre d'emprunts en retard
    
    const empruntsEnRetardResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM emprunts
        WHERE
            date_retour_effective IS NULL
            AND date_retour_prevue < CURRENT_DATE
    `);


    
    // Livre le plus emprunté
     
    const livrePlusEmprunteResult = await pool.query(`
        SELECT 
            livres.id, 
            livres.titre, 
            auteurs.nom AS auteur, 
            COUNT(emprunts.id)::INTEGER AS nombre_emprunts 
            FROM emprunts 
            INNER JOIN livres 
                ON emprunts.livre_id = livres.id INNER JOIN auteurs 
                ON livres.auteur_id = auteurs.id 
            GROUP BY 
                livres.id, 
                livres.titre, 
                auteurs.nom 
            ORDER BY nombre_emprunts DESC LIMIT 1
    `);


    
    // Adhérent le plus actif
     
    const adherentPlusActifResult = await pool.query(`
        SELECT
            adherents.id,
            adherents.nom,
            adherents.contact,
            COUNT(emprunts.id)::INTEGER AS nombre_emprunts
        FROM emprunts
        INNER JOIN adherents
            ON emprunts.adherent_id = adherents.id
        GROUP BY
            adherents.id,
            adherents.nom,
            adherents.contact
        ORDER BY nombre_emprunts DESC
        LIMIT 1
    `);


    return {
        totalLivres: Number(
            totalLivresResult.rows[0].total
        ),

        totalAdherents: Number(
            totalAdherentsResult.rows[0].total
        ),

        empruntsEnCours: Number(
            empruntsEnCoursResult.rows[0].total
        ),

        empruntsEnRetard: Number(
            empruntsEnRetardResult.rows[0].total
        ),

        livrePlusEmprunte:
            livrePlusEmprunteResult.rows[0] || null,

        adherentPlusActif:
            adherentPlusActifResult.rows[0] || null
    };
};


module.exports = {
    getStatistiques
};

