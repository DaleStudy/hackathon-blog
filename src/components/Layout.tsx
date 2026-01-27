import type { ReactNode } from "react";
import { Box, Flex, VStack } from "daleui";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box
      as="div"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        color: "#111827",
      }}
    >
      <Header />

      <main
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          padding: "0 1rem",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Flex as="div">
          <VStack as="div" style={{ width: "100%" }} gap="12">
            {children}
          </VStack>
        </Flex>
      </main>
    </Box>
  );
}
