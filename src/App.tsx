import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PostListPage } from "./routes/PostListPage.tsx";
import { PostDetailPage } from "./routes/PostDetailPage.tsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/:slug" element={<PostDetailPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
