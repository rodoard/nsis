<script>
  export let message = "Oh no!";
  import emergency from "$lib/assets/911.jpeg";
  import { Label } from "flowbite-svelte";
</script>

<div class="flex flex-col justify-center rounded">
  <div class="text-center mt-8 mb-16">
    <Label color="red" class="text-lg mb-4">{message}</Label>
    <p class="mt-2 font-semibold">
      Hang tight Louis, <br />Act like everything is normal, <br /> Help is on the
      way!
    </p>
  </div>
  <div>
    <img src={emergency} alt="" />
  </div>
</div>
