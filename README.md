# 🍽️ Resto Gestor Gastronómico

**Resto Gestor Gastronómico** es un sistema integral desarrollado para optimizar y digitalizar la operación de restaurantes, bares, franquicias y food trucks. El sistema permite gestionar pedidos mediante un agente virtual con IA, comandas en tiempo real, administración de mesas, cierre de caja y mucho más.

---

## 🚀 Funcionalidades principales

- 🤖 Agente virtual inteligente para tomar pedidos por texto o voz.
- 📋 Gestión de comandas conectadas a mesas físicas.
- 🔊 Reconocimiento y síntesis de voz en el frontend.
- 📱 Menú digital QR interactivo para los clientes.
- 🧾 Módulo de cierre de caja y control de arqueos.
- 👥 Gestión de usuarios y roles con autenticación JWT.
- 🔄 Comunicación en tiempo real con WebSockets (Socket.IO).

---

## 🛠️ Tecnologías utilizadas

### Frontend
- React
- TailwindCSS
- Web Speech API (voz a texto y texto a voz)

### Backend
- Node.js + Express
- Sequelize (ORM)
- JWT para autenticación
- Socket.IO (actualización en tiempo real)

### Inteligencia Artificial
- Google Gemini API (`gemini-2.0-flash`)
  - Comprensión del lenguaje natural
  - Detección de productos, confirmación de pedidos
  - Respuestas amigables y naturales

### Base de datos (Sequelize ORM)
- Modelos: `Comanda`, `MenuItem`, `ComandaItem`, `Mesa`, `Usuario`

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/resto-gestor-gastronomico.git
cd resto-gestor-gastronomico
```

### 2. Instalar dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Variables de entorno (`.env` backend)
```env
GOOGLE_API_KEY=tu_api_key_de_gemini
JWT_SECRET=una_clave_segura
DB_NAME=nombre_base
DB_USER=usuario
DB_PASS=contraseña
DB_HOST=localhost
```

### 4. Migraciones y seeders
```bash
npx sequelize db:migrate
npx sequelize db:seed:all
```

### 5. Iniciar servidor

#### Backend
```bash
npm run dev
```

#### Frontend
```bash
npm start
```

---

## 📌 Notas

- El sistema distingue mesas por ID y mantiene el contexto del pedido.
- Chat bloqueado automáticamente tras confirmación de pedido.
- Ideal para entornos físicos con tablets o terminales en cada mesa.
- IA personalizada para no pedir dirección ni asumir delivery.

---

## 📄 Licencia

MIT License

---

## ✉️ Contacto

Desarrollado por Justina Navarro Ocampo  
