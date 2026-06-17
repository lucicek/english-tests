<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let result = null;

  let sender = "englishtest";
  let to = "mo.vitek@seznam.cz";
  let name = "";

  onMount(() => {
    name = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
  });

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  async function send() {
    const form = new FormData();

    const name =
      (localStorage.getItem('firstName') ?? '') +
      ' ' +
      (localStorage.getItem('lastName') ?? '');

    form.append("sender", sender);
    form.append("to", to);
    form.append("name", name.trim());
    form.append(
      "answers",
      JSON.stringify({
        grammar: localStorage.getItem("grammar"),
        vocabulary: localStorage.getItem("vocabulary"),
        reading1: localStorage.getItem("reading1"),
        reading2: localStorage.getItem("reading2"),
        reading3: localStorage.getItem("reading3")
      })
    );

    const res = await fetch("?/send", {
      method: "POST",
      body: form
    });

    result = await res.json();

    localStorage.clear();
    await goto('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
</script>

<main>
  <button onclick={send}>
    Send my answers
  </button>
</main>

<style>


  main{
    display: flex;
    justify-content: center;
    align-items: center ;
    width: 100%;
    height: 100%;
    padding-top: 50px;
  }

  main button {
    text-decoration: none;
    color: white;
    background-color: rgb(136, 97, 154);
    font-size: 30px;
    padding: 19px 50px;
    border-radius: 1000px;
    transition: background-color 0.3s;
    border: none;
    cursor: pointer;
  }

  main button:hover{
    background-color: #6C4D7B;
  }
</style>
