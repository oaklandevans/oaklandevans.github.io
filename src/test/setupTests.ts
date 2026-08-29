import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Not using Vitest's `globals: true`, so @testing-library/react's own auto-cleanup (which relies on
// detecting a global afterEach) doesn't kick in — register it explicitly instead.
afterEach(cleanup)
