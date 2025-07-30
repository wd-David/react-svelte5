<script lang="ts">
  import { onMount } from "svelte";
  import { createRoot } from "react-dom/client";
  import React from "react";

  type Props = {
    component: React.ComponentType<any>;
    [key: string]: unknown;
  };

  let { component, ...reactProps }: Props = $props();

  let container = $state<HTMLDivElement>();
  let lastKey = $state<string>("");
  let mounted = $state(false);
  let root = $state<ReturnType<typeof createRoot>>();

  // Create a unique key for this component instance
  let currentKey = $derived(
    JSON.stringify({
      campaign: (reactProps.campaign as { uuid?: string })?.uuid,
      layout: (reactProps.layout as { uuid?: string })?.uuid,
    })
  );

  // Handle React rendering
  $effect(() => {
    if (!mounted || !container || !root) return;

    if (currentKey !== lastKey) {
      // Key changed - unmounting old React tree
      root.unmount();

      // Creating new React tree for key:
      root = createRoot(container);
      root.render(React.createElement(component, reactProps));
      lastKey = currentKey;
    } else {
      // Same key, just update props
      // Updating React props
      root.render(React.createElement(component, reactProps));
    }
  });

  onMount(() => {
    mounted = true;

    // Initial render
    if (container) {
      // Initial React render
      root = createRoot(container);
      root.render(React.createElement(component, reactProps));
      lastKey = currentKey;
    }

    return () => {
      // Svelte component unmounting - cleaning up React
      if (root) {
        root.unmount();
      }
      mounted = false;
    };
  });
</script>

<div class="contents" bind:this={container}></div>
