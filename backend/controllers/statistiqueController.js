const statistiqueService = require("../model/statistiqueService");



//  Récupérer les statistiques du dashboard.

const getStatistiques = async (req, res, next) => {
    try {

        const statistiques =
            await statistiqueService.getStatistiques();

        res.status(200).json({
            success: true,
            data: statistiques
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getStatistiques
};

