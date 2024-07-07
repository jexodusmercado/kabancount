import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Badge } from '@/components/ui/badge'
import {
    MutableProductSchema,
    MutableProductType,
} from '@/services/product/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
    SubmitHandler,
    useFieldArray,
    useForm,
    useFormContext,
} from 'react-hook-form'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { getCategoriesApi } from '@/services/category'
import { CategoryCombobox } from './-components/category-dropdown'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createProductApi } from '@/services/product'
import { toast } from 'sonner'
import { MediaDialog } from '@/components/shared/media-dialog'
import { VariantImageSelectorDialog } from './-components/variant-image-selector-dialog'

export const Route = createFileRoute('/_auth/products/create')({
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(categoriesQueryOptions()),
    component: CreateProduct,
})

const categoriesQueryOptions = () =>
    queryOptions({
        queryKey: ['categories'],
        queryFn: getCategoriesApi,
    })

function CreateProduct() {
    const BUCKET_URL = import.meta.env.VITE_BUCKET_URL
    const queryClient = useQueryClient()
    const router = useRouter()
    const categoriesQuery = useQuery(categoriesQueryOptions())
    const categories = categoriesQuery.data?.results || []
    const form = useForm<MutableProductType>({
        defaultValues: {
            productName: '',
            productSKU: '',
            productBarcode: '',
            productBasePrice: 0,
            productCostPrice: 0,
            productQuantity: 0,
            productStatus: undefined,
            variantOptionName: '',
            variants: [],
        },
        resolver: zodResolver(MutableProductSchema),
    })

    const selectedProductImages = form.watch('productMedias') || []

    const createProductMu = useMutation({
        mutationFn: (data: MutableProductType) => createProductApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['products'],
            })
            form.reset()

            router.navigate({ to: '/products' })
        },
    })

    const onSubmit: SubmitHandler<MutableProductType> = (data) => {
        const promisedMutation = createProductMu.mutateAsync(data)
        toast.promise(promisedMutation, {
            loading: 'Creating product...',
            success: 'Product created successfully',
            error: 'Failed to create product',
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-row items-center justify-between">
                <span className="text-lg">
                    <Button variant="link" className="text-2xl p-0" asChild>
                        <Link to="/products">Products </Link>
                    </Button>
                    <span> / </span> <span> Create Product </span>
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
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="col-span-full">
                                    <CardHeader>
                                        <CardTitle> Media </CardTitle>
                                        <CardDescription>
                                            Manage your media
                                        </CardDescription>
                                        <CardContent className="p-0 space-y-2">
                                            {selectedProductImages.length >
                                                0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedProductImages.map(
                                                        (media) => (
                                                            <div
                                                                key={media.id}
                                                                className="aspect-w-1 aspect-h-1"
                                                            >
                                                                <img
                                                                    src={`${BUCKET_URL}${media.url}`}
                                                                    alt={
                                                                        media.name
                                                                    }
                                                                    className="w-full h-48 object-cover rounded-md"
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <MediaDialog />
                                        </CardContent>
                                    </CardHeader>
                                </Card>

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
                                            name="productDiscountedPrice"
                                            render={({ field }) => (
                                                <div>
                                                    <FormLabel>
                                                        Discounted Price
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
                                            Create Product
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

    if (!addVariant) {
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
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => remove(index)}
                                >
                                    <TrashIcon className="size-5" />
                                </Button>
                            )}
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
                                <TableHead className="">Image</TableHead>
                                <TableHead className="">Variant</TableHead>
                                <TableHead className="w-36">
                                    Base Price
                                </TableHead>
                                <TableHead className="w-36">
                                    Discounted Price
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
                                        <VariantImageSelectorDialog
                                            index={index}
                                        />
                                    </TableCell>
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
                                            name={`variants.${index}.variantDiscountedPrice`}
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
