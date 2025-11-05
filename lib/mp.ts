import MercadoPago from "mercadopago";

export const mp = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
