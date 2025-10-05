export function Header(props: { name: string }) {
  return (
    <a href="/maps">
      <h1 id="header__title" class="text-xl font-bold">
        <span>{props.name}</span>
      </h1>
    </a>
  );
}
