<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  export let setHeaderDone;

  const welcomeText = "Welcome to NSIS!";
  let subText = "No System Is Safe";
  let showSubText = false;

  const animateSubText = (nodes) => {
    setTimeout(() => {
      fadeOutSubText(nodes);
    }, welcomeText.length * 550); // Wait for main text animation to complete before showing subtext
  };

  const hideSubTextChar = (node) => {
    node.remove();
  };
  const fadeOutSubText = (nodes) => {
    for (let i = 0; i < subText.length; i++) {
      setTimeout(
        () => {
          hideSubTextChar(nodes[i]);
          if (i === subText.length - 1) {
            showSubText = false;
            setHeaderDone();
          }
        },
        (subText.length + i + 1) * 150,
      );
    }
  };
  onMount(() => {
    animateSubText(document.querySelectorAll(".subtext-char"));
  });
</script>

<!-- Header component -->
<header class=" text-center text-xl mt-8">
  {#each welcomeText as char, i}
    <span style="animation-delay: {i * 0.2}s" transition:fly>{char}</span>
  {/each}

  <div class="text-sm italic">
    {#each subText as char, i}
      <span
        style="opacity:0; 
            animation-delay: {(subText.length + i) * 0.2}s"
        class="subtext-char">{char}</span
      >
    {/each}
  </div>
</header>

<style>
  /* Apply transition to each character */
  span {
    animation: fadeIn 1.5s ease-in-out;
    animation-fill-mode: forwards; /* Ensure the last frame of the animation persists */
    opacity: 0; /* Initially hide characters */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
