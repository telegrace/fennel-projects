DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/4K-pC8i_FY2d70lnQmcfLrAbiek4PoU5.jpeg',
	'Spike',
	'Photobooth Selfie',
	'Hey I think I forgot something in the fridge.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/TYr6RRdDBi5I54j_3WG3HWULtTIZNmCF.jpeg',
    'Detective Swan',
    'Have you seen this goose?',
    'It''s back again wreaking havoc.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/0U60pCVuTg9EPjfVmvnUs4G5-VvwU3pR.gif',
    'CrustySocks',
    'Hackerman',
    'Hacking too much time!'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/qmXZoabckeK1JXQuIs3G10P_iW9u_DpU.jpeg',
	'Wanda',
	'Yoga for all!',
	'Don''t feel ashamed about your skills!'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/merwlfiqn9snr6SXuhspmWOkWcDIg1tr.jpeg',
	'Blaze',
	'Streets Of Rage',
	'Clean up the streets!'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/KKn_ap3RomM5UunyDrYattBa15wz8JCV.jpeg',
	'Auntie Ayi',
	'Selfie',
	'Feeling cute might delete later'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/vVEZTBp6lu1_D5qNESrWTLhjGyKJGcKf.svg',
	'Mr. Robot',
	'Hamburger Menu',
	'I''m running out of things to post!'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/DNTjcpILnhNtaNMeTqIKVUSX8CijwFsF.jpeg',
	'Nick',
	'Hot Fuzz',
	'It''s just the one.'
);

INSERT INTO images (url, username, title, description) VALUES (
	'https://s3.amazonaws.com/spicedling/WKeSTaf0cmmKCb5tDzMWSl5cN1iD6ebF.jpeg',
	'Groundskeeper',
	'Have you seen this goose?',
	'Act with caution ultimate goose is known to honk agressively and steal keys.'
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    img_id INT NOT NULL REFERENCES images (id),
    comment TEXT NOT NULL CHECK (comment <> ''),
    author TEXT NOT NULL CHECK (comment <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO comments (img_id, comment, author) VALUES (
    '1',
 	'Found the lobster shortly after this photo',
	'Spike'
);

INSERT INTO comments (img_id, comment, author) VALUES (
    '6',
 	'You should stop smoking.',
	'Uncle Roger'
);

INSERT INTO comments (img_id, comment, author) VALUES (
    '6',
 	'Leave me alone.',
	'Auntie Ayi'
);
