import { formatNumber } from '@shared/utils'
import { twMerge } from 'tailwind-merge'

const Earnings = ({className='', earnings}) => {
  const formatted = formatNumber(earnings)
  if (earnings>0) {
    return <p className={twMerge('text-sm text-green-600', className)}>+{formatted}</p>
  } else if (earnings< 0) {
    return <p className={twMerge('text-sm text-red-500', className)}>-{formatted}</p>
  } else {
    return <p className={twMerge('text-sm text-gray-500', className)}>{formatted}</p>
  }
}

export default Earnings