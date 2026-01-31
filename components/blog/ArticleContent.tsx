import type { ReactNode } from 'react'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Simple markdown-style parser for content
  const lines = content.trim().split('\n')
  const elements: ReactNode[] = []
  
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    
    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }
    
    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {line.substring(2)}
        </h1>
      )
      i++
      continue
    }
    
    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-3xl font-bold mt-12 mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {line.substring(3)}
        </h2>
      )
      i++
      continue
    }
    
    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-2xl font-semibold mt-8 mb-3 text-white">
          {line.substring(4)}
        </h3>
      )
      i++
      continue
    }
    
    // Code block
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-slate-950/80 border border-white/10 rounded-xl p-6 overflow-x-auto my-6">
          <code className="text-purple-300 text-sm font-mono">
            {codeLines.join('\n')}
          </code>
        </pre>
      )
      i++
      continue
    }
    
    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].substring(2))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-2 my-6 text-purple-100">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
      continue
    }
    
    // Ordered list
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].substring(lines[i].indexOf('. ') + 2))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-2 my-6 text-purple-100">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      )
      continue
    }
    
    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(
        <hr key={i} className="border-white/10 my-12" />
      )
      i++
      continue
    }
    
    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-purple-500 pl-6 italic text-purple-200 my-6">
          {line.substring(2)}
        </blockquote>
      )
      i++
      continue
    }
    
    // Regular paragraph - parse inline formatting
    const paragraph = parseInlineFormatting(line)
    elements.push(
      <p key={i} className="text-purple-100 leading-relaxed mb-6">
        {paragraph}
      </p>
    )
    i++
  }
  
  return (
    <article className="max-w-[65ch] mx-auto">
      {elements}
    </article>
  )
}

// Helper function to parse inline formatting (bold, italic, links, code)
function parseInlineFormatting(text: string): (string | ReactNode)[] {
  const parts: (string | ReactNode)[] = []
  let currentText = ''
  let i = 0
  
  while (i < text.length) {
    // Bold **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      if (currentText) {
        parts.push(currentText)
        currentText = ''
      }
      i += 2
      let boldText = ''
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i]
        i++
      }
      parts.push(<strong key={parts.length} className="text-white font-semibold">{boldText}</strong>)
      i += 2
      continue
    }
    
    // Inline code `code`
    if (text[i] === '`' && text[i - 1] !== '`') {
      if (currentText) {
        parts.push(currentText)
        currentText = ''
      }
      i++
      let codeText = ''
      while (i < text.length && text[i] !== '`') {
        codeText += text[i]
        i++
      }
      parts.push(
        <code key={parts.length} className="bg-slate-950/50 px-2 py-1 rounded text-purple-300 text-sm font-mono">
          {codeText}
        </code>
      )
      i++
      continue
    }
    
    // Links [text](url)
    if (text[i] === '[') {
      if (currentText) {
        parts.push(currentText)
        currentText = ''
      }
      i++
      let linkText = ''
      while (i < text.length && text[i] !== ']') {
        linkText += text[i]
        i++
      }
      i += 2 // Skip ](
      let linkUrl = ''
      while (i < text.length && text[i] !== ')') {
        linkUrl += text[i]
        i++
      }
      parts.push(
        <a key={parts.length} href={linkUrl} className="text-purple-400 underline hover:text-purple-300">
          {linkText}
        </a>
      )
      i++
      continue
    }
    
    currentText += text[i]
    i++
  }
  
  if (currentText) {
    parts.push(currentText)
  }
  
  return parts.length > 0 ? parts : [text]
}
