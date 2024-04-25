<script>
  import {
    Navbar,
    NavBrand,
    NavUl,
    NavHamburger,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownHeader,
  } from "flowbite-svelte";

  import logo from "$lib/assets/logo.svg";
  import avatar from "$lib/assets/avatar.svg";
  import { getContext } from "svelte";

  export let signOut;

  const user = getContext("user");
  $: isLoggedIn = $user !== null;
</script>

<Navbar rounded color="form">
  <NavBrand href="/">
    <div class="rounded-full m-2 overflow-hidden">
      <img src={logo} class="w-12 h-12" alt="NSIS Logo" />
    </div>
    <span class="self-center whitespace-nowrap text-lg">NSIS</span>
  </NavBrand>
  {#if isLoggedIn}
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" src={avatar} />
      <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        <span class="block text-sm">{$user.profile.username}</span>
      </DropdownHeader>
      <DropdownItem on:click={signOut}>Sign out</DropdownItem>
    </Dropdown>
  {/if}
  <NavUl></NavUl>
</Navbar>
