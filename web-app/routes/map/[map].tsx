import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import maps from "../../static/maps/info.json" with { type: "json" };

import MapInterface from "../../islands/MapInterface.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const map = ctx.params.map;
    const url = new URL(ctx.req.url);
    const side = url.searchParams.get("side") || "atk";

    if (!map) {
      return new Response("Missing map parameter", { status: 400 });
    }

    if (!(maps as string[]).includes(map)) {
      return new Response("Map not found", { status: 404 });
    }

    try {
      const mapInfoUrl = new URL(`${ctx.url.origin}/maps/${map}/info.json`);
      const content = await fetch(mapInfoUrl);
      const { layers, bombsites } = await content.json();

      return { data: { name: map, layers, bombsites, side } };
    } catch (error) {
      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }
  },
});

export default define.page<typeof handler>((props) => {
  const { name: map, layers, bombsites, side } = props.data;

  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>
          {map.charAt(0).toUpperCase() + map.slice(1)} - Strategy Planner
        </title>
      </Head>

      <MapInterface
        map={map}
        layers={layers}
        bombsites={bombsites}
        side={side}
      />
    </div>
  );
});
