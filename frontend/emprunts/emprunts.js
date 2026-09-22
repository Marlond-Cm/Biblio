let filtreActuel = "all";


// ==============================
// Éléments HTML
// ==============================

const empruntForm =
    document.getElementById("empruntForm");

const adherentIdInput =
    document.getElementById("adherentId");

const livreIdInput =
    document.getElementById("livreId");

const dateRetourPrevueInput =
    document.getElementById("dateRetourPrevue");

const empruntsTableBody =
    document.getElementById("empruntsTableBody");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const listeTitle =
    document.getElementById("listeTitle");

const allButton =
    document.getElementById("allButton");

const currentButton =
    document.getElementById("currentButton");

const overdueButton =
    document.getElementById("overdueButton");


// ==============================
// Messages
// ==============================

function afficherMessage(texte, type = "success") {

    message.textContent = texte;

    message.className = type;

    setTimeout(() => {

        message.textContent = "";
        message.className = "";

    }, 4000);
}


// ==============================
// Protection HTML
// ==============================

function echapperHTML(texte) {

    const div =
        document.createElement("div");

    div.textContent =
        texte ?? "";

    return div.innerHTML;
}


// ==============================
// Formatage des dates
// ==============================

function formaterDate(date) {
    if (!date) return "-";

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return "Date invalide";
    }

    return dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


// ==============================
// Date minimale
// ==============================

function definirDateMinimale() {

    const aujourdHui =
        new Date();

    const annee =
        aujourdHui.getFullYear();

    const mois =
        String(
            aujourdHui.getMonth() + 1
        ).padStart(2, "0");

    const jour =
        String(
            aujourdHui.getDate()
        ).padStart(2, "0");


    dateRetourPrevueInput.min =
        `${annee}-${mois}-${jour}`;
}


definirDateMinimale();



// Charger les adhérents


async function chargerAdherents() {

    try {

        const response =
            await api.get("/adherents");

        const adherents =
            response.data || [];


        adherentIdInput.innerHTML = `
            <option value="">
                Sélectionner un adhérent
            </option>
        `;


        adherents.forEach((adherent) => {

            const option =
                document.createElement("option");

            option.value =
                adherent.id;

            option.textContent =
                adherent.nom;

            adherentIdInput.appendChild(option);
        });


    } catch (error) {

        afficherMessage(
            "Impossible de charger les adhérents : " +
            error.message,
            "error"
        );
    }
}



// Charger les livres disponibles


async function chargerLivresDisponibles() {

    try {

        const response =
            await api.get(
                "/livres?limit=100"
            );


        const livres =
            response.data || [];


        const livresDisponibles =
            livres.filter(
                (livre) =>
                    livre.statut === "disponible"
            );


        livreIdInput.innerHTML = `
            <option value="">
                Sélectionner un livre
            </option>
        `;


        livresDisponibles.forEach((livre) => {

            const option =
                document.createElement("option");

            option.value =
                livre.id;

            option.textContent =
                `${livre.titre} — ${livre.auteur}`;

            livreIdInput.appendChild(option);
        });


    } catch (error) {

        afficherMessage(
            "Impossible de charger les livres : " +
            error.message,
            "error"
        );
    }
}



// Charger tous les emprunts

async function chargerTousLesEmprunts() {

    return await api.get("/emprunts");
}



// Charger les emprunts actuels


async function chargerEmpruntsActuels() {

    return await api.get("/emprunts/current");
}



// Charger les emprunts en retard


async function chargerEmpruntsEnRetard() {

    return await api.get("/emprunts/overdue");
}



// Afficher les emprunts


function afficherEmprunts(emprunts) {

    empruntsTableBody.innerHTML = "";


    if (emprunts.length === 0) {

        empruntsTableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    Aucun emprunt trouvé.
                </td>
            </tr>
        `;

        return;
    }


    emprunts.forEach((emprunt) => {

        const row =
            document.createElement("tr");


        const estRetourne =
            Boolean(
                emprunt.date_retour_effective
            );


        const estEnRetard =
            !estRetourne &&
            new Date(
                `${emprunt.date_retour_prevue}T00:00:00`
            ) < new Date(
                `${new Date().toISOString().split("T")[0]}T00:00:00`
            );


        let statut = "En cours";

        if (estRetourne) {

            statut = "Retourné";

        } else if (estEnRetard) {

            statut = "En retard";
        }


        row.classList.add(
            estEnRetard
                ? "emprunt-retard"
                : estRetourne
                    ? "emprunt-retourne"
                    : "emprunt-en-cours"
        );


        row.innerHTML = `

            <td>
                ${emprunt.id}
            </td>

            <td>
                ${echapperHTML(
                    emprunt.adherent
                )}
            </td>

            <td>
                ${echapperHTML(
                    emprunt.livre
                )}
            </td>

            <td>
                ${echapperHTML(
                    emprunt.auteur
                )}
            </td>

            <td>
                ${formaterDate(
                    emprunt.date_emprunt
                )}
            </td>

            <td>
                ${formaterDate(
                    emprunt.date_retour_prevue
                )}
            </td>

            <td>
                ${
                    emprunt.date_retour_effective
                        ? formaterDate(
                            emprunt.date_retour_effective
                        )
                        : "-"
                }
            </td>

            <td>
                ${statut}
            </td>

            <td>

                ${
                    !estRetourne
                        ? `
                            <button
                                type="button"
                                onclick="retournerLivre(${emprunt.id})"
                            >
                                Retourner
                            </button>
                        `
                        : `
                            <span>
                                Terminé
                            </span>
                        `
                }

            </td>
        `;


        empruntsTableBody.appendChild(row);
    });
}



// Charger selon le filtre


async function chargerEmprunts() {

    loading.hidden = false;

    empruntsTableBody.innerHTML = "";


    try {

        let response;


        if (filtreActuel === "current") {

            response =
                await chargerEmpruntsActuels();

            listeTitle.textContent =
                "Emprunts en cours";


        } else if (filtreActuel === "overdue") {

            response =
                await chargerEmpruntsEnRetard();

            listeTitle.textContent =
                "Emprunts en retard";


        } else {

            response =
                await chargerTousLesEmprunts();

            listeTitle.textContent =
                "Tous les emprunts";
        }


        const emprunts =
            response.data || [];


        afficherEmprunts(emprunts);


    } catch (error) {

        afficherMessage(
            "Impossible de charger les emprunts : " +
            error.message,
            "error"
        );

    } finally {

        loading.hidden = true;
    }
}



// Créer un emprunt


empruntForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const emprunt = {

            adherent_id:
                Number(
                    adherentIdInput.value
                ),

            livre_id:
                Number(
                    livreIdInput.value
                ),

            date_retour_prevue:
                dateRetourPrevueInput.value
        };


        try {

            await api.post(
                "/emprunts",
                emprunt
            );


            afficherMessage(
                "Emprunt enregistré avec succès."
            );


            empruntForm.reset();


            definirDateMinimale();


            await chargerLivresDisponibles();

            await chargerEmprunts();


        } catch (error) {

            afficherMessage(
                "Impossible d'enregistrer l'emprunt : " +
                error.message,
                "error"
            );
        }
    }
);



// Retourner un livre


async function retournerLivre(id) {

    const confirmation =
        confirm(
            "Confirmer le retour de ce livre ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        await api.patch(
            `/emprunts/${id}/retour`
        );


        afficherMessage(
            "Livre retourné avec succès."
        );


        await chargerLivresDisponibles();

        await chargerEmprunts();


    } catch (error) {

        afficherMessage(
            "Impossible d'effectuer le retour : " +
            error.message,
            "error"
        );
    }
}



// Filtres


allButton.addEventListener(
    "click",
    async () => {

        filtreActuel = "all";

        await chargerEmprunts();
    }
);


currentButton.addEventListener(
    "click",
    async () => {

        filtreActuel = "current";

        await chargerEmprunts();
    }
);


overdueButton.addEventListener(
    "click",
    async () => {

        filtreActuel = "overdue";

        await chargerEmprunts();
    }
);



// Initialisation


async function initialiserPage() {

    await chargerAdherents();

    await chargerLivresDisponibles();

    await chargerEmprunts();
}


initialiserPage();