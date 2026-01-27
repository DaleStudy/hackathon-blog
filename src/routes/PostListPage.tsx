import { Heading, Text, VStack } from "daleui";
import { Link } from "react-router-dom";
import { posts } from "../posts/posts";

export function PostListPage() {
  return (
    <VStack gap="4">
      <Heading level={1}>포스트 목록</Heading>
      <Text as="p" muted>
        아래 링크 중 하나를 클릭하면 해당 포스트의 상세 페이지로 이동합니다.
      </Text>
      <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
        <VStack gap="2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </VStack>
      </ul>
    </VStack>
  );
}

