<script>
  export let message = "Sunshine";
  import sunshine from "$lib/assets/sunshine.jpeg";
  import { Label } from "flowbite-svelte";
</script>

<div class="flex flex-col justify-center rounded">
  <div class="text-center mt-8 mb-16">
    <Label color="red" class="text-lg mb-4">{message}</Label>
    <p class="mt-2">Lovely day, filled with sunshine and rainbows.</p>
    <p>Roses are red, violets are...[max tokens reached]</p>
  </div>
  <div>
    <img src={sunshine} alt="" />
  </div>
</div>
