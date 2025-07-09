create table usuarios(
    id serial primary key,
    nombre varchar(50) not null,
    mail varchar(50) not null,
    clave varchar(16) not null,
    ubicacion varchar(500) not null,
    reputacion int not null,
    imagen varchar(100) not null
);
create table objetos(  
    id serial primary key,
    nombre varchar(50) not null,
    descripcion varchar(255) not null,
    categoria varchar(50) not null,
    estado varchar(50) not null,
    fecha_publicacion date not null,
    imagen varchar(100) not null,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);
create table trueques(
    id serial primary key,
    objeto_ofrecido_id INT NOT NULL REFERENCES objetos(id) ON DELETE CASCADE,
    objeto_deseado_id INT NOT NULL REFERENCES objetos(id) ON DELETE CASCADE,
    estado varchar(50) not null default 'Pendiente',
    fecha date not null,
    usuario_solicitante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO usuarios(nombre, mail, clave, ubicacion, reputacion, imagen) VALUES
('Eric Rodriguez', 'eric_rodriguez@gmail.com', '123456', 'Flores', 3, '/img/usuarios/1.jpg'),
('Ana Torres', 'ana_torres@gmail.com', 'abcdef', 'Palermo', 4, '/img/usuarios/2.jpg'),
('Luis Pérez', 'luis_perez@hotmail.com', 'luis123', 'Belgrano', 5, '/img/usuarios/3.jpg'),
('María García', 'maria.garcia@yahoo.com', 'maria456', 'Recoleta', 2, '/img/usuarios/4.jpg'),
('Carlos López', 'carlos.lopez@gmail.com', 'qwerty', 'Caballito', 4, '/img/usuarios/5.jpg'),
('Sofía Martínez', 'sofia_mtz@gmail.com', 'sofia789', 'Villa Urquiza', 5, '/img/usuarios/6.jpg'),
('Julián Fernández', 'julianf@hotmail.com', 'julian321', 'Almagro', 3, '/img/usuarios/7.jpg'),
('Valentina Gómez', 'valentina@gmail.com', 'valen123', 'Villa Crespo', 4, '/img/usuarios/8.jpg'),
('Matías Ramírez', 'matias.ramirez@gmail.com', 'matias456', 'Once', 2, '/img/usuarios/9.jpg'),
('Camila Herrera', 'camiherrera@yahoo.com', 'camila654', 'San Telmo', 5, '/img/usuarios/10.jpg');

INSERT INTO objetos(nombre, descripcion, categoria, estado, fecha_publicacion, imagen, usuario_id) VALUES 
('Bicicleta', 'Bicicleta de montaña en buen estado', 'Deportes', 'Usado', '2025-06-01', '/img/objetos/1.jpg', 1),
('Mesa de madera', 'Mesa de comedor para 6 personas', 'Muebles', 'Usado', '2025-06-02', '/img/objetos/2.jpg', 2),
('Notebook Lenovo', 'Laptop Lenovo i5, 8GB RAM, SSD', 'Electrónica', 'Usado', '2025-06-03', '/img/objetos/3.jpg', 3),
('Campera de cuero', 'Campera talle M, poco uso', 'Ropa', 'Usado', '2025-06-04', '/img/objetos/4.jpg', 4),    
('Cafetera Philips', 'Cafetera nueva sin abrir', 'Electrodomésticos', 'Nuevo', '2025-06-05', '/img/objetos/5.jpg', 5),
('Juego de herramientas', 'Set completo de herramientas manuales', 'Hogar', 'Usado', '2025-06-06', '/img/objetos/6.jpg', 1),
('Zapatillas Nike', 'Zapatillas originales, talle 42', 'Calzado', 'Usado', '2025-06-07', '/img/objetos/7.jpg', 2),
('Celular Samsung A52', 'Smartphone libre con funda incluida', 'Electrónica', 'Usado', '2025-06-08', '/img/objetos/8.jpg', 3),
('Heladera Whirlpool', 'Heladera con freezer, buen funcionamiento', 'Electrodomésticos', 'Usado', '2025-06-09', '/img/objetos/9.jpg', 5),
('Silla Gamer', 'Silla ergonómica reclinable, color negro/rojo', 'Muebles', 'Usado', '2025-06-10', '/img/objetos/10.jpg', 6),
('Patineta Eléctrica', 'Scooter plegable con batería nueva', 'Transporte', 'Nuevo', '2025-06-11', '/img/objetos/11.jpg', 7),
('Guitarra Criolla', 'Guitarra de madera clásica, incluye funda', 'Instrumentos', 'Usado', '2025-06-12', '/img/objetos/12.jpg', 8),
('Monitor LG 24"', 'Monitor Full HD en excelente estado', 'Electrónica', 'Usado', '2025-06-13', '/img/objetos/13.jpg', 9),
('Lavarropas Samsung', 'Carga frontal, capacidad 7kg', 'Electrodomésticos', 'Usado', '2025-06-14', '/img/objetos/14.jpg', 10),
('Libro "1984"', 'Edición en español, tapa blanda', 'Libros', 'Usado', '2025-06-15', '/img/objetos/15.jpg', 5),
('Impresora HP', 'Impresora multifunción con escáner', 'Oficina', 'Usado', '2025-06-16', '/img/objetos/16.jpg', 6),
('Set de ollas Tramontina', 'Juego de 5 piezas de acero inoxidable', 'Cocina', 'Nuevo', '2025-06-17', '/img/objetos/17.jpg', 7),
('Zapatillas Adidas', 'Modelo RunFalcon, talle 43, poco uso', 'Calzado', 'Usado', '2025-06-18', '/img/objetos/18.jpg', 8);

INSERT INTO trueques (objeto_ofrecido_id, objeto_deseado_id, estado, fecha, usuario_solicitante_id) VALUES
(1, 2, 'Pendiente', '2025-07-01', 1),  -- Eric ofrece su bicicleta a cambio de la mesa de Ana
(3, 5, 'Pendiente', '2025-07-02', 3),  -- Luis ofrece su notebook por la cafetera de Carlos
(6, 4, 'Pendiente', '2025-07-03', 1),  -- Eric ofrece herramientas por la campera de María
(7, 8, 'Pendiente', '2025-07-04', 2),  -- Ana ofrece sus zapatillas por el celular de Luis
(9, 10, 'Pendiente', '2025-07-05', 5), -- Carlos ofrece heladera por la silla de Sofía
(11, 6, 'Pendiente', '2025-07-06', 7), -- Julián ofrece patineta por herramientas de Eric
(13, 3, 'Pendiente', '2025-07-07', 9), -- Matías ofrece monitor por notebook de Luis
(12, 14, 'Pendiente', '2025-07-08', 8),-- Valentina ofrece guitarra por lavarropas de Camila
(15, 16, 'Pendiente', '2025-07-09', 5),-- Carlos ofrece libro por impresora de Sofía    
(18, 17, 'Pendiente', '2025-07-10', 8);-- Valentina ofrece zapatillas Adidas por ollas de Julián



