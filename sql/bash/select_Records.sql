USE characters;

-- SELECT --
SELECT * FROM heroes;

-- SELECT COLUMN --
SELECT FirstName FROM heroes;

-- SELECT COLUMN, COLUMN --
SELECT FirstName, Health FROM heroes;

-- SELECT COLUMN ORDER BY [ASC, DESC] --
SELECT FirstName FROM heroes ORDER BY FirstName ASC
SELECT FirstName FROM heroes ORDER BY FirstName DESC

-- SELECT w/ WHERE --
SELECT * FROM heroes WHERE Mana IS NOT NULL;
SELECT * FROM heroes WHERE Mana IS NULL;

-- SELECT TOP w/ WHERE --
SELECT TOP 3 * FROM heroes WHERE Mana IS NULL

-- SELECT DISTINCT --
SELECT DISTINCT FirstName FROM heroes

-- SELECT MIN(COLUMN) --
SELECT MIN(Mana) AS SmallestMana FROM heroes WHERE Mana IS NOT NULL;

-- SELECT MAX(COLUMN) --
SELECT MAX(Health) AS GreatestHealth FROM heroes;

-- SELECT COUNT(COLUMN) --
SELECT COUNT(FirstName) FROM heroes WHERE Mana IS NULL;

-- SELECT AVG(COLUMN) --
SELECT AVG(Atk) FROM heroes WHERE Atk IS NOT NULL;

-- SELECT SUM(COLUMN) --
SELECT SUM(Stamina) FROM heroes WHERE Stamina IS NOT NULL;

-- SELECT LIKE --
SELECT FirstName FROM heroes WHERE FirstName LIKE "J%";

-- SELECT IN --
SELECT FirstName, Atk FROM heroes WHERE Atk IN (25, 35, 45)

-- SELECT BETWEEN --
SELECT FirstName, Magic FROM heroes WHERE Magic BETWEEN 0 AND 100;