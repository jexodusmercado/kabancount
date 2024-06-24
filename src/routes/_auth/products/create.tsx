import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
    MutableProductSchema,
    MutableProductType,
} from '@/services/products/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { CirclePlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth/products/create')({
    component: CreateProduct,
})

function CreateProduct() {
    const form = useForm<MutableProductType>({
        defaultValues: {
            productName: '',
            productStatus: 'publish',
            variants: [
                {
                    variantName: '',
                    variantDescription: '',
                    basePrice: 0,
                    costPrice: 0,
                    inventoryQuantity: 0,
                    variantStatus: 'active',
                },
            ],
        },
        resolver: zodResolver(MutableProductSchema),
    })

    return (
        <div>
            <Form {...form}>
                <form>
                    <FormField
                        name="productName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="productName">
                                    Product Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="productName"
                                        {...field}
                                        placeholder="E.g. ...biceps ni henry cavill"
                                    />
                                </FormControl>
                                <FormMessage {...field} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="productStatus"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status for this product." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="publish">
                                            Publish
                                        </SelectItem>
                                        <SelectItem value="unpublish">
                                            Unpublish
                                        </SelectItem>
                                        <SelectItem value="drafts">
                                            Drafts
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    You can change the status of the product
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ProductVariantForm />
                </form>
            </Form>
        </div>
    )
}

function ProductVariantForm() {
    const { control } = useFormContext<MutableProductType>()
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'variants',
    })

    return (
        <div className="px-5 py-2 border border-gray-200 rounded-2xl">
            <div className="flex flex-row items-center">
                <h2 className="text-2xl font-bold space-x-1">
                    <span>Variants </span>
                    <span className={cn(fields.length >= 10 && 'text-red-700')}>
                        ( {fields.length} ){' '}
                    </span>
                </h2>

                <span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={fields.length >= 10}
                        onClick={() =>
                            append({
                                variantName: '',
                                variantDescription: '',
                                basePrice: 0,
                                costPrice: 0,
                                inventoryQuantity: 0,
                                variantStatus: 'active',
                            })
                        }
                    >
                        <CirclePlusIcon className="size-5" />
                    </Button>
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-600">
                    You can add up to 10 variants.
                </p>
            </div>
            <div className="flex flex-row gap-5  overflow-x-auto snap-x snap-mandatory md:snap-none">
                {fields.map((field, index) => (
                    <div
                        className="h-full py-5 px-2 shrink-0 snap-always snap-center md:snap-none"
                        key={index}
                    >
                        <div key={field.id} className="grid grid-cols-2 gap-2">
                            <FormField
                                name={`variants.${index}.variantName`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel htmlFor={field.name}>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id={field.name}
                                                {...field}
                                                placeholder={`Variant ${index + 1}`}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a name for this variant. If
                                            none, you can leave it blank. We
                                            will automatically generate a name
                                            for you.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`variants.${index}.variantDescription`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel htmlFor={field.name}>
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`variants.${index}.basePrice`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name}>
                                            Base Price
                                        </FormLabel>
                                        <FormControl>
                                            <CurrencyInput
                                                id={field.name}
                                                getPassedNumber={field.onChange}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`variants.${index}.costPrice`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name}>
                                            Cost Price
                                        </FormLabel>
                                        <FormControl>
                                            <CurrencyInput
                                                id={field.name}
                                                getPassedNumber={field.onChange}
                                                className=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`variants.${index}.inventoryQuantity`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name}>
                                            Quantity
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                id={field.name}
                                                getPassedNumber={field.onChange}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`variants.${index}.variantStatus`}
                                control={control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-2">
                                        <div>
                                            <FormLabel htmlFor={field.name}>
                                                Active
                                            </FormLabel>
                                            <FormDescription>
                                                Active variants are visible to
                                                POS and customers.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                id={field.name}
                                                onCheckedChange={(value) => {
                                                    field.onChange(
                                                        value
                                                            ? 'active'
                                                            : 'inactive',
                                                    )
                                                }}
                                                checked={
                                                    field.value === 'active'
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {index !== 0 && (
                                <div className="col-span-2">
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
