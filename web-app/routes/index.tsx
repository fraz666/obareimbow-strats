import { getCookies } from "@std/http/cookie";
import { define } from "../utils.ts";
import Login from "../islands/Login.tsx";

// TODO: unable to share handler; is it a bug?
export const handler = define.handlers({
  GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    return { data: { isLogged: cookies.auth != null} };
  },
});

export default define.page<typeof handler>((props) => {
  const { isLogged } = props.data;
  return (
    <div class="min-h-screen bg-gray-900 text-white">
      {isLogged ? <a href="/maps">Maps</a> : <Login/>}
    </div>
  );
});
