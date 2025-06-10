
/**
 * Gerencia interações do mouse (clique e movimento) dentro da cena Three.js.
 *
 * ATENÇÃO: Este arquivo foi esvaziado. A lógica de interação do mouse
 * foi movida para o hook customizado `src/hooks/use-mouse-interaction.ts`
 * (renomeado internamente para `useMouseInteractionManager` em termos de funcionalidade)
 * como parte de uma refatoração para melhorar a modularidade e o Princípio da Responsabilidade Única.
 *
 * O hook `useMouseInteractionManager` agora encapsula:
 * - A lógica de raycasting para detectar interseções.
 * - A adição e remoção de ouvintes de eventos do mouse no elemento DOM da cena.
 * - A invocação de callbacks para tratar seleção e hover de equipamentos.
 *
 * Este arquivo é mantido para evitar quebras de importação em locais que ainda
 * possam referenciá-lo, mas seu conteúdo não é mais utilizado.
 * Considere remover as importações deste arquivo e usar o hook diretamente.
 */

// Conteúdo removido. A lógica agora reside em src/hooks/use-mouse-interaction.ts
