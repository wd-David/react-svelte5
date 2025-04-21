# We Heard You Like Svelte, So We Put Svelte in Your React App

> ...and Ending Up Migrating Everything to SvelteKit

Ever have one of those “What if we just tried…” moments, only to find yourself months later on the other side of a full-blown migration? That’s exactly how we ended up swapping React for SvelteKit.

This wasn’t a bold, all-in decision from day one. Our journey started with pure curiosity—a series of “let’s see if it works” experiments. We tried Svelte 5 in a React SPA, then pushed a little further, and a little further still. Each time, the answer was: “Hey, this actually works!” By the time we proved we could run React components inside SvelteKit, there was no turning back.

This post is a chronicle of that trial-and-error adventure: the wins, the fails, and the real-world lessons from migrating a production app one experiment at a time. And in the end? The best tech choice might just be the one that keeps moving your business forward—especially in the AI era.

Jump to [part two](#part-2-migrate) if you only want to know how to migrate.

Let's get started.

## Part 1: Decision-Making

"Do not rewrite your product!" is a common piece of advice from seasoned product/tech leaders.

No matter whether you're in a startup or a large company, business value is the ultimate metric for decision-making, especially at a profit center.

"You don't understand! We have years of tech debt, we can replace x, y, z with a new library, performance can be improved by 30%, lighthouse scores can be improved by 20%, CI times can be cut in half, development speed can be doubled, also..."

"Alright, how long will it take?"

"About 6 months."

"Can you do it in 3 months and keep shipping new features and bug fixes?"

If you've been in a similar situation, you might have already guessed the outcome of this conversation.

As a tech leader, you know how undocumented legacy code can drag down the team's velocity, and how new features can be delayed or even canceled due to the unknowns.

On one side, your team is complaining about poorly written code produced by Jason, who left the company before the current team joined. On the other side, your business team is pushing for more ad-hoc features and not satisfied with the quality of the product.

Life is hard, buddy.

In mid-2024, we decided to embark on a gradual migration journey from a legacy React app to Svelte, with the goal of releasing a new version of the product in Q2 2025.

### Why?

- More than 80% of the React SPA is written in JavaScript without tests and documentation.
- Obsessed with DRY, which makes a simple component extremely complex to maintain. (Thanks, Jason)
- We have a hand-crafted graphic editor with poor performance (re-rendering excessively) utilizing SVGs, not the Canvas API.

You can address the first two issues by refactoring the codebase (we tried our best in the last two years). However, the last issue, which is more inherent to React, makes it a less than ideal choice for a graphic editor.

> Our editor is like Figma or Canva, but needs to support complex text formatting (different font, size, color, letter spacing, line height in one text box).

#### The React Rendering Challenge

React's rendering model, while powerful for many applications, presented significant challenges for our graphic editor:

1. **Virtual DOM Reconciliation**: React's reconciliation process compares the entire virtual DOM tree with its previous version to determine what needs to be updated. For a complex graphic editor with hundreds of elements, this process became expensive, especially during real-time editing.

2. **Coarse-grained Updates**: React's component-based update model meant that even small changes to a text property could trigger re-renders of entire component trees. We tried various optimization techniques (memoization, `React.memo`, careful prop management), but still struggled with performance.

3. **Batched State Updates**: React's batching of state updates sometimes made it difficult to achieve the precise, immediate feedback needed in a design tool where users expect pixel-perfect control.

I've long dreamed of fine-grained reactivity, particularly when debugging the editor's issues and optimizing rendering performance. The introduction of runes in Svelte 5 has made this a reality.

When Svelte 5 RC was released, I decided it was time to take the leap.

<!-- To convince the team to try Svelte, I highlighted Svelte's unique selling points: its performance, concise syntax, and most importantly, the mental model shift that comes with Svelte.

In React, a common concern is how to prevent unnecessary re-renders or recalculations. Svelte's approach to reactivity is distinct from React's, and it's easier to understand and work with.

This is crucial when building a graphic editor, where precise control over rendering and performance is vital. -->

### Start with Small Bets

To ease back into Svelte (my last experience was with Svelte 3, pre-SvelteKit), I began by building a simple modal component. Modals are a great test case—they’re self-contained, but still touch on state, events, and styling.

My goal was to get a feel for Svelte 5’s new syntax and see how smoothly it could be integrated into an existing React app. (If you want to jump straight to the integration details, see [React + Svelte 5 components](#prerequisites).)

Once I had the modal working, I felt confident enough to migrate an entire route to Svelte, which really showcased how clean and expressive the new syntax is.

#### Not Everything is a Win

I was pleasantly surprised by how smooth the transition was, but I also encountered a few challenges along the way.
- Ecosystem is not ready for Svelte 5: Makes sense. I believe most author libraries were waiting for the release-candidate before starting to support Svelte 5. Mix use of store and runes are inevitable, it makes team confusing about when to use which.
- Lack of best practices and patterns: It's a chicken and egg problem, early-adopters are still exploring, still early to form best practices and patterns. Rounds of trial and error are inevitable.

Seriously, I don't think above two are deal-breakers, it's just a matter of time.

#### Rewrite is not enough to get buy-in

Migrating an entire route and keep everything working is not enough. There must be a clear value proposition.

- Total amount of code
- How fast to build a new feature?
- How fast to address an issue?
- How easy for your team to understand the code?

After we get positive feedback after deploying to the production, it's time to migrate.

### In fact, it's not just a migration...

#### Pick up Svelte 5 & SvelteKit is not easy

#### Your DX is not your team's DX

Mental modal shift is a considerable cost.

#### Key Takeaways

- Be honest about both the upsides and the challenges. Svelte 5’s ecosystem is still young, and you’ll need to improvise or adapt patterns from elsewhere.
  - double-edge sword, React tends to find yet another libraryies, but apps are getting more and more complex. On the other hand, Svelte makes it easier to build your own using Svelte actions.
- Give your team time to adjust—switching mental models from React to Svelte takes practice.
- Avoid overwhelming your project with too many changes at once. For example, I held off on introducing SvelteKit until the team was comfortable with Svelte itself.
- Start with isolated components to minimize risk and maximize learning before scaling up.

#### Tech Stack
- React vite SPA
- Redux (not redux toolkit) + Context API
- Material UI 4 + CSS modules
- Svelte 5
- shadcn-svelte

## Part 2: Migrate
### Prerequisites

- pnpm workspace
- Vite-based React app
  > or you can use `reactify` from [`svelte-preprocess-react`](https://github.com/bfanger/svelte-preprocess-react/tree/main) in a non-Vite React app
- Svelte 5 + SvelteKit 2

#### React + Svelte 5 components
Run `pnpm create vite react-vite --template react-ts` to create a new React app in this monorepo.

1. Install `svelte` & `@sveltejs/vite-plugin-svelte`:
```bash
pnpm add -D svelte @sveltejs/vite-plugin-svelte
```

2. Add `@sveltejs/vite-plugin-svelte` to `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svelte()]
})
```

3. Create a `useSvelte.tsx` hook:
```tsx
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
```

4. Create a Svelte component (in the React app) and use `useSvelte`:
```svelte
// src/lib/components/counter/counter.svelte
<script lang="ts">
  let { initCount = 0 }: { initCount: number } = $props()
  let counter = $state(initCount)
</script>

<button onclick={() => (counter += 1)}>
  Svelte count is {counter}
</button>

```
```tsx
// src/lib/components/counter/svelte-counter.tsx
import useSvelte from '../../hooks/useSvelte'
import Counter from './counter.svelte'

export default function SvelteCounter({ initCount }: { initCount: number }) {
  const SvelteCounter = useSvelte(Counter)

  return <SvelteCounter initCount={initCount} />
}
```

5. Add to `App.tsx` and test it:
```tsx
import { useState } from 'react'
import { SvelteCounter } from './lib/components/counter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        React count is {count}
      </button>
      <SvelteCounter initCount={0} />
    </>
  )
}

export default App
```
![svelte-in-react](./assets/svelte5-in-react.gif)
You may have noticed an issue with this approach.

Due to React's rerendering behavior, the Svelte component gets remounted each time, which is not the desired outcome.

To resolve this, let's add `memo` to `SvelteCounter`:
```tsx
// src/lib/components/counter/svelte-counter.tsx
import { memo } from 'react'
import useSvelte from '../../hooks/useSvelte'
import Counter from './counter.svelte'

export default memo(function SvelteCounter({ initCount }: { initCount: number }) {
  const SvelteCounter = useSvelte(Counter)

  return <SvelteCounter initCount={initCount} />
})
```
It should work as expected now:
![svelte-in-react-fixed](./assets/svelte5-in-react-fixed.gif)

> **Note**: As a best practice, only pass props that don't change frequently to Svelte components, such as global variables like i18n, theme configurations, etc.

#### SvelteKit + React components

In order to migrate the whole app incrementally, we move some shared React components to a package `react-components` under this monorepo to ensure we can use them in both React & SvelteKit apps.

Adding React components to SvelteKit requires a different approach than integrating Svelte components into React.

1. First, we need to package the shared React components to make them available to both applications.
> Please find the source code in `packages/react-components`. We use nodemon to watch the source files and rebuild the package when they change.

2. Run `npx sv create sveltekit` to create a new SvelteKit app in this monorepo.

3. We use [svelte-preprocess-react](https://github.com/bfanger/svelte-preprocess-react/tree/main) to add React support to SvelteKit.
```bash
# in the sveltekit folder
pnpm add -D svelte-preprocess-react react react-dom
```
Add `svelte-preprocess-react` to `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import preprocessReact from 'svelte-preprocess-react/preprocessReact'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), preprocessReact()],

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter()
  }
}

export default config
```
4. Add `react-components` to `package.json`:
```json
{
  "dependencies": {
    "react-components": "workspace:^"
  }
}
```

5. Add React components to SvelteKit:
```tsx
// packages/react-components/src/counter/index.tsx
import { useState } from 'react'

export default function Counter({ initCount = 0 }: { initCount: number }) {
  const [count, setCount] = useState(initCount)

  function incrementCount() {
    setCount((count) => count + 1)
  }

  return (
    <>
      <p>React counter: {count}</p>
      <button onClick={incrementCount}>+1</button>
    </>
  )
}
```
```svelte
// apps/sveltekit/src/lib/components/react-counter.svelte
<script lang="ts">
  import { sveltify } from 'svelte-preprocess-react'
  import { Counter } from 'react-components'

  const react = sveltify({ Counter })
  let initCount = $state(0)
</script>

<!-- In Svelte, you can use the shorthand {initCount} syntax -->
<react.Counter {initCount} />
```
> You can use a react component library or use your own components.

6. Add to `apps/sveltekit/src/routes/+page.svelte`:
```svelte
<script lang="ts">
  import { ReactCounter } from '$lib/components'
</script>

<ReactCounter initCount={0} />
```
![react-in-sveltekit](./assets/react-in-sveltekit.gif)
