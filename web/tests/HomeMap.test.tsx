import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { HomeMap } from '../src/views/dashboard/HomeMap'

test('shows indoor badge and highlights the current room', () => {
  const { container } = render(<HomeMap mode="indoor" room="거실" />)
  expect(screen.getByTestId('map-badge')).toHaveTextContent('실내 모드')
  expect(container.querySelector('.room.is-active')).toBeTruthy()
  expect(screen.getByTestId('here-dot')).toBeInTheDocument()
})

test('shows outdoor badge with no position dot', () => {
  render(<HomeMap mode="outdoor" />)
  expect(screen.getByTestId('map-badge')).toHaveTextContent('실외 모드')
  expect(screen.queryByTestId('here-dot')).not.toBeInTheDocument()
})
