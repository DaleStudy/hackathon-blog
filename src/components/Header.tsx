import { Box, HStack, Icon, Text, TextInput } from "daleui";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <Box
      as="header"
      style={{
        borderBottom: "1px solid #F1F5F9",
        backgroundColor: "white",
        padding: "16px 0",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <HStack
        as="div"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Left: Logo */}
        <Box style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img src="/logo.svg" alt="Dale Blog Logo" style={{ height: "32px", width: "auto" }} />
            <Text as="span" weight="bold" style={{ fontSize: "20px", color: "#4F46E5" }}>
              Dale Blog
            </Text>
          </Link>
        </Box>

        {/* Center: GitHub Link */}
        <Box style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Link to="/github" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Text as="span" style={{ fontSize: "14px", fontWeight: 500, color: "#64748B" }}>
              깃허브
            </Text>
            <Icon name="externalLink" size="xs" style={{ marginLeft: "4px", color: "#94A3B8" }} />
          </Link>
        </Box>

        {/* Right: Search bar */}
        <Box style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Box style={{ width: "320px" }}>
            <TextInput
              placeholder="검색어를 입력해주세요.."
              leadingIcon="search"
            />
          </Box>
        </Box>
      </HStack>
    </Box>
  );
}
