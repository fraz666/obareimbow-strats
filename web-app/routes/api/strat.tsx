import { Strategy } from "../../domain/models/strategy.ts";
import { define } from "../../utils.ts";
import { exists } from "jsr:@std/fs/exists";

export const handler = define.handlers({
  async GET(ctx: any) {
    if (!ctx.state.isLoggedIn) {
      return new Response("Unauthorized", { status: 401 });
    }

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
    if (!ctx.state.isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const params = new URLSearchParams(ctx.url.search);
    const map = params.get("map");
    const side = params.get("side");
    const bombsite = params.get("bombsite");

    if (!map || !side || !bombsite) {
      return new Response("Missing parameters", { status: 400 });
    }

    const stratFilePath = `static/strats/${map}/${side}/${bombsite}.json`;
    const fileExists = await exists(stratFilePath, { isFile: true });

    let strats: Strategy[] = [];
    if (fileExists) {
      const stratContent = await Deno.readTextFile(stratFilePath);
      strats = JSON.parse(stratContent);
    }

    const newStrat = await ctx.req.json() as Strategy;

    const existingStrat = strats.find((s) => s.code === newStrat.code);
    if (existingStrat) {
      // Update existing strat
      existingStrat.traces = newStrat.traces;
    } else {
      // Add new strat
      strats.push(newStrat);
    }

    const stratFolderPath = `static/strats/${map}/${side}`;
    const directoryExists = await exists(stratFolderPath, { isDirectory: true });
    if (!directoryExists) {
      await Deno.mkdir(stratFolderPath, { recursive: true });
    }

    await Deno.writeTextFile(
      stratFilePath,
      JSON.stringify(strats),
      { create: true },
    );

    return Response.json(strats);
  },
  async DELETE(ctx: any) {
    if (!ctx.state.isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const params = new URLSearchParams(ctx.url.search);
    const map = params.get("map");
    const side = params.get("side");
    const bombsite = params.get("bombsite");

    if (!map || !side || !bombsite) {
      return new Response("Missing parameters", { status: 400 });
    }

    const stratFilePath = `static/strats/${map}/${side}/${bombsite}.json`;
    const fileExists = await exists(stratFilePath);

    let strats: Strategy[] = [];
    if (fileExists) {
      const stratContent = await Deno.readTextFile(stratFilePath);
      strats = JSON.parse(stratContent);
    }

    const oldStrat = await ctx.req.json() as Strategy;

    const idx = strats.findIndex((s) => s.code === oldStrat.code);
    if (idx !== -1) {
      strats.splice(idx, 1);
    }

    await Deno.writeTextFile(
      stratFilePath,
      JSON.stringify(strats),
    );

    return Response.json(strats);
  },
});
