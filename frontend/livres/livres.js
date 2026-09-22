let currentPage = 1;
const limit = 10;
let currentSearch = "";

let editingLivreId = null;



// Éléments HTML

const livreForm = document.getElementById("livreForm");

const livreIdInput = document.getElementById("livreId");
const titreInput = document.getElementById("titre");
const auteurIdInput = document.getElementById("auteurId");
const anneePublicationInput = document.getElementById("anneePublication");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const livresTableBody = document.getElementById("livresTableBody");

const loading = document.getElementById("loading");
const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const paginationInfo = document.getElementById("paginationInfo");



// Message


function afficherMessage(texte, type = "success") {
    message.textContent = texte;
    message.className = type;

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 4000);
}



// Charger les auteurs

async function chargerAuteurs() {

    try {

        const response = await api.get("/auteurs");

        const auteurs = response.data || [];

        auteurIdInput.innerHTML = `
            <option value="">
                Sélectionner un auteur
            </option>
        `;

        auteurs.forEach((auteur) => {

            const option = document.createElement("option");

            option.value = auteur.id;
            option.textContent = auteur.nom;

            auteurIdInput.appendChild(option);
        });

    } catch (error) {

        afficherMessage(
            "Impossible de charger les auteurs : " + error.message,
            "error"
        );
    }
}



// Charger les livres

async function chargerLivres() {

    loading.hidden = false;

    livresTableBody.innerHTML = "";

    try {

        let endpoint = `/livres?page=${currentPage}&limit=${limit}`;

        if (currentSearch) {
            endpoint += `&search=${encodeURIComponent(currentSearch)}`;
        }

        const response = await api.get(endpoint);

        const livres = response.data || [];
        const pagination = response.pagination;


        if (livres.length === 0) {

            livresTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Aucun livre trouvé.
                    </td>
                </tr>
            `;

        } else {

            livres.forEach((livre) => {

                const row = document.createElement("tr");

                const statut =
                    livre.statut === "disponible"
                        ? "Disponible"
                        : "Emprunté";

                row.innerHTML = `
                    <td>${livre.id}</td>

                    <td>${echapperHTML(livre.titre)}</td>

                    <td>${echapperHTML(livre.auteur)}</td>

                    <td>${livre.annee_publication ?? "-"}</td>

                    <td>${statut}</td>

                    <td>
                        <button
                            type="button"
                            onclick="modifierLivre(${livre.id})"
                        >
                            Modifier
                        </button>

                        <button
                            type="button"
                            onclick="supprimerLivre(${livre.id})"
                        >
                            Supprimer
                        </button>
                    </td>
                `;

                livresTableBody.appendChild(row);
            });
        }


        // Pagination

        paginationInfo.textContent =
            `Page ${pagination.page} / ${pagination.totalPages || 1}`;

        previousButton.disabled =
            pagination.page <= 1;

        nextButton.disabled =
            pagination.page >= pagination.totalPages;

    } catch (error) {

        afficherMessage(
            "Impossible de charger les livres : " + error.message,
            "error"
        );

    } finally {

        loading.hidden = true;
    }
}



// Protection HTML

function echapperHTML(texte) {

    const div = document.createElement("div");

    div.textContent = texte ?? "";

    return div.innerHTML;
}



// Ajouter / Modifier


livreForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const livre = {

        titre: titreInput.value.trim(),

        auteur_id: Number(auteurIdInput.value),

        annee_publication:
            anneePublicationInput.value
                ? Number(anneePublicationInput.value)
                : null
    };


    try {

        if (editingLivreId) {

            await api.put(
                `/livres/${editingLivreId}`,
                livre
            );

            afficherMessage(
                "Livre modifié avec succès."
            );

        } else {

            await api.post(
                "/livres",
                livre
            );

            afficherMessage(
                "Livre ajouté avec succès."
            );
        }


        resetForm();

        await chargerLivres();

    } catch (error) {

        afficherMessage(
            error.message,
            "error"
        );
    }
});



// Modifier un livre

async function modifierLivre(id) {

    try {

        const response = await api.get(`/livres/${id}`);

        const livre = response.data;

        editingLivreId = livre.id;

        livreIdInput.value = livre.id;

        titreInput.value = livre.titre;

        auteurIdInput.value = livre.auteur_id;

        anneePublicationInput.value =
            livre.annee_publication ?? "";


        submitButton.textContent =
            "Modifier le livre";

        cancelButton.hidden = false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        afficherMessage(
            "Impossible de récupérer le livre : " +
            error.message,
            "error"
        );
    }
}



// Supprimer

async function supprimerLivre(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce livre ?"
    );

    if (!confirmation) {
        return;
    }


    try {

        await api.delete(`/livres/${id}`);

        afficherMessage(
            "Livre supprimé avec succès."
        );

        await chargerLivres();

    } catch (error) {

        afficherMessage(
            "Suppression impossible : " +
            error.message,
            "error"
        );
    }
}



// Réinitialiser le formulaire


function resetForm() {

    livreForm.reset();

    editingLivreId = null;

    livreIdInput.value = "";

    submitButton.textContent =
        "Ajouter le livre";

    cancelButton.hidden = true;
}


cancelButton.addEventListener(
    "click",
    resetForm
);


// Recherche

searchButton.addEventListener(
    "click",
    () => {

        currentSearch =
            searchInput.value.trim();

        currentPage = 1;

        chargerLivres();
    }
);


searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchButton.click();
        }
    }
);


resetButton.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        currentSearch = "";

        currentPage = 1;

        chargerLivres();
    }
);



// Pagination


previousButton.addEventListener(
    "click",
    () => {

        if (currentPage > 1) {

            currentPage--;

            chargerLivres();
        }
    }
);


nextButton.addEventListener(
    "click",
    () => {

        currentPage++;

        chargerLivres();
    }
);



// Initialisation


async function initialiserPage() {

    await chargerAuteurs();

    await chargerLivres();
}


initialiserPage();
