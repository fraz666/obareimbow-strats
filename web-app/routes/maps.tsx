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
          <h1 class="text-4xl font-bold mb-4">Available maps</h1>
        </div>

        <div id="maps-container" class="grid md:grid-cols-2 gap-6">
          {(maps as any[])
            .map((m) => (
              <a
                key={m.code}
                class="map-card-link group"
                href={`/map/${m.code}`}
              >
                <div class="relative overflow-hidden rounded-lg bg-gray-800">
                  <img
                    src={`/maps/${m.code}/preview.avif`}
                    alt={m.name}
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300">
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="text-xl font-semibold capitalize text-white">
                      {m.name}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
        </div>
      </main>
    </div>
  );
});
