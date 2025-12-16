import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface PostDetail extends RowDataPacket {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_name: string
  category_slug: string
  author_name: string
  author_bio: string
  author_avatar_url: string
  read_time: number
  published_at: string
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const query = `
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.content, p.featured_image,
        p.read_time, p.published_at,
        c.name as category_name, c.slug as category_slug,
        a.name as author_name, a.bio as author_bio, a.avatar_url as author_avatar_url
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ? AND p.status = 'published'
    `

    const [rows] = await pool.execute<PostDetail[]>(query, [slug])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Track view
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await pool.execute("INSERT INTO post_views (post_id, ip_address, user_agent) VALUES (?, ?, ?)", [
      rows[0].id,
      clientIP,
      userAgent,
    ])

    return NextResponse.json({ post: rows[0] })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
