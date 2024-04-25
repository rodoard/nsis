<script>
  import { onDestroy } from "svelte";
  import { UserCircleSolid } from "flowbite-svelte-icons";
  import {
    Card,
    ButtonGroup,
    Helper,
    InputAddon,
    Input,
    Label,
  } from "flowbite-svelte";

  export let formGet, formDone, formPut, section;

  const profile = formGet(section) || {};

  let name = profile.name || "";
  let username = profile.username || "";
  let formUpdated = false;

  const nameChanged = () => {
    if (formUpdated || name.length === 0 || username.length === 0) return;
    formPut(section, { name, username });
    formUpdated = true;
  };

  onDestroy(() => {
    if (name.length && username.length) {
      formPut(section, { name, username });
      console.log("put ", section, { name, username });
      formDone(section);
    }
  });

  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
  let errorMessage = "";

  function validateUsername() {
    if (!userNameRegex.test(username)) {
      errorMessage =
        "Username must start with a letter and be between 3 and 16 characters long, containing only letters, numbers, hyphens, and underscores.";
    } else {
      errorMessage = "";
    }
  }
</script>

<Card size="lg" class="h-full">
  <Label class="text-center mb-8 text-lg">Welcome to NSIS Onboarding</Label>
  <article class="prose mb-4 italic">
    You will be completing a few steps that will allow you to login using the
    novel AI-based multi-pass-through authentication. In this initial phase you
    will authenticate using a combination of face stylization and either hand
    gesture or secure gesture which will be configured to trigger a choice of
    security protocols; in the case of an emergency situation where you are
    force to authenticate under duress.
  </article>

  <Label class="text-md">
    But, first let's get some basic profile information to address you properly!
  </Label>

  <div class="mt-8 mb-6">
    <Label class="block mb-2">Your name</Label>
    <Input bind:value={name} on:blur={nameChanged} placeholder="Emily Faye" />
  </div>
  <div class="mt-2 mb-6">
    <Label class="block mb-2">Username</Label>
    <ButtonGroup class="w-full">
      <InputAddon>
        <UserCircleSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </InputAddon>
      <Input
        color={errorMessage.length ? "red" : "green"}
        on:blur={nameChanged}
        placeholder="doubleAgent"
        bind:value={username}
        on:input={validateUsername}
      />
    </ButtonGroup>
    {#if errorMessage}
      <Helper class="mt-2" color="red"
        ><span class="font-medium">
          {errorMessage}
        </span></Helper
      >
    {:else}
      <Helper class="text-sm mt-2 text-center">
        Use this to kick-off authentication process.
      </Helper>
    {/if}
  </div>
</Card>
