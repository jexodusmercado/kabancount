import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect } from 'react'
import { CategoryType } from '@/services/category/schema'

interface CategoryComboboxProps {
    categories: CategoryType[]
    onSelect: (value: string) => void
    value?: string
}

export function CategoryCombobox(props: CategoryComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [categoryID, setCategoryID] = React.useState('')

    useEffect(() => {
        if (props.value) {
            setCategoryID(props.value)
        }
    }, [props.value])

    useEffect(() => {
        if (props.onSelect && categoryID) {
            props.onSelect(categoryID)
        }
        // do not pass props as dependency
        // it will prompt infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryID])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="w-full">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {categoryID
                        ? props.categories.find(
                              (categories) => categories.id === categoryID,
                          )?.name
                        : 'Select Category...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search Category..." />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {props.categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={(currentValue) => {
                                        setCategoryID(
                                            currentValue === categoryID
                                                ? ''
                                                : currentValue,
                                        )
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            categoryID === category.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {category.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
