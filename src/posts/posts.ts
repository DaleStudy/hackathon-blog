const modules = import.meta.glob("./*.md", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

export interface Post {
  slug: string;
  title: string;
  content: string;
}

export const posts: Post[] = Object.entries(modules).map(([path, content]) => {
  const fileName = path.replace("./", "");
  const slug = fileName.replace(/\.md$/, "");

  // 간단하게: 첫 번째 줄을 제목으로, 나머지를 본문으로 사용
  const [firstLine, ...rest] = content.split("\n");
  const title = firstLine.replace(/^#\s*/, "").trim() || slug;
  const body = rest.join("\n");

  return {
    slug,
    title,
    content: body || content,
  };
});

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

