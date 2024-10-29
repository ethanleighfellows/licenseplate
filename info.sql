CREATE TABLE plates (
    region VARCHAR(255) PRIMARY KEY,
    count INT DEFAULT 0
);

-- Insert US States
INSERT INTO plates (region) VALUES
('Alabama'), ('Alaska'), ('Arizona'), ('Arkansas'), ('California'),
('Colorado'), ('Connecticut'), ('Delaware'), ('Florida'), ('Georgia'),
('Hawaii'), ('Idaho'), ('Illinois'), ('Indiana'), ('Iowa'),
('Kansas'), ('Kentucky'), ('Louisiana'), ('Maine'), ('Maryland'),
('Massachusetts'), ('Michigan'), ('Minnesota'), ('Mississippi'),
('Missouri'), ('Montana'), ('Nebraska'), ('Nevada'), ('New Hampshire'),
('New Jersey'), ('New Mexico'), ('New York'), ('North Carolina'),
('North Dakota'), ('Ohio'), ('Oklahoma'), ('Oregon'), ('Pennsylvania'),
('Rhode Island'), ('South Carolina'), ('South Dakota'), ('Tennessee'),
('Texas'), ('Utah'), ('Vermont'), ('Virginia'), ('Washington'),
('West Virginia'), ('Wisconsin'), ('Wyoming');

-- Insert Mexican States
INSERT INTO plates (region) VALUES
('Aguascalientes'), ('Baja California'), ('Baja California Sur'),
('Campeche'), ('Chiapas'), ('Chihuahua'), ('Coahuila'), ('Colima'),
('Durango'), ('Guanajuato'), ('Guerrero'), ('Hidalgo'), ('Jalisco'),
('Mexico City'), ('Mexico State'), ('Michoacán'), ('Morelos'),
('Nayarit'), ('Nuevo León'), ('Oaxaca'), ('Puebla'), ('Querétaro'),
('Quintana Roo'), ('San Luis Potosí'), ('Sinaloa'), ('Sonora'),
('Tabasco'), ('Tamaulipas'), ('Tlaxcala'), ('Veracruz'), ('Yucatán'),
('Zacatecas');

-- Insert Canadian Provinces and Territories
INSERT INTO plates (region) VALUES
('Alberta'), ('British Columbia'), ('Manitoba'), ('New Brunswick'),
('Newfoundland and Labrador'), ('Nova Scotia'), ('Ontario'),
('Prince Edward Island'), ('Quebec'), ('Saskatchewan'),
('Northwest Territories'), ('Nunavut'), ('Yukon');
