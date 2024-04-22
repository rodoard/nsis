<script>
  import {
    Label,
    GradientButton,
    Alert,
    Select,
    Card,
    Helper,
    Spinner,
  } from "flowbite-svelte";

  import {
    GestureRecognizer,
    DrawingUtils,
    FilesetResolver,
  } from "@mediapipe/tasks-vision";
  import colorTask from "../../../../mediapipe/fs_color_sketch.task";
  import { onDestroy, onMount } from "svelte";

  export let formGet, formPut;

  const demosSection = document.getElementById("demos");

  let devices = ["CPU", "GPU"].map((d) => ({ name: d, value: d }));

  let webcamButtonText = "Run Webcam";
  let webcamRunning = false;
  let gestureRecognizer;
  let selectedDevice = devices[0].name;
  let runningMode = "IMAGE";

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
    demosSection.classList.remove("invisible");
  };
  createGestureRecognizer();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let video = null;
  let videoTrack = null;
  let canvasElement = null;
  let canvasCtx = null;
  let handGestureImg;

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
    canvasCtxPut(formGet("faceStyle"));
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
  // Enable the live webcam view.
  function enableCam(event) {
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

  async function captureGesture(event) {
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
    console.log(results);
    if (results.gestures.length > 0) {
      const p = event.target.parentNode.childNodes[3];
      p.setAttribute("class", "info");

      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(
        results.gestures[0][0].score * 100,
      ).toFixed(2);
      const handedness = results.handednesses[0][0].displayName;

      p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
      p.style =
        "left: 0px;" +
        "top: " +
        event.target.height +
        "px; " +
        "width: " +
        (event.target.width - 10) +
        "px;";

      const canvas = document.createElement("canvas");
      canvas.setAttribute("class", "canvas");
      canvas.setAttribute("width", event.target.naturalWidth + "px");
      canvas.setAttribute("height", event.target.naturalHeight + "px");
      canvas.style =
        "left: 0px;" +
        "top: 0px;" +
        "width: " +
        event.target.width +
        "px;" +
        "height: " +
        event.target.height +
        "px;";

      event.target.parentNode.appendChild(canvas);
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
  }

  let lastVideoTime = -1;

  async function predictWebcam() {
    const startTimeMs = performance.now();
    const callback = (image) => {
      if (image) {
        const { width, height } = image;
        const data = image.getAsImageData();
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        handGestureImg.width = widht;
        handGestureImg.height = height;
        handGestureImg.src = canvas.toDataURL();
        camButtonDisabled = false;
      }
    };
  }

  onDestroy(() => {
    videoTrack && videoTrack.stop();
  });
</script>

<Card size="lg" class="h-full">
  <Label class="text-center mb-8">Webcam hand gesture</Label>
  <Label class="mb-8">
    Select device
    <Select class="mt-2" items={devices} bind:value={selectedDevice} />
  </Label>
  {#if webcamSupported}
    <Helper class="text-sm mb-2 ">
      <p class="mb-2 text-center">
        Use your hand to make gestures in front of the camera to capture your
        gesture.
      </p>
    </Helper>
  {:else}
    <Alert color="red">
      <span class="font-medium">Whoops!</span>
      Webcam is not supported, please enable webcam to continue.
    </Alert>
  {/if}
  {#if webcamSupported}
    <div class="grid grid-cols-1 mt-2 items-center gap-4">
      <div class="grid grid-cols-2 place-content-between gap-4 h-full">
        <div class="grid">
          <div></div>
          <div>
            {#if camButtonDisabled}
              <GradientButton outline color="greenToBlue">
                <Spinner class="me-3" size="4" color="white" />
                Styling...
              </GradientButton>
            {:else}
              <GradientButton outline color="greenToBlue" on:click={enableCam}>
                {webcamButtonText}
              </GradientButton>
            {/if}
          </div>
        </div>
        <div class="grow">
          <video width="256" he bind:this={video} autoplay playsinline>
            <track kind="captions" />
          </video>
        </div>
      </div>
      <div class="flex justify-center">
        <img bind:this={handGestureImg} alt="" on:click={captureGesture} />
      </div>
    </div>
  {/if}
</Card>
