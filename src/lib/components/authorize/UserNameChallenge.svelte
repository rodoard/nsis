<script>
  import { Label, Button, Spinner, Input, Card, Helper } from "flowbite-svelte";
  import { userExists } from "$lib/stores/users";

  export let props;

  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;

  $: isValidUsername = userNameRegex.test(username);
  const { postUserNameChallenge } = props;
  let username = "";
  let userNameError;

  function validateUsername() {
    if (!userNameRegex.test(username)) {
      userNameError =
        "Username must start with a letter and be between 3 and 16 characters long, containing only letters, numbers, hyphens, and underscores.";
    } else {
      userNameError = "";
    }
  }

  let nameChallengeError;
  let userNameExists;
  let solvingUsernameChallenge = false;

  async function solveUserNameChallenge() {
    solvingUsernameChallenge = true;
    setTimeout(async () => {
      nameChallengeError = "";
      userNameExists = await userExists(username);
      if (!userNameExists) {
        nameChallengeError = "Username challenge did not succeed.";
      }
      solvingUsernameChallenge = false;
    }, 1000);
  }
</script>

<Card class="card mt-8">
  <div class="mt-8 mb-8">
    <Label class="mb-2">Username</Label>
    <Input
      on:input={validateUsername}
      bind:value={username}
      color={isValidUsername ? "green" : "red"}
    />
    {#if solvingUsernameChallenge}
      <Helper class="mt-2 text-sm">
        <Spinner class="me-3" size="4" color="light" />
        Loading next challenge....
      </Helper>
    {:else}
      {#if nameChallengeError}
        <Helper class="mt-2 text-sm" color="red">
          Whoops! <span class="font-semibold">{nameChallengeError}</span>
        </Helper>
      {:else if userNameExists}
        <Helper class="mt-2 text-sm" color="green">
          Great, you are well on your way, proceed to next challenge.
        </Helper>
      {/if}
      {#if !userNameExists}
        <Button
          on:click={solveUserNameChallenge}
          disabled={!isValidUsername || solvingUsernameChallenge}
          class="w-full mt-4"
          outline
          color="alternative">Solve</Button
        >
      {:else}
        <Button
          on:click={() => postUserNameChallenge(username)}
          class="w-full mt-4"
          outline
          color="alternative">Next Challenge</Button
        >
      {/if}
    {/if}
  </div>
</Card>
