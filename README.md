# La Usina Rifas (Clean ZIP)

MVP con reservas de 10 minutos, pago con Mercado Pago (ARS) y email de confirmación (Resend).

## Deploy rápido en Vercel
1. Subí este repo a GitHub (con **GitHub Desktop**, así mantiene carpetas).
2. En Vercel → **New Project** → Importá el repo.
3. Variables de entorno (Settings → Environment Variables):
   - `DATABASE_URL` (Postgres con `?sslmode=require`)
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `MP_ACCESS_TOKEN`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXTAUTH_SECRET`
   - `CURRENCY=ARS`
   - `BRAND_NAME="La Usina Rifas"`
4. Primer deploy.
5. Seteá `NEXT_PUBLIC_BASE_URL` con la URL que te da Vercel y redeploy.

## Crear rifa
- Ir a `/admin` → completar formulario → crear.
- Ver rifa en `/rifa/TU-SLUG`.

## Webhook de Mercado Pago
- Pegá en MP → Webhooks: `https://TU_DOMINIO/api/mp/webhook` (evento: `payment`).

> Este MVP no incluye autenticación de admin ni validación completa del webhook (para producción conviene consultar el pago a MP y validar `status=approved`).

