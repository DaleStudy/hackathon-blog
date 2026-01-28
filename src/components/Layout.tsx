import { Box, Flex, VStack } from "daleui";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box
      as="div"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        color: "#111827",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          maxWidth: "1024px",
          width: "100%",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <Flex as="div">
          <VStack as="div" style={{ width: "100%" }} gap="12">
            {children}
          </VStack>
        </Flex>
      </main>

      <Footer />
    </Box>
  );
}
