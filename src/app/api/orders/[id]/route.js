import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    timezone: 'Z'
  });
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; 
    const connection = await connectToDB();
    await connection.execute('DELETE FROM orders WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ success: true, message: 'Order berhasil dihapus' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const connection = await connectToDB();
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    await connection.end();

    return NextResponse.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui status' }, { status: 500 });
  }
}