// Mocks useRouter
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

/**
 * mockNextUseRouter
 * Mocks the useRouter React hook from Next.js on a test-case by test-case basis
 */
export function mockNextUseRouter(
  { route, pathname, query, asPath },
  { once = false } = {},
) {
  useRouter[once ? 'mockImplementationOnce' : 'mockImplementation'](() => ({
    route,
    pathname,
    query,
    asPath,
  }))
}
