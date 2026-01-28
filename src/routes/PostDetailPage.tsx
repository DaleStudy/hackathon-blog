import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  Flex,
  Tag,
  Select,
  TextInput,
  PasswordInput,
  Label,
  Checkbox,
  Icon
} from "daleui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostBySlug } from "../posts/posts";
import { marked } from "marked";

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  if (!slug) {
    return (
      <Flex direction="column" gap="4">
        <Heading level={1}>포스트를 찾을 수 없습니다</Heading>
        <Text as="p" muted>
          잘못된 주소입니다.
        </Text>
      </Flex>
    );
  }

  const post = getPostBySlug(slug);

  useEffect(() => {
    if (post) {
      const rawHtml = marked.parse(post.content) as string;
      setHtmlContent(rawHtml);
    }
  }, [post]);

  if (!post) {
    return (
      <Flex direction="column" gap="4">
        <Heading level={1}>포스트를 찾을 수 없습니다</Heading>
        <Text as="p" muted>
          요청하신 슬러그에 해당하는 포스트가 없습니다.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="12" align="stretch">
      <Flex direction="column" gap="4" align="stretch">
        <Box>
            <Button 
            variant="ghost" 
            leftIcon="chevronLeft" 
            onClick={() => navigate(-1)}
            tone="neutral"
            >
            뒤로가기
            </Button>
        </Box>
        
        <Heading level={1}>{post.title}</Heading>
        
        <HStack align="between" gap="4">
          <HStack gap="2" align="center">
            <Text weight="bold">Dale.UI</Text>
            <Text muted>·</Text>
            <Text muted>2024년 7월 28일</Text>
          </HStack>
        </HStack>
        
        <HStack gap="2" align="left">
            <Tag tone="neutral">daleui</Tag>
            <Tag tone="neutral">design-system</Tag>
            <Tag tone="neutral">react</Tag>
        </HStack>
      </Flex>

      <Box width="100%" style={{ borderBottom: '1px solid var(--colors-border-neutral)' }} />

      <Flex direction="column" gap="8">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </Flex>

      <Box width="100%" style={{ borderBottom: '1px solid var(--colors-border-neutral)' }} />

      <Flex direction="column" gap="8" align="stretch">
        {/* 댓글 헤더 */}
        <HStack align="between" gap="4">
          <Text size="lg" weight="medium">댓글 (2)</Text>
          <HStack gap="4" align="center">
             <HStack gap="2" align="center">
                <Icon name="menu" />
                <Text weight="semibold" tone="neutral">정렬 기준</Text>
             </HStack>
             <Box width="150px">
                <Select defaultValue="latest">
                    <option value="latest">최신순</option>
                    <option value="oldest">시간순</option>
                </Select>
             </Box>
          </HStack>
        </HStack>

        <Box width="100%" style={{ borderBottom: '1px solid var(--colors-border-neutral)' }} />
        
        {/* 댓글 작성 폼 */}
        <Box 
            padding="16" 
            style={{ 
                backgroundColor: 'var(--colors-bg-neutral-hover)', 
                borderRadius: 'var(--radii-md)' 
            }}
        >
            <Flex direction="column" gap="20" align="stretch">
                <Text weight="semibold" tone="neutral">댓글 쓰기</Text>
                
                <Flex gap="20">
                    <Box width="320px">
                        <Label labelText="닉네임">
                            <TextInput placeholder="내용을 입력해주세요." />
                        </Label>
                    </Box>
                    <Box width="320px">
                        <Label labelText="비밀번호">
                            <PasswordInput placeholder="패스워드를 입력해주세요." />
                        </Label>
                    </Box>
                </Flex>

                <Box width="100%">
                    <TextInput placeholder="댓글 내용을 입력해주세요.." />
                </Box>

                <HStack align="between" gap="4">
                    <Checkbox label="비밀글" checked={isSecret} onChange={setIsSecret} />
                    <Button tone="brand" size="sm">등록</Button>
                </HStack>
            </Flex>
        </Box>

        {/* 댓글 목록 */}
        <Flex direction="column" gap="8" align="stretch">
            {/* 댓글 1 */}
            <Flex direction="column" gap="4" align="stretch">
                <Flex justify="between" align="center">
                    <Flex direction="column" gap="2" align="start">
                        <Text weight="semibold" tone="neutral">김승현</Text>
                        <Text size="sm" muted weight="medium">2024. 7. 28.</Text>
                    </Flex>
                    <HStack gap="4">
                        <Button variant="outline" tone="neutral" size="sm">수정</Button>
                        <Button variant="outline" tone="neutral" size="sm">삭제</Button>
                    </HStack>
                </Flex>
                <Text as="p">
                    정말 유용한 글이네요! 특히 웹 컴포넌트와 React 사이의 고민
                    과정이 인상 깊었습니다.
                </Text>
            </Flex>

            <Box width="100%" style={{ borderBottom: '1px solid var(--colors-border-neutral)' }} />

            {/* 댓글 2 */}
            <Flex direction="column" gap="4" align="stretch">
                 <Flex justify="between" align="center">
                    <Flex direction="column" gap="2" align="start">
                        <Text weight="semibold" tone="neutral">박지훈</Text>
                        <Text size="sm" muted weight="medium">2024. 7. 28.</Text>
                    </Flex>
                    <HStack gap="4">
                        <Button variant="outline" tone="neutral" size="sm">수정</Button>
                        <Button variant="outline" tone="neutral" size="sm">삭제</Button>
                    </HStack>
                </Flex>
                <Text as="p">
                    저희 팀도 비슷한 문제로 고민하고 있었는데, 이 글이 큰 도움이
                    될 것 같아요. 감사합니다!
                </Text>
            </Flex>

            <Box width="100%" style={{ borderBottom: '1px solid var(--colors-border-neutral)' }} />

             {/* 비밀 댓글 예시 */}
             <Flex direction="column" gap="4" align="stretch">
                 <Flex justify="between" align="center">
                    <Flex direction="column" gap="2" align="start">
                        <Text weight="semibold" tone="neutral">익명</Text>
                        <Text size="sm" muted weight="medium">2024. 7. 29.</Text>
                    </Flex>
                    <HStack gap="4">
                        <Button variant="outline" tone="neutral" size="sm">수정</Button>
                        <Button variant="outline" tone="neutral" size="sm">삭제</Button>
                    </HStack>
                </Flex>
                <Text as="p">
                    비밀 댓글입니다.
                </Text>
            </Flex>

        </Flex>
      </Flex>
    </Flex>
  );
}
