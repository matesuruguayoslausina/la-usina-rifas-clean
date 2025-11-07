import { MercadoPagoConfig, Preference } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("Falta MP_ACCESS_TOKEN en variables de entorno");
}

export const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Cliente para crear preferencias de pago
export const preferenceClient = new Preference(mpConfig);
