import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home(ctx) {
  const count = useSignal(3) //{ current: 3, step: 1});

  console.log("Shared value " + ctx.state.shared);

  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Obareimbow Strats - Rainbow Six Siege Strategy Planner</title>
        <meta
          name="description"
          content="Plan and draw your Rainbow Six Siege attack and defense strategies on interactive maps"
        />
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <h2>{count.value}</h2>
        <Counter count={count} />
      </div>
    </div>
  );
});
