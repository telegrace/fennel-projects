DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    img_id INT NOT NULL UNIQUE REFERENCES images (id),
    comment TEXT NOT NULL CHECK (comment <> ''),
    author TEXT NOT NULL CHECK (comment <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);