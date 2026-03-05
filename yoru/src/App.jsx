import { BrowserRouter, Routes, Route } from "react-router"


// components
import LoginForm from "./components/LoginForm.jsx"
import SignUpFormm from "./components/SignUpForm.jsx"

// styling
import "./styles/LoginForm.css"
import "./styles/SignUpForm.css"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignUpFormm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
