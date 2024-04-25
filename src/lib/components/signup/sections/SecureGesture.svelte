<script>
  import HandGesture from "./HandGesture.svelte";
  export let formGet, formPut, section, formDone;
</script>

<svelte:component this={HandGesture} {formDone} {section} {formGet} {formPut} />
