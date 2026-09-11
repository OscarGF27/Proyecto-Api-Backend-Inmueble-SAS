CREATE TABLE rol (
rol_id SERIAL PRIMARY KEY,
nombre_rol VARCHAR(30) NOT NULL CHECK (nombre_rol IN ('admin','cliente','encargado_productos'))
);

CREATE TABLE personas(
personas_id SERIAL PRIMARY KEY,
nombre VARCHAR(70) NOT NULL,
apellido VARCHAR(70) NOT NULL,
correo VARCHAR(254) UNIQUE NOT NULL CHECK(correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
contrasena VARCHAR(255) NOT NULL,
rol_id INTEGER NOT NULL REFERENCES rol(rol_id) 

);

CREATE TABLE direccion (
    direccion_id SERIAL PRIMARY KEY,
    personas_id INTEGER NOT NULL REFERENCES personas(personas_id),
    lugar VARCHAR(30),
    direccion VARCHAR(255) NOT NULL,
    municipio VARCHAR(70) NOT NULL CHECK (municipio IN ('Barbosa','Girardota','Copacabana','Bello','Medellin','Envigado', 'Itagui','Sabaneta','La estrella','Caldas'))

);

CREATE TABLE categoria (
categoria_id SERIAL PRIMARY KEY,
nombre_categoria VARCHAR(70) NOT NULL CHECK(nombre_categoria IN ('mueble','comedor','closet'))

);

CREATE TABLE producto(
producto_id SERIAL PRIMARY KEY,
color VARCHAR(30) NOT NULL,
descripcion_producto TEXT NOT NULL,
precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
cantidad INTEGER NOT NULL CHECK(cantidad>=0),
categoria_id INTEGER NOT NULL REFERENCES categoria(categoria_id),
sku_codigo VARCHAR(50) UNIQUE NOT NULL,
estado BOOLEAN NOT NULL DEFAULT TRUE

);

CREATE TABLE compra(
compra_id SERIAL PRIMARY KEY,
personas_id INTEGER NOT NULL REFERENCES personas(personas_id),
direccion_id INTEGER REFERENCES direccion(direccion_id),
fecha_compra TIMESTAMPTZ DEFAULT NOW(),
canal VARCHAR(30) NOT NULL CHECK (canal IN('presencial','virtual')),
total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
estado VARCHAR(70)NOT NULL CHECK (estado IN('pendiente','pagada','cancelada'))

);

CREATE TABLE detalle_compra(
detalle_id SERIAL PRIMARY KEY,
compra_id INTEGER NOT NULL REFERENCES compra(compra_id),
producto_id INTEGER NOT NULL REFERENCES producto(producto_id),
cantidad INTEGER NOT NULL CHECK (cantidad > 0),
precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0)

);