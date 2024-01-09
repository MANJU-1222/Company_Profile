import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import ViewPage from "./pages/View";
import './styles/base.style.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/view" Component={ViewPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
