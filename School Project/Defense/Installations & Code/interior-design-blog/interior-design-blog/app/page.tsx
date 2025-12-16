import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Heart, Share2, Calendar, User, ArrowRight, Bookmark } from "lucide-react"
import Image from "next/image"
import { NewsletterForm } from "@/components/newsletter-form"

export default async function InteriorDesignBlog() {
  let featuredPosts = []

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts?featured=true&limit=3`,
      {
        cache: "no-store", // Always fetch fresh data
      },
    )

    if (response.ok) {
      const data = await response.json()
      featuredPosts = data.posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        image: post.featured_image,
        category: post.category_name,
        readTime: `${post.read_time} min read`,
        date: new Date(post.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        author: post.author_name,
        slug: post.slug,
      }))
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    // Fallback to static data if API fails
    featuredPosts = [
      {
        id: 1,
        title: "Scandinavian Minimalism: Creating Serene Spaces",
        excerpt:
          "Discover how to achieve the perfect balance of functionality and beauty with clean lines, natural materials, and thoughtful design choices.",
        image: "/modern-scandinavian-living-room-with-white-walls-n.jpg",
        category: "Living Room",
        readTime: "5 min read",
        date: "Dec 8, 2024",
        author: "Emma Nielsen",
        slug: "scandinavian-minimalism-creating-serene-spaces",
      },
      {
        id: 2,
        title: "Bold Kitchen Transformations That Inspire",
        excerpt:
          "From statement backsplashes to dramatic color schemes, explore kitchen designs that make a lasting impression.",
        image: "/modern-kitchen-with-dark-green-cabinets-marble-cou.jpg",
        category: "Kitchen",
        readTime: "7 min read",
        date: "Dec 6, 2024",
        author: "Marcus Chen",
        slug: "bold-kitchen-transformations-that-inspire",
      },
      {
        id: 3,
        title: "Cozy Bedroom Retreats for Every Season",
        excerpt:
          "Transform your bedroom into a year-round sanctuary with layered textures, warm lighting, and seasonal accents.",
        image: "/cozy-bedroom-with-warm-lighting-layered-textiles-n.jpg",
        category: "Bedroom",
        readTime: "4 min read",
        date: "Dec 4, 2024",
        author: "Sofia Rodriguez",
        slug: "cozy-bedroom-retreats-for-every-season",
      },
    ]
  }

  const categories = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Outdoor", "Office", "Dining Room", "Entryway"]

  const trendingTopics = [
    "Biophilic Design",
    "Maximalist Decor",
    "Sustainable Materials",
    "Color Psychology",
    "Small Space Solutions",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary">DesignHub</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Inspiration
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Trends
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Guides
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  About
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search inspiration..." className="pl-10 w-64 bg-muted/50 border-border" />
              </div>
              <Button variant="outline" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Interior Design
            <span className="text-primary block">Inspiration</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Discover beautiful spaces, expert tips, and the latest trends to transform your home into a sanctuary of
            style and comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore Designs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Latest Trends
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Room</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-foreground">Featured Stories</h3>
            <Button variant="outline">View All Posts</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <Card
                key={post.id}
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={600}
                    height={400}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${index === 0 ? "h-80 lg:h-96" : "h-48"}`}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`group-hover:text-primary transition-colors ${index === 0 ? "text-xl lg:text-2xl" : "text-lg"}`}
                  >
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-pretty">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Trending Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingTopics.map((topic, index) => (
              <Card
                key={topic}
                className="group cursor-pointer hover:shadow-md transition-all duration-300 hover:bg-accent/10"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{topic}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Stay Inspired</h3>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
                Get the latest design trends, expert tips, and beautiful home inspiration delivered to your inbox every
                week.
              </p>
              <NewsletterForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold text-primary mb-4">DesignHub</h4>
              <p className="text-muted-foreground text-sm text-pretty">
                Your source for interior design inspiration, expert advice, and the latest home decor trends.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Categories</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Living Room
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Kitchen
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Bedroom
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Bathroom
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Design Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Color Palettes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Trend Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Expert Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Connect</h5>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DesignHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
