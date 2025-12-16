import { NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface Category extends RowDataPacket {
  id: number
  name: string
  slug: string
  description: string
  post_count: number
}

export async function GET() {
  try {
    const query = `
      SELECT 
        c.id, c.name, c.slug, c.description,
        COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
      GROUP BY c.id, c.name, c.slug, c.description
      ORDER BY c.name
    `

    const [rows] = await pool.execute<Category[]>(query)

    return NextResponse.json({ categories: rows })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
