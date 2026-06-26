# Consorcio365

Sistema web integral para la gestión de edificios y consorcios. Permite administrar unidades, incidencias, trabajos, mantenimientos preventivos, gastos, avisos y documentación, con tres perfiles de usuario diferenciados (Administrador, Ocupante y Proveedor).

## Aplicación desplegada

La aplicación se encuentra disponible online en:

- **Frontend (Vercel):** https://consorcio365.vercel.app
- **Backend (Render):** https://consorcio365.onrender.com

Para evaluar el sistema no es necesario instalar nada localmente: basta con ingresar al link del frontend y utilizar las credenciales de prueba que se detallan más abajo.

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@consorcio365.com | Admin1234! |
| Ocupante | juan@mail.com | Cambiar123! |
| Proveedor | carlos.plomero@mail.com | Cambiar123! |

Estos usuarios son de prueba y se cargan automáticamente mediante el seed inicial.

## 🛠️ Stack tecnológico

### Frontend
- React + Vite
- React Router DOM 7
- Tailwind CSS
- Axios para llamadas a la API
- React Hot Toast para notificaciones
- Socket.IO Client para notificaciones en tiempo real
- Lucide React para iconografía

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT para autenticación con RBAC (control de acceso por roles)
- Multer + Cloudinary para gestión de archivos
- Brevo API (vía Axios) para envío de mails (recuperación de contraseña)
- Socket.IO para tiempo real
- Bcrypt para hash de contraseñas

### Infraestructura
- **Frontend:** desplegado en Vercel
- **Backend:** desplegado en Render
- **Base de datos:** MongoDB Atlas (cloud)
- **Almacenamiento de archivos:** Cloudinary

## 📁 Estructura del repositorio

```
Consorcio365/
├── backend/                  # API REST en Node.js + Express
│   ├── src/
│   │   ├── config/           # Conexión a DB y Cloudinary
│   │   ├── middlewares/      # Auth, roles, manejo de errores
│   │   ├── models/           # Esquemas de Mongoose
│   │   ├── modules/          # Lógica por dominio (auth, unidades, etc.)
│   │   ├── seeds/            # Scripts de carga inicial
│   │   ├── sockets/          # Configuración de Socket.IO
│   │   └── utils/            # Helpers (JWT, mailer, uploads)
│   ├── server.js
│   └── package.json
│
├── frontend/                 # SPA en React + Vite
│   ├── src/
│   │   ├── components/       # Componentes reutilizables por dominio
│   │   ├── pages/            # Páginas por rol (admin, ocupante, proveedor)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Llamadas a la API (axios)
│   │   ├── context/          # Auth y Socket Context
│   │   ├── layouts/          # Layouts compartidos
│   │   └── utils/            # Helpers, formatters, toasts
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Cómo ejecutar el proyecto localmente

### Requisitos previos
- Node.js v18 o superior
- npm v9 o superior
- Cuenta de MongoDB Atlas (o MongoDB local)
- Cuenta de Cloudinary (opcional, para subida de archivos)
- Cuenta de Brevo con un sender verificado (opcional, para envío de mails)

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/MarinaOliva/Consorcio365.git
cd Consorcio365
```

### 2️⃣ Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en `/backend` con el siguiente contenido (basado en `.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/consorcio365
JWT_SECRET=tu_secreto_super_seguro
FRONTEND_URL=http://localhost:5173

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mail (opcional)
BREVO_API_KEY=tu_api_key_de_brevo
MAIL_SENDER=tu_email_verificado_en_brevo@gmail.com
```

Poblar la base de datos con datos de prueba:

```bash
node src/seeds/seed.js
```

Levantar el servidor:

```bash
npm run dev
```

El backend quedará disponible en `http://localhost:3000`.

### 3️⃣ Configurar el frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear un archivo `.env` en `/frontend` con:

```env
VITE_API_URL=http://localhost:3000/api
```

Para usar el backend deployado en Render en lugar del local:

```env
VITE_API_URL=https://consorcio365.onrender.com/api
```

> **Nota:** el backend en Render tiene CORS restringido al dominio de Vercel por seguridad, por lo que esto no funcionará para desarrollo local. Para uso local completo, levantar también el backend.

Levantar el frontend:

```bash
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

## Base de datos

El sistema utiliza **MongoDB Atlas** como base de datos NoSQL.

### Modelos principales
- **Usuario** — datos personales, rol y credenciales
- **Edificio** — información de cada consorcio
- **Unidad** — departamentos / cocheras con historial de ocupación
- **Incidencia** — reclamos de los ocupantes
- **Trabajo** — tareas asignadas a proveedores (vinculadas a incidencias o mantenimientos)
- **Gasto** — libro de expensas
- **PlanMantenimiento + InstanciaMantenimiento** — mantenimiento preventivo
- **Aviso** — comunicados de la administración
- **Documento** — archivos compartidos

### Trazabilidad central

```
Gasto → Trabajo → Incidencia / Instancia de Mantenimiento → Edificio
```

## Pruebas

El proyecto incluye:
- **Pruebas unitarias** sobre validaciones y funciones de negocio (Jest)
- **Pruebas de integración** sobre flujos end-to-end (Selenium / Cypress)

Para ejecutar los tests del backend:

```bash
cd backend
npm test
```
