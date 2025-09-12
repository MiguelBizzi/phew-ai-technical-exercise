import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArticleCard } from '@/components/articles/article-card'
import { fetchArticles } from '@/server/actions/articles/fetchs'
import { ArticleSectionError } from './article-section-error'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function ArticlesSection() {
  try {
    const articles = await fetchArticles()

    return (
      <div className="space-y-8">
        <Card className="from-card to-card/80 border-0 bg-gradient-to-br shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="space-y-2">
              <CardTitle className="text-primary text-xl font-bold sm:text-2xl">
                Available Articles
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-base sm:text-lg">
                Select an article and add your context to generate an AI summary
                tailored to your needs
              </CardDescription>
            </div>

            <Link href="/summaries" className="self-start sm:self-auto">
              <Button size="sm">
                See summaries
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={article.id}
                className="animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))
          ) : (
            <Card className="from-card to-card/50 border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm">
              <CardContent className="p-8 text-center sm:p-12">
                <div className="space-y-4">
                  <div className="bg-muted/50 mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16">
                    <BookOpen className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <p className="text-muted-foreground text-base font-medium sm:text-lg">
                    No articles available at the moment
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    Check back later for new content
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return <ArticleSectionError error={error as Error} />
  }
}
