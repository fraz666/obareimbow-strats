import { define } from "../../utils.ts";

import maps from "../../static/maps/info.json" with { type: "json" };

export const handler = define.handlers({
  GET(ctx) {
    console.log(maps);
    return Response.json(maps);
    // const name = ctx.params.name;
    // return new Response(
    //   `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
    // );
  },
});
