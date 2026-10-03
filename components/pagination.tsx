import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PaginationInfo } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PaginationProps {
  pagination: PaginationInfo
  basePath: string
  className?: string
}

export function Pagination({ pagination, basePath, className }: PaginationProps) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) return null

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsisThreshold = 2

    // Always show first page
    pages.push(1)

    // Show ellipsis if needed
    if (page > showEllipsisThreshold + 2) {
      pages.push('ellipsis')
    }

    // Show pages around current
    for (let i = Math.max(2, page - showEllipsisThreshold); i <= Math.min(totalPages - 1, page + showEllipsisThreshold); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Show ellipsis if needed
    if (page < totalPages - showEllipsisThreshold - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  const buildUrl = (pageNum: number) => {
    return pageNum === 1 ? basePath : `${basePath}?page=${pageNum}`
  }

  return (
    <nav 
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Paginacion"
    >
      {/* Previous */}
      {page > 1 ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildUrl(page - 1)} aria-label="Pagina anterior">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            )
          }

          const isActive = pageNum === page
          return (
            <Button
              key={pageNum}
              variant={isActive ? 'default' : 'outline'}
              size="icon"
              asChild={!isActive}
              disabled={isActive}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <span>{pageNum}</span>
              ) : (
                <Link href={buildUrl(pageNum)}>{pageNum}</Link>
              )}
            </Button>
          )
        })}
      </div>

      {/* Next */}
      {page < totalPages ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildUrl(page + 1)} aria-label="Pagina siguiente">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
