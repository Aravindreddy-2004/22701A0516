import ShortenerForm from "./components/ShortenerForm";
import StatsPage from "./components/StatsPage";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>Affordmed URL Shortener</Typography>
      <ShortenerForm />
      <StatsPage />
    </Container>
  );
}
export default App;
