import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Coffee, Share2 } from 'lucide-react'

export function SupportDialog({ open, onOpenChange }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        Projeyi Destekle
                    </DialogTitle>
                    <DialogDescription>
                        Bu proje tamamen ücretsizdir. Geliştirmeye devam etmem için bana destek olabilirsiniz! ❤️
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        className="w-full bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 font-bold"
                        onClick={() => window.open('https://buymeacoffee.com/onurkeskinq', '_blank')}
                    >
                        <Coffee className="mr-2 h-5 w-5" />
                        Bana Kahve Ismarla
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Done',
                                    text: 'Harika bir görev yönetim uygulaması!',
                                    url: window.location.href,
                                })
                            }
                        }}
                    >
                        <Share2 className="mr-2 h-5 w-5" />
                        Arkadaşlarınla Paylaş
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
