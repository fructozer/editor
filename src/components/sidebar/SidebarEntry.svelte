<script lang="ts">
  import {
    active,
    deleteProData,
    dragging,
    getFolder,
    isShowClasses,
    saveData,
    sidebarOpen,
    updateFolders
  }                                     from "../../data/store";
  import ProSkill                       from "$api/proskill";
  import ProClass                       from "$api/proclass";
  import { get }                        from "svelte/store";
  import ProFolder                      from "$api/profolder";
  import { fly }                        from "svelte/transition";
  import Modal                          from "../Modal.svelte";
  import { addClassFolder, cloneClass } from "../../data/class-store";
  import { addSkillFolder, cloneSkill } from "../../data/skill-store";
  import { animationEnabled }           from "../../data/settings";

  export let delay                                 = 0;
  export let direction: "right" | "left"           = "left";
  export let data: ProSkill | ProClass | undefined = undefined;

  let over     = false;
  let deleting = false;

  const startDrag = (e: DragEvent) => {
    if (!data) {
      e.preventDefault();
      return;
    }
    dragging.set(data);
  };

  const drop = () => {
    const dragData: ProClass | ProSkill | ProFolder = get(dragging);
    let targetFolder;
    if (data) {
      targetFolder = getFolder(data);
    }

    const containing = getFolder(dragData);
    if (containing) containing.remove(dragData);
    if (targetFolder) {
      targetFolder.add(dragData);
      over = false;
      updateFolders();
      return;
    }
    if (dragData instanceof ProFolder) {
      if (get(isShowClasses)) addClassFolder(dragData);
      else addSkillFolder(dragData);
      dragData.parent = undefined;
    }

    over = false;
  };

  const dragOver = () => {
    const dragData = get(dragging);
    if (data === dragData) return;
    over = true;
  };


  const maybe = (node: Element, options: any) => {
    if (!get(animationEnabled)) {
      options.delay = 0;
    }
    return options.fn(node, options);
  };

  const cloneData = (data: ProClass | ProSkill) => {
    if (data instanceof ProClass) {
      cloneClass(data);
    } else {
      cloneSkill(data);
    }
  };
</script>


<div class="sidebar-entry"
     class:over
     class:active={data && $active === data}
     class:in-folder={!!getFolder(data)}
     draggable="{!!data}"
     on:dragstart={startDrag}
     on:drop|preventDefault|stopPropagation={drop}
     on:dragover|preventDefault={dragOver}
     on:dragleave={() => over = false}
     on:click
     in:maybe={{fn: fly, x: (direction === "left" ? -100 : 100), duration: 500, delay: $sidebarOpen ? 0 : delay}}
     out:fly={{x: (direction === "left" ? -100 : 100), duration: 500}}>
  <slot/>
  {#if data}
    <div class="buttons">
      {#if data instanceof ProSkill}
        <a href="/skill/{data.name}/edit"
           class="edit"
           title="Edit Skill">
          <span class="material-symbols-rounded">
            edit
          </span>
        </a>
      {/if}
      <div on:click|preventDefault|stopPropagation={() => saveData(data)}
           class="download"
           title="Save {data.triggers ? 'Skill' : 'Class'}">
        <span class="material-symbols-rounded">
          save
        </span>
      </div>
      <div on:click|preventDefault|stopPropagation={() => cloneData(data)}
           class="clone"
           title="Clone {data.triggers ? 'Skill' : 'Class'}">
        <span class="material-symbols-rounded">
          content_copy
        </span>
      </div>
      <div on:click|preventDefault|stopPropagation={() => deleting = true}
           class="delete"
           title="Delete {data.triggers ? 'Skill' : 'Class'}">
        <span class="material-symbols-rounded">
          delete
        </span>
      </div>
    </div>
  {/if}
</div>

<Modal bind:open={deleting}>
  <h3>Do you really want to delete {data.name}?</h3>
  <div class="modal-buttons">
    <div class="button" on:click={() => deleting = false}>Cancel</div>
    <div class="button modal-delete" on:click={() => deleteProData(data)}>Delete</div>
  </div>
</Modal>

<style>
    .sidebar-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #444;
        padding: 0.3rem 0.5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: break-spaces;
        border-left: 0 solid var(--color-accent);
        transition: background-color 0.25s ease-in-out,
        border-left-width 0.25s ease-in-out;
        user-select: none;
        -webkit-user-select: none;
        margin-inline: 0.4rem;
    }

    .sidebar-entry:has(.new) {
        padding: unset;
    }

    .sidebar-entry:hover {
        cursor: pointer;
    }

    .sidebar-entry:not(.in-folder):last-child {
        position: sticky;
        margin-top: 0.5rem;
        bottom: 0;
        background-color: unset;
    }

    .sidebar-entry:not(:last-child), :global(.folder-content .sidebar-entry) {
        border-bottom: 1px solid #aaa;
    }

    .sidebar-entry.over:not(:last-child) {
        border-bottom: 10px solid rgba(0, 79, 143, 0.7);
    }

    .sidebar-entry.over:last-child {
        border-top: 10px solid rgba(0, 79, 143, 0.7);
    }

    .active {
        background-color: #005193;
        border-left-width: 4px;
    }

    .buttons {
        display: flex;
        opacity: 0;
        position: absolute;
        right: 0.25rem;
        font-size: 1.3rem;
        justify-content: center;
        align-items: stretch;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 100vw;
        transition: opacity 0.25s ease;
    }

    .download, .delete, .edit, .clone {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.3rem;
        border-radius: 50%;
        transition: background-color 0.25s ease;
        text-decoration: none;
        color: white;
    }

    .sidebar-entry:hover .buttons {
        opacity: 1;
    }

    .download:hover {
        background-color: #1dad36;
    }

    .delete:hover {
        background-color: #b60000;
    }

    .edit:hover {
        background-color: #0083ef;
    }

    .clone:hover {
        background-color: #00568c;

    }

    .modal-buttons {
        display: flex;
        justify-content: center;
    }

    .modal-buttons .button {
        margin-inline: 1rem;
    }

    .modal-delete {
        background-color: #b60000;
    }
</style>