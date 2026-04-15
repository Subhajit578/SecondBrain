
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Signin} from './pages/Signin'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { SharedBrain } from './components/SharedBrain'
function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path ="/signin" element = {<Signin/>}/>
      <Route path ="/signup" element = {<Signup/>}/>
      <Route path ="/dashboard" element = {<Dashboard/>}/>
      <Route path="/brain/share/:hash" element={<SharedBrain />} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
