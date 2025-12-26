'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full p-4 rounded-lg border flex items-start gap-3 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 border-slate-200 text-slate-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        danger: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      }
    }
  }
)

interface AlertProps extends VariantProps<typeof alertVariants> {
  show?: boolean
  message?: string
  dismissible?: boolean
  timeout?: number
  icon?: React.ReactNode
  onClose?: () => void
}

const defaultIcons = {
  info: 'ℹ️',
  danger: '⚠️',
  success: '✅',
  warning: '⚠️',
}

export function Alert({
  variant = 'default',
  show = true,
  message,
  dismissible = false,
  timeout = 0,
  icon,
  onClose,
  className,
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  // Auto-dismiss jika timeout diatur
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [timeout, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const iconComponent = icon || defaultIcons[variant as keyof typeof defaultIcons]

  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      {iconComponent && (
        <span className="text-2xl flex-shrink-0 mt-0.5">
          {iconComponent}
        </span>
      )}

      <div className="flex-grow flex items-start gap-3">
        {message && <p className="flex-grow text-sm leading-relaxed">{message}</p>}
      </div>

      {dismissible && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity rounded-md"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
