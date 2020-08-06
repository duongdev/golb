import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { mockNextUseRouter } from 'utils/testing'
import NewPost from './new'
import { AuthProvider } from 'contexts/AuthContext'

describe('pages/posts/new', () => {
  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it(`redirects to /auth when no user signed in`, () => {
    const router = mockNextUseRouter({
      route: '/posts/new',
      pathname: '/posts/new',
      query: '',
      asPath: `/posts/new`,
    })

    render(
      <AuthProvider user={null}>
        <NewPost />
      </AuthProvider>,
    )
    expect(router.replace).toBeCalledWith(
      `/auth?redirect=${encodeURIComponent(router.pathname)}`,
    )
    expect(screen.getByText('Redirecting to sign in...')).toBeInTheDocument()
  })

  it(`renders the editor if the user has signed in`, async () => {
    mockNextUseRouter({
      route: '/posts/new',
      pathname: '/posts/new',
      query: '',
      asPath: `/posts/new`,
    })

    render(
      <AuthProvider
        user={{
          id: 1,
          username: 'duongdev',
          name: 'Duong',
          email: 'dustin.do95@gmail.com',
          avatar: 'avatar_url',
        }}
      >
        <NewPost showSignInOptions />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('New post title here...'),
      ).toBeInTheDocument()
      expect(
        screen.queryByText('Write your post content here...'),
      ).toBeInTheDocument()
      expect(screen.queryByTestId('post-editor').innerHTML).toMatchSnapshot()
    })
  })
})
