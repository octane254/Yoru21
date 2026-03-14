import { BrowserRouter, Routes, Route } from "react-router"


// components
import LoginForm from "./components/LoginForm.jsx"
import SignUpFormm from "./components/SignUpForm.jsx"
import Home from "./components/Home.jsx"
import MangaReader from "./components/MangaReader.jsx"

// styling
import "./styles/LoginForm.css"
import "./styles/SignUpForm.css"
import "./styles/Home.css"
import "./styles/MangaReader.css"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignUpFormm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/manga-reader" element={<MangaReader />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
