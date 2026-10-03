import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { slugify, stripLeadingTitle, stripMarkdownToText } from '@/lib/blog'

interface MarkdownContentProps {
  content: string
  className?: string
}

export interface TocItem {
  id: string
  text: string
  level: number
}

// Extract headings from markdown for TOC
export function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2})\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(stripLeadingTitle(markdown))) !== null) {
    const level = match[1].length
    const text = stripMarkdownToText(match[2].trim())
    headings.push({ id: slugify(text), text, level })
  }

  return headings
}

export interface FaqItem {
  question: string
  answer: string
}

// Extrae preguntas frecuentes de una sección "## Preguntas frecuentes" con "### ¿Pregunta?" + respuesta
export function extractFaq(markdown: string): FaqItem[] {
  const match = /^##\s+Preguntas frecuentes[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(markdown)
  if (!match) return []
  const items: FaqItem[] = []
  const re = /^###\s+(.+)\n+([\s\S]*?)(?=^###\s|(?![\s\S]))/gm
  let m
  while ((m = re.exec(match[1])) !== null) {
    const answer = stripMarkdownToText(m[2]).trim()
    if (answer) items.push({ question: stripMarkdownToText(m[1]).trim(), answer })
  }
  return items
}

// Process markdown to HTML
async function processMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(stripLeadingTitle(content))

  let html = String(file)

  // Heading ids (mismo algoritmo que extractHeadings para que el índice funcione)
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
    return `<h${level} id="${slugify(text)}">${inner}</h${level}>`
  })

  // External links open in a new tab
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"([^>]*)>/g,
    (_m, href: string, rest: string) => {
      const isOwn = /^https?:\/\/(www\.)?todoenergias\.com\.ar/.test(href)
      if (isOwn) return `<a href="${href}"${rest}>`
      const isPartner = /^https?:\/\/(www\.)?(solarpower|cargadorelectrico|solarpool)\.com\.ar/.test(href)
      return `<a href="${href}" target="_blank" rel="${isPartner ? 'noopener' : 'nofollow noopener'}"${rest}>`
    }
  )

  return html
}

export async function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const html = await processMarkdown(content)

  return (
    <div
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
