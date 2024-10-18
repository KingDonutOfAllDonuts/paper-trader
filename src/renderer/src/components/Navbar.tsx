import icon from './../../../../resources/icon.png' 
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

const Navbar = () => {

  return (
    <header className='w-full h-10 bg-black navbar flex justify-between'>
      <img className='w-10 h-10' src={icon}/>
      <div className='h-10 absolute left-1/2 transform -translate-x-[65%] flex justify-center items-center flex-1 z-[999]'>
        <SearchBar/>
        <Link to="/home" className='bar-button'> Accounts </Link>
        <Link to="/portfolio/summary" className='bar-button'> Portfolio </Link>
      </div>
    </header>
  )
}

export default Navbar