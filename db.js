import pg from 'pg';
const { Pool } = pg

export default new Pool({
   user: 'user',
   host: 'database',
   database: 'myapp',
   password: 'pasword',
   port: 5432
})