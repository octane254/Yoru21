import { BrowserRouter, Routes, Route } from "react-router"

// components
import LoginForm from "./components/LoginForm.jsx"

// styling
import "./styles/LoginForm.css"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
