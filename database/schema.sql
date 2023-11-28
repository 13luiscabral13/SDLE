CREATE TABLE list (
    name TEXT,
    url TEXT NOT NULL PRIMARY KEY,
    changed BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE item (
    name TEXT NOT NULL,
    list_url TEXT NOT NULL,
    current INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    changed BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (list_url) REFERENCES list (url),
    PRIMARY KEY (name, list_url)
);