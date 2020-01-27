USE characters;

CREATE TABLE heroes (
    char_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Health int NOT NULL,
    Stamina int NULL,
    Mana int NULL,
    Atk int NULL,
    Magic int NULL,
    CanFight bit NULL,
    CanSteal bit NULL,
    CanHeal bit NULL,
    CanCast bit NULL
);

CREATE TABLE villians (
    char_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Health int NOT NULL,
    Stamina int NULL,
    Mana int NULL,
    Atk int NULL,
    Magic int NULL,
    CanFight bit NULL,
    CanSteal bit NULL,
    CanHeal bit NULL,
    CanCast bit NULL
);