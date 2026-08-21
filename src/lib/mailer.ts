import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM || "no-reply@tuprofesorparticular.com";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[mailer] RESEND_API_KEY no configurada. Email simulado:
  Para: ${to}
  Asunto: ${subject}
  ${html}`);
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html });
}

export function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verificar-email?token=${token}&email=${encodeURIComponent(email)}`;
  return sendEmail(
    email,
    "Verifica tu email — TuProfesorParticular",
    `<p>Confirma tu cuenta haciendo clic en el siguiente enlace:</p><p><a href="${url}">${url}</a></p>`,
  );
}

export function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/restablecer-contrasena?token=${token}`;
  return sendEmail(
    email,
    "Recupera tu contraseña — TuProfesorParticular",
    `<p>Haz clic en el siguiente enlace para elegir una nueva contraseña (caduca en 1 hora):</p><p><a href="${url}">${url}</a></p>`,
  );
}

export function sendNewMessageEmail(
  email: string,
  senderName: string,
  conversationUrl: string,
) {
  return sendEmail(
    email,
    `Nuevo mensaje de ${senderName} — TuProfesorParticular`,
    `<p>${senderName} te ha enviado un mensaje.</p><p><a href="${conversationUrl}">Ver conversación</a></p>`,
  );
}
