import React from 'react'
import { Input } from './input'

interface CurrencyInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    getPassedNumber?: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ getPassedNumber, ...props }, ref) => {
        const [passedValue, setPassedValue] = React.useState(0)
        const [inputValue, setInputValue] = React.useState('0.00')

        const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value)
        }

        const onHandleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (!value) {
                setInputValue('0.00')
                return
            }

            if (isNaN(Number(value))) {
                setInputValue(
                    passedValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                    }),
                )
                return
            }

            if (Number(value) < 0) {
                setInputValue(
                    passedValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                    }),
                )
                return
            }

            setInputValue(
                Number(value).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                }),
            )

            setPassedValue(Number(value))
        }

        const onHandleFocus = () => {
            setInputValue(passedValue.toString())
        }

        React.useEffect(() => {
            if (getPassedNumber) {
                getPassedNumber(passedValue)
            }
        }, [getPassedNumber, passedValue])

        return (
            <Input
                {...props}
                onChange={onHandleChange}
                onBlur={onHandleBlur}
                onFocus={onHandleFocus}
                value={inputValue}
                ref={ref}
            />
        )
    },
)

export { CurrencyInput }
