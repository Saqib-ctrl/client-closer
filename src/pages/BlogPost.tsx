import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { getBlogPost, blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-28 pb-20">
          <div className="container-narrow text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{block.replace("## ", "")}</h2>;
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="text-xl font-semibold mt-8 mb-3">{block.replace("### ", "")}</h3>;
      }
      if (block.startsWith("| ")) {
        const rows = block.split("\n").filter(r => !r.startsWith("|-"));
        return (
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  {rows[0]?.split("|").filter(Boolean).map((cell, j) => (
                    <th key={j} className="px-4 py-2 text-left font-medium">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, j) => (
                  <tr key={j} className="border-t border-border">
                    {row.split("|").filter(Boolean).map((cell, k) => (
                      <td key={k} className="px-4 py-2">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (block.startsWith("- ") || block.startsWith("1. ")) {
        const items = block.split("\n");
        const isOrdered = block.startsWith("1. ");
        const Tag = isOrdered ? "ol" : "ul";
        return (
          <Tag key={i} className={`my-4 space-y-2 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}>
            {items.map((item, j) => (
              <li key={j} className="text-muted-foreground leading-relaxed">
                {item.replace(/^[-\d]+[.)]\s*/, "").split("**").map((part, k) =>
                  k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part
                )}
              </li>
            ))}
          </Tag>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className="text-muted-foreground leading-relaxed my-4">
          {block.split("**").map((part, k) =>
            k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <article className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
            </Link>

            <span className="inline-block text-xs font-medium tracking-wider uppercase text-primary mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12 pb-8 border-b border-border/30">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <div className="prose-custom">
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 rounded-xl border border-primary/20 bg-primary/5 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to write better proposals?</h3>
              <p className="text-muted-foreground mb-6">Try Propel's AI proposal writer free — no credit card required.</p>
              <a href="/auth" className="btn-primary">Start Free →</a>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border/30">
                <h3 className="text-lg font-semibold mb-6">Related articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map(related => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="block group rounded-xl border border-border/30 bg-card p-5 hover:border-primary/30 transition-all"
                    >
                      <span className="text-xs font-medium tracking-wider uppercase text-primary">{related.category}</span>
                      <h4 className="text-base font-semibold mt-2 group-hover:text-primary transition-colors">{related.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{related.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </article>
      </main>
      <Footer />

      {/* JSON-LD for blog post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: "Propel" },
            publisher: { "@type": "Organization", name: "Propel" },
            mainEntityOfPage: `https://propeldev.lovable.app/blog/${post.slug}`
          })
        }}
      />
    </div>
  );
};

export default BlogPost;
