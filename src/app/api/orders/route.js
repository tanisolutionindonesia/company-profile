import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    },
    connectTimeout: 10000,
    timezone: 'Z',
  });
}

export async function GET() {
  try {
    const connection = await connectToDB();
    const [rows] = await connection.execute('SELECT * FROM orders ORDER BY created_at DESC');
    await connection.end(); 
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error('ERROR API GET:', error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_name, qty, total_price, nama, whatsapp, kota, alamat, payment } = body;

    const connection = await connectToDB();

    const query = `
      INSERT INTO orders 
      (product_name, qty, total_price, customer_name, whatsapp, city, address, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [product_name, qty, total_price, nama, whatsapp, kota, alamat, payment];

    const [result] = await connection.execute(query, values);
    await connection.end();

    return NextResponse.json({ success: true, insertId: result.insertId });

  } catch (error) {
    console.error('ERROR API POST:', error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}