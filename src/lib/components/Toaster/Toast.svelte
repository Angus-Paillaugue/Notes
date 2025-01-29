<script lang="ts">
	import { type Toast, type ToastType, toast as toastClass } from '$lib/stores';
	import { CheckCircle, ChevronUp, Info, X, XCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { MyTween } from './toast.svelte';

	interface MyProps {
		toast: Toast;
	}
	const { toast }: MyProps = $props();
	let timeLeft = new MyTween(0, 100, toast.options.timeout || 4000);
	let paragraph = $state<HTMLParagraphElement>();
	let toastComponent = $state<HTMLDivElement>();
	let showMoreButton = $state<HTMLButtonElement>();
	const PARAGRAPH_LINE_HEIGHT = 24;
	let showMore = $state(false);
	let hasMoreToShow = $state(false);
	let animation = $state<Animation>();

	onMount(() => {
		if (toast?.options?.timeout && toast.options.timeout >= 0) timeLeft.play();

		if (!paragraph || !toastComponent) return;

		paragraph.style.height = PARAGRAPH_LINE_HEIGHT + 'px';
		hasMoreToShow = paragraph.scrollHeight > PARAGRAPH_LINE_HEIGHT;
		const duration = 150;

		animation = paragraph.animate(
			[{ height: PARAGRAPH_LINE_HEIGHT + 'px' }, { height: paragraph.scrollHeight + 'px' }],
			{ duration, fill: 'both' }
		);
		animation.pause();

		animation.addEventListener('finish', () => {
			if (!animation) return;
			animation.pause();
			animation.currentTime = showMore ? duration : 0;
		});

		toastComponent.addEventListener('mouseenter', show);
		toastComponent.addEventListener('mouseleave', hide);
		showMoreButton?.addEventListener('click', toggle);

		return () => {
			toastComponent?.removeEventListener('mouseenter', show);
			toastComponent?.removeEventListener('mouseleave', hide);
			showMoreButton?.removeEventListener('click', toggle);
		};
	});

	const show = () => {
		if (!animation) return;
		animation.pause();
		animation.playbackRate = 1;
		animation.play();
		showMore = true;
	};
	const hide = () => {
		if (!animation) return;
		animation.pause();
		animation.playbackRate = -1;
		animation.play();
		showMore = false;
	};
	const toggle = () => (showMore ? hide() : show());

	const toastIcon = new Map<ToastType, { icon: any; class: string }>([
		[
			'success',
			{
				icon: CheckCircle,
				class: 'text-green-600'
			}
		],
		[
			'error',
			{
				icon: XCircle,
				class: 'text-red-600'
			}
		],
		[
			'info',
			{
				icon: Info,
				class: 'text-blue-600'
			}
		]
	]);

	const icon = toastIcon.get(toast.type);

	const dismiss = () => toastClass.remove(toast.id);
</script>

<div
	class="bg-card text-foreground group relative flex flex-row items-center gap-2 overflow-hidden rounded-t-lg p-4"
	bind:this={toastComponent}
>
	<!-- Icon -->
	<svelte:component this={icon.icon} class="size-5 shrink-0 {icon.class}" />

	<!-- Text content -->
	<p
		bind:this={paragraph}
		class="relative w-full grow overflow-hidden font-sans text-base leading-6 font-normal text-wrap"
	>
		{toast.message}
	</p>

	<!-- Show more button -->
	{#if hasMoreToShow}
		<button
			class="hover:bg-card-foreground shrink-0 rounded-sm p-1 transition-colors 2xl:hidden"
			onclick={toggle}
		>
			<ChevronUp class="size-4 transition-transform {showMore && 'rotate-180'}" />
		</button>
	{/if}

	<!-- Dismiss button -->
	<button
		class="hover:bg-card-foreground shrink-0 rounded-sm p-1 transition-colors"
		onclick={dismiss}
	>
		<X class="size-4" />
	</button>

	<!-- Progress bar -->
	{#if toast.options.timeout && toast.options.timeout >= 0}
		<div class="absolute right-0 bottom-0 left-0 h-1">
			<div
				class="bg-primary-foreground block h-full"
				style:width={100 - timeLeft.current + '%'}
			></div>
		</div>
	{/if}
</div>
