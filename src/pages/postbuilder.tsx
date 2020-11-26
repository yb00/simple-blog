import React, { useCallback, useMemo, useState } from "react"

import axios from "axios"

import isHotkey from "is-hotkey"
import { Editable, withReact, Slate } from "slate-react"
import { Editor, createEditor, Node, Text } from "slate"
import { withHistory } from "slate-history"
import escapeHtml from "escape-html"

import Layout from "src/components/Layout"
import Snackbar from "src/components/Snackbar"

import "./styles/postbuilder.css"

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true},
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

const serialize = node => {
  if(Text.isText(node)) {
    let text = <>{node.text}</>
    if("bold" in node && node["bold"] == true)
      text = <b>{text}</b>
    if("italic" in node && node["italic"] == true)
      text = <i>{text}</i>
    if("code" in node && node["code"] == true)
      text = <code>{text}</code>
    return text
  }

  const children = node.children.map(n => [serialize(n)])

  switch (node.type) {
    case 'block-quote':
      return <blockquote><p>{children}</p></blockquote>
    case 'paragraph':
      // return `<p>${children}</p>`
      return <p>{children}</p>
    case 'link':
      return <a href="${escapeHtml(node.url)}">{children}</a>
    default:
      return children
  }
}


const PostBuilder = () => {
  const [title, setTitle] = useState("")
  const [value, setValue] = useState<Node[]>(initialValue)

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const newPost = async (post) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/blog`,
      post)
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Layout>
      {value.map(node => serialize(node))}
      <div className="edit-area">
        <div>
        <input className="post__title" placeholder="Your title here." onChange={(e) => setTitle(e.target.value)}/>
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
          />
        </Slate>
        </div>
        <button className="post__submit" onClick={() => newPost({title: title, author: "No one", date: Date.now, body: value})}>Post</button>
      </div>
      
    </Layout>
  )
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default PostBuilder
