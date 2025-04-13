<script lang="ts">
  import { sveltify } from 'svelte-preprocess-react'
  import { Counter } from 'react-components'

  const react = sveltify({ Counter })
  let initCount = $state(0)
</script>

<react.Counter {initCount} />
