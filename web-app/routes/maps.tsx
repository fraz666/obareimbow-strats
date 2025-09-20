import { define } from "../utils.ts";

import maps from "../static/maps/info.json" with { type: "json" };

export default define.page(() => {
  return (
    <main>
      <h1>Maps</h1>
      <p>This is the maps page.</p>
      <div id="maps-container">
        {(maps as string[])
            .map((m) => (
                <a key={m} class="map-card-link" href={`/map/${m}`}>
                    <img src={`/maps/${m}/preview.avif`} alt={m} />
                    <span>{m}</span>
                </a>
            ))
        }
      </div>
    </main>
  );
});