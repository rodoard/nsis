<script>
  import Header from "../lib/components/Header.svelte";
  import Navbar from "../lib/components/Navbar.svelte";
  import "./styles.css";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let data;

  const user = writable(null);
  $: user.set(data.user || null);

  setContext("user", user);

  const signOut = () => {
    setContext("user", null);
  };
  let headerDone = false;
  const setHeaderDone = () => (headerDone = true);
</script>

<div class="app">
  <Navbar {signOut} />
  <Header {setHeaderDone} />
  <main>
    {#if headerDone}
      <slot />
    {/if}
  </main>
  <footer>
    <p class="text-sm">Encode AI BootCamp</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
