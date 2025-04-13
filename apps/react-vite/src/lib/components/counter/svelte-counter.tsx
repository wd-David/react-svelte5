import { memo } from 'react'
import useSvelte from '../../hooks/useSvelte'
import Counter from './counter.svelte'

export default memo(function SvelteCounter({
  initCount
}: {
  initCount: number
}) {
  const SvelteCounter = useSvelte(Counter)

  return <SvelteCounter initCount={initCount} />
})
