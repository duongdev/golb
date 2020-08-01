import React from 'react'

import EditorJs from 'react-editor-js'
import CheckList from '@editorjs/checklist'
import List from '@editorjs/list'
import Header from '@editorjs/header'

const tools = { checkList: CheckList, list: List, header: Header }

const PostEditor = (props) => {
  return (
    <EditorJs
      tools={tools}
      onChange={console.log}
      placeholder="Write your post content here..."
      {...props}
    />
  )
}

export default PostEditor
