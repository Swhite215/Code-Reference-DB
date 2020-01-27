USE characters;

CREATE TABLE heroes (
    char_id INT NOT NULL PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Health int,
    Stamina int,
    Atk int,
    Magic int,
    CanFight bit,
    CanSteal bit,
    CanHeal bit,
    CanCast bit
);

CREATE TABLE villians (
    char_id INT NOT NULL PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Health int,
    Stamina int,
    Atk int,
    Magic int,
    CanFight bit,
    CanSteal bit,
    CanHeal bit,
    CanCast bit
);