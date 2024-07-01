import { Button } from '@/components/ui/button'
import { getProductByIdApi, updateProductApi } from '@/services/product'
import {
    MutableProductSchema,
    MutableProductType,
} from '@/services/product/schema'
import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
    useForm,
    SubmitHandler,
    useFormContext,
    useFieldArray,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCategoriesApi } from '@/services/category'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CategoryCombobox } from './-components/category-dropdown'
import { CurrencyInput } from '@/components/ui/currency-input'
import { NumberInput } from '@/components/ui/number-input'
import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/products/$productId')({
    loader: ({ params, context }) => {
        context.queryClient.ensureQueryData(
            getProductByIDQueryOptions(params.productId),
        )
    },
    component: () => <UpdateCategoryPage />,
})

const getProductByIDQueryOptions = (productId: string) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => getProductByIdApi(productId),
    })

const categoriesQueryOptions = () =>
    queryOptions({
        queryKey: ['categories'],
        queryFn: getCategoriesApi,
    })

function UpdateCategoryPage() {
    const params = Route.useParams()

    const productQuery = useSuspenseQuery(
        getProductByIDQueryOptions(params.productId),
    )

    const product = productQuery.data

    const queryClient = useQueryClient()
    const categoriesQuery = useQuery(categoriesQueryOptions())
    const categories = categoriesQuery.data?.results || []
    const form = useForm<MutableProductType>({
        defaultValues: {
            productName: product.name,
            productSKU: product.sku,
            categoryID: product.categoryId,
            productBarcode: product.barcode,
            productBasePrice: product.basePrice,
            productCostPrice: product.costPrice,
            productQuantity: product.inventory.quantity,
            productStatus: product.status,
            variantOptionName:
                product.variants && product.variants.length > 0
                    ? product.variants[0].name
                    : '',
            variants: product.variants
                ? product.variants.map((v) => ({
                      variantID: v.id,
                      variantOptionValue: v.value,
                      variantSKU: v.sku,
                      variantBarcode: v.barcode,
                      variantBasePrice: v.basePrice,
                      variantCostPrice: v.costPrice,
                      variantStatus: v.status,
                      variantQuantity: v.inventory.quantity,
                  }))
                : [],
        },
        resolver: zodResolver(MutableProductSchema),
    })

    const updateCategoryMu = useMutation({
        mutationFn: (data: MutableProductType) =>
            updateProductApi(product.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['product', product.id],
            })
        },
    })

    const onSubmit: SubmitHandler<MutableProductType> = (data) => {
        const promisedMutation = updateCategoryMu.mutateAsync(data)
        toast.promise(promisedMutation, {
            loading: 'Updating product...',
            success: 'Product updated successfully',
            error: 'Failed to update product',
        })
    }

    useEffect(() => {
        console.log('error')
        console.log(form.formState.errors)
    }, [form.formState.errors])

    return (
        <div className="space-y-4">
            <div className="flex flex-row items-center justify-between">
                <span className="text-lg">
                    <Button variant="link" className="text-lg p-0" asChild>
                        <Link to="/products">Products </Link>
                    </Button>
                    <span> / </span> <span> {product.name}</span>
                </span>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full md:max-w-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="col-span-full">
                                    <CardHeader>
                                        <CardTitle> Product Details </CardTitle>
                                        <CardDescription>
                                            Manage your details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="productName"
                                            render={({ field }) => (
                                                <FormItem className="col-span-full">
                                                    <FormLabel>
                                                        Product Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="productStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Product Status
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="published">
                                                                Published
                                                            </SelectItem>
                                                            <SelectItem value="unpublished">
                                                                Unpublished
                                                            </SelectItem>
                                                            <SelectItem value="drafts">
                                                                Drafts
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="categoryID"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Category
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="w-full">
                                                            <CategoryCombobox
                                                                categories={
                                                                    categories
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/*<Card className="col-span-full">
                                    <CardHeader>
                                        <CardTitle> Media </CardTitle>
                                        <CardDescription>
                                            Manage your media
                                        </CardDescription>
                                        <CardContent></CardContent>
                                    </CardHeader>
                                </Card>*/}

                                <Card>
                                    <CardHeader>
                                        <CardTitle> Pricing </CardTitle>
                                        <CardDescription>
                                            Manage your pricing
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="productBasePrice"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <CurrencyInput
                                                            {...field}
                                                            getPassedNumber={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="productCostPrice"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>
                                                        Cost Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <CurrencyInput
                                                            {...field}
                                                            getPassedNumber={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="col-span-full">
                                    <CardHeader>
                                        <CardTitle> Inventory </CardTitle>
                                        <CardDescription>
                                            Manage your inventory
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="productSKU"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>SKU</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="productBarcode"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>
                                                        Bar-code
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="productQuantity"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>
                                                        Quantity
                                                    </FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            {...field}
                                                            getPassedNumber={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                <ProductVariants />
                                <Card className="p-6 m-0 col-span-full">
                                    <CardContent className="p-0 flex items-center justify-end">
                                        <Button type="submit">
                                            Update Product
                                        </Button>
                                    </CardContent>
                                </Card>
                                <div>&nbsp;</div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

function ProductVariants() {
    const [addVariant, setAddVariant] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const { control, setValue, getValues } =
        useFormContext<MutableProductType>()
    const { fields, append, remove, replace } = useFieldArray({
        name: 'variants',
        control,
    })

    const variantOptionName = getValues('variantOptionName')
    const variants = getValues('variants')

    const handleDeleteVariantOption = () => {
        setAddVariant(false)
        setValue('variantOptionName', '')
        replace([])
    }

    const handleDeleteVariantValue = (index: number) => {
        const variantsTBD = getValues('deletedVariantIDs') || []
        const variantID = variants[index]?.variantID || ''

        remove(index)
        setValue('deletedVariantIDs', [...variantsTBD, variantID])
    }

    const startEditMode = () => {
        setAddVariant(true)
        setEditMode(true)
        append({
            variantOptionValue: '',
            variantSKU: '',
            variantBarcode: '',
            variantBasePrice: 0,
            variantCostPrice: 0,
            variantQuantity: 0,
            variantStatus: 'active',
        })
    }

    if (!addVariant && !variants.length) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle> Variants </CardTitle>
                    <CardDescription>Manage your variants</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="link"
                        type="button"
                        onClick={startEditMode}
                        className="w-full text-blue-600"
                    >
                        <PlusIcon className="size-4" /> Add Variants
                    </Button>
                </CardContent>
            </Card>
        )
    }

    /**
     * This is the code that will be executed when the user clicks on the "Add Variants" button
     *
     *
     */
    if (editMode) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle> Variants </CardTitle>
                    <CardDescription>Manage your variants</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-start col-span-full gap-2">
                        <FormField
                            control={control}
                            name="variantOptionName"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Option Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Size" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="link"
                            onClick={handleDeleteVariantOption}
                        >
                            <XIcon className="size-5" />
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div
                            key={index}
                            className="flex items-end justify-start col-span-full gap-2"
                        >
                            <FormField
                                control={control}
                                key={field.id}
                                name={`variants.${index}.variantOptionValue`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel
                                            className={cn(
                                                'hidden items-center justify-start gap-2',
                                                index === 0 && 'flex',
                                            )}
                                        >
                                            <span>Option Values</span>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="flex"
                                                onClick={() =>
                                                    append({
                                                        variantOptionValue: '',
                                                        variantSKU: '',
                                                        variantBarcode: '',
                                                        variantBasePrice: 0,
                                                        variantCostPrice: 0,
                                                        variantQuantity: 0,
                                                        variantStatus: 'active',
                                                    })
                                                }
                                            >
                                                <PlusIcon className="size-4" />
                                                <span> Add Variant </span>
                                            </Button>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => handleDeleteVariantValue(index)}
                            >
                                <TrashIcon className="size-5" />
                            </Button>
                        </div>
                    ))}
                    <div className="col-span-full">
                        <Separator />
                    </div>
                    <div>
                        <Button
                            type="button"
                            onClick={() => setEditMode(false)}
                        >
                            Done
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle> Variants </CardTitle>
                <CardDescription>Manage your variants</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                    <div className="space-y-2">
                        <span> {variantOptionName} </span>
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => setEditMode(true)}
                            className="text-blue-600"
                        >
                            Edit
                        </Button>
                        <div className="flex items-center justify-start gap-2">
                            {variants.map((field, index) => (
                                <Badge key={index} variant="secondary">
                                    {field?.variantOptionValue || 'N/A'}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-full py-4">
                    <Separator />
                </div>
                <div className="col-span-full w-full">
                    <Table className="w-[48rem]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variant</TableHead>
                                <TableHead className="w-36">
                                    Base Price
                                </TableHead>
                                <TableHead className="w-36">
                                    Cost Price
                                </TableHead>
                                <TableHead className="w-12">Quantity</TableHead>
                                <TableHead className="w-48">SKU</TableHead>
                                <TableHead className="w-48">Barcode</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantOptionValue`}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <span> {field.value} </span>
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantBasePrice`}
                                            render={({ field, fieldState }) => (
                                                <FormControl>
                                                    <CurrencyInput
                                                        {...field}
                                                        className={cn(
                                                            fieldState.error &&
                                                                'border-destructive',
                                                        )}
                                                        getPassedNumber={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantCostPrice`}
                                            render={({ field, fieldState }) => (
                                                <FormControl>
                                                    <CurrencyInput
                                                        {...field}
                                                        className={cn(
                                                            fieldState.error &&
                                                                'border-destructive',
                                                        )}
                                                        getPassedNumber={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantQuantity`}
                                            render={({ field, fieldState }) => (
                                                <FormControl>
                                                    <NumberInput
                                                        {...field}
                                                        className={cn(
                                                            fieldState.error &&
                                                                'border-destructive',
                                                        )}
                                                        getPassedNumber={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantSKU`}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            key={field.id}
                                            name={`variants.${index}.variantBarcode`}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
