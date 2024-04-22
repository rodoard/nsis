<script>
  import { Button, Helper } from "flowbite-svelte";
  import { getContext } from "svelte";
  import Home from "../lib/components/Home.svelte";
  import SignupModal from "../lib/components/SignupModal.svelte";

  const user = getContext("user");
  let isLoggedIn = $user !== null;
  let signup = false;
  const showSignup = (show) => {
    signup = show;
  };
</script>

<div class="mt-36 w-full col-auto">
  {#if !isLoggedIn}
    <div class="text-center">
      <Button color="green">Login</Button>
      <Helper class="text-sm mt-2">
        Don't have an acount? <button
          on:click={() =>
            showSignup(true) && console.log("showsignup!!!", showSignup)}
          class="font-medium text-primary-600"
        >
          Sign up.
        </button>
      </Helper>
    </div>
    <SignupModal {signup} {showSignup} />
  {:else}
    <Home />
  {/if}
</div>
