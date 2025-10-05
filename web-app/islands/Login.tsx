import { UserType } from "../domain/models/authentication.ts";

const ADMIN = "admin" as UserType;
const VIEWER = "viewer" as UserType;

export default function Login() {
  return (
    <div class="bg-gray-900 text-white">
      <div>
        <h4>Create strats</h4>
        <form method="post" action="/api/login">
          <input type="passphrase" name="passphrase" value="" />
          <input type="hidden" name="type" value={ADMIN} />
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        <h4>Join strats</h4>
        <form method="post" action="/api/login">
          <input type="passphrase" name="passphrase" value="" />
          <input type="hidden" name="type" value={VIEWER} />
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  );
}
