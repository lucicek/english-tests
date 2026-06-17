<script>
  let { content, count, type } = $props();

  let selected = $state(false);

  function updateSelected() {
    const answers = JSON.parse(localStorage.getItem(type)) || [];
    selected = answers[count] === content;
  }

  function saveAnswer() {
    const answers = JSON.parse(localStorage.getItem(type)) || [];

    answers[count] = content;

    localStorage.setItem(type, JSON.stringify(answers));

    updateSelected();

    window.dispatchEvent(new Event('answer-changed'));
  }

  $effect(() => {
    updateSelected();

    const handler = () => updateSelected();

    window.addEventListener('answer-changed', handler);

    return () => {
      window.removeEventListener('answer-changed', handler);
    };
  });
</script>

<button class="answer-button" onclick={saveAnswer} class:selected={selected}>
  {content}
</button>

<style>
  .selected {
    background-color: rgb(33, 148, 163) !important;
    color: white!important;
    border: 1px rgb(33, 148, 163) solid !important;
  }

  .selected:hover {
    border: 1px rgb(33, 148, 163) solid !important;
  }

  .answer-button{
    min-width: 170px;
    padding: 10px 48px;
    box-sizing: content-box;
    font-size: 26px;
    color: #34495E;
    background-color: white;
    border: 1px rgb(205, 205, 205) solid;
    border-radius: 6px;
    cursor: pointer;
    transition: border 0.15s, background-color 0.3s;
  }

  .answer-button:hover{
    border: #3498DB 1px solid;
  }
</style>