<script lang="ts">
  import { UseReact } from ".";
  import { Counter } from "react-components";

  let initCount = $state(0);
</script>

<UseReact component={Counter} {initCount} />
