import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Article } from '@/types/articles'
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react'
import { formatDate } from '@/utils/format-date'

export default function ArticleViewDialog({ article }: { article: Article }) {
  const publishedDate = formatDate(article.datetime)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          View Article <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover flex h-[90vh] w-[95vw] flex-col gap-0 p-0 sm:h-[min(80vh,800px)] sm:max-w-4xl [&>button:last-child]:top-2 [&>button:last-child]:right-2 sm:[&>button:last-child]:top-3.5 sm:[&>button:last-child]:right-6">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="line-clamp-3 border-b px-4 py-3 text-lg leading-tight font-bold sm:line-clamp-2 sm:px-6 sm:py-4 sm:text-xl">
            {article.title}
          </DialogTitle>

          <div className="bg-muted/30 border-b px-4 py-2 sm:px-6 sm:py-3">
            <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Published {publishedDate}</span>
              </div>

              {article.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary hover:text-primary/80 h-auto w-fit p-0 text-xs sm:text-xs"
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Read original</span>
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {article.thumbnail_url && (
              <div className="relative h-[200px] w-full overflow-hidden sm:h-[300px]">
                <Image
                  src={article.thumbnail_url}
                  alt={article.title}
                  quality={100}
                  fill
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <DialogDescription asChild>
              <div className="px-4 py-4 sm:px-6 sm:py-6">
                <div className="prose prose-sm sm:prose [&_strong]:text-foreground max-w-none text-justify text-sm leading-relaxed sm:text-base [&_p]:mb-3 sm:[&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 sm:mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t px-4 py-3 sm:items-center sm:px-6 sm:py-4">
          <DialogClose asChild>
            <Button type="button" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
