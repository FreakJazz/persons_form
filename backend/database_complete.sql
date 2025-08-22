
-- ==================================================
-- RETO SELECTION - BASE DE DATOS COMPLETA
-- Sistema de Gestión de Personas y Profesiones
-- ==================================================

-- Eliminar tablas si existen
DROP TABLE IF EXISTS persons CASCADE;
DROP TABLE IF EXISTS professions CASCADE;

-- ==================================================
-- TABLA: professions
-- ==================================================
CREATE TABLE professions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Índices para professions
CREATE INDEX ix_professions_id ON professions (id);
CREATE UNIQUE INDEX ix_professions_name ON professions (name);

-- ==================================================
-- TABLA: persons
-- ==================================================
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER NOT NULL,
    profession_id INTEGER NOT NULL REFERENCES professions(id),
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Índices para persons
CREATE INDEX ix_persons_id ON persons (id);
CREATE INDEX idx_persons_profession_id ON persons (profession_id);
CREATE INDEX idx_persons_birth_date ON persons (birth_date);

-- ==================================================
-- DATOS INICIALES - PROFESIONES
-- ==================================================
INSERT INTO professions (name) VALUES 
('INGENIERO DE SISTEMAS'),
('MÉDICO GENERAL'),
('ABOGADO'),
('ARQUITECTO'),
('DISEÑADOR GRÁFICO'),
('ADMINISTRADOR DE EMPRESAS'),
('PSICÓLOGO'),
('PROFESOR'),
('VENDEDOR'),
('CHEF'),
('CONTADOR PÚBLICO'),
('ENFERMERO'),
('FISIOTERAPEUTA'),
('PERIODISTA'),
('MARKETING DIGITAL');

-- ==================================================
-- DATOS INICIALES - PERSONAS
-- ==================================================
INSERT INTO persons (first_name, last_name, birth_date, age, profession_id, address, phone) VALUES 
('Juan Carlos', 'Pérez García', '1990-05-15', 34, 1, 'Calle 123 #45-67, Bogotá', '3001234567'),
('María Elena', 'González López', '1985-08-22', 39, 2, 'Carrera 45 #123-89, Medellín', '3009876543'),
('Carlos Alberto', 'Rodríguez Silva', '1992-03-10', 32, 3, 'Avenida 80 #12-34, Cali', '3155551234'),
('Ana Sofía', 'Martínez Torres', '1988-11-30', 35, 4, 'Calle 72 #89-01, Barranquilla', '3187654321'),
('Diego Fernando', 'Hernández Cruz', '1995-07-18', 29, 5, 'Carrera 15 #67-23, Cartagena', '3123456789'),
('Luisa Fernanda', 'Jiménez Morales', '1991-12-05', 33, 6, 'Calle 85 #34-56, Bucaramanga', '3209876543'),
('Andrés Felipe', 'Castro Vargas', '1987-04-25', 37, 7, 'Avenida 68 #45-78, Pereira', '3141234567'),
('Paola Andrea', 'Ramos Delgado', '1993-09-12', 31, 8, 'Carrera 30 #12-90, Manizales', '3176543210'),
('Miguel Ángel', 'Torres Aguilar', '1989-01-08', 35, 9, 'Calle 50 #78-12, Ibagué', '3198765432'),
('Valentina', 'Ruiz Castillo', '1994-06-20', 30, 10, 'Avenida 19 #23-45, Santa Marta', '3234567890'),
('Santiago', 'Moreno Vega', '1986-10-14', 38, 9, 'Carrera 7 #56-89, Villavicencio', '3112345678'),
('Isabella', 'Gómez Herrera', '1996-02-28', 28, 8, 'Calle 26 #90-23, Pasto', '3189876543'),
('Sebastián', 'López Mendoza', '1990-08-03', 34, 7, 'Avenida 9 #34-67, Neiva', '3156789012'),
('Camila', 'Vargas Sánchez', '1992-12-16', 32, 6, 'Carrera 25 #78-01, Popayán', '3223456789'),
('Nicolás', 'Silva Ramírez', '1987-05-09', 37, 5, 'Calle 40 #12-34, Armenia', '3167890123'),
('Sofía Isabel', 'Mendoza Restrepo', '1995-03-12', 29, 11, 'Calle 94 #15-23, Bogotá', '3245678901'),
('Alejandro', 'Ramírez Córdoba', '1991-07-08', 33, 12, 'Carrera 68 #45-12, Medellín', '3134567890'),
('Daniela', 'Quintero Morales', '1993-11-25', 31, 13, 'Avenida 6 #78-90, Cali', '3098765432'),
('Fernando', 'Salazar Vega', '1988-05-30', 36, 14, 'Calle 45 #23-67, Barranquilla', '3187654321'),
('Natalia', 'Guerrero Torres', '1996-09-14', 28, 15, 'Carrera 13 #89-45, Cartagena', '3256789012');

-- ==================================================
-- VISTAS ÚTILES
-- ==================================================

-- Vista de personas con información completa
CREATE VIEW v_persons_complete AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    CONCAT(p.first_name, ' ', p.last_name) as full_name,
    p.birth_date,
    p.age,
    pr.name as profession_name,
    p.address,
    p.phone,
    p.photo_url,
    p.created_at,
    p.updated_at
FROM persons p
JOIN professions pr ON p.profession_id = pr.id
ORDER BY p.created_at DESC;

-- Vista de estadísticas
CREATE VIEW v_statistics AS
SELECT 
    (SELECT COUNT(*) FROM persons) as total_persons,
    (SELECT COUNT(*) FROM professions) as total_professions,
    (SELECT AVG(age) FROM persons) as average_age,
    (SELECT MIN(age) FROM persons) as min_age,
    (SELECT MAX(age) FROM persons) as max_age;

-- ==================================================
-- FUNCIÓN PARA ACTUALIZAR EDAD AUTOMÁTICAMENTE
-- ==================================================
CREATE OR REPLACE FUNCTION update_person_age()
RETURNS TRIGGER AS $$
BEGIN
    NEW.age := EXTRACT(YEAR FROM AGE(NEW.birth_date));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar edad automáticamente
CREATE TRIGGER trigger_update_person_age
    BEFORE INSERT OR UPDATE ON persons
    FOR EACH ROW
    EXECUTE FUNCTION update_person_age();

-- ==================================================
-- CONSULTAS DE EJEMPLO
-- ==================================================

-- Seleccionar todas las personas con su profesión
-- SELECT * FROM v_persons_complete;

-- Contar personas por profesión
-- SELECT pr.name, COUNT(p.id) as cantidad
-- FROM professions pr
-- LEFT JOIN persons p ON pr.id = p.profession_id
-- GROUP BY pr.id, pr.name
-- ORDER BY cantidad DESC;

-- Personas por rango de edad
-- SELECT 
--     CASE 
--         WHEN age <= 18 THEN '0-18'
--         WHEN age BETWEEN 19 AND 35 THEN '19-35'
--         WHEN age BETWEEN 36 AND 60 THEN '36-60'
--         ELSE '60+'
--     END as rango_edad,
--     COUNT(*) as cantidad
-- FROM persons
-- GROUP BY 
--     CASE 
--         WHEN age <= 18 THEN '0-18'
--         WHEN age BETWEEN 19 AND 35 THEN '19-35'
--         WHEN age BETWEEN 36 AND 60 THEN '36-60'
--         ELSE '60+'
--     END
-- ORDER BY rango_edad;

-- ==================================================
-- FIN DEL SCRIPT
-- ==================================================
