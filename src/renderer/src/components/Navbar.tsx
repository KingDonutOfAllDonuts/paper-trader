import icon from './../../../../resources/icon.png' 
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header className='w-full h-10 bg-black navbar flex justify-between'>
      <img className='w-10 h-10' src={icon}/>

      <div className='h-10 absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center flex-1'>
        <Link to="/home" className='bar-button'> Search </Link>
        <Link to="/home" className='bar-button'> Accounts </Link>
        <Link to="/portfolio/summary" className='bar-button'> Portfolio </Link>
      </div>
    </header>
  )
}

export default Navbar