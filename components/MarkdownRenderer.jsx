import MarkdownIt from 'markdown-it'

import { memo, useMemo } from 'react'
import 'github-markdown-css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
})

function b64_to_utf8(str) {
  // 如果直接atob(str), 当str里有中文的时候会变成乱码
  return decodeURIComponent(escape(atob(str)))
}

export default memo(function MarkdownRenderer({ content, isBase64 }) {
  const markdown = isBase64 ? b64_to_utf8(content) : content

  const html = useMemo(() => md.render(markdown), [markdown])

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})
