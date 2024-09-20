import { ComponentProps } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

const RefreshButton = ({className ,onClick}) => {
  return (
    <FaSyncAlt
    className= {twMerge('w-7 h-7 transition-transform duration-300 hover:rotate-180', className)}
    onClick={()=> onClick()}
    />
  )
}

export default RefreshButton