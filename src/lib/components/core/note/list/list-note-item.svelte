<script lang="ts">
	import { Input, Checkbox } from '$lib/components';
	import type { ListNoteItem } from '$lib/types';
	import { cn } from '$lib/utils';
	import { GripVertical, Trash } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { isSwiping as isSwipingFromEveryInstance } from '$lib/stores';

	interface Props {
		item: ListNoteItem;
		deleteItem: (item: ListNoteItem) => void;
		save: () => void;
    isOwner: boolean;
		ondrop?: (draggedId: string, targetId: string) => void;
		focus: boolean;
	}

	let { item = $bindable(), isOwner, deleteItem, save, focus = false, ondrop }: Props = $props();
	let SWIPE_X_THRESHOLD = $state(0);
	const MOBILE_ACTION_MISSHAPE_DELAY = 150;

	// DND on mobile
	let touchTimeout = $state<ReturnType<typeof setTimeout>>();
	let currentPosition = $state<{ x: number; y: number }>();
	let initialPosition = $state<{ x: number; y: number }>();
	let swipeX = $state(0);
	let isDragging = $state(false);
	let isSwiping = $state(false);
	function handleTouchStart(event: TouchEvent) {
		if (isDragging || isSwiping || !isOwner) return;
		// Prevent scrolling while dragging
		event.preventDefault();
		event.stopPropagation();
		touchTimeout = setTimeout(() => {
			isDragging = true;
			initialPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
		}, MOBILE_ACTION_MISSHAPE_DELAY);
	}
	function handleTouchMove(event: TouchEvent) {
		if (!isDragging || isSwiping || !isOwner) return;
		event.preventDefault();
		event.stopPropagation();
		currentPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };

		// Find potential drop target
		const elements = document.elementsFromPoint(currentPosition.x, currentPosition.y);
		const dropTarget = elements.find((el) => el.hasAttribute('data-note-item')) as HTMLElement;

		if (dropTarget) {
			document.querySelectorAll('.drop-target').forEach((el) => el.classList.remove('drop-target'));
			dropTarget.classList.add('drop-target');
		}
	}
	function handleTouchEnd(event: TouchEvent) {
		clearTimeout(touchTimeout);
		if (!isDragging || isSwiping || !isOwner) return;

		event.preventDefault();
		event.stopPropagation();
		isDragging = false;

		const dropTarget = document.querySelector('.drop-target') as HTMLElement;
		if (dropTarget && ondrop) {
			ondrop(item.id.toString(), dropTarget.dataset.id!);
		}

		document.querySelectorAll('.drop-target').forEach((el) => el.classList.remove('drop-target'));
	}
	onDestroy(() => {
		clearTimeout(touchTimeout);
	});

	// DND on desktop
	function handleDragStart(event: DragEvent) {
		if ((event.target as HTMLElement).closest('.drag-handle') === null || !isOwner) {
			return;
		}
		// On drag start from dragging the row up or down
		isDragging = true;
		event.dataTransfer?.setData('text/plain', item.id.toString());
		event.dataTransfer!.effectAllowed = 'move';
	}
	function handleDragEnd(event: DragEvent) {
		// On drag end from dragging the row up or down
		if (isSwiping || !isOwner) return;
		isDragging = false;
		(event.currentTarget as HTMLElement).classList.remove('drop-target'); // Ensure cleanup
	}
	function handleDragOver(event: DragEvent) {
		// On drag over another row from dragging the row up or down
		if (isSwiping || !isOwner) return;
		event.preventDefault();
		const draggedId = event.dataTransfer?.getData('text/plain');
		// Only show drop indicator if not dragging over self
		let isDropTarget = draggedId !== item.id.toString();
		if (isDropTarget) {
			(event.currentTarget as HTMLElement).classList.add('drop-target');
		}
		event.dataTransfer!.dropEffect = 'move';
	}
	function handleDragLeave(event: DragEvent) {
		// On drag leave from dragging the row up or down
		if (isSwiping || !isOwner) return;
		(event.currentTarget as HTMLElement).classList.remove('drop-target');
		isDragging = false;
	}
	function handleDrop(event: DragEvent) {
		// On drop from dragging the row up or down
		if (isSwiping || !isOwner) return;
		event.preventDefault();
		isDragging = false;
		(event.currentTarget as HTMLElement).classList.remove('drop-target'); // Reset before dispatch
		const draggedId = event.dataTransfer?.getData('text/plain');
		if (draggedId && draggedId !== item.id.toString() && ondrop) {
			ondrop(draggedId, item.id.toString());
		}
	}

	// Side swipe to open more options on mobile
	function handleTouchStartRow(event: TouchEvent) {
		// On touch start from swiping the row to the side on mobile
		if (isSwiping || !isOwner) return;
		initialPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
		touchTimeout = setTimeout(() => {
			isSwiping = true;
		}, MOBILE_ACTION_MISSHAPE_DELAY);
	}
	function handleTouchMoveRow(event: TouchEvent) {
		// On touch move from swiping the row to the side on mobile
		if (!initialPosition || !isSwiping || !isOwner) return;

		currentPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
		const moveX = currentPosition.x - initialPosition.x;

		swipeX = Math.max(Math.min(swipeX + moveX, 0), -SWIPE_X_THRESHOLD);
		initialPosition = currentPosition; // Update initial position for continuous swiping
		$isSwipingFromEveryInstance = {
			isSwiping: true,
			id: item.id
		};
	}
	function handleTouchEndRow() {
		// On touch end from swiping the row to the side on mobile
		if (!isSwiping || !isOwner) {
			clearTimeout(touchTimeout);
			return;
		}

		isSwiping = false;
		if (swipeX <= -SWIPE_X_THRESHOLD * 0.7) {
			swipeX = -SWIPE_X_THRESHOLD;
		} else {
			swipeX = 0;
		}
	}
	// Side swipe to open more options on desktop
	function handleDragStartRow(event: MouseEvent) {
		// On mouse down from dragging the row to the side on desktop
		if (isSwiping || isDragging || !isOwner) return;
		if ((event.target as HTMLElement).closest('.drag-handle') !== null) {
			return;
		}
		initialPosition = { x: event.clientX, y: event.clientY };
		touchTimeout = setTimeout(() => {
			if (isSwiping || isDragging) return;
			isSwiping = true;
		}, MOBILE_ACTION_MISSHAPE_DELAY + 1);
	}
	function handleDragMoveRow(event: MouseEvent) {
		// On mouse move from dragging the row to the side on desktop
		if (!initialPosition || !isSwiping || !isOwner) return;

		currentPosition = { x: event.clientX, y: event.clientY };
		const moveX = currentPosition.x - initialPosition.x;

		swipeX = Math.max(Math.min(swipeX + moveX, 0), -SWIPE_X_THRESHOLD);
		initialPosition = currentPosition; // Update initial position for continuous swiping
		$isSwipingFromEveryInstance = {
			isSwiping: true,
			id: item.id
		};
	}
	function handleDragEndRow() {
		// On mouse up from dragging the row to the side on desktop
		if (!isSwiping || isDragging || !isOwner) {
			clearTimeout(touchTimeout);
			return;
		}

		isSwiping = false;
		if (swipeX <= -SWIPE_X_THRESHOLD * 0.7) {
			swipeX = -SWIPE_X_THRESHOLD;
		} else {
			swipeX = 0;
		}
	}
	// Reset swipe when dragging from another instance
	$effect(() => {
		if ($isSwipingFromEveryInstance.isSwiping && $isSwipingFromEveryInstance.id !== item.id) {
			swipeX = 0;
		}
	});

	onMount(() => {
		if (focus && isOwner) {
			const input = document.getElementById(`noteInputItem-${item.id}`) as HTMLTextAreaElement;
			input.focus();
		}
	});
</script>

<svelte:window onmousemove={handleDragMoveRow} />

<div class="relative">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={cn(
			'group before:bg-primary relative flex flex-row items-center gap-1 before:absolute before:left-0 before:h-full',
			!isDragging && !isSwiping && ' transition-transform'
		)}
		data-note-item
		data-id={item.id}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		ontouchstart={handleTouchStartRow}
		ontouchmove={handleTouchMoveRow}
		ontouchend={handleTouchEndRow}
		onmousedown={handleDragStartRow}
		onmouseup={handleDragEndRow}
		onmousemove={handleDragMoveRow}
		style:transform={`translateX(${swipeX}px)`}
	>
    {#if isOwner}
      <!-- Drag handle -->
      <button
        draggable="true"
        class="drag-handle w-5 shrink-0 touch-none select-none"
        ondragstart={handleDragStart}
        ondragend={handleDragEnd}
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
      >
        <GripVertical class="size-5 cursor-move" />
      </button>
    {/if}
		<Checkbox
			bind:checked={item.checked}
			id="noteCheckboxItem-{item.id}"
			onchange={save}
      disabled={!isOwner}
			class="shrink-0"
		/>
		<Input.Textarea
			autoFit
			bind:value={item.item}
			onValueChange={save}
			debounce={500}
      disabled={!isOwner}
			id="noteInputItem-{item.id}"
			class="text-wrap whitespace-normal"
		/>
		<!-- More actions container -->
		<div
			class="absolute top-0 bottom-0 left-full ml-1 flex flex-row items-center gap-2"
			bind:clientWidth={SWIPE_X_THRESHOLD}
		>
			<button
				class="bg-danger text-foreground flex h-8 w-full flex-row items-center justify-center rounded px-4 font-bold"
				onclick={() => deleteItem(item)}
			>
				<Trash class="size-5" />
			</button>
		</div>
	</div>
</div>

<style>
	.drop-target {
		padding-left: 4px;
	}
	.drop-target::before {
		width: 4px;
	}
</style>
