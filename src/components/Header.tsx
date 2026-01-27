import { Box, HStack, Text } from "daleui";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <Box
      as="header"
      style={{
        borderBottom: "1px solid #e5e5e5",
        backgroundColor: "white",
        padding: "12px 24px",
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
          maxWidth: "800px",
          margin: "0 auto",
          gap: "8px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Text as="span" tone="brand">
            홈
          </Text>
        </Link>
        <Text as="span" weight="bold">
          여기가 헤더 영역입니다
        </Text>
      </HStack>
    </Box>
  );
}
