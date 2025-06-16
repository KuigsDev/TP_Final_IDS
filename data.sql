-- Insertar empresas
INSERT INTO empresa (nombre, email, direccion, intereses, reputacion) VALUES
('TechNova S.A.', 'contacto@technova.com', 'Av. Corrientes 1234', 'Electrónica, Computación', 'Buena'),
('EcoVerde SRL', 'info@ecoverde.com', 'Calle Mitre 567', 'Jardinería, Sustentabilidad', 'Excelente'),
('CulturaLibre', 'admin@culturalibre.org', 'San Juan 1122', 'Libros, Arte, Música', 'Muy Buena');

-- Insertar objetos
INSERT INTO objeto (titulo, descripcion, categoria, estado, empresa_id) VALUES
('Notebook HP', 'Notebook 14" usada pero en buen estado', 'Tecnología', 'Disponible', 1),
('Planta de Interior', 'Ficus grande en maceta decorativa', 'Jardinería', 'Disponible', 2),
('Libro "1984"', 'Edición especial de George Orwell', 'Libros', 'Intercambiado', 3),
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 'Tecnología', 'Disponible', 1),
('Regadera ecológica', 'Regadera hecha con plástico reciclado', 'Jardinería', 'Disponible', 2);
