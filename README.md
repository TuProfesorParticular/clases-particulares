# TuProfesorParticular — MVP

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

La subida de avatar en `/panel/perfil` usa Supabase Storage (bucket público `avatars`, creado con
`npx tsx scripts/setup-storage.ts`). Necesita `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el
entorno (ver `.env.example`) — sin ellas, la subida falla con un error explícito.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migraciones de Prisma |
| `npm run db:seed` | Siembra el catálogo de materias |
| `npm run db:studio` | Abre Prisma Studio para inspeccionar los datos |

## Producción

- **URL en vivo**: https://tuprofesorparticular.vercel.app
- **Hosting**: Vercel, proyecto `tu-profesor-particular/tuprofesorparticular`
- **Base de datos**: Supabase (Postgres), proyecto `clases-particulares` (nombre interno en Supabase, sin efecto visible)
- **Emails**: Resend, remitente `onboarding@resend.dev` (dominio de pruebas — ver más abajo)
- **Repositorio**: https://github.com/TuProfesorParticular/tuprofesorparticular

Variables de entorno configuradas en Vercel (Production): `DATABASE_URL`, `DIRECT_URL`,
`AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `APP_URL`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`.

El repositorio de GitHub está conectado a Vercel: cada `git push` a `main` despliega solo. Para
forzar un despliegue manual:

```bash
npx vercel deploy --prod
```

Si se cambia el esquema de Prisma, aplicar la migración también en producción antes de desplegar:

```bash
DATABASE_URL="<DIRECT_URL de Supabase>" npx prisma migrate deploy
```

⚠️ **`tuprofesorparticular.vercel.app` no se actualiza automáticamente en cada nuevo despliegue** —
es un alias manual, no el dominio por defecto del proyecto. Tras cada deploy (automático o
manual), hay que re-apuntarlo al último:

```bash
npx vercel ls   # copia la URL "Ready" más reciente
npx vercel alias set <esa-url> tuprofesorparticular.vercel.app
```

Esto deja de ser necesario en cuanto se conecte un dominio propio comprado (ver "Qué falta").

## Qué falta (siguientes pasos)

Funcionalmente el MVP descrito en el documento está completo y desplegado (búsqueda, perfil de
profesor, registro/login, edición de anuncio, mensajería interna, verificación de email,
recuperación de contraseña, panel de admin). Pendiente, cuando quieras ir más allá del MVP:

- Comprar un dominio propio y verificarlo en Resend, para poder enviar emails a cualquier
  alumno/profesor (ahora mismo solo llegan a `carlosalazarguzman@gmail.com`, la cuenta de prueba
  de Resend) y usarlo también como dominio de la web en vez de `*.vercel.app`
- Revisar textos legales (términos, privacidad) antes de abrir el registro al público
