create table usuarios(
    id serial primary key,
    nombre varchar(50) not null,
    mail varchar(50) not null,
    clave varchar(16) not null,
    ubicacion varchar(500) not null,
    reputacion int not null
);
create table producto(
    id serial primary key,
    nombre varchar(50) not null,
    descripcion varchar(255) not null,
    categoria varchar(50) not null,
    estado varchar(50) not null,
    fecha_publicacion date not null,
    usuario_id int REFERENCES usuario (id) not null
);
create table trueque(
    id serial primary key,
    producto_ofrecido_id int REFERENCES producto (id) not null,
    producto_deseado_id int REFERENCES producto (id) not null,
    estado varchar(50) not null,
    fecha date not null,
    usuario_solicitante_id int REFERENCES usuario (id) not null
);

INSERT INTO usuarios(nombre, mail, clave, ubicacion, reputacion) VALUES
('Eric Rodriguez', 'eric_rodriguez@gmail.com', '123456', 'Flores', 3),
('Ana Torres', 'ana_torres@gmail.com', 'abcdef', 'Palermo', 4),
('Luis Pérez', 'luis_perez@hotmail.com', 'luis123', 'Belgrano', 5),
('María García', 'maria.garcia@yahoo.com', 'maria456', 'Recoleta', 2),
('Carlos López', 'carlos.lopez@gmail.com', 'qwerty', 'Caballito', 4),
('Sofía Martínez', 'sofia_mtz@gmail.com', 'sofia789', 'Villa Urquiza', 5),
('Julián Fernández', 'julianf@hotmail.com', 'julian321', 'Almagro', 3),
('Valentina Gómez', 'valentina@gmail.com', 'valen123', 'Villa Crespo', 4),
('Matías Ramírez', 'matias.ramirez@gmail.com', 'matias456', 'Once', 2),
('Camila Herrera', 'camiherrera@yahoo.com', 'camila654', 'San Telmo', 5);

INSERT INTO producto(nombre, descripcion, categoria, estado, fecha_publicacion, usuario_id) VALUES
('Bicicleta', 'Bicicleta de montaña en buen estado', 'Deportes', 'Usado', '2025-06-01', 1),
('Mesa de madera', 'Mesa de comedor para 6 personas', 'Muebles', 'Usado', '2025-06-02', 2),
('Notebook Lenovo', 'Laptop Lenovo i5, 8GB RAM, SSD', 'Electrónica', 'Usado', '2025-06-03', 3),
('Campera de cuero', 'Campera talle M, poco uso', 'Ropa', 'Usado', '2025-06-04', 4),    
('Cafetera Philips', 'Cafetera nueva sin abrir', 'Electrodomésticos', 'Nuevo', '2025-06-05', 5),
('Juego de herramientas', 'Set completo de herramientas manuales', 'Hogar', 'Usado', '2025-06-06', 1),
('Zapatillas Nike', 'Zapatillas originales, talle 42', 'Calzado', 'Usado', '2025-06-07', 2),
('Celular Samsung A52', 'Smartphone libre con funda incluida', 'Electrónica', 'Usado', '2025-06-08', 3),
('Heladera Whirlpool', 'Heladera con freezer, buen funcionamiento', 'Electrodomésticos', 'Usado', '2025-06-09', 5),
('Silla Gamer', 'Silla ergonómica reclinable, color negro/rojo', 'Muebles', 'Usado', '2025-06-10', 6),
('Patineta Eléctrica', 'Scooter plegable con batería nueva', 'Transporte', 'Nuevo', '2025-06-11', 7),
('Guitarra Criolla', 'Guitarra de madera clásica, incluye funda', 'Instrumentos', 'Usado', '2025-06-12', 8),
('Monitor LG 24"', 'Monitor Full HD en excelente estado', 'Electrónica', 'Usado', '2025-06-13', 9),
('Lavarropas Samsung', 'Carga frontal, capacidad 7kg', 'Electrodomésticos', 'Usado', '2025-06-14', 10),
('Libro "1984"', 'Edición en español, tapa blanda', 'Libros', 'Usado', '2025-06-15', 5),
('Impresora HP', 'Impresora multifunción con escáner', 'Oficina', 'Usado', '2025-06-16', 6),
('Set de ollas Tramontina', 'Juego de 5 piezas de acero inoxidable', 'Cocina', 'Nuevo', '2025-06-17', 7),
('Zapatillas Adidas', 'Modelo RunFalcon, talle 43, poco uso', 'Calzado', 'Usado', '2025-06-18', 8);     

