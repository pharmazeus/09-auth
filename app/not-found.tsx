import type { Metadata } from "next";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "404 — Сторінку не знайдено | NoteHub",
  description: "Такої сторінки не існує. Перейдіть на головну.",
  openGraph: {
    title: "404 — Сторінку не знайдено | NoteHub",
    description: "Такої сторінки не існує.",
    url: "https://notehub.vercel.app/404",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
