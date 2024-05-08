import { forwardRef, useState } from 'react'
import { Input, InputProps } from './input'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface PasswordInputProps extends InputProps {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (props, ref) => {
        const [isMasked, setIsMasked] = useState(true)

        const toggleMask = () => {
            setIsMasked(!isMasked)
        }

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    type={isMasked ? 'password' : 'text'}
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                    onClick={toggleMask}
                >
                    {isMasked ? (
                        <EyeIcon className="size-4" />
                    ) : (
                        <EyeOffIcon className="size-4" />
                    )}
                </button>
            </div>
        )
    },
)

PasswordInput.displayName = 'PasswordInput'
