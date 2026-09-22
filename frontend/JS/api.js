const API_BASE_URL = "http://localhost:5000/api";

const api = {
    async request(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            ...options
        });

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            throw new Error("La réponse du serveur n'est pas un JSON valide.");
        }

        if (!response.ok) {
            const message =
                data?.message || "Une erreur est survenue lors de la requête.";

            throw new Error(message);
        }

        return data;
    },

    get(endpoint) {
        return this.request(endpoint, {
            method: "GET"
        });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, {
            method: "DELETE"
        });
    }
};

