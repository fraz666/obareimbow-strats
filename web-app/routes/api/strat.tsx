import { define } from "../../utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const req = await ctx.req.json()
    // console.log(req);
    return new Response();
  },
});
