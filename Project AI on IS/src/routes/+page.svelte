<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import { writable } from 'svelte/store';

  let userQuery = '';
  let isLoading = writable(false);
  let error = writable('');
  let chatHistory = writable<{ sender: 'user' | 'ai'; message: string }[]>([]);
  const md = MarkdownIt();

  async function sendQuery() {
  if (!userQuery.trim()) return;

  chatHistory.update(history => [...history, { sender: 'user', message: userQuery }]);
  isLoading.set(true);
  error.set('');

  try {
    const request = await fetch('http://localhost:5173/api2/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: userQuery,
        system_instruction: "Answer only what is asked. Keep responses concise and do not add extra details or assumptions." 
      })
    });

    if (!request.ok) throw new Error('Failed to fetch AI response');

    const apiResponse = await request.json();
    let aiResponse = apiResponse?.message || 'No response from AI.';

    aiResponse = aiResponse.replace(/<think>.*?<\/think>/gs, '').trim();

    aiResponse = aiResponse.split('.')[0] + '.'; // Only keeps the first sentence

    chatHistory.update(history => [...history, { sender: 'ai', message: aiResponse }]);
  } catch (err) {
    console.error('Error sending query:', err);
    error.set('Oops! Something went wrong.');
  } finally {
    userQuery = '';
    isLoading.set(false);
  }
}

</script>

<div class="min-h-screen" style="background-image: url('https://images2.alphacoders.com/131/thumbbig-1317068.webp'); background-size: cover; background-position: center; background-repeat: no-repeat;">//Mark
  <div class="min-h-screen bg-gradient-to-b from-green-100/60 to-green-200/60 py-8 px-4 flex items-center justify-center">
    <div class="max-w-lg w-full bg-white/95 rounded-2xl shadow-xl p-6 border-2 border-green-300 mt-8">
      
      <h2 class="text-center text-1.8xl font-bold mb-5.5 text-blue-600">
      🤖Question me this, and I shall answer!🤖
      </h2>

      <div class="space-y-3 break-words text-left text-sm text-gray-800">
        {#each $chatHistory as chat}
          <div class="mb-2">
            <strong class={chat.sender === 'user' ? 'text-blue-500' : 'text-pastel-blue-500'}>
              {chat.sender === 'user' ? 'ME' : 'AI'}:
            </strong>
            <span>{@html md.render(chat.message.replace(/<think>([\s\S]*?)<\/think>/g, ""))}</span>
          </div>
        {/each}
      </div>

      <div class="space-y-4 mt-4">
        <input
          type="text"
          bind:value={userQuery}
          placeholder="Enter chat here..."
          class="w-full rounded-xl border-2 border-green-300 p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-green-300 transition bg-white/90"
          on:keydown={(e) => e.key === 'Enter' && sendQuery()}
        />

        <button
          on:click={sendQuery}
          class="w-full rounded-xl bg-gradient-to-r from-blue-400 to-lightblue-500 p-3 text-white font-semibold hover:from-pink-500 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={$isLoading}
        >
          {#if $isLoading}
            ⏳ Processing...
          {:else}
            🛰️ Send ⚡
          {/if}
        </button>

        {#if $isLoading}
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        {/if}

        <!-- Display Errors -->
        {#if $error}
          <div class="mt-4 text-red-500 text-sm">{$error}</div>
        {/if}
      </div>
    </div>
  </div>
</div>
