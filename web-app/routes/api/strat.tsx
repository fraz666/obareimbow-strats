import { define } from "../../utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const req = await ctx.req.json()
    // console.log(req);
    await Deno.writeTextFile( `${Deno.cwd()}/static/lines.log`, JSON.stringify(req.lines));
    return new Response("ok", { status: 200 })
  },
});
