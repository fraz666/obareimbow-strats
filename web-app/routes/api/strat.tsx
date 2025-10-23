import { define } from "../../utils.ts";
import { exists } from "jsr:@std/fs/exists";

export const handler = define.handlers({
  async GET(ctx: any) {
    const params = new URLSearchParams(ctx.url.search);
    const map = params.get("map");
    const side = params.get("side");
    const bombsite = params.get("bombsite");

    if (!map || !side || !bombsite) {
      return new Response("Missing parameters", { status: 400 });
    }

    const stratFilePath = `static/strats/${map}/${side}/${bombsite}.json`;
    const fileExists = await exists(stratFilePath);

    if (!fileExists) {
      return Response.json([]);
    }

    const stratContent = await Deno.readTextFile(stratFilePath);
    const stratData = JSON.parse(stratContent);

    return Response.json(stratData);
  },
  async POST(ctx: any) {
    const req = await ctx.req.json();
    // console.log(req);
    await Deno.writeTextFile(
      `${Deno.cwd()}/static/lines.log`,
      JSON.stringify(req.lines),
    );
    return new Response("ok", { status: 200 });
  },
});
