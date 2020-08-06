import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockNextUseRouter } from 'utils/testing'
import App from './index'

describe('pages/index', () => {
  const data = {
    docs: [],
    totalDocs: 0,
    limit: 10,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  }

  beforeEach(() => {
    mockNextUseRouter({
      route: '/',
      pathname: '/',
      query: '',
      asPath: `/`,
    })
  })
  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  it('renders correct message when the post list is empty', () => {
    render(<App data={data} />)
    expect(screen.getByTestId('empty-message').innerHTML).toMatchInlineSnapshot(
      `"There is no posts created yet."`,
    )
  })

  it('renders correct message when the search result is empty', () => {
    render(
      <App
        data={{
          ...data,
          searchText: 'something does not exist',
        }}
      />,
    )
    expect(screen.getByTestId('empty-message').innerHTML).toMatchInlineSnapshot(
      `"Couldn't find any posts relevant to <strong>something does not exist</strong>."`,
    )
  })

  it(`doesn't render the Pagination if there's only 1 page`, () => {
    render(<App data={data} />)
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it(`renders the Pagination if there're 2 pages`, () => {
    render(<App data={{ ...data, totalPages: 2 }} />)
    expect(screen.queryByTestId('pagination')).toBeInTheDocument()
    expect(screen.queryByTestId('pagination').innerHTML).toMatchSnapshot()
  })

  it(`renders the list of posts correctly`, () => {
    render(
      <App
        data={{
          ...data,
          totalPages: 1,
          docs: [
            {
              id: 1,
              title: 'The first post',
              plainText: 'The first post content',
            },
            {
              id: 2,
              title: 'The second post',
              plainText: 'The second post content',
            },
          ],
        }}
      />,
    )
    expect(screen.queryAllByTestId('post-grid-item').length).toEqual(2)
  })
})
