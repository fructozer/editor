<script lang="ts">
  import ProFolder                                                                       from "$api/profolder";
  import SidebarEntry
                                                                                         from "./sidebar/SidebarEntry.svelte";
  import { goto }                                                                        from "$app/navigation";
  import { slide }                                                                       from "svelte/transition";
  import { deleteFolder, dragging, getFolder, removeFolder, sidebarOpen, updateFolders } from "../data/store";
  import ProClass                                                                        from "$api/proclass";
  import ProSkill                                                                        from "$api/proskill";
  import { get }                                                                         from "svelte/store";

  export let folder: ProFolder;
  let elm: HTMLElement;

  let focus = (e?: MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    elm.contentEditable = "true";
    elm.focus();
    setTimeout(() => {
      const range: Range = document.createRange();
      range.setStart(elm, 0);
      range.setEnd(elm, 1);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 1);
  };

  const keydown = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      e.preventDefault();
      e.stopPropagation();
      elm.blur();
    }
  };

  const deleteF = (e: MouseEvent) => {
    e.stopPropagation();
    deleteFolder(folder);
  };

  const addFolder = (e: MouseEvent) => {
    e.stopPropagation();
    folder.createFolder();
    folder.open = true;
    updateFolders();
  };


  let over = false;

  const startDrag = () => {
    dragging.set(folder);
  };

  const drop = () => {
    over                                            = false;
    const dragData: ProClass | ProSkill | ProFolder = get(dragging);
    if (!dragData) return;
    if (folder.data.includes(dragData)) return;

    const containing = getFolder(dragData);
    if (containing) containing.remove(dragData);

    if (dragData instanceof ProFolder) {
      removeFolder(dragData);
      dragData.parent = folder;
    }

    folder.add(dragData);
  };

  const dragOver = () => {
    if (folder === get(dragging)) return;
    over = true;
  };
</script>

<div class="folder"
     class:over
     draggable="true"
     on:dragstart={startDrag}
     on:drop|preventDefault|stopPropagation={drop}
     on:dragover|preventDefault={dragOver}
     on:dragleave={() => over = false}
     on:click={() => folder.open = !folder.open}
     in:slide={{duration: ($sidebarOpen ? 0 : 400)}}
     out:slide>
  <span class="material-symbols-rounded folder-icon">
    folder
  </span>
  <span class="name" contenteditable="false"
        bind:this={elm}
        on:blur={elm.contentEditable = "false"}
        bind:textContent={folder.name}
        on:keydown={keydown} />
  <div class="buttons">
    <div class="icon add" title="Add Folder"
         on:click={addFolder}>
      <span class="material-symbols-rounded">
        add
      </span>
    </div>
    <div class="icon" title="Rename"
         on:click={focus}>
      <span class="material-symbols-rounded">
        edit
      </span>
    </div>
    <div class="icon delete" title="Delete Folder"
         on:click={deleteF}>
      <span class="material-symbols-rounded">
        delete
      </span>
    </div>
  </div>
</div>

{#if folder.open}
  <div class="folder-content" transition:slide>
    {#each folder.data as data, i (data.key)}
      {#if data.isFolder}
        <svelte:self folder={data} />
      {:else}
        <SidebarEntry {data}
                      on:click={() => goto(`/${data.isClass ? 'class' : 'skill'}/${data.name}${data.isClass ? '/edit' : ''}`)}>
          {data.name}
        </SidebarEntry>
      {/if}
    {/each}
  </div>
{/if}

<style>
    .folder-icon {
        color: #0083ef;
    }

    .folder {
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
        border-bottom: 1px solid #aaa;
    }

    .folder.over {
        border-bottom: 10px solid rgba(0, 79, 143, 0.7);
    }

    .folder:hover {
        cursor: pointer;
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

    .folder:hover .buttons {
        opacity: 1;
    }

    .name {
        flex: 1;
        margin-left: 0.5rem;
    }

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.3rem;
        border-radius: 50%;
        transition: background-color 0.25s ease;
    }

    .icon:hover {
        background-color: #1dad36;
    }

    .icon.add:hover {
        background-color: #006c91;
    }

    .icon.delete:hover {
        background-color: #b60000;
    }

    .folder-content {
        margin-left: 0.3rem;
    }
</style>