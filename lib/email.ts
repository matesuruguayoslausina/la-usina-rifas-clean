import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendConfirmationEmail(to: string, data: { title: string; numbers: number[]; amount: number; orderId: string }) {
  const from = process.env.EMAIL_FROM || "matesuruguayoslausina@gmail.com";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif">
      <h2>¡Tus números ya son tuyos! 🎉</h2>
      <p>Rifa: <b>${data.title}</b></p>
      <p>Números: <b>${data.numbers.join(", ")}</b></p>
      <p>Importe: <b>$${(data.amount/100).toLocaleString('es-AR')}</b> ARS</p>
      <p>Orden: ${data.orderId}</p>
      <p>¡Gracias por participar!</p>
    </div>
  `;
  await resend.emails.send({ from, to, subject: `Confirmación de compra – ${data.title}`, html });
}
