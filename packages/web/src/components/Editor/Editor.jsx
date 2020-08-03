import React, { useMemo, useState, useCallback } from 'react'

import isHotkey from 'is-hotkey'
import { createEditor, Editor, Transforms } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
  useEditor,
} from 'slate-react'
import { Typography, useTheme, makeStyles } from '@material-ui/core'
import { Button, Toolbar } from './components'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
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
  Image,
} from 'mdi-material-ui'
import { css } from 'emotion'
import { withHistory } from 'slate-history'
import { APP_BAR_HEIGHT } from 'constants/ui'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const TextEditor = (props) => {
  const classes = useStyles(props)
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    [],
  )
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
      {!props.readOnly && (
        <div className={classes.toolbar}>
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
            <InsertImageButton />
          </Toolbar>
        </div>
      )}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Write your post content here..."
        readOnly={props.disabled || props.readOnly}
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

const useStyles = makeStyles(({ spacing, palette }) => ({
  toolbar: {
    position: 'sticky',
    top: APP_BAR_HEIGHT,
    paddingTop: spacing(2),
    backgroundColor: palette.background.paper,
  },
}))

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

const withImages = (editor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          alt=""
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  )
}

const InsertImageButton = () => {
  const editor = useEditor()
  return (
    <Button
      onMouseDown={(event) => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the image:')
        if (!url) return
        insertImage(editor, url)
      }}
    >
      <Image />
    </Button>
  )
}

const isImageUrl = (url) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

const Element = (props) => {
  const { attributes, children, element } = props
  const theme = useTheme()

  switch (element.type) {
    case 'image':
      return <ImageElement {...props} />
    case 'block-quote':
      return (
        <Typography
          variant="h6"
          color="textSecondary"
          style={{
            borderLeft: `solid 5px ${theme.palette.text.secondary}`,
            padding: theme.spacing(0.5, 0),
            margin: theme.spacing(1.5, 0),
          }}
          {...attributes}
        >
          <blockquote>{children}</blockquote>
        </Typography>
      )
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return (
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginTop: theme.spacing(3), ...attributes.style }}
          {...attributes}
        >
          {children}
        </Typography>
      )
    case 'heading-two':
      return (
        <Typography
          variant="h5"
          gutterBottom
          style={{ marginTop: theme.spacing(3), ...attributes.style }}
          {...attributes}
        >
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
