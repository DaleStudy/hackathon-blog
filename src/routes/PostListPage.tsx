import { useState } from "react";
import { Card, Flex, Heading, HStack, Link, Radio, RadioGroup, Tag, VStack, Icon } from "daleui";
import { posts } from "../posts/posts";

export function PostListPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["콘텐츠 제작", "브랜드 관리"]);
  const [sortOrder, setSortOrder] = useState<string>("작성순");

  const allTags = [
    "디지털 마케팅",
    "소셜 미디어 전략",
    "콘텐츠 제작",
    "SEO 최적화",
    "데이터 분석",
    "브랜드 관리",
  ];

  const categories = [
    { name: "카테고리1", count: 1 },
    { name: "카테고리2", count: 100 },
    { name: "카테고리3", count: 40 },
  ];

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Flex gap="8" style={{ alignItems: "flex-start", maxWidth: "1400px", margin: "0 auto" }}>
      <VStack gap="6" style={{ flex: 1 }}>
        {/* Filter Tags Section */}
        <HStack gap="8">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Tag
                key={tag}
                tone={isSelected ? "brand" : "neutral"}
                removable={isSelected}
                onClick={() => (isSelected ? handleTagRemove(tag) : handleTagAdd(tag))}
              >
                {tag}
              </Tag>
            );
          })}
        </HStack>

        {/* Sort Radio Buttons */}
        <div style={{ marginTop: "55px", marginBottom: "16px" }}>
          <RadioGroup
            name="sort"
            value={sortOrder}
            onChange={setSortOrder}
            orientation="horizontal"
            tone="brand"
          >
            <Radio value="작성순">작성순</Radio>
            <Radio value="최신순">최신순</Radio>
          </RadioGroup>
        </div>
        {/* Blog Post Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "36px",
            width: "100%",
          }}
        >
          {posts.map((post) => (
            <Card key={post.slug} tone="neutral" outline>
              <Card.Icon name="search" size="md" />
              <Card.Body>
                <Card.Title size="lg">{post.title}</Card.Title>
                <Card.Description size="md">{post.excerpt}</Card.Description>
              </Card.Body>
              <Card.Link tone="neutral" size="lg" underline={false} href={`/${post.slug}`}>
                자세히 보기
                <Icon name="externalLink" size="sm" />
              </Card.Link>
            </Card>
          ))}
        </div>
      </VStack>

      {/* Category Sidebar */}
      <div style={{ marginTop: "85px", marginLeft: "60px" }}>
        <VStack gap="16">
          <Heading level={3}>카테고리</Heading>
          <VStack gap="16">
           {categories.map((category) => (
             <Link
               key={category.name}
               href={`#${category.name}`}
               tone="neutral"
               size="lg"
               underline={false}
             >
               {category.name} ({category.count})
             </Link>
           ))}
          </VStack>
        </VStack>
      </div>
    </Flex>
  );
}

