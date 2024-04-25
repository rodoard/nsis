<script>
  import {
    Label,
    Button,
    Alert,
    Select,
    Card,
    Helper,
    Spinner,
  } from "flowbite-svelte";

  import { FaceStylizer, FilesetResolver } from "@mediapipe/tasks-vision";
  import colorTask from "../../../../mediapipe/fs_color_sketch.task";
  import { onDestroy, onMount } from "svelte";

  export let formGet, formDone, formPut, section;

  const demosSection = document.getElementById("demos");

  let styles = [{ name: "Color Sketch", value: colorTask }];

  onDestroy(() => formDone(section));

  let selectedStyle = colorTask;
  let faceStylizer;
  let webcamButtonText = "Run Webcam";
  let webcamRunning = false;
  const videoWidth = 480;

  async function createFaceStylizer() {
    // Clean up any existing Face Stylizer instance
    if (faceStylizer !== undefined) {
      faceStylizer.close();
    }
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm",
    );
    faceStylizer = await FaceStylizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: selectedStyle,
      },
    });
  }
  createFaceStylizer();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let video = null;
  let videoTrack = null;
  let canvasElement = null;
  let canvasCtx = null;
  const canvasCtxPut = (imageInfo) => {
    if (imageInfo) {
      const { width, height, data } = imageInfo.image;
      canvasElement.width = width;
      canvasElement.height = height;
      canvasCtx.putImageData(data, 0, 0);
    }
  };
  onMount(() => {
    canvasCtx = canvasElement.getContext("2d");
    canvasCtxPut(formGet(section));
  });
  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  let webcamSupported = true;

  if (!hasGetUserMedia()) {
    webcamSupported = false;
  }

  let camButtonDisabled = false;
  // Enable the live webcam view and start stylization.
  function enableCam(event) {
    if (!faceStylizer) {
      console.log("Wait! faceStylizer not loaded yet.");
      return;
    }

    if (webcamRunning === true) {
      camButtonDisabled = true;
      webcamRunning = false;
      webcamButtonText = "Run Webcam";
      video.pause();
      setTimeout(predictWebcam, 100);
    } else {
      webcamRunning = true;
      webcamButtonText = "Pause and Stylize";
      if (video.paused && video.played.length > 0) {
        video.play();
      } else {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
            videoTrack = stream.getVideoTracks()[0];
          });
      }
    }
  }

  let lastVideoTime = -1;

  async function predictWebcam() {
    const startTimeMs = performance.now();
    const callback = (image) => {
      if (image) {
        const { width, height } = image;
        const data = image.getAsImageData();
        const imageInfo = {
          image: {
            width,
            height,
            data,
          },
        };
        canvasCtxPut(imageInfo);
        imageInfo.image.src = canvasElement.toDataURL("image/png");
        formPut(section, imageInfo);
        camButtonDisabled = false;
      }
    };

    // Stylize when Pause video
    if (!webcamRunning && lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      faceStylizer.stylize(video, callback);
    }
  }

  onDestroy(() => {
    videoTrack && videoTrack.stop();
  });
</script>

<Card size="lg" class="h-full">
  <Label class="text-center mb-8">Webcam face stylizer</Label>
  <Label class="mb-8">
    Select face stylizer
    <Select class="mt-2" items={styles} bind:value={selectedStyle} />
  </Label>

  {#if webcamSupported}
    <Helper class="text-sm mb-2 ">
      <p class="mb-2 text-center">
        Hold your face in front of your webcam,<br />then click
        <span class="font-semibold">pause and stylize</span>
        to pause and trigger face stylization.
      </p>
    </Helper>
  {:else}
    <Alert color="red">
      <span class="font-medium">Whoops!</span>
      Webcam is not supported, please enable webcam to continue.
    </Alert>
  {/if}
  {#if webcamSupported}
    {#if camButtonDisabled}
      <Button outline color="light">
        <Spinner class="me-3" size="4" color="light" />
        Styling...
      </Button>
    {:else}
      <Button outline color="light" on:click={enableCam}>
        {webcamButtonText}
      </Button>
    {/if}
    <div class="grid grid-cols-2 place-content-between mt-4 gap-4 h-full">
      <div class="grid">
        <div></div>
        <div>
          <video width="256" he bind:this={video} autoplay playsinline>
            <track kind="captions" />
          </video>
        </div>
      </div>
      <div class="flex justify-center">
        <canvas bind:this={canvasElement}></canvas>
      </div>
    </div>
  {/if}
</Card>
