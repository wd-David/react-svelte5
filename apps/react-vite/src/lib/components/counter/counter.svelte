<script lang="ts">
  let { initCount = 0 }: { initCount: number } = $props()
  let counter = $state(initCount)
</script>

<button onclick={() => (counter += 1)}>
  Svelte count is {counter}
</button>
