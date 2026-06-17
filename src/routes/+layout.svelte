<script>
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import Login from '$lib/login/Login.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Icon from '$lib/assets/icon.png';

	let { children } = $props();

	let clicked = $state(false);
	let firstName = $state('');
	let lastName = $state('');

	function handleUpdate() {
		clicked = true;
		firstName = localStorage.getItem('firstName');
		lastName = localStorage.getItem('lastName');
	}

	if (browser) {
		if (localStorage.getItem('firstName') && localStorage.getItem('lastName')) {
			clicked = true;
		}

		firstName = localStorage.getItem('firstName');
		lastName = localStorage.getItem('lastName');
	}

	let dialog;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Login on:update={handleUpdate} bind:this={dialog} />

<nav>
	<a href="/" class="logo">
		<img src={Icon} alt="" />
		<div>English Test</div>
	</a>

	<div class="links-container">
		<a href="/grammar" class:active={page.url.pathname === '/grammar'}>Grammar</a>
		<a href="/vocabulary" class:active={page.url.pathname === '/vocabulary'}>Vocabulary</a>
		<a href="/reading1" class:active={page.url.pathname === '/reading1'}>Reading 1</a>
		<a href="/reading2" class:active={page.url.pathname === '/reading2'}>Reading 2</a>
		<a href="/reading3" class:active={page.url.pathname === '/reading3'}>Reading 3</a>
		<a href="/send" class:active={page.url.pathname === '/send'}>Send</a>
	</div>

	<button onclick={() => dialog.open()}>
		{#if clicked}
			Logged as {firstName + ' ' + lastName}
		{:else}
			Log in
		{/if}
	</button>
</nav>

{@render children()}

<style>
	:global(body, html) {
		background-color: #F6F6F7;
		margin: 0;
		padding: 0;
		font-family: Arial, Helvetica, sans-serif;
	}

	nav {
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: white;
		padding: 0 20px;
	}

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.logo div {
		color: #343C4B;
		font-weight: bold;
		font-size: 26px;
	}

	.logo img {
		height: 50px;
	}

	.links-container {
		display: flex;
		gap: 15px;
	}

	.links-container a {
		font-size: 18px;
		color: #51596A;
		text-decoration: none;
	}

	nav button {
		font-size: 18px;
		background: transparent;
		border: none;
		color: #51596A;
		cursor: pointer;
	}

	.links-container a.active {
		color: black;
		text-decoration: underline;
	}
</style>