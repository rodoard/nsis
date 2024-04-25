<script>
  export let message = "Access Denied";
  import accessDenied from "$lib/assets/access-denied.jpeg";
  import { Label } from "flowbite-svelte";
</script>

<div class="flex flex-col justify-center rounded">
  <div class="text-center mt-8 mb-16">
    <Label color="red" class="text-lg mb-4">{message}</Label>
    <p class="mt-2">Sorry, you don't have permission to access this page!</p>
  </div>
  <div>
    <img src={accessDenied} alt="" />
  </div>
</div>
