import { Heading, Text, VStack } from "daleui";
import { useParams } from "react-router-dom";
import { getPostBySlug } from "../posts/posts";
import { renderMarkdownWithDaleUI } from "../posts/renderMarkdownWithDaleUI";

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <VStack gap="4">
        <Heading level={1}>포스트를 찾을 수 없습니다</Heading>
        <Text as="p" muted>
          잘못된 주소입니다.
        </Text>
      </VStack>
    );
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <VStack gap="4">
        <Heading level={1}>포스트를 찾을 수 없습니다</Heading>
        <Text as="p" muted>
          요청하신 슬러그에 해당하는 포스트가 없습니다.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack gap="4">
      <Heading level={1}>{post.title}</Heading>
      {renderMarkdownWithDaleUI(post.content)}
    </VStack>
  );
}

