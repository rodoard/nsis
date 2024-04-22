<script>
  import { Modal, Button } from "flowbite-svelte";
  import { Listgroup, Label, ListgroupItem } from "flowbite-svelte";
  import sectionComponent from "./signup/sections/index.js";

  export let showSignup, signup;

  const signupClosed = () => {
    showSignup(false);
  };

  let form = {};

  const formPut = (prop, value) => (form[prop] = value);
  const formGet = (prop) => form[prop];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  let sectiontoLabel = {};
  let sections = ["face_stylization", "hand_gesture", "secure_gesture"].map(
    (label, index) => {
      let name = label.split("_").map(capitalize).join(" ");
      sectiontoLabel[name] = { label, index };
      return {
        name,
        label,
        index,
      };
    },
  );
  const lastSectionIndex = sections.length - 1;
  let currentSectionIndex;
  let currentSection;
  const setSection = (index) => {
    currentSectionIndex = index;
    currentSection = sections[currentSectionIndex].label;
  };
  const sectionChanged = (evt) => {
    const { index } = sectiontoLabel[evt.target.innerText];
    setSection(index);
  };

  const formPrev = () => setSection(currentSectionIndex - 1);

  const formNext = () => setSection(currentSectionIndex + 1);

  setSection(0);
</script>

<Modal class="h-svh" size="lg" bind:open={signup} title="NSIS Onboarding">
  <Label class=" text-center">Complete the steps below.</Label>
  <div class="flex h-full gap-2">
    <div class="flex-none grid border rounded-lg border-1 border-color-black">
      <div><Label class="text-sm text-center mt-8">Steps</Label></div>
      <div class="">
        <Listgroup active>
          {#each sections as section}
            <ListgroupItem current={currentSection === section.label}>
              {section.name}
            </ListgroupItem>
          {/each}
        </Listgroup>
      </div>
    </div>
    <div
      class="grow border-t-1 border-l-1 border-b-1 rounded-lg border-color-black"
    >
      <svelte:component
        this={sectionComponent(currentSection)}
        {formGet}
        {formPut}
      />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <div class="flex justify-between w-full">
      <div>
        <Button
          class="btn"
          on:click={formPrev}
          disabled={currentSectionIndex === 0}>Prev</Button
        >
      </div>
      <div>
        <Button
          class="btn"
          on:click={formNext}
          disabled={currentSectionIndex === lastSectionIndex}>Next</Button
        >
      </div>
    </div>
  </svelte:fragment>
</Modal>
