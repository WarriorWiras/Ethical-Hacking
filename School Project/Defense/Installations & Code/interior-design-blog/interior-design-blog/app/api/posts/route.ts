import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface Post extends RowDataPacket {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  category_name: string
  author_name: string
  read_time: number
  published_at: string
  is_featured: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.featured_image, 
        p.read_time, p.published_at, p.is_featured,
        c.name as category_name,
        a.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.status = 'published'
    `

    let countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
    `

    const params: any[] = []
    const countParams: any[] = []

    if (featured === "true") {
      query += " AND p.is_featured = ?"
      countQuery += " AND p.is_featured = ?"
      params.push(true)
      countParams.push(true)
    }

    if (category) {
      query += " AND c.slug = ?"
      countQuery += " AND c.slug = ?"
      params.push(category)
      countParams.push(category)
    }

    query += " ORDER BY p.published_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const [rows] = await pool.execute<Post[]>(query, params)
    const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, countParams)
    const total = countResult[0].total

    return NextResponse.json({
      posts: rows,
      total: total,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
