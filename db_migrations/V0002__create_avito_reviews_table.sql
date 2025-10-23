CREATE TABLE IF NOT EXISTS avito_reviews (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_avito_reviews_created_at ON avito_reviews(created_at DESC);
