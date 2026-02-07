# 🛒 API de Gestión de Productos

## 📋 ¿Qué hace este proyecto?

Esta es una API REST simple que permite gestionar un catálogo de productos. Puedes crear, ver, actualizar y eliminar productos. Los datos se guardan en un archivo JSON.

## 🚀 Tecnologías

- **Node.js** - Para ejecutar JavaScript en el servidor
- **Express** - Framework para crear la API
- **File System (fs)** - Para guardar datos en archivos JSON

## 📦 Instalación

1. Clona el proyecto
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor:
```bash
npm start
```

El servidor corre en `http://localhost:8080`

## 🔌 Endpoints

- `GET /api/products` - Ver todos los productos
- `GET /api/products/:id` - Ver un producto específico
- `POST /api/products` - Crear un producto nuevo
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

## 📝 Ejemplo de Producto
```json
{
    "title": "Laptop",
    "description": "Laptop gamer",
    "code": "LAP001",
    "price": 1500,
    "stock": 10,
    "category": "Electrónica"
}
