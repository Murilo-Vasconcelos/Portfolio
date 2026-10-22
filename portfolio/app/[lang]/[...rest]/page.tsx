import { notFound } from "next/navigation";

// Qualquer endereço que não existe (ex.: /pt/qualquer-coisa) cai aqui e
// mostra a página 404 do site, com o layout e o idioma certos.
export default function CatchAll() {
  notFound();
}
