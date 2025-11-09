import { UserType } from "../domain/models/authentication.ts";

const ADMIN = "admin" as UserType;
const VIEWER = "viewer" as UserType;

export default function Login() {
  return (
    <div class="bg-gray-900 text-white flex flex-col gap-4 items-center justify-center min-h-screen">
      <div>
        <h4>Create strats</h4>
        <form method="post" action="/api/login">
          <input
            type="password"
            name="passphrase"
            value=""
            class="bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none"
          />
          <input type="hidden" name="type" value={ADMIN} />
          <button
            type="submit"
            class="bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Login
          </button>
        </form>
      </div>
      <div>
        <h4>View strats</h4>
        <form method="post" action="/api/login">
          <input
            type="password"
            name="passphrase"
            value=""
            class="bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none"
          />
          <input type="hidden" name="type" value={VIEWER} />
          <button
            type="submit"
            class="bg-gray-700 text-gray-300 hover:bg-gray-600 ml-2"
          >
            View
          </button>
        </form>
      </div>
    </div>
  );
}
