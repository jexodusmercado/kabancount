import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { createMediaApi, getMediaApi } from '@/services/media'
import { CreateMediaType, MediaType } from '@/services/media/schema'
import { ChangeEvent, ElementRef, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useFormContext } from 'react-hook-form'
import { MutableProductType } from '@/services/product/schema'

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL

export const MediaDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button">Open Media Center</Button>
            </DialogTrigger>
            <MediaDialogContent isOpen={isOpen} setIsOpen={setIsOpen} />
        </Dialog>
    )
}

interface MediaDialogContentProps {
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
                    Save
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

const EmptyMediaDialogContent = () => {
    const maxSize = 25
    const acceptedFormats = ['png', 'jpeg', 'jpg', 'gif']
    const maxFileSizeInBytes = maxSize * 1024 * 1024

    const inputRef = useRef<ElementRef<'input'>>(null)
    const queryClient = useQueryClient()
    const formContext = useFormContext<MutableProductType>()
    const [selectedMedia, setSelectedMedia] = useState<MediaType[]>([])

    const uploadMediaMu = useMutation({
        mutationFn: (data: CreateMediaType) => createMediaApi(data),
        onSuccess: (data) => {
            setSelectedMedia(data)
        },
    })

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? event.target.files : null
        if (!files) {
            toast.error('No file selected')
            return
        }

        const arrayFiles = Array.from(files)

        arrayFiles.forEach((file, index) => {
            if (
                !acceptedFormats.includes(file.type.split('/')[1].toLowerCase())
            ) {
                arrayFiles.splice(index, 1)
                toast.error(
                    `The file ${file.name}. File format not supported. Supported formats are ${acceptedFormats.join(', ')}`,
                )
                return
            }

            if (file.size >= maxFileSizeInBytes) {
                arrayFiles.splice(index, 1)
                toast.error(
                    `The file ${file.name}. File is too large. Maximum file size is ${maxSize}MB`,
                )

                return
            }
        })

        const uploadPromise = uploadMediaMu.mutateAsync({
            images: arrayFiles,
        })

        toast.promise(uploadPromise, {
            loading: 'Uploading media...',
            success: () => {
                queryClient.invalidateQueries({
                    queryKey: ['media'],
                })
                return 'Media uploaded successfully'
            },
            error: 'Failed to upload media',
        })
    }

    useEffect(() => {
        formContext.setValue('productMedias', selectedMedia)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMedia])

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
                            ref={inputRef}
                            id="upload-file"
                            type="file"
                            className="hidden"
                            onChange={handleOnChange}
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
    const maxSize = 25
    const acceptedFormats = ['png', 'jpeg', 'jpg', 'gif']
    const maxFileSizeInBytes = maxSize * 1024 * 1024

    const inputRef = useRef<ElementRef<'input'>>(null)
    const queryClient = useQueryClient()
    const formContext = useFormContext<MutableProductType>()
    const [selectedMedia, setSelectedMedia] = useState<MediaType[]>([])

    const uploadMediaMu = useMutation({
        mutationFn: (data: CreateMediaType) => createMediaApi(data),
        onSuccess: (data) => {
            setSelectedMedia(data)
        },
    })

    const handleSelectMedia = (media: MediaType) => {
        if (selectedMedia) {
            const isMediaExist = selectedMedia.find(
                (selected) => selected.id === media.id,
            )

            if (isMediaExist) {
                setSelectedMedia(
                    selectedMedia.filter(
                        (selected) => selected.id !== media.id,
                    ),
                )
            } else {
                setSelectedMedia([...selectedMedia, media])
            }
        } else {
            setSelectedMedia([media])
        }
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? event.target.files : null
        if (!files) {
            toast.error('No file selected')
            return
        }

        const arrayFiles = Array.from(files)

        arrayFiles.forEach((file, index) => {
            if (
                !acceptedFormats.includes(file.type.split('/')[1].toLowerCase())
            ) {
                arrayFiles.splice(index, 1)
                toast.error(
                    `The file ${file.name}. File format not supported. Supported formats are ${acceptedFormats.join(', ')}`,
                )
                return
            }

            if (file.size >= maxFileSizeInBytes) {
                arrayFiles.splice(index, 1)
                toast.error(
                    `The file ${file.name}. File is too large. Maximum file size is ${maxSize}MB`,
                )

                return
            }
        })

        const uploadPromise = uploadMediaMu.mutateAsync({
            images: arrayFiles,
        })

        toast.promise(uploadPromise, {
            loading: 'Uploading media...',
            success: () => {
                queryClient.invalidateQueries({
                    queryKey: ['media'],
                })
                return 'Media uploaded successfully'
            },
            error: 'Failed to upload media',
        })
    }

    const handleSetMedia = () => {
        formContext.setValue('productMedias', selectedMedia)
        props.setIsOpen(false)
    }

    useEffect(() => {
        formContext.setValue('productMedias', selectedMedia)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMedia])

    return (
        <DialogContent className="w-full h-full md:h-4/6 md:max-w-3xl">
            <DialogHeader className="">
                <DialogTitle>Media Center</DialogTitle>
                <DialogDescription>
                    All of your media files in one place.
                </DialogDescription>
            </DialogHeader>
            <div> Selected Media: {selectedMedia?.length} </div>
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
                <div className="w-full flex items-center justify-between flex-row space-x-2">
                    <div>
                        <Button asChild>
                            <Label
                                htmlFor="upload-file"
                                className="cursor-pointer"
                            >
                                Upload
                                <Input
                                    ref={inputRef}
                                    id="upload-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleOnChange}
                                    multiple
                                />
                            </Label>
                        </Button>
                    </div>

                    <div className="inline-flex flex-row space-x-2">
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
                </div>
            </DialogFooter>
        </DialogContent>
    )
}

interface MediaItemProps {
    media: MediaType
    onSelectMedia: (media: MediaType) => void
    selectedMedia: MediaType[] | null
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
                        props.selectedMedia?.find(
                            (media) => media.id === props.media.id,
                        )
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
