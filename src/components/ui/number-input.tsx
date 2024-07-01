import React from 'react'
import { Input } from './input'

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    getPassedNumber?: (value: number) => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ getPassedNumber, ...props }, ref) => {
        const [passedValue, setPassedValue] = React.useState(0)
        const [inputValue, setInputValue] = React.useState('0')

        const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value)
        }

        const onHandleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (!value) {
                setInputValue('0')
                return
            }

            if (isNaN(Number(value))) {
                setInputValue(passedValue.toLocaleString('en-US'))
                return
            }

            if (Number(value) < 0) {
                setInputValue(passedValue.toLocaleString('en-US'))
                return
            }

            if (Number(value) !== Math.floor(Number(value))) {
                setInputValue(passedValue.toLocaleString('en-US'))
                return
            }

            setInputValue(Number(value).toLocaleString('en-US'))

            setPassedValue(Number(value))
        }

        const onHandleFocus = () => {
            if (passedValue === 0) {
                setInputValue('')
                return
            }

            setInputValue(passedValue.toString())
        }

        React.useEffect(() => {
            if (props.value) {
                setInputValue(props.value.toLocaleString('en-US'))
                setPassedValue(Number(props.value))
            }
        }, [props.value])

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

export { NumberInput }
