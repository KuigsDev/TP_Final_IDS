create table empresa (id serial primary key,nombre VARCHAR(50) not null,email VARCHAR(50) not null,direccion VARCHAR(50) not null,intereses VARCHAR(255),reputacion VARCHAR(50));

create table objeto (
id serial primary key,
titulo VARCHAR(50) not null,
descripcion VARCHAR(255) not null,
categoria VARCHAR(50) not null,
estado VARCHAR(50),
empresa_id INT not null,
CONSTRAINT fk_empresa
	FOREIGN KEY (empresa_id)
	REFERENCES empresa(id)
	ON DELETE CASCADE
);