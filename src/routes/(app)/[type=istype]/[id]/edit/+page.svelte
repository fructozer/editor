<script lang="ts">
  import ProClass from "$api/proclass";
  import ProSkill from "$api/proskill";
  import ClassDetails from "$components/ClassDetails.svelte";
  import SkillDetails from "$components/SkillDetails.svelte";

  export let data: { data: ProClass | ProSkill };
</script>

<svelte:head>
  <title>ProSkillAPI Dynamic Editor - {data.data.name}</title>
</svelte:head>
<h1>{data?.data?.name}
  {#if data?.data instanceof ProSkill}
    <a href="/skill/{data.data.name}" class="material-symbols-rounded chip edit-skill">auto_fix</a>
  {/if}
</h1>
<hr />
<div class="container">
  {#if data?.data instanceof ProClass}
    <ClassDetails bind:data={data.data} />
  {:else}
    <SkillDetails bind:data={data.data} />
  {/if}
</div>


<style>
    h1 {
        margin-bottom: 0.1em;
    }

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        margin-inline: 1rem;
        width: 90%;
    }

    .edit-skill {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0.4rem;
        margin-left: 1rem;
        height: 100%;
        width: 6rem;
        font-size: inherit;
        color: white;
        text-decoration: none;
        background-color: #1dad36;
        transition: background-color 0.25s ease;
    }

    .edit-skill:hover {
        background-color: #2fd950;
    }

    .edit-skill:active {
        background-color: #157e2b;
        box-shadow: inset 0 0 5px #333;
    }
</style>