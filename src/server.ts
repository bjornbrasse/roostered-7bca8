import { CONVEX_URL } from '~/lib/env'

import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'

if (!CONVEX_URL) {
  throw new Error('Missing CONVEX_URL')
}

export default createStartHandler({
  createRouter: () => createRouter({ convexUrl: CONVEX_URL! }),
})(defaultStreamHandler)
