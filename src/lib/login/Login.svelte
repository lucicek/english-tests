<script>
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let dialog;
	let firstName = $state('');
	let lastName = $state('');

	function handleClick() {
		dispatch('update', { value: true });
	}

	onMount(() => {
		if (!localStorage.getItem('firstName') || !localStorage.getItem('lastName')) {
			dialog.showModal();
		}
	});

	function login() {
		const fn = firstName.trim();
		const ln = lastName.trim();

		if (!fn || !ln) return;

		localStorage.setItem('firstName', fn);
		localStorage.setItem('lastName', ln);

		handleClick();
		dialog.close();
	}

	export function open() {
		dialog.showModal();
	}
</script>

<dialog bind:this={dialog}>
	<h1>Enter your name</h1>

	<input placeholder="first name" bind:value={firstName} type="text" />
	<input placeholder="last name" bind:value={lastName} type="text" />

	<button
		onclick={login}
		disabled={!firstName.trim() || !lastName.trim()}
	>
		Log in
	</button>
</dialog>

<style>
	dialog[open] {
		border: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px;
		border-radius: 10px;
		gap: 30px;
	}

	dialog h1 {
		color: #343C4B;
		font-size: 32px;
	}

	dialog input {
		font-size: 18px;
		padding: 15px 25px;
		border: 1px solid rgb(204, 207, 212);
		border-radius: 3px;
	}

	dialog button {
		background-color: rgb(136, 97, 154);
		border: none;
		padding: 14px 40px;
		font-size: 18px;
		color: white;
		width: 100%;
		border-radius: 100px;
		cursor: pointer;
		transition: background-color 0.5s;
	}

	dialog button:hover {
		background-color: #70507F;
	}

	dialog button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>