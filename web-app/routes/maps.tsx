import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

import maps from "../static/maps/info.json" with { type: "json" };

export default define.page(() => {
  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Maps - Obareimbow Strats</title>
      </Head>

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <a
            href="/"
            class="text-orange-500 hover:text-orange-400 mb-4 inline-block"
          >
            ← Back to Home
          </a>
          <h1 class="text-4xl font-bold mb-4">Available Maps</h1>
          <p class="text-gray-300">
            Choose a map to start planning your strategies
          </p>
        </div>

        <div id="maps-container" class="grid md:grid-cols-2 gap-6">
          {(maps as string[])
            .map((m) => (
              <a key={m} class="map-card-link group" href={`/map/${m}`}>
                <div class="relative overflow-hidden rounded-lg bg-gray-800">
                  <img
                    src={`/maps/${m}/preview.avif`}
                    alt={m}
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300">
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="text-xl font-semibold capitalize text-white">
                      {m}
                    </h3>
                    <p class="text-gray-300 text-sm">
                      Click to start planning
                    </p>
                  </div>
                </div>
              </a>
            ))}
        </div>
      </main>
    </div>
  );
});
