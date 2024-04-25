<script>
  import {
    Card,
    Label,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import FaceStylization from "./complete_steps/FaceStylization.svelte";
  import HandGesture from "./complete_steps/HandGesture.svelte";
  import SecureGesture from "./complete_steps/SecureGesture.svelte";
  import Profile from "./complete_steps/Profile.svelte";

  export let form;

  const sections = Object.keys(form);

  function getSectionCaption(section) {
    switch (section) {
      case "profile":
        return Profile;
      case "face_stylization":
        return FaceStylization;
      case "hand_gesture":
        return HandGesture;
      case "secure_gesture":
        return SecureGesture;
    }
  }
</script>

<Card size="none" class="h-full w-full">
  <Label class="text-center mb-8 text-lg">Nice work, let's summarize.</Label>

  <Table noborder={true}>
    <caption
      class="p-5 text-md font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
    >
      <p>Your responses</p>
      <p class="mt-3 text-sm font-normal prose text-center">
        For each step we list the corresonding results.Feel free to go back to
        the appropriate steps to make changes.
      </p>
      <p class="mt-2 text-sm font-normal prose text-center">
        The next time you login you will need results for face stylization and
        one of hand or secure gesture. Selecting secure gesture will trigger the
        associated secure protocol.
      </p>
    </caption>
    <TableHead class="text-center bg-gray-100">
      <TableHeadCell>Step</TableHeadCell>
      <TableHeadCell>Result</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each sections as section}
        <TableBodyRow class="mt-4">
          <TableBodyCell>{form[section].title}</TableBodyCell>
          <svelte:component
            this={getSectionCaption(section)}
            data={form[section]}
          />
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
