USE election;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

CREATE TABLE  voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);


CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  voter_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- values inserted into voter_id must be unique
  CONSTRAINT uc_voter UNIQUE (voter_id),
  -- ON DELETE CASCADE deleting reference key will also delete entire now
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);


-- run these commands in command line
    -- INSERT INTO votes (voter_id, candidate_id) VALUES(1, 1);
    -- INSERT INTO votes (voter_id, candidate_id) VALUES(2, 1);
    -- INSERT INTO votes (voter_id, candidate_id) VALUES(2, 2);
      -- the 3rd will not run becase we entered voter_id = 2 already 
    -- show all rows from votes table
      -- SELECT * FROM votes;
--  Insert some votes
  -- INSERT INTO votes (voter_id, candidate_id) 
  -- VALUES(3,1), (4,2), (5,2), (6,2), (7,2), (8,3), (9,3);
-- count the votes per candidate id (group by candidate id)
  -- SELECT COUNT(candidate_id) FROM votes GROUP BY candidate_id;


  -- The candidate_id field is a foreign key, so we can still join this table with the candidates table. While we're at it, we can also join the candidates table with the parties table to pull in their party affiliation.
      -- Run the following query in the MySQL command line:
        -- SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
        -- FROM votes
        -- LEFT JOIN candidates ON votes.candidate_id = candidates.id
        -- LEFT JOIN parties ON candidates.party_id = parties.id
        -- GROUP BY candidate_id ORDER BY count DESC;