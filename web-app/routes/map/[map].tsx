import { define } from "../../utils.ts";

import maps from "../../static/maps/info.json" with { type: "json" };

import SidePicker from "../../islands/SidePicker.tsx";
import StratPlanner from "../../islands/StratPlanner.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const map = ctx.params.map;

    console.log("par", ctx.url.search  );

    if (!map) {
      return new Response("Missing file parameter", { status: 400 });
    }

    if (!(maps as string[]).includes(map)) {
      return new Response("Map not found", { status: 404 });
    }

    try {
      const url = new URL(`${ctx.url.origin}/maps/${map}/info.json`);
      const content = await fetch(url);

      const { layers, bombsites } = await content.json();

      console.log("AAAAAA");

      return { data: { name: map, layers, bombsites } };
    } catch (error) {
      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }
  },
});

export default define.page<typeof handler>((props) => {
  const map = props.data.name;
  const layers = props.data.layers;

  const someLayer = layers[0];

  return (
    <main>
      <h1>{map}</h1>
      <SidePicker />
      <div>
        {layers.map((layer: string) => (
          <a key={layer} href={`/map/${map}/${layer}`}>
            {layer}
          </a>
        ))}
      </div>
      <StratPlanner map={map} layers={layers}/>
      <div id="maps-container">
      </div>
    </main>
  );
});
