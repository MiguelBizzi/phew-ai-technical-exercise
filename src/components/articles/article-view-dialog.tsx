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
      <DialogContent className="bg-popover flex flex-col gap-0 p-0 sm:max-h-[min(80vh,800px)] sm:max-w-4xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="line-clamp-2 border-b px-6 py-4 text-xl font-bold">
            {article.title}
          </DialogTitle>

          <div className="bg-muted/30 border-b px-6 py-3">
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Published {publishedDate}</span>
              </div>

              {article.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
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

          <div className="overflow-y-auto">
            {article.thumbnail_url && (
              <div className="relative h-[300px] w-full overflow-hidden">
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
              <div className="px-6 py-6">
                <div className="prose prose-sm [&_strong]:text-foreground max-w-none text-justify leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
