# Plataforma de Clases Particulares — Definición del MVP

## 1. Objetivo del producto

Conectar a **alumnos** que buscan clases particulares con **profesores** que las ofrecen, replicando el mecanismo de plataformas como Tusclasesparticulares: el profesor publica un anuncio con su materia, precio y zona; el alumno busca, filtra y contacta.

Fase 1 (MVP): validar el modelo con la funcionalidad mínima imprescindible. Nada de pagos integrados, nada de videollamada propia, nada de valoraciones todavía — eso es fase 2.

---

## 2. Roles de usuario

| Rol | Qué puede hacer |
|---|---|
| **Visitante (sin cuenta)** | Buscar y ver anuncios de profesores (perfil público limitado) |
| **Alumno** | Registrarse, buscar/filtrar, contactar profesores, ver historial de conversaciones |
| **Profesor** | Registrarse, crear/editar su anuncio de perfil, recibir y responder mensajes |
| **Admin** | Moderar anuncios, gestionar usuarios reportados, ver métricas básicas |

---

## 3. Funcionalidades del MVP

### 3.1 Autenticación
- Registro por email/contraseña (+ opcional Google OAuth)
- Verificación de email
- Recuperación de contraseña

### 3.2 Perfil de profesor (equivalente al "anuncio")
- Foto de perfil
- Nombre, bio corta (presentación)
- Materia(s) que imparte (de una lista cerrada de categorías, ej. Matemáticas, Inglés, Física...)
- Nivel que imparte (Primaria, ESO, Bachillerato, Universidad, Adultos)
- Modalidad: presencial a domicilio / online / ambas
- Zona (ciudad/código postal) si es presencial
- Precio por hora
- Titulación / experiencia (texto libre en MVP)

### 3.3 Búsqueda y filtrado (la pieza central)
- Buscador por materia + ubicación (o "online")
- Filtros: precio, modalidad, nivel, valoración (placeholder para fase 2)
- Resultados en formato tarjeta (foto, nombre, materia, precio, zona) — igual que el listado de Tusclasesparticulares

### 3.4 Contacto / mensajería
- El alumno contacta al profesor mediante un sistema de mensajes interno (no exponer email/teléfono directamente en el MVP, por seguridad y para poder monetizar en el futuro)
- Bandeja de mensajes simple por usuario

### 3.5 Panel de administración básico
- Aprobar/rechazar anuncios nuevos
- Suspender usuarios reportados

---

## 4. Modelo de datos (esquema relacional)

```
users
├── id (PK)
├── email (unique)
├── password_hash
├── role (enum: student, teacher, admin)
├── name
├── avatar_url
├── created_at

teacher_profiles
├── id (PK)
├── user_id (FK → users.id)
├── bio
├── price_per_hour
├── modality (enum: in_person, online, both)
├── city
├── postal_code
├── experience_text
├── status (enum: pending, approved, rejected)
├── created_at

subjects
├── id (PK)
├── name (ej. "Matemáticas", "Inglés")
├── category (ej. "Idiomas", "Ciencias")

teacher_subjects (tabla puente, un profesor puede dar varias materias)
├── teacher_profile_id (FK)
├── subject_id (FK)
├── level (enum: primaria, eso, bachillerato, universidad, adultos)

conversations
├── id (PK)
├── student_id (FK → users.id)
├── teacher_id (FK → users.id)
├── created_at

messages
├── id (PK)
├── conversation_id (FK)
├── sender_id (FK → users.id)
├── body
├── created_at
```

---

## 5. Stack técnico recomendado

Pensado para que un desarrollador (o tú, si programas) pueda mantenerlo sin infraestructura compleja:

- **Frontend + Backend**: Next.js (React) — una sola base de código, fácil de desplegar
- **Base de datos**: PostgreSQL (ej. gestionado en Supabase o Railway — tienen capa gratuita para arrancar)
- **Autenticación**: Auth.js (NextAuth) o el sistema de auth de Supabase
- **Hosting**: Vercel (frontend/backend) + Supabase/Railway (base de datos)
- **Almacenamiento de imágenes**: Supabase Storage o Cloudinary

Este stack te permite lanzar el MVP con coste cercano a cero al principio, y escalar si el negocio funciona.

---

## 6. Flujo de usuario principal (el "mecanismo")

1. Profesor se registra → crea su perfil/anuncio → queda "pendiente" hasta aprobación admin
2. Alumno entra sin cuenta → busca "Matemáticas" + su ciudad → ve resultados en tarjetas
3. Alumno hace clic en un perfil → ve ficha completa del profesor
4. Alumno pulsa "Contactar" → se le pide registrarse/iniciar sesión si no lo ha hecho
5. Se abre una conversación entre alumno y profesor dentro de la plataforma
6. Profesor recibe notificación (email) de nuevo mensaje

---

## 7. Qué queda fuera del MVP (fase 2+)

- Pagos y comisiones dentro de la plataforma
- Sistema de valoraciones y reseñas
- Videollamada integrada
- App móvil nativa
- Verificación de identidad/titulación de profesores
- Multi-idioma / expansión a otros países

---

## Siguiente paso

Con este documento como base, el siguiente paso natural es crear el repositorio del proyecto (estructura de carpetas, esquema de base de datos real, primeras pantallas) usando **Claude Code**, donde puedo ir construyendo contigo archivo a archivo con contexto completo del proyecto.
