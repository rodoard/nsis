<script>
  import { Modal, Label } from "flowbite-svelte";
  import { LockOutline, LockOpenOutline } from "flowbite-svelte-icons";
  import UserNameChallenge from "./authorize/UserNameChallenge.svelte";
  import { getUser } from "$lib/stores/users";
  import PostUserChallenge from "./authorize/PostUserChallenge.svelte";
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import { error } from "@sveltejs/kit";

  export let authorize, closeAuthorize;

  const userStore = getContext("user");

  let user;
  let authorized = false;
  const postUserNameChallenge = async (username) => {
    user = await getUser(username);
    currentChallenge = "postuser";
  };
  let currentChallenge = "username";
  const challenges = {
    username: UserNameChallenge,
    postuser: PostUserChallenge,
  };
  function challengeResult(result) {
    authorized = result.authorized;
    if (authorized) {
      userStore.set(user);
      if (result.mode.secure) {
        goto("/911");
        window.location = "/911";
      } else {
        goto("/sunshine");
        window.location = "/sunshine";
      }
    } else {
      goto("/access-denied");
      window.location = "/access-denied";
    }
  }

  const currentUser = () => user;

  const challengeProps = {
    username: {
      postUserNameChallenge,
    },
    postuser: { challengeResult, currentUser },
  };
</script>

<Modal
  on:close={closeAuthorize}
  class="h-svh modal"
  size="lg"
  bind:open={authorize}
  title="NSIS DoorKeeper"
>
  <svelte:fragment slot="header">
    <div class="grid w-full place-content-between grid-cols-2">
      <Label class="text-lg">NSIS DoorKeeper</Label>
      <div>
        {#if !authorized}
          <LockOutline size="lg" />
        {:else}
          <LockOpenOutline size="lg" />
        {/if}
      </div>
    </div>
  </svelte:fragment>
  <Label class="text-center mt-4 mb-8 text-md"
    >Solve the following challenges to enter</Label
  >
  <div class="flex justify-center rounded">
    <svelte:component
      this={challenges[currentChallenge]}
      props={challengeProps[currentChallenge]}
    />
  </div>
</Modal>
