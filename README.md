# 🛒 Servidor Express + Node.js — Gestión de Productos y Carritos

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-7.x-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)

> Proyecto final del curso de Node.js en CoderHouse. API REST completa para gestión de productos y carritos de compra, con persistencia en MongoDB, vistas dinámicas con Handlebars y actualización en tiempo real con WebSockets.

---

## 📁 Estructura del Proyecto

```
Jhon_Fredy_Entrega_1/
│
├── server.js                   # Punto de entrada del servidor
├── package.json
├── .env                        # Variables de entorno (no incluido en el repo)
├── .gitignore
│
├── public/
│   └── css/
│       └── styles.css          # Estilos globales
│
└── src/
    ├── config/
    │   └── db.js               # Conexión a MongoDB
    ├── models/
    │   ├── Product.js          # Modelo Mongoose de productos
    │   └── Cart.js             # Modelo Mongoose de carritos
    ├── managers/
    │   ├── ProductManager.js   # Lógica de negocio de productos
    │   └── CartManager.js      # Lógica de negocio de carritos
    ├── routes/
    │   ├── products.routes.js  # Endpoints /api/products
    │   ├── carts.routes.js     # Endpoints /api/carts
    │   └── views.routes.js     # Rutas de vistas
    └── views/
        ├── layouts/
        │   └── main.handlebars # Layout principal
        ├── index.handlebars        # Lista de productos con paginación
        ├── productDetail.handlebars # Detalle de producto
        ├── cart.handlebars         # Vista del carrito
        ├── realTimeProducts.handlebars # Productos en tiempo real
        └── error.handlebars        # Vista de error
```

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/jhonFDeveloper/Sever_Express_NodeJS.git
cd Sever_Express_NodeJS
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://localhost:27017/tienda
PORT=8080
```

> Para usar MongoDB Atlas reemplazá la URI por tu connection string.

### 4. Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:8080`

---

## 🌐 Vistas disponibles

| Ruta | Descripción |
|------|-------------|
| `/products` | Lista de productos con paginación, filtros y ordenamiento |
| `/products/:pid` | Detalle de un producto con opción de agregar al carrito |
| `/carts/:cid` | Vista del carrito con productos y total |
| `/realtimeproducts` | Lista de productos con actualización en tiempo real vía WebSockets |

---

## 📦 Endpoints de Productos — `/api/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/products` | Listar productos con paginación, filtros y ordenamiento |
| `GET` | `/api/products/:pid` | Obtener un producto por ID |
| `POST` | `/api/products` | Crear un nuevo producto |
| `PUT` | `/api/products/:pid` | Actualizar un producto |
| `DELETE` | `/api/products/:pid` | Eliminar un producto |

### Query params disponibles para `GET /api/products`

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | Number | 10 | Cantidad de productos por página |
| `page` | Number | 1 | Página a consultar |
| `sort` | `asc` / `desc` | — | Ordenar por precio |
| `query` | String | — | Filtrar por categoría o disponibilidad |

### Ejemplo de respuesta

```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 4,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/products?page=2&limit=10"
}
```

---

## 🛒 Endpoints de Carritos — `/api/carts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/carts` | Crear un nuevo carrito |
| `GET` | `/api/carts/:cid` | Obtener carrito con productos completos (populate) |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |
| `PUT` | `/api/carts/:cid` | Reemplazar todos los productos del carrito |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualizar cantidad de un producto |
| `DELETE` | `/api/carts/:cid/products/:pid` | Eliminar un producto del carrito |
| `DELETE` | `/api/carts/:cid` | Vaciar el carrito completo |

---

## ⚡ WebSockets

La vista `/realtimeproducts` utiliza **Socket.io** para actualizar la lista de productos en tiempo real sin necesidad de recargar la página.

| Evento (cliente → servidor) | Descripción |
|-----------------------------|-------------|
| `nuevoProducto` | Crea un producto nuevo |
| `eliminarProducto` | Elimina un producto por ID |

| Evento (servidor → cliente) | Descripción |
|-----------------------------|-------------|
| `actualizarProductos` | Emite la lista actualizada de productos |

---

## 🗄️ Modelos de datos

### Product

```js
{
  title:       String,   // requerido
  description: String,   // requerido
  code:        String,   // requerido, único
  price:       Number,   // requerido
  status:      Boolean,  // default: true
  stock:       Number,   // requerido
  category:    String,   // requerido
  thumbnails:  [String]  // default: []
}
```

### Cart

```js
{
  products: [
    {
      product:  ObjectId,  // referencia a Product
      quantity: Number     // default: 1
    }
  ]
}
```

---

## 🛠️ Tecnologías utilizadas

- **Node.js** — entorno de ejecución
- **Express** — framework web
- **MongoDB** — base de datos NoSQL
- **Mongoose** — ODM para MongoDB
- **mongoose-paginate-v2** — paginación de consultas
- **Socket.io** — comunicación en tiempo real
- **Express-Handlebars** — motor de plantillas
- **dotenv** — manejo de variables de entorno

---

## 👨‍💻 Autor

**Jhon Fredy** — [@jhonFDeveloper](https://github.com/jhonFDeveloper)

Proyecto desarrollado como entrega final del curso de **Backend con Node.js** en [CoderHouse](https://www.coderhouse.com/).
