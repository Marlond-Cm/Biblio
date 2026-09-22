


--- TABLE : auteurs

CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,

    nom VARCHAR(150) NOT NULL,

    nationalite VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--- table : adhérents

CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,

    nom VARCHAR(150) NOT NULL,

    contact VARCHAR(150) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);

--- table : Livres
CREATE TABLE livres (
    id SERIAL PRIMARY KEY,

    titre VARCHAR(255) NOT NULL,

    auteur_id INTEGER NOT NULL,

    annee_publication INTEGER,

    statut VARCHAR(20) NOT NULL DEFAULT 'disponible',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livre_auteur
        FOREIGN KEY (auteur_id)
        REFERENCES auteurs(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_livre_statut
        CHECK (statut IN ('disponible', 'emprunte')),

    CONSTRAINT chk_annee_publication
        CHECK (
            annee_publication IS NULL
            OR annee_publication BETWEEN 1000 AND 2100
        )
);

--- table : emprunts
CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,

    adherent_id INTEGER NOT NULL,

    livre_id INTEGER NOT NULL,

    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,

    date_retour_prevue DATE NOT NULL,

    date_retour_effective DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_emprunt_adherent
        FOREIGN KEY (adherent_id)
        REFERENCES adherents(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_emprunt_livre
        FOREIGN KEY (livre_id)
        REFERENCES livres(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_date_retour_prevue
        CHECK (date_retour_prevue >= date_emprunt),

    CONSTRAINT chk_date_retour_effective
        CHECK (
            date_retour_effective IS NULL
            OR date_retour_effective >= date_emprunt
        )
);

--- INDEX

CREATE INDEX idx_livres_titre
ON livres(titre);

CREATE INDEX idx_livres_auteur
ON livres(auteur_id);

CREATE INDEX idx_livres_statut
ON livres(statut);

CREATE INDEX idx_emprunts_adherent
ON emprunts(adherent_id);

CREATE INDEX idx_emprunts_livre
ON emprunts(livre_id);

CREATE INDEX idx_emprunts_date_retour
ON emprunts(date_retour_prevue);

