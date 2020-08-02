import React, { useMemo, useState, useCallback } from 'react'

import isHotkey from 'is-hotkey'
import { createEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { Typography } from '@material-ui/core'
import { Button, Toolbar } from './components'
import {
  FormatBold,
  FormatItalic,
  FormatUnderline,
  CodeTags,
  FormatHeader1,
  FormatHeader2,
  FormatQuoteClose,
  FormatListNumbered,
  FormatListBulleted,
} from 'mdi-material-ui'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const TextEditor = (props) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(
    props.value ?? [
      {
        children: [{ text: '' }],
      },
    ],
  )
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const handleChange = useCallback(
    (value) => {
      setValue(value)
      if (typeof props.onChange === 'function') {
        props.onChange(value)
      }
    },
    [props],
  )

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Toolbar>
        <MarkButton format="bold" icon={FormatBold} />
        <MarkButton format="italic" icon={FormatItalic} />
        <MarkButton format="underline" icon={FormatUnderline} />
        <MarkButton format="code" icon={CodeTags} />
        <BlockButton format="heading-one" icon={FormatHeader1} />
        <BlockButton format="heading-two" icon={FormatHeader2} />
        <BlockButton format="block-quote" icon={FormatQuoteClose} />
        <BlockButton format="numbered-list" icon={FormatListNumbered} />
        <BlockButton format="bulleted-list" icon={FormatListBulleted} />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Write your post content here..."
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon: Icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon />
    </Button>
  )
}

const MarkButton = ({ format, icon: Icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon />
    </Button>
  )
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

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return (
        <Typography variant="h5" {...attributes}>
          {children}
        </Typography>
      )
    case 'heading-two':
      return (
        <Typography variant="h6" {...attributes}>
          {children}
        </Typography>
      )
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return (
        <Typography gutterBottom component="p" {...attributes}>
          {children}
        </Typography>
      )
  }
}

export default TextEditor
