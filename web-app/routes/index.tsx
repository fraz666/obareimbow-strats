import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home() {
  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Obareimbow Strats - Rainbow Six Siege Strategy Planner</title>
        <meta
          name="description"
          content="Plan and draw your Rainbow Six Siege attack and defense strategies on interactive maps"
        />
      </Head>

      <main class="container mx-auto px-4 py-8">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold mb-4 text-orange-500">
            Obareimbow Strats
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Plan your Rainbow Six Siege strategies with interactive map drawing
          </p>

          <div class="flex justify-center gap-4">
            <a
              href="/maps"
              class="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Maps
            </a>
            <a
              href="/maps"
              class="border border-orange-600 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Planning
            </a>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="text-center p-6 bg-gray-800 rounded-lg">
            <div class="text-3xl mb-4">🗺️</div>
            <h3 class="text-xl font-semibold mb-2">Interactive Maps</h3>
            <p class="text-gray-400">
              Navigate through different floors and layers of R6S maps
            </p>
          </div>

          <div class="text-center p-6 bg-gray-800 rounded-lg">
            <div class="text-3xl mb-4">✏️</div>
            <h3 class="text-xl font-semibold mb-2">Draw Strategies</h3>
            <p class="text-gray-400">
              Draw attack routes, defense positions, and callouts directly on
              maps
            </p>
          </div>

          <div class="text-center p-6 bg-gray-800 rounded-lg">
            <div class="text-3xl mb-4">⚔️</div>
            <h3 class="text-xl font-semibold mb-2">Attack & Defense</h3>
            <p class="text-gray-400">
              Plan both attacking and defending strategies for each bombsite
            </p>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-semibold mb-6">Available Maps</h2>
          <div class="flex justify-center gap-4">
            <a
              href="/map/bank"
              class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors"
            >
              <div class="font-semibold">Bank</div>
              <div class="text-sm text-gray-400">4 floors</div>
            </a>
            <a
              href="/map/clubhouse"
              class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors"
            >
              <div class="font-semibold">Clubhouse</div>
              <div class="text-sm text-gray-400">3 floors</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
});
