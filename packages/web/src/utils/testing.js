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
  const router = {
    route,
    pathname,
    query,
    asPath,
    replace: jest.fn(),
  }
  useRouter[once ? 'mockImplementationOnce' : 'mockImplementation'](
    () => router,
  )
  return router
}
