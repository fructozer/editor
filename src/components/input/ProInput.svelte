<script lang="ts">
  import { fly, slide } from "svelte/transition";

  export let tooltip: string | undefined        = undefined;
  export let label: string;
  export let type: "string" | "number"          = "string";
  export let intMode                            = false;
  export let value: string | number | undefined = undefined;
  export let placeholder: string | undefined    = undefined;
  export let nowrap = false;
  let hovered                                   = false;
  let ypos = 0;
</script>

<div class="label"
     transition:slide>
  {#if tooltip && tooltip.length > 0 && hovered}
    <div class="tooltip" class:top={ypos < window.innerHeight / 2.5}
         transition:fly={{x: -20, duration: 100}}>
      {tooltip}
    </div>
  {/if}
  <span class='display'
        class:nowrap
        on:mouseenter={(e) => {
          ypos = e.target.getBoundingClientRect().top;
          hovered = true;
        }}
        on:mouseleave={() => hovered = false}>
    {label || ''}
    <slot name="label"/>
  </span>
</div>
<div transition:slide class="input-wrapper" class:labeled={!!label}>
  <!--{#if type === "number"}-->
  <!--    <input type="number" bind:value use:numberOnly={{intMode, enabled: type === "number"}}-->
  <!--           {placeholder} />-->
  <!--  {:else}-->
  {#if !!value || value === "" || value === 0}
    <input bind:value {placeholder}/>
  {/if}
  <!--{/if}-->
  <slot/>
</div>

<style>
    input {
        width: 100%;
        padding-inline: 0.5rem;
    }

    .label {
        padding-right: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: fit-content;
        align-self: center;
    }

    .tooltip {
        z-index: 30;
        text-align: center;
        background-color: #0a0a0a;
        padding: 0.75rem;
        position: absolute;
        max-width: 70%;
        bottom: 125%;
        right: 0;
        border-radius: 0.3rem;
        border: 1px solid #777;
        white-space: break-spaces;
    }

    .tooltip.top {
        top: 125%;
        bottom: unset;
    }

    .tooltip:before {
        position: absolute;
        top: 100%;
        right: 10%;
        border: 6px solid transparent;
        background: transparent;
        content: "";
        border-top-color: #777;
    }

    .tooltip.top:before {
        bottom: 100%;
        top: unset;
        border-top-color: transparent;
        border-bottom-color: #777;
    }

    .nowrap {
        white-space: nowrap;
    }
</style>