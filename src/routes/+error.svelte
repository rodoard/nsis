<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  if ($page.status === 401) {
    goto("/access-denied");
  }
</script>

<h1>{$page.status} {$page.error.message}</h1>
