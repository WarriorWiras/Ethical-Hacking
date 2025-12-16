import mysql from "mysql2/promise"

// Create connection pool for better performance
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "shopmaster",
  password: "<Password>",
  database: "blog",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
