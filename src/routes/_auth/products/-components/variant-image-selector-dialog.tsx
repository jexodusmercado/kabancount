import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMediaApi } from '@/services/media'
import { MediaType } from '@/services/media/schema'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { MutableProductType } from '@/services/product/schema'
import { ImageIcon } from 'lucide-react'

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL

interface MediaDialogProps {
    index: number
}

export const VariantImageSelectorDialog = (props: MediaDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const formContext = useFormContext<MutableProductType>()
    const variantSelectedImage = formContext.getValues(
        `variants.${props.index}.variantMedia`,
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" className="p-0 w-full">
                    {variantSelectedImage ? (
                        <img
                            src={BUCKET_URL + variantSelectedImage.url}
                            alt={variantSelectedImage.name}
                            className="size-8 object-cover rounded-md hover:contrast-50 transition duration-300 ease-in-out"
                        />
                    ) : (
                        <ImageIcon />
                    )}
                </Button>
            </DialogTrigger>
            <MediaDialogContent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                index={props.index}
            />
        </Dialog>
    )
}

interface MediaDialogContentProps extends MediaDialogProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

const MediaDialogContent = (props: MediaDialogContentProps) => {
    const mediaQuery = useQuery({
        queryKey: ['media'],
        queryFn: () => getMediaApi(1, 100),
    })

    if (mediaQuery.isLoading) {
        return (
            <LoadingMediaDialogContent
                isOpen={props.isOpen}
                setIsOpen={props.setIsOpen}
                index={props.index}
            />
        )
    }

    if (
        (mediaQuery && !mediaQuery.data) ||
        mediaQuery.data.results.length === 0
    ) {
        return <EmptyMediaDialogContent />
    }

    return (
        <MediaListContent
            data={mediaQuery.data.results}
            isOpen={props.isOpen}
            setIsOpen={props.setIsOpen}
            index={props.index}
        />
    )
}

const LoadingMediaDialogContent = (props: MediaDialogContentProps) => {
    return (
        <DialogContent className="w-full max-w-4xl h-1/2">
            <DialogHeader>
                <DialogTitle>Media Center</DialogTitle>
                <DialogDescription>
                    All of your media files in one place.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full h-full border border-gray-400 border-dashed">
                <p>Loading...</p>
            </div>
            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => props.setIsOpen(false)}
                >
                    Cancel
                </Button>
                <Button variant="default" disabled>
                    Set
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

const EmptyMediaDialogContent = () => {
    return (
        <DialogContent className="w-full max-w-4xl h-1/2">
            <DialogHeader>
                <DialogTitle>Media Center</DialogTitle>
                <DialogDescription>
                    All of your media files in one place.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full h-48 border border-gray-400 border-dashed">
                <div className="flex w-full h-full items-center justify-center">
                    <Label
                        htmlFor="upload-file"
                        className="w-full h-full flex items-center justify-center"
                    >
                        <h1> Upload File </h1>
                        <Input
                            id="upload-file"
                            type="file"
                            className="hidden"
                            multiple
                        />
                    </Label>
                </div>
            </div>
        </DialogContent>
    )
}

interface MediaListContentProps extends MediaDialogContentProps {
    data: MediaType[]
}
const MediaListContent = (props: MediaListContentProps) => {
    const formContext = useFormContext<MutableProductType>()
    const [selectedMedia, setSelectedMedia] = useState<MediaType>()

    const handleSelectMedia = (media: MediaType) => {
        setSelectedMedia(media)
    }

    const handleSetMedia = () => {
        formContext.setValue(
            `variants.${props.index}.variantMedia`,
            selectedMedia,
        )
        props.setIsOpen(false)
    }

    return (
        <DialogContent className="w-full h-full md:h-4/6 md:max-w-3xl">
            <DialogHeader className="">
                <DialogTitle>Media Center</DialogTitle>
                <DialogDescription>
                    All of your media files in one place.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full rounded-lg border border-gray-400 border-dashed p-8 overflow-auto">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {props.data.map((media) => (
                        <MediaItem
                            key={media.id}
                            media={media}
                            onSelectMedia={handleSelectMedia}
                            selectedMedia={selectedMedia}
                        />
                    ))}
                </div>
            </div>
            <DialogFooter>
                <div className="space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => props.setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleSetMedia}
                    >
                        Set
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}

interface MediaItemProps {
    media: MediaType
    onSelectMedia: (media: MediaType) => void
    selectedMedia?: MediaType
}

const MediaItem = (props: MediaItemProps) => {
    const handleSelectMedia = () => {
        props.onSelectMedia(props.media)
    }

    return (
        <div className="group">
            <button
                onClick={handleSelectMedia}
                className="h-full w-full group-hover:opacity-75"
            >
                <div
                    className={cn(
                        'aspect-h-1 aspect-w-1 overflow-hidden rounded-md transition duration-300 ease-in-out',
                        props.selectedMedia?.id === props.media.id
                            ? 'border-2 border-blue-600 '
                            : 'border-transparent contrast-50',
                    )}
                >
                    <img
                        src={BUCKET_URL + props.media.url}
                        alt={props.media.name}
                        className="object-cover object-center"
                    />
                </div>
            </button>
        </div>
    )
}
