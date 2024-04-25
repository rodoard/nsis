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

  import { slide } from "svelte/transition";

  import {
    GestureRecognizer,
    DrawingUtils,
    FilesetResolver,
  } from "@mediapipe/tasks-vision";

  import { onDestroy, onMount } from "svelte";

  export let formGet, formDone, formPut, section;

  const title =
    section === "hand_gesture"
      ? "Wecam hand gesture"
      : "Webcam secure hand gesture ";
  const demosSection = document.getElementById("demos");

  let devices = ["CPU", "GPU"].map((d) => ({ name: d, value: d }));

  let webcamButtonText = "Run Webcam";
  let webcamRunning = false;
  let gestureRecognizer;
  let selectedDevice = devices[0].name;
  let runningMode = "IMAGE";

  onDestroy(() => formDone(section));

  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: selectedDevice,
      },
      runningMode: runningMode,
    });
  };
  createGestureRecognizer();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let video = null;
  let canvas;
  let videoTrack = null;
  let capturedImg;

  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  let webcamSupported = true;

  if (!hasGetUserMedia()) {
    webcamSupported = false;
  }

  let camButtonDisabled = false;
  let videoStarted = false;
  function enableCam(event) {
    if (webcamRunning === true) {
      camButtonDisabled = true;
      webcamRunning = false;
      webcamButtonText = "Run Webcam";
      video.pause();
      setTimeout(predictWebcam, 100);
    } else {
      webcamRunning = true;
      webcamButtonText = "Pause to capture gesture";
      if (video.paused && video.played.length > 0) {
        video.play();
      } else {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
            videoTrack = stream.getVideoTracks()[0];
            setTimeout(() => (videoStarted = true), 300);
          });
      }
    }
  }
  let capturedImgDetails;
  let gestureError = "";

  function setCapturedImage() {
    const saved = formGet(section);
    if (!saved) return;
    const { width, height, src } = saved.image;
    capturedImg.width = width;
    capturedImg.height = height;
    capturedImg.src = src;
    const { handedness, categoryName, categoryScore } = saved;
    const results = saved.results;
    capturedImgDetails.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
    capturedImgDetails.style =
      "left: 0px;" +
      "top: " +
      height +
      "px; " +
      "width: " +
      (width - 10) +
      "px;";

    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "canvas");
    canvas.setAttribute("width", capturedImg.naturalWidth + "px");
    canvas.setAttribute("height", capturedImg.naturalHeight + "px");
    canvas.style =
      "position:absolute;" +
      "left: 0px;" +
      "top: 0px;" +
      "width: " +
      width +
      "px;" +
      "height: " +
      height +
      "px;";

    capturedImg.parentNode.appendChild(canvas);
    const canvasCtx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5,
        },
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 1,
      });
    }
  }
  async function captureGesture(event) {
    gestureError = "";
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    // Remove all previous landmarks
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
      const n = allCanvas[i];
      n.parentNode.removeChild(n);
    }
    const results = gestureRecognizer.recognize(event.target);

    // View results in the console to see their format
    if (results.gestures.length > 0) {
      const { width, height, src } = event.target;
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(
        results.gestures[0][0].score * 100,
      ).toFixed(2);
      const handedness = results.handednesses[0][0].displayName;
      formPut(section, {
        securityProtocol,
        handedness,
        categoryName,
        categoryScore,
        results: { landmarks: results.landmarks },
        image: {
          width,
          height,
          src,
        },
      });
      setCapturedImage();
    } else {
      gestureError =
        "No gesture found, be sure to make gestures with your hand in front of the camera.";
    }
  }
  let showCapturedHelper = false;
  const securityProtocols = [{ name: "911", value: "911" }];
  let securityProtocol = securityProtocols[0].value;

  async function predictWebcam() {
    gestureError = "";
    capturedImgDetails.innerText = "";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/png");
    capturedImg.width = 256;
    capturedImg.height = 256;
    capturedImg.src = imageDataURL;
    camButtonDisabled = false;
    showCapturedHelper = true;
  }
  onMount(() => {
    setCapturedImage();
  });
  onDestroy(() => {
    videoTrack && videoTrack.stop();
  });
  $: disableCaptureGesture = capturedImgDetails
    ? capturedImgDetails.innerText.length > 0
    : false;
</script>

<Card size="lg" class="h-full">
  <Label class="text-center mb-8">{title}</Label>
  <Label class="mb-8">
    Select device
    <Select class="mt-2" items={devices} bind:value={selectedDevice} />
  </Label>

  {#if section === "secure_gesture"}
    <Label class="mb-8">
      Select security protocol
      <Select
        class="mt-2"
        items={securityProtocols}
        bind:value={securityProtocol}
      />
    </Label>
  {/if}
  {#if !webcamSupported}
    <Alert color="red">
      <span class="font-medium">Whoops!</span>
      Webcam is not supported, please enable webcam to continue.
    </Alert>
  {/if}
  {#if webcamSupported}
    {#if camButtonDisabled}
      <Button outline color="light">
        <Spinner class="me-3" size="4" color="white" />
        Styling...
      </Button>
    {:else}
      <Button outline color="light" on:click={enableCam}>
        {webcamButtonText}
      </Button>
    {/if}
    <div class="grid grid-cols-2 place-content-between mt-4">
      <div>
        <video width="256" bind:this={video} autoplay playsinline>
          <track kind="captions" />
        </video>
        {#if videoStarted}
          <Helper transition={slide} class="text-sm mb-2 ">
            <p class="-ml-12 text-center">
              Use your hand to make gestures in front<br /> of the camera
            </p>
          </Helper>
        {/if}
      </div>
      <div class="relative">
        <button disabled={disableCaptureGesture} on:click={captureGesture}>
          <div class="relative">
            <img
              disabled={disableCaptureGesture}
              width="256"
              bind:this={capturedImg}
              alt=""
            />
          </div>
          {#if showCapturedHelper}
            <Helper class="text-sm mb-2 ">
              <p class="mb-2 text-center">Click image to capture gesture</p>
            </Helper>
          {/if}
          {#if gestureError.length}
            <Helper class="text-sm mb-2 ">
              <p class="mb-2 text-center">
                {gestureError}
              </p>
            </Helper>
          {/if}
          <p class="text-sm" bind:this={capturedImgDetails} />
        </button>
      </div>
    </div>
  {/if}
</Card>
