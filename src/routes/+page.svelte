<script>
  import { Button, Helper } from "flowbite-svelte";
  import { getContext } from "svelte";
  import Home from "../lib/components/Home.svelte";
  import SignupModal from "../lib/components/SignupModal.svelte";
  import { goto } from "$app/navigation";
  import Authorize from "../lib/components/Authorize.svelte";

  const user = getContext("user");
  let isLoggedIn = $user !== null;
  let signup = false;
  const showSignup = (show) => {
    signup = show;
  };
  const submitSignup = async (userObj) => {
    user.set(userObj);
    await goto("/", { invalidateAll: true, replaceState: true });
  };
  let authorize = false;
  const closeAuthorize = () => (authorize = false);

  const secureAccess = () => {
    authorize = true;
  };
</script>

<div class="mt-36 w-full col-auto">
  {#if !isLoggedIn}
    {#if authorize}
      <Authorize {authorize} {closeAuthorize} />
    {:else}
      <div class="text-center">
        <Button on:click={secureAccess} outline color="light"
          >Secure Access</Button
        >
        <Helper class="text-sm mt-2">
          Don't have an acount? <button
            on:click={() => showSignup(true)}
            class="font-medium text-primary-600"
          >
            Create credential
          </button>
        </Helper>
      </div>
      <SignupModal {submitSignup} {signup} {showSignup} />
    {/if}
  {:else}
    <Home user={$user} />
  {/if}
</div>
