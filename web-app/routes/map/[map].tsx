import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import maps from "../../static/maps/info.json" with { type: "json" };

import { getCookies } from "@std/http/cookie";
import { Side } from "../../domain/models/side.ts";
import { MapWithStrats } from "../../islands/map/MapWithStrats.tsx";
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
    const side = (url.searchParams.get("side") || "atk") as Side;

    console.log(`Is admin?: ${ctx.state.isAdmin}`);

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
  const { map } = props.data;

  return (
    <div class="bg-gray-900 text-white">
      <Head>
        <title>
          {map.name} - Strats
        </title>
      </Head>
      <MapWithStrats configuration={props.data} />
    </div>
  );
});
