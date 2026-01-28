import { Box, HStack, Text, VStack } from "daleui";

export function Footer() {
  return (
    <Box
      as="footer"
      style={{
        backgroundColor: "white",
        padding: "64px 0",
      }}
    >
      <VStack
        as="div"
        gap="12"
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 24px",
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        <VStack gap="4" style={{ alignItems: "flex-start" }}>
          <HStack gap="4" style={{ alignItems: "center" }}>
            <img src="/logo.svg" alt="Dale Blog Logo" style={{ height: "24px", width: "auto" }} />
            <Text as="span" weight="bold" style={{ fontSize: "18px", color: "#4F46E5" }}>
              Dale Blog
            </Text>
          </HStack>
          <HStack gap="16" style={{ marginTop: "8px" }}>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Text as="span" style={{ fontSize: "14px", color: "#64748B" }}>
                깃허브
              </Text>
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Text as="span" style={{ fontSize: "14px", color: "#64748B" }}>
                Discord
              </Text>
            </a>
          </HStack>
        </VStack>

        <Text as="p" style={{ fontSize: "12px", color: "#94A3B8" }}>
          © 2025 Dale Blog. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
}
