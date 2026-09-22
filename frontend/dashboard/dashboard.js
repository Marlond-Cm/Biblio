

// Éléments HTML


const totalLivres =
    document.getElementById("totalLivres");

const totalAdherents =
    document.getElementById("totalAdherents");

const empruntsEnCours =
    document.getElementById("empruntsEnCours");

const empruntsEnRetard =
    document.getElementById("empruntsEnRetard");

const livrePlusEmprunte =
    document.getElementById("livrePlusEmprunte");

const adherentPlusActif =
    document.getElementById("adherentPlusActif");

const message =
    document.getElementById("message");



// Message


function afficherMessage(texte, type = "error") {

    message.textContent = texte;

    message.className = type;

}



// Charger les statistiques


async function chargerStatistiques() {

    try {

        const response =
            await api.get("/statistiques");

        const statistiques =
            response.data;


        
        // Statistiques générales
        

        totalLivres.textContent =
            statistiques.totalLivres ?? 0;

        totalAdherents.textContent =
            statistiques.totalAdherents ?? 0;

        empruntsEnCours.textContent =
            statistiques.empruntsEnCours ?? 0;

        empruntsEnRetard.textContent =
            statistiques.empruntsEnRetard ?? 0;


    
        // Livre le plus emprunté
        

        if (statistiques.livrePlusEmprunte) {

            const livre =
                statistiques.livrePlusEmprunte;


            livrePlusEmprunte.innerHTML = `

                <p>
                    <strong>
                        ${echapperHTML(livre.titre)}
                    </strong>
                </p>

                <p>
                    Auteur :
                    ${echapperHTML(livre.auteur)}
                </p>

                <p>
                    Nombre d'emprunts :
                    <strong>
                        ${livre.nombre_emprunts}
                    </strong>
                </p>

            `;

        } else {

            livrePlusEmprunte.innerHTML = `
                <p>
                    Aucun emprunt enregistré.
                </p>
            `;
        }


       
        // Adhérent le plus actif
        

        if (statistiques.adherentPlusActif) {

            const adherent =
                statistiques.adherentPlusActif;


            adherentPlusActif.innerHTML = `

                <p>
                    <strong>
                        ${echapperHTML(adherent.nom)}
                    </strong>
                </p>

                <p>
                    Contact :
                    ${echapperHTML(adherent.contact)}
                </p>

                <p>
                    Nombre d'emprunts :
                    <strong>
                        ${adherent.nombre_emprunts}
                    </strong>
                </p>

            `;

        } else {

            adherentPlusActif.innerHTML = `
                <p>
                    Aucun emprunt enregistré.
                </p>
            `;
        }


    } catch (error) {

        afficherMessage(
            "Impossible de charger les statistiques : " +
            error.message
        );

        livrePlusEmprunte.textContent =
            "Erreur de chargement.";

        adherentPlusActif.textContent =
            "Erreur de chargement.";
    }
}



// Protection HTML


function echapperHTML(texte) {

    const div =
        document.createElement("div");

    div.textContent =
        texte ?? "";

    return div.innerHTML;
}


// Initialisation


chargerStatistiques();
