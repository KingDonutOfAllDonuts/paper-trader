import { formatPercentage } from '@shared/utils'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const PercentageEarnings = ({className='', percentage}) => {
  const formatted = formatPercentage(percentage)
  if (percentage>0) {
    return <p className={twMerge('text-sm text-green-600', className)}>{formatted}</p>
  } else if (percentage< 0) {
    return <p className={twMerge('text-sm text-red-500', className)}>{formatted}</p>
  } else {
    return <p className={twMerge('text-sm text-gray-500', className)}>{formatted}</p>
  }
}

export default PercentageEarnings