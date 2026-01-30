const modules = import.meta.glob("./*.md", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

export interface Post {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
}

function extractMetadata(content: string): {
  title: string;
  excerpt: string;
  body: string;
} {
  const lines = content.split("\n");
  const title = lines[0]?.replace(/^#\s*/, "").trim() || "";
  
  let excerpt = "";
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith("#") && !line.startsWith("!") && !line.startsWith(">")) {
      excerpt = line;
      break;
    }
  }

  return {
    title,
    excerpt: excerpt || title,
    body: lines.slice(1).join("\n"),
  };
}

export const posts: Post[] = Object.entries(modules).map(([path, content]) => {
  const fileName = path.replace("./", "");
  const slug = fileName.replace(/\.md$/, "");
  const metadata = extractMetadata(content);

  return {
    slug,
    title: metadata.title,
    content: metadata.body || content,
    excerpt: metadata.excerpt,
  };
});

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

