# Trueque Libre - TP Final IDS

Este es un proyecto de intercambio de productos llamado **Trueque Libre**, desarrollado como trabajo final para la materia **Introducción a Ingeniería de Software**.

## Contenidos

- [Tecnologías usadas](#tecnologías-usadas)
- [Instrucciones para correr el proyecto](#instrucciones-para-correr-el-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [Funcionalidades del Frontend](#funcionalidades-del-frontend)

---
## Tecnologías usadas

- **Frontend:** HTML, CSS, JavaScript
- **Servidor web:** Nginx
- **Backend:** Node.js, Express, Multer 
- **Base de datos:** PostgreSQL
- **Docker:** Para contenerización y despliegue local
---
## Instrucciones para correr el proyecto

Asegúrate de tener **Docker** y **Docker Compose** instalados. Luego, en la raíz del proyecto, ejecutá:

```bash
docker compose up --build
```
---
##  Modelo de Datos

### 1. Usuario

**Campos:**
- `id`: Identificador único (autoincremental)
- `nombre`
- `email`
- `clave`
- `ubicación`
- `reputación`
- `imagen`

**Relaciones:**
- Tiene muchos objetos
- Tiene muchas propuestas de trueque

---

### 2. Objetos

**Campos:**
- `id`
- `nombre`
- `descripción`
- `categoría`
- `estado` (nuevo, usado, etc.)
- `fecha_publicación`
- `imagen`
- `usuario_id` (FK → Usuario)

**Relaciones:**
- Pertenece a un usuario
- Participa en una o más propuestas de trueque

---

### 3. Trueques

**Campos:**
- `id`
- `objeto_ofrecido_id` (FK → Producto)
- `objeto_deseado_id` (FK → Producto)
- `estado` (pendiente, aceptado, rechazado)
- `fecha_propuesta`
- `usuario_solicitante_id` (FK → Usuario)

**Relaciones:**
- Relaciona dos objetos
- Es creada por un usuario

**Notas adicionales:**
- Al eliminar un usuario, sus objetos y trueques asociados también se eliminan (`ON DELETE CASCADE`).
- El estado inicial de cada trueque es `"Pendiente"`.

## Datos de ejemplo

La base de datos viene con datos precargados. Por ejemplo:

- Usuario: `Eric Rodriguez` (email: `eric_rodriguez@gmail.com`)
- Objeto: `Bicicleta de montaña`
- Trueque: Eric ofrece su bicicleta a cambio de la `Mesa de madera` de Ana.

Esto facilita las pruebas iniciales del sistema.

---
## Funcionalidades del Frontend

### Inicio
- Presentación del sitio.
- Listado de productos más recientes.

### Panel de Usuario
- Ver productos del usuario actual.
- Crear, editar y eliminar productos.
- Ver propuestas de trueque realizadas y recibidas.
- Crear, editar y eliminar propuestas de trueque.

### Usuarios
- Ver listado completo de usuarios registrados.
- Registro de nuevos usuarios.
---
## Autores

- Joaquin Nahuel Ruiz – Padrón/Legajo: 113980
- Lautaro Ignacio Arias – Padrón/Legajo: 113870
- Axel Julian Gonzalez - Padrón/Legajo: 114001
