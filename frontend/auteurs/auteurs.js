let editingAuteurId = null;



// Éléments HTML


const auteurForm =
    document.getElementById("auteurForm");

const auteurIdInput =
    document.getElementById("auteurId");

const nomInput =
    document.getElementById("nom");

const nationaliteInput =
    document.getElementById("nationalite");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const auteursTableBody =
    document.getElementById("auteursTableBody");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");



// Messages


function afficherMessage(texte, type = "success") {

    message.textContent = texte;

    message.className = type;

    setTimeout(() => {

        message.textContent = "";
        message.className = "";

    }, 4000);
}



// Protection HTML

function echapperHTML(texte) {

    const div =
        document.createElement("div");

    div.textContent =
        texte ?? "";

    return div.innerHTML;
}



// Charger les auteurs


async function chargerAuteurs() {

    loading.hidden = false;

    auteursTableBody.innerHTML = "";


    try {

        const response =
            await api.get("/auteurs");

        const auteurs =
            response.data || [];


        if (auteurs.length === 0) {

            auteursTableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Aucun auteur enregistré.
                    </td>
                </tr>
            `;

            return;
        }


        auteurs.forEach((auteur) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${auteur.id}
                </td>

                <td>
                    ${echapperHTML(auteur.nom)}
                </td>

                <td>
                    ${
                        echapperHTML(
                            auteur.nationalite || "-"
                        )
                    }
                </td>

                <td>

                    <button
                        type="button"
                        onclick="modifierAuteur(${auteur.id})"
                    >
                        Modifier
                    </button>


                    <button
                        type="button"
                        onclick="supprimerAuteur(${auteur.id})"
                    >
                        Supprimer
                    </button>

                </td>
            `;


            auteursTableBody.appendChild(row);
        });


    } catch (error) {

        afficherMessage(
            "Impossible de charger les auteurs : " +
            error.message,
            "error"
        );

    } finally {

        loading.hidden = true;
    }
}


// Ajouter / modifier


auteurForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const auteur = {

            nom:
                nomInput.value.trim(),

            nationalite:
                nationaliteInput.value.trim() || null
        };


        try {

            if (editingAuteurId) {

                await api.put(
                    `/auteurs/${editingAuteurId}`,
                    auteur
                );


                afficherMessage(
                    "Auteur modifié avec succès."
                );

            } else {

                await api.post(
                    "/auteurs",
                    auteur
                );


                afficherMessage(
                    "Auteur ajouté avec succès."
                );
            }


            resetForm();

            await chargerAuteurs();


        } catch (error) {

            afficherMessage(
                error.message,
                "error"
            );
        }
    }
);



// Modifier

async function modifierAuteur(id) {

    try {

        const response =
            await api.get(`/auteurs/${id}`);

        const auteur =
            response.data;


        editingAuteurId =
            auteur.id;


        auteurIdInput.value =
            auteur.id;

        nomInput.value =
            auteur.nom;

        nationaliteInput.value =
            auteur.nationalite || "";


        formTitle.textContent =
            "Modifier un auteur";

        submitButton.textContent =
            "Modifier l'auteur";

        cancelButton.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        afficherMessage(
            "Impossible de récupérer l'auteur : " +
            error.message,
            "error"
        );
    }
}



// Supprimer


async function supprimerAuteur(id) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cet auteur ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        await api.delete(
            `/auteurs/${id}`
        );


        afficherMessage(
            "Auteur supprimé avec succès."
        );


        await chargerAuteurs();


    } catch (error) {

        afficherMessage(
            "Suppression impossible : " +
            error.message,
            "error"
        );
    }
}



// Réinitialiser


function resetForm() {

    auteurForm.reset();

    editingAuteurId = null;

    auteurIdInput.value = "";

    formTitle.textContent =
        "Ajouter un auteur";

    submitButton.textContent =
        "Ajouter l'auteur";

    cancelButton.hidden =
        true;
}


cancelButton.addEventListener(
    "click",
    resetForm
);



// Initialisation

chargerAuteurs();

