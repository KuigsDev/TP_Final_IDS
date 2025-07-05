create table usuarios(
    id serial primary key,
    nombre varchar(50) not null,
    mail varchar(50) not null,
    clave varchar(16) not null,
    ubicacion varchar(500) not null,
    reputacion int not null,
    imagen varchar(100)
);
create table producto(  
    id serial primary key,
    nombre varchar(50) not null,
    descripcion varchar(255) not null,
    categoria varchar(50) not null,
    estado varchar(50) not null,
    fecha_publicacion date not null,
    imagen varchar(100),
    usuario_id int REFERENCES usuarios (id) not null
);
create table trueque(
    id serial primary key,
    producto_ofrecido_id int REFERENCES producto (id) not null,
    producto_deseado_id int REFERENCES producto (id) not null,
    estado varchar(50) not null,
    fecha date not null,
    usuario_solicitante_id int REFERENCES usuarios (id) not null
);

INSERT INTO usuarios(nombre, mail, clave, ubicacion, reputacion, imagen) VALUES
('Eric Rodriguez', 'eric_rodriguez@gmail.com', '123456', 'Flores', 3, 'eric.jpg'),
('Ana Torres', 'ana_torres@gmail.com', 'abcdef', 'Palermo', 4, 'ana.jpg'),
('Luis Pérez', 'luis_perez@hotmail.com', 'luis123', 'Belgrano', 5, 'luis.jpg'),
('María García', 'maria.garcia@yahoo.com', 'maria456', 'Recoleta', 2, 'maria.jpg'),
('Carlos López', 'carlos.lopez@gmail.com', 'qwerty', 'Caballito', 4, 'carlos.jpg'),
('Sofía Martínez', 'sofia_mtz@gmail.com', 'sofia789', 'Villa Urquiza', 5, 'sofia.jpg'),
('Julián Fernández', 'julianf@hotmail.com', 'julian321', 'Almagro', 3, 'julian.jpg'),
('Valentina Gómez', 'valentina@gmail.com', 'valen123', 'Villa Crespo', 4, 'valentina.jpg'),
('Matías Ramírez', 'matias.ramirez@gmail.com', 'matias456', 'Once', 2, 'matias.jpg'),
('Camila Herrera', 'camiherrera@yahoo.com', 'camila654', 'San Telmo', 5, 'camila.jpg');

INSERT INTO producto(nombre, descripcion, categoria, estado, fecha_publicacion, imagen, usuario_id) VALUES
('Bicicleta', 'Bicicleta de montaña en buen estado', 'Deportes', 'Usado', '2025-06-01', 'bicicleta.jpg', 1),
('Mesa de madera', 'Mesa de comedor para 6 personas', 'Muebles', 'Usado', '2025-06-02', 'mesa.jpg', 2),
('Notebook Lenovo', 'Laptop Lenovo i5, 8GB RAM, SSD', 'Electrónica', 'Usado', '2025-06-03', 'notebook.jpg', 3),
('Campera de cuero', 'Campera talle M, poco uso', 'Ropa', 'Usado', '2025-06-04', 'campera.jpg', 4),    
('Cafetera Philips', 'Cafetera nueva sin abrir', 'Electrodomésticos', 'Nuevo', '2025-06-05', 'cafetera.jpg', 5),
('Juego de herramientas', 'Set completo de herramientas manuales', 'Hogar', 'Usado', '2025-06-06', 'herramientas.jpg', 1),
('Zapatillas Nike', 'Zapatillas originales, talle 42', 'Calzado', 'Usado', '2025-06-07', 'nike.jpg', 2),
('Celular Samsung A52', 'Smartphone libre con funda incluida', 'Electrónica', 'Usado', '2025-06-08', 'celular.jpg', 3),
('Heladera Whirlpool', 'Heladera con freezer, buen funcionamiento', 'Electrodomésticos', 'Usado', '2025-06-09', 'heladera.jpg', 5),
('Silla Gamer', 'Silla ergonómica reclinable, color negro/rojo', 'Muebles', 'Usado', '2025-06-10', 'silla_gamer.jpg', 6),
('Patineta Eléctrica', 'Scooter plegable con batería nueva', 'Transporte', 'Nuevo', '2025-06-11', 'patineta.jpg', 7),
('Guitarra Criolla', 'Guitarra de madera clásica, incluye funda', 'Instrumentos', 'Usado', '2025-06-12', 'guitarra.jpg', 8),
('Monitor LG 24"', 'Monitor Full HD en excelente estado', 'Electrónica', 'Usado', '2025-06-13', 'monitor.jpg', 9),
('Lavarropas Samsung', 'Carga frontal, capacidad 7kg', 'Electrodomésticos', 'Usado', '2025-06-14', 'lavarropas.jpg', 10),
('Libro "1984"', 'Edición en español, tapa blanda', 'Libros', 'Usado', '2025-06-15', 'libro_1984.jpg', 5),
('Impresora HP', 'Impresora multifunción con escáner', 'Oficina', 'Usado', '2025-06-16', 'impresora.jpg', 6),
('Set de ollas Tramontina', 'Juego de 5 piezas de acero inoxidable', 'Cocina', 'Nuevo', '2025-06-17', 'ollas.jpg', 7),
('Zapatillas Adidas', 'Modelo RunFalcon, talle 43, poco uso', 'Calzado', 'Usado', '2025-06-18', 'adidas.jpg', 8);

INSERT INTO trueque (producto_ofrecido_id, producto_deseado_id, estado, fecha, usuario_solicitante_id) VALUES
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



