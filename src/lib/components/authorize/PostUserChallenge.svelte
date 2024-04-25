<script>
  import { Card, Label, Spinner } from "flowbite-svelte";
  import { Gallery, Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import dummyFace from "$lib/assets/dummy-face.jpeg";
  import iloveyou from "$lib/assets/iloveyou.jpeg";

  export let props;

  const { currentUser, challengeResult } = props;

  const user = currentUser();

  const { face_stylization, hand_gesture, secure_gesture } =
    user.authentication;

  let imagesLoaded = false;

  const faces = [
    { alt: "dummy face", src: dummyFace },
    { alt: "double agent", src: face_stylization.image.src },
  ];

  const gestures = [
    { alt: "secureGesture", src: secure_gesture.image.src },
    { alt: "handGesture", src: hand_gesture.image.src },
    { alt: "iloveyou", src: iloveyou },
  ];

  let face = [];
  let gesture = [];

  async function createImageVariations(blob) {
    const form = new FormData();
    form.append("image", blob);
    try {
      const response = await fetch("api/variations", {
        method: "POST",
        body: form,
      });
      return response.json();
    } catch (e) {
      console.error(e);
    }
    return {
      error: true,
    };
  }
  async function postNameChallenge(image1, image2) {
    const form = new FormData();
    form.append("image1", image1);
    form.append("image2", image2);
    try {
      const response = await fetch("api/challenges", {
        method: "POST",
        body: form,
      });
      return response.json();
    } catch (e) {
      console.error(e);
    }
    return {
      error: true,
    };
  }

  $: faceGestureSelected = face.length > 0 && gesture.length > 0;

  const faceSelected = (image) => {
    face = [image];
  };

  let solvingPostChallenge = false;

  const gestureSelected = (image) => {
    gesture = [image];
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function toBlob(image) {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // Set canvas dimensions to match image dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    image.crossOrigin = "anonymous";
    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0);

    // Convert canvas content to a Blob
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, image.src.type || "png"),
    );
  }
  const THRESHOLD_SIMILARITY = 0.5;
  const solvePostNameChallenge = async () => {
    solvingPostChallenge = true;
    const faceResult = await postNameChallenge(
      await toBlob(expected.faceStyle),
      await toBlob(selectedFace),
    );
    let matchedGesture = null;
    if (faceResult.score >= THRESHOLD_SIMILARITY) {
      const testGestures = ["handGesture", "secureGesture"];
      for (let i = 0; i < testGestures.length; i++) {
        const gesture = testGestures[i];
        const result = await postNameChallenge(
          await toBlob(expected[gesture]),
          await toBlob(selectedGesture),
        );
        if (result.score >= THRESHOLD_SIMILARITY) {
          matchedGesture = gesture;
          break;
        }
      }
    }
    if (matchedGesture === null) {
      challengeResult({ ok: false });
    } else {
      challengeResult({
        ok: true,
        mode: { secure: matchedGesture === "secureGesture" },
      });
    }
  };

  const expected = {
    faceStyle: null,
    handGesture: null,
    secureGesture: null,
  };
  let numToSet = 3;
  const setImage = (image, type) => {
    const { width, height, src } = image;
    var img = new Image(width, height);
    (img.src = src),
      (img.onload = () => {
        expected[type] = img;
        numToSet--;
      });
  };
  setImage(face_stylization.image, "faceStyle");
  setImage(hand_gesture.image, "handGesture");
  setImage(secure_gesture.image, "secureGesture");
  let selectedFace;
  let selectedGesture;

  async function loadImages() {
    imagesLoaded = true;
  }

  onMount(async () => {
    setTimeout(async () => await loadImages(), 1000);
  });
</script>

{#if imagesLoaded}
  <div class="text-center">
    <div class="mb-8">
      {#if faceGestureSelected}
        <Button
          disabled={solvingPostChallenge}
          on:click={solvePostNameChallenge}
          outline
          color="alternative">Submit</Button
        >
      {/if}
    </div>
    <div class="flex">
      <Card>
        <Label class="text-center">Your Choices</Label>
        <div class="grid grid-rows-2 mt-4">
          <div>
            {#if face.length}
              <Label class="text-center mb-2">Face</Label>
              <Gallery class="gap-2 grid-cols-1" items={face} let:item>
                <img
                  bind:this={selectedFace}
                  src={item.src}
                  alt={item.alt}
                  class="h-auto max-w-full rounded-lg"
                />
              </Gallery>
            {/if}
          </div>
          <div class="mt-2">
            {#if gesture.length}
              <Label class="text-center mb-2">Gesture</Label>
              <Gallery class="gap-2 grid-cols-1" items={gesture} let:item>
                <img
                  bind:this={selectedGesture}
                  src={item.src}
                  alt={item.alt}
                  class="h-auto max-w-full rounded-lg"
                />
              </Gallery>
            {/if}
          </div>
        </div>
      </Card>
      <Card>
        <Label class="text-center">Select face and gesture from below</Label>
        <div class="grid grid-rows-2 mt-4">
          <div>
            <Label class="text-center mb-2">Face</Label>
            <Gallery class="gap-2 grid-cols-2" items={faces} let:item>
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <img
                on:click={() => faceSelected(item)}
                src={item.src}
                alt={item.alt}
                class="h-auto max-w-full rounded-lg"
              />
            </Gallery>
          </div>
          <div class="mt-2">
            <Label class="text-center mb-2">Gesture</Label>
            <Gallery class="gap-2 grid-cols-2" items={gestures} let:item>
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <img
                on:click={() => gestureSelected(item)}
                src={item.src}
                alt={item.alt}
                class="h-auto max-w-full rounded-lg"
              />
            </Gallery>
          </div>
        </div>
      </Card>
    </div>
  </div>
{:else}
  <div class="flex justify-center">
    <p>
      <Spinner class="me-3" size="4" />
      <span class="text-md font-semibold italic">Loading challenge...</span>
    </p>
  </div>
{/if}
