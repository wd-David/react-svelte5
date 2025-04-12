import useSvelte from '../../hooks/useSvelte'
import Counter from './counter.svelte'

export default function SvelteCounter({ initCount }: { initCount: number }) {
  const SvelteCounter = useSvelte(Counter)

  return <SvelteCounter initCount={initCount} />
}
