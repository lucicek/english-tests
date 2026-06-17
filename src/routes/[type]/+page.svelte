<script>
  import { page } from '$app/state';
  import { goto, invalidateAll } from '$app/navigation';
  import AnswerButton from '$lib/answers/AnswerButton.svelte';

  let { data } = $props();

  let path = $derived(page.url.pathname);

  let readingDialog;

  let progress = $state({});

  const types = [
    'grammar',
    'vocabulary',
    'reading1',
    'reading2',
    'reading3'
  ];

  let currentType = $derived(path.slice(1));

  let count = $derived(progress[currentType] ?? 0);

  function setCount(value) {
    progress[currentType] = value;
  }

  async function increase() {
    const max = data.questions.length - 1;

    if (count === max) {
      const index = types.indexOf(currentType);
      const next = types[index + 1];

      if (!next) {
        await goto('/send');
      } else {
        await goto(`/${next}`);
        await invalidateAll();
      }
    } else {
      setCount(count + 1);
    }
  }

  async function decrease() {
    const min = 0;

    if (count === min) {
      const index = types.indexOf(currentType);
      const previous = types[index - 1];

      if (previous) {
        await goto(`/${previous}`);
        await invalidateAll();
      } else {
        await goto('/');
      }
    } else {
      setCount(count - 1);
    }
  }
</script>

<main>
  <dialog class="reading-dialog" bind:this={readingDialog}>
    <div class="reading-button-container">
      <button class="reading-button" onclick={() => {readingDialog.close()}}>
        ✖
      </button>
    </div>
    <div class="reading-text">
      {@html data.text}
    </div>
  </dialog>

  {#if data.text}
    <div class="open-dialog-button-container">
      <button class="open-dialog-button" onclick={() => {readingDialog.showModal()}}>
        Show reading
      </button>
    </div>
  {/if}

  <div class="question">
    {data.questions[count]?.question}
  </div>

  <div class="answers-grid">
    <AnswerButton
      content={data.questions[count]?.a}
      {count}
      type={currentType}
    />

    <AnswerButton
      content={data.questions[count]?.b}
      {count}
      type={currentType}
    />

    <AnswerButton
      content={data.questions[count]?.c}
      {count}
      type={currentType}
    />

    {#if data.questions[count]?.d}
      <AnswerButton
        content={data.questions[count]?.d}
        {count}
        type={currentType}
      />
    {/if}
  </div>

  <div class="continue-button-container">
    <button class="continue-button" onclick={decrease}>← Prev</button>
    <button class="continue-button" onclick={increase}>Next →</button>
  </div>
</main>

<style>
  main{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 75px;
    row-gap: 30px;
  }

  .question{
    color: #34495E;
    font-size: 37px;
    max-width: 1000px;
  }

  .answers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 1000px;
    width: 100%;
    place-items: center;
  }

  .continue-button-container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
  }

  .continue-button{
    color: white;
    border: none;
    background-color: rgb(136, 97, 154);
    box-sizing: content-box;
    font-size: 18px;
    border-radius: 40px;
    padding: 14px 40px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .continue-button:hover{
    background-color: #6C4D7B;
  }

  .reading-dialog{
    max-width: 1200px;
    padding: 20px;
    border: none;
    border-radius: 25px;
  }

  .reading-button-container{
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .reading-button{
    width: 35px;
    height: 35px;
    border-radius: 100px;
    box-sizing: content-box;
    padding: 0;
    border: none;
    cursor: pointer;
    font-size: 15px;
    border: rgb(189, 189, 189) 2px solid;
    background-color: white;
    color: #AEB2BA;
    transition: border 0.15s, background-color 0.15s;
  }

  .reading-button:hover{
    border: #94C0CF 2px solid;
    background-color: #F8F9F9;

  }

  .reading-text{
    white-space: pre-line;
    color: #343C4B;
  }

  .open-dialog-button-container{
    max-width: 1000px;
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
  }

  .open-dialog-button{
    max-width: 1000px;
    display: flex;
    justify-content: start;
    align-items: center;
    background-color: transparent;
    color: #4298B4;
    border: none;
    cursor: pointer;
    font-size: 16px;
    position: relative;
  }

  .open-dialog-button::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0%;
    height: 1px;
    background-color: #4298B4;
    transition: width 0.15s ease;
  }

  .open-dialog-button:hover::after {
    width: 100%;
  }
</style>
