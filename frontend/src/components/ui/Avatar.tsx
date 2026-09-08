import { HTMLAttributes } from 'react'
import { cn, getInitials } from '@/utils'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({ className, src, firstName, lastName, size = 'md', ...props }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const initials = getInitials(firstName, lastName)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  )
}
