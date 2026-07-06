import mysql from 'mysql2/promise';

let db;

/** Konfigurasi koneksi & pool */
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '4000'),

  // Aktifkan SSL jika bukan localhost
  ssl: process.env.DB_HOST === 'localhost' ? undefined : {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 1,
  maxIdle: 0,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
};

/** Buat pool, gunakan global pool di development agar tidak kebanjiran koneksi */
if (process.env.NODE_ENV === 'production') {
  db = mysql.createPool(dbConfig);
} else {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  db = global.mysqlPool;
}

/** Pool siap pakai untuk query */
export default db;