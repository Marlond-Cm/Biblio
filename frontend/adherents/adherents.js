let editingAdherentId = null;



// Éléments HTML


const adherentForm =
    document.getElementById("adherentForm");

const adherentIdInput =
    document.getElementById("adherentId");

const nomInput =
    document.getElementById("nom");

const contactInput =
    document.getElementById("contact");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");

const adherentsTableBody =
    document.getElementById("adherentsTableBody");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const historiqueSection =
    document.getElementById("historiqueSection");

const historiqueAdherent =
    document.getElementById("historiqueAdherent");

const historiqueTableBody =
    document.getElementById("historiqueTableBody");


// Afficher un message


function afficherMessage(texte, type = "success") {

    message.textContent = texte;

    message.className = type;

    setTimeout(() => {

        message.textContent = "";
        message.className = "";

    }, 4000);
}



// Charger les adhérents


async function chargerAdherents() {

    loading.hidden = false;

    adherentsTableBody.innerHTML = "";


    try {

        const response =
            await api.get("/adherents");

        const adherents =
            response.data || [];


        if (adherents.length === 0) {

            adherentsTableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Aucun adhérent enregistré.
                    </td>
                </tr>
            `;

            return;
        }


        adherents.forEach((adherent) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${adherent.id}</td>

                <td>
                    ${echapperHTML(adherent.nom)}
                </td>

                <td>
                    ${echapperHTML(adherent.contact)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="modifierAdherent(${adherent.id})"
                    >
                        Modifier
                    </button>


                    <button
                        type="button"
                        onclick="supprimerAdherent(${adherent.id})"
                    >
                        Supprimer
                    </button>


                    <button
                        type="button"
                        onclick="voirHistorique(${adherent.id})"
                    >
                        Historique
                    </button>

                </td>
            `;


            adherentsTableBody.appendChild(row);
        });


    } catch (error) {

        afficherMessage(
            "Impossible de charger les adhérents : " +
            error.message,
            "error"
        );

    } finally {

        loading.hidden = true;
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



// Ajouter / modifier


adherentForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const adherent = {

            nom:
                nomInput.value.trim(),

            contact:
                contactInput.value.trim()
        };


        try {

            if (editingAdherentId) {

                await api.put(
                    `/adherents/${editingAdherentId}`,
                    adherent
                );


                afficherMessage(
                    "Adhérent modifié avec succès."
                );

            } else {

                await api.post(
                    "/adherents",
                    adherent
                );


                afficherMessage(
                    "Adhérent ajouté avec succès."
                );
            }


            resetForm();

            await chargerAdherents();


        } catch (error) {

            afficherMessage(
                error.message,
                "error"
            );
        }
    }
);


// Modifier


async function modifierAdherent(id) {

    try {

        const response =
            await api.get(`/adherents/${id}`);

        const adherent =
            response.data;


        editingAdherentId =
            adherent.id;


        adherentIdInput.value =
            adherent.id;

        nomInput.value =
            adherent.nom;

        contactInput.value =
            adherent.contact;


        formTitle.textContent =
            "Modifier un adhérent";

        submitButton.textContent =
            "Modifier l'adhérent";

        cancelButton.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        afficherMessage(
            "Impossible de récupérer l'adhérent : " +
            error.message,
            "error"
        );
    }
}



// Supprimer


async function supprimerAdherent(id) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cet adhérent ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        await api.delete(
            `/adherents/${id}`
        );


        afficherMessage(
            "Adhérent supprimé avec succès."
        );


        await chargerAdherents();


    } catch (error) {

        afficherMessage(
            "Suppression impossible : " +
            error.message,
            "error"
        );
    }
}



// Réinitialiser formulaire


function resetForm() {

    adherentForm.reset();

    editingAdherentId = null;

    adherentIdInput.value = "";

    formTitle.textContent =
        "Ajouter un adhérent";

    submitButton.textContent =
        "Ajouter l'adhérent";

    cancelButton.hidden =
        true;
}


cancelButton.addEventListener(
    "click",
    resetForm
);



// Historique d'un adhérent


async function voirHistorique(id) {

    try {

        const response =
            await api.get(
                `/emprunts/adherent/${id}`
            );


        const emprunts =
            response.data || [];


        historiqueSection.hidden =
            false;


        historiqueTableBody.innerHTML =
            "";


        if (emprunts.length === 0) {

            historiqueAdherent.textContent =
                "Aucun emprunt enregistré pour cet adhérent.";

            historiqueTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Aucun emprunt.
                    </td>
                </tr>
            `;

        } else {

            const premierEmprunt =
                emprunts[0];


            historiqueAdherent.textContent =
                `Historique de : ${premierEmprunt.adherent}`;


            emprunts.forEach((emprunt) => {

                const row =
                    document.createElement("tr");


                const retourne =
                    emprunt.date_retour_effective
                        ? "Retourné"
                        : "En cours";


                row.innerHTML = `

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
                        ${retourne}
                    </td>
                `;


                historiqueTableBody.appendChild(row);
            });
        }


        historiqueSection.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        afficherMessage(
            "Impossible de charger l'historique : " +
            error.message,
            "error"
        );
    }
}



// Formatage date


function formaterDate(date) {

    if (!date) {
        return "-";
    }

    const morceaux =
        date.split("-");

    if (morceaux.length !== 3) {
        return date;
    }

    return `${morceaux[2]}/${morceaux[1]}/${morceaux[0]}`;
}


// Initialisation

chargerAdherents();

