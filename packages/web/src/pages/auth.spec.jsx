import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockNextUseRouter } from 'utils/testing'
import Auth from './auth'

describe('pages/auth', () => {
  beforeEach(() => {
    mockNextUseRouter({
      route: '/auth',
      pathname: '/auth',
      query: '',
      asPath: `/auth`,
    })
  })
  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it(`renders the sign in options correctly`, () => {
    render(<Auth showSignInOptions />)
    expect(screen.queryByTestId('require-sign-in').innerHTML).toMatchSnapshot()
  })
})
