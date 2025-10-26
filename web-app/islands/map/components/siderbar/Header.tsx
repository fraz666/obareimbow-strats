export function Header(props: { name: string }) {
  return (
    <a href="/maps">
      <span id="header__title" class="text-xl font-bold">
        <span>{props.name}</span>
      </span>
    </a>
  );
}
