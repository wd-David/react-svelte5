import { useLayoutEffect, useRef } from 'react'
import { mount } from 'svelte'

type Component = Parameters<typeof mount>[0]
type Props = Parameters<typeof mount>[1]['props']

/** A wrapper for Svelte component */
export default function useSvelte(Component: Component) {
  const svelteRef = useRef<HTMLDivElement>(null)

  return (props: Props) => {
    useLayoutEffect(() => {
      while (svelteRef.current?.firstChild) {
        svelteRef.current?.firstChild?.remove()
      }
      mount(Component, {
        target: svelteRef.current as unknown as Document,
        props
      })
    }, [])

    return <div style={{ height: '100%', width: '100%' }} ref={svelteRef}></div>
  }
}
