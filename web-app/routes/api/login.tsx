import { UserType } from "../../domain/models/authentication.ts";
import { define } from "../../utils.ts";
import { setCookie } from "@std/http/cookie";

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const type = form.get("type")?.toString() as UserType;
    const passphrase = form.get("passphrase")?.toString();

    if (
      !passphrase ||
      (passphrase !== Deno.env.get("ADMIN_PASSPHRASE") && type === "admin") ||
      (passphrase !== Deno.env.get("VIEWER_PASSPHRASE") && type === "viewer")
    ) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, {
        status: 303, // See Other
        headers,
      });
    }

    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: btoa(type), // this should be a unique value for each session
      maxAge: 36000, // 10 hours
      sameSite: "Lax", // this is important to prevent CSRF attacks
      path: "/",
      secure: true,
    });

    headers.set("location", "/maps");
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
});
