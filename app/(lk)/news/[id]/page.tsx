import style from "./page.module.css";

export default function Page({ params }: { params: { id: string } }) {
  return <div>My Post: {params.id}</div>;
}
