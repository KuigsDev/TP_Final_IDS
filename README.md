# TP_Final_IDS

Base de datos:
1. Usuario
- id (auto)
- nombre
- email
- clave
- ubicación
- reputación

Relaciones:

- Tiene muchos productos
- Tiene muchas propuestas de trueque

2. Producto
- id (auto)
- nombre
- descripción
- categoría
- estado (nuevo, usado, etc.)
- fecha_publicación
- usuario_id (FK → Usuario)

Relaciones:

- Pertenece a un usuario
- Participa en una o más propuestas de trueque

3. Propuesta de Trueque
- id (auto)
- producto_ofrecido_id (FK → Producto)
- producto_deseado_id (FK → Producto)
- estado (pendiente, aceptado, rechazado)
- fecha_propuesta
- usuario_solicitante_id (FK → Usuario)

Relaciones:

- Relaciona dos productos (ofrecido y deseado)
- Es creada por un usuario

Frontend:

1. Inicio (Home):
- Presentación del sitio, botón para registrarse / loguearse.
- Listado de productos más recientes.

2. Mis Productos / Panel de Usuario:
- Ver productos del usuario actual.
- CRUD de productos (crear, editar, eliminar, ver).
- Ver propuestas de trueque realizadas y recibidas.

3. Explorar Productos:
- Filtro por categoría, ubicación, etc.
- Botón para proponer un trueque.
- CRUD de propuestas desde cada producto.