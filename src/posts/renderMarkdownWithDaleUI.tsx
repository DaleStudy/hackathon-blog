import type { ReactNode } from "react";
import { Heading, Text, VStack } from "daleui";

/**
 * 매우 단순한 마크다운 → DalE UI 렌더러
 * - 지원: #, ##, 일반 문단
 * - 목적: 해커톤 초기 셋업용으로 Heading/Text 사용 감만 잡는 수준
 */
export function renderMarkdownWithDaleUI(markdown: string): ReactNode {
  if (!markdown.trim()) {
    return null;
  }

  const blocks = markdown.split(/\n{2,}/); // 빈 줄 두 개 이상을 단락 구분으로 사용

  return (
    <VStack>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 한 줄씩 나눠서 첫 줄을 기준으로 판단
        const lines = trimmed.split("\n");
        const firstLine = lines[0].trim();
        const restLines = lines.slice(1).join("\n");

        // Heading level 1
        if (firstLine.startsWith("# ")) {
          const text = firstLine.replace(/^#\s*/, "").trim();
          return (
            <Heading key={index} level={1}>
              {text}
            </Heading>
          );
        }

        // Heading level 2
        if (firstLine.startsWith("## ")) {
          const text = firstLine.replace(/^##\s*/, "").trim();
          return (
            <Heading key={index} level={2}>
              {text}
            </Heading>
          );
        }

        // 기본은 문단 텍스트
        const paragraphText = [firstLine, restLines].filter(Boolean).join("\n");
        return (
          <Text key={index} as="p">
            {paragraphText}
          </Text>
        );
      })}
    </VStack>
  );
}

