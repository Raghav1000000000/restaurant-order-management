# Deploying to Vercel

1. **Database.** In the Supabase SQL editor, create the tables described in
   [database-schema.md](database-schema.md), then run `docs/add-price-and-feedback.sql`
   and the files in `migrations/` in order (see [migrations/README.md](../migrations/README.md)).
   Run `03_enable_realtime.sql`, or the kitchen screen will not update live.
2. **Project.** Import the repository in Vercel. The framework is detected as Next.js.
3. **Environment variables** (Project Settings -> Environment Variables):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
   | `ADMIN_PASSWORD` | a long, unique password for `/admin` |
   | `KITCHEN_PASSWORD` | a long, unique password for `/kitchen` |

   The password variables are server-only. Do not prefix them with `NEXT_PUBLIC_`.
4. **Deploy**, then open `/kitchen/login` and `/admin/login` to check both logins.

## Troubleshooting

- **"login is not configured on this server"**: `ADMIN_PASSWORD` or `KITCHEN_PASSWORD` is missing. Add it and redeploy.
- **Orders do not appear live in the kitchen**: migration `03_enable_realtime.sql` has not been run.
- **Menu is empty**: insert menu rows (see `migrations/05_fresh_menu_data.sql`).
