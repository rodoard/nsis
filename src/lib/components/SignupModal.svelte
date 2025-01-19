<script>
  import { Modal, Button, Spinner } from "flowbite-svelte";
  import { Listgroup, Label, ListgroupItem } from "flowbite-svelte";
  import sectionComponent from "./signup/sections/index.js";
  import CompleteSteps from "./signup/sections/CompleteSteps.svelte";
  import {imageDataToDataUrl} from "$lib/utils"

  export let showSignup, signup, submitSignup;

  const signupClosed = () => {
    showSignup(false);
  };

  let form = {};

  const formPut = (prop, value) => {
    if (sectionLabels[prop] != undefined) {
      form[prop] = value;
      form[prop].inProgress = true;
    }
  };
  const formDone = (prop) => {
    if (form[prop] && sectionLabels[prop]) {
      form[prop].inProgress = false;
    }
  };
  const formGet = (prop) => form[prop];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  let sectiontoLabel = {};
  let sectionLabels = {};
  let sections = [
    "profile",
    "face_stylization",
    "hand_gesture",
    "secure_gesture",
  ].map((label, index) => {
    let name = label.split("_").map(capitalize).join(" ");
    sectiontoLabel[name] = { label, index };
    sectionLabels[label] = name;
    return {
      name,
      label,
      index,
    };
  });
  const lastSectionIndex = sections.length - 1;
  let currentSectionIndex;
  let currentSection;
  const setSection = (index) => {
    currentSectionIndex = index;
    if (index > lastSectionIndex) return
    currentSection = sections[currentSectionIndex].label;
  };
  const sectionChanged = (label) => {
    const { index } = sectiontoLabel[label];
    setSection(index);
  };

  const formPrev = () => {
    form[currentSection]?.inProgress &&
      currentSectionIndex > 0 &&
      setSection(currentSectionIndex - 1);
  };

  const formNext = () => {
    form[currentSection]?.inProgress &&
      currentSectionIndex <= lastSectionIndex &&
      setSection(currentSectionIndex + 1);
  };

  const sectionCompleted = (label) => form[label] && form[label].inProgress;

  setSection(0);

  $: allSectionsCompleted = Object.keys(form).length === lastSectionIndex + 1;

  let finalize = false;

  const completeSteps = () => {
    Object.keys(form).forEach((label) => {
      form[label].title = sectionLabels[label];
    });
    finalize = true;
  };
  let submitting = false;
  const submit = () => {
    const { profile, face_stylization, hand_gesture, secure_gesture } = form;
    submitting = true;
    delete hand_gesture.results;
    delete secure_gesture.results;
    const convertImageData = [face_stylization, hand_gesture, secure_gesture]
    convertImageData.forEach(elem=>{
      console.log(elem)
      if ("data" in elem.image) {
       delete elem.image.data; 
       //= imageDataToDataUrl(elem.image.data)
      }
    })
    face_stylization.data = imageDataToDataUrl
    setTimeout(async () => {
      await submitSignup({
        profile,
        authentication: {
          face_stylization,
          hand_gesture,
          secure_gesture,
        },
      });
      submitting = false;
    }, 1000);
  };
  $: hasPointerEvents = allSectionsCompleted;
</script>

<Modal
  on:close={() => showSignup(false)}
  class="h-svh"
  size="lg"
  bind:open={signup}
  title="NSIS Onboarding"
>
  <Label class=" text-center">Complete the steps below.</Label>
  <div class="flex h-full gap-2">
    <div class="flex-none grid border rounded-lg border-1 border-color-black">
      <div><Label class="text-sm text-center mt-8">Steps</Label></div>
      <div class="">
        <Listgroup active>
          {#each sections as section}
            <ListgroupItem
              on:click={() => sectionChanged(section.label)}
              current={currentSection === section.label}
              class={hasPointerEvents ? "pointer-events-none" : ""}
            >
              {section.name}
            </ListgroupItem>
          {/each}
        </Listgroup>
      </div>
    </div>
    <div
      class="grow border-t-1 border-l-1 border-b-1 rounded-lg border-color-black"
    >
      {#if !finalize}
        <svelte:component
          this={sectionComponent(currentSection)}
          {formGet}
          {formPut}
          {formDone}
          section={sections[currentSectionIndex].label}
        />
      {:else if finalize && allSectionsCompleted}
        <CompleteSteps {form} />
      {/if}
    </div>
  </div>
  <svelte:fragment slot="footer">
    <div class="flex justify-between w-full">
      <div>
        <Button
          outline
          color="light"
          on:click={formPrev}
          disabled={currentSectionIndex === 0 ||
            (currentSectionIndex <= lastSectionIndex &&
              !form[currentSection]?.inProgress)}>Prev</Button
        >
      </div>
      <div>
        <Button
          outline
          color="light"
          on:click={formNext}
          disabled={allSectionsCompleted || currentSectionIndex > lastSectionIndex ||
            (currentSectionIndex <= lastSectionIndex && !form[currentSection])
              ?.inProgress}>Next</Button
        >
      </div>

      <div>
        {#if !finalize && allSectionsCompleted}
          <Button
            outline
            color="light"
            on:click={completeSteps}
            disabled={!allSectionsCompleted}>Summarize</Button
          >
        {:else if finalize && allSectionsCompleted}
          {#if submitting}
            <Button outline color="dark" disabled={true}>
              <Spinner class="me-3" size="4" />
              Submitting...
            </Button>
          {:else}
            <Button outline color="light" on:click={submit}>Submit</Button>
          {/if}
        {/if}
      </div>
    </div>
  </svelte:fragment>
</Modal>
