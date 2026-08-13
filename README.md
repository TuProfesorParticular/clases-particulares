# Plataforma de Clases Particulares — MVP

Base del proyecto descrito en [`MVP-plataforma-clases-particulares.md`](./MVP-plataforma-clases-particulares.md).

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma/PostgreSQL + Auth.js**.

## Estructura

```
prisma/schema.prisma            Modelo de datos (users, teacher_profiles, subjects, conversations, messages...)
prisma/seed.ts                  Seed de materias (subjects)
scripts/seed-demo-teacher.ts    Crea un profesor de ejemplo ya aprobado
scripts/seed-admin.ts           Crea un usuario admin de prueba
src/lib/prisma.ts               Cliente de Prisma (driver adapter @prisma/adapter-pg)
src/lib/auth.ts                 Configuración de Auth.js (Credentials + Google opcional)
src/lib/auth-helpers.ts         requireSession()/requireRole() para proteger páginas
src/lib/mailer.ts               Envío de emails (Resend; cae a console.log sin RESEND_API_KEY)
src/lib/teachers.ts             Consultas de búsqueda/perfil de profesores
src/lib/messages.ts             Consultas de conversaciones/mensajes
src/app/page.tsx                Búsqueda y listado (home)
src/app/profesores/[id]/        Perfil público de profesor + botón "Contactar"
src/app/registro/               Registro (alumno/profesor)
src/app/iniciar-sesion/         Login
src/app/recuperar-contrasena/   Solicitud de recuperación de contraseña
src/app/restablecer-contrasena/ Formulario para fijar nueva contraseña
src/app/verificar-email/        Confirmación de email vía token
src/app/panel/perfil/           Edición del anuncio del profesor (foto, materias, precio...)
src/app/panel/mensajes/         Bandeja de entrada y conversaciones
src/app/admin/                  Aprobar/rechazar anuncios, suspender usuarios
```

## Puesta en marcha

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Configura la base de datos. Para desarrollo local, Prisma incluye un Postgres embebido que no requiere instalar nada:

   ```bash
   npx prisma dev
   ```

   Copia la cadena de conexión que imprime y colócala en `.env` como `DATABASE_URL` (ver `.env.example`).
   Para producción, usa Supabase o Railway (capa gratuita) tal como propone el documento del MVP.

3. Aplica el esquema y siembra datos:

   ```bash
   npm run db:migrate   # crea las tablas
   npm run db:seed       # carga el catálogo de materias
   npx tsx scripts/seed-demo-teacher.ts   # (opcional) profesor de ejemplo aprobado
   npx tsx scripts/seed-admin.ts          # (opcional) admin@example.com / password123
   ```

4. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Emails en desarrollo

Sin `RESEND_API_KEY` configurada, los emails (verificación, recuperación de contraseña, aviso de
nuevo mensaje) se imprimen por consola en vez de enviarse — busca `[mailer]` en el log del
servidor y copia el enlace manualmente. Para envíos reales, crea una cuenta en
[resend.com](https://resend.com), añade `RESEND_API_KEY` y `EMAIL_FROM` a `.env`.

## Fotos de perfil

La subida de avatar en `/panel/perfil` guarda el archivo en `public/uploads/avatars/` (solo
válido en desarrollo local; en la mayoría de hostings serverless el sistema de archivos no es
persistente). Para producción, sustituir por Supabase Storage o Cloudinary tal como propone el
documento del MVP.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migraciones de Prisma |
| `npm run db:seed` | Siembra el catálogo de materias |
| `npm run db:studio` | Abre Prisma Studio para inspeccionar los datos |

## Qué falta (siguientes pasos)

Funcionalmente el MVP descrito en el documento está completo (búsqueda, perfil de profesor,
registro/login, edición de anuncio, mensajería interna, verificación de email, recuperación de
contraseña, panel de admin). Queda pendiente, para pasar de este scaffold a producción:

- Desplegar en Vercel + base de datos real (Supabase/Railway) — ver sección siguiente
- Conectar `RESEND_API_KEY` para el envío real de emails
- Sustituir la subida local de avatares por Supabase Storage o Cloudinary
- Revisar textos legales (términos, privacidad) antes de abrir el registro al público
