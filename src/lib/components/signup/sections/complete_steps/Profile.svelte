<script>
  import { Avatar } from "flowbite-svelte";
  export let data;
  const { name, username } = data;
</script>

<div class="flex justify-center mb-6 mt-6">
  <div class="flex items-center space-x-4 rtl:space-x-reverse">
    <Avatar rounded />
    <div class="space-y-1 font-medium">
      <div class="text-sm text-gray-500">{username}</div>
      <div>{name}</div>
    </div>
  </div>
</div>
