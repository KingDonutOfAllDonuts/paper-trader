import Navbar from './components/Navbar'
import Accounts from './pages/Accounts'
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Portfolio from './pages/Portfolio';
import Summary from './components/Summary';
import Positions from './components/Positions';
import History from './components/History';

const App = () => {
  return (
    <div className='bg-white h-lvh overflow-hidden'>
      <Router>
        <Navbar/>
        <Routes>
          <Route index element={<Accounts/>}/>
          <Route path="home" element={<Accounts/>}/>
          {/* <Route path="portfolio" element={<Portfolio/>}/> 
            <Route index element={<Summary/>}/>
            <Route path="summary" element={<Summary/>}/>
            <Route path="positions" element={<Positions/>}/>
          <Route/> */}
          <Route path="portfolio" element={<Portfolio />}>
            <Route index element={<Summary />} />
            <Route path="summary" element={<Summary />} />
            <Route path="positions" element={<Positions />} />
            <Route path="history" element={<History />} />
          </Route>

          
        </Routes>
      </Router>
    </div>
  )
}

export default App
