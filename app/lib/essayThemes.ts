export const essayThemes = [
  "Desafios da educação no Brasil",
  "Fake news e democracia",
  "Saúde mental dos jovens",
  "Violência nas escolas",
  "Impacto das redes sociais",
  "Desigualdade social",
  "Sustentabilidade ambiental",
  "Inclusão digital",
  "Cultura do cancelamento",
  "Inteligência artificial",
];

export function getRandomTheme() {
  return essayThemes[
    Math.floor(Math.random() * essayThemes.length)
  ];
}
