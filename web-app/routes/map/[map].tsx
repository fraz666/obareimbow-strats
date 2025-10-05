import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import maps from "../../static/maps/info.json" with { type: "json" };

import MapInterface from "../../islands/MapInterface.tsx";
import { getCookies } from "@std/http/cookie";
import { Header } from "../../islands/map/Header.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    if (!cookies.auth) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    const mapCode = ctx.params.map;
    const url = new URL(ctx.req.url);
    const side = url.searchParams.get("side") || "atk";

    console.log(`User type: ${ctx.state.isAdmin}`);

    if (!mapCode) {
      return new Response("Missing map parameter", { status: 400 });
    }

    const map = maps.find((m: any) => m.code === mapCode) as any;
    if (!map) {
      return new Response("Map not found", { status: 404 });
    }

    try {
      const mapInfoUrl = new URL(`${ctx.url.origin}/maps/${mapCode}/info.json`);
      const content = await fetch(mapInfoUrl);
      const { layers, bombsites } = await content.json();

      return { data: { map, layers, bombsites, side } };
    } catch (error) {
      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }
  },
});

export default define.page<typeof handler>((props) => {
  const { map, layers, bombsites, side } = props.data;

  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>
          {map.name} - Strategy Planner
        </title>
      </Head>

      <Header name={map.name} />

      {/* <MapInterface
        map={map}
        layers={layers}
        bombsites={bombsites}
        side={side}
      /> */}
    </div>
  );
});
