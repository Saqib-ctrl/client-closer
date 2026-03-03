

## Grant Admin Role

Your account was found (user ID: `845b747d-...`). To grant you admin access, I'll run a database migration that inserts your admin role into the `user_roles` table.

### What will happen
1. **Database migration**: Insert a row into `user_roles` with your user ID and `admin` role
2. After that, navigate to `/admin` to access the admin dashboard

### Technical detail
- Single SQL statement: `INSERT INTO user_roles (user_id, role) VALUES ('845b747d-9677-4208-9437-6b23593f67b2', 'admin')`
- Uses the existing RBAC system already in place

