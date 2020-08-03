import React from 'react'
import Layout from 'components/Layout'
import RequireSignIn from 'components/RequireSignIn'
import { useAuth } from 'contexts/AuthContext'
import { Container } from '@material-ui/core'

const NewPost = () => {
  const user = useAuth()
  return (
    <Layout title="Write a new post">
      {user ? (
        <>
          <Container>new post</Container>
        </>
      ) : (
        <RequireSignIn />
      )}
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  return { props: {} }
}

export default NewPost
