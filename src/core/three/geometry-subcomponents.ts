
/**
 * @module core/three/geometry-subcomponents
 * Este módulo fornece funções para criar subcomponentes geométricos reutilizáveis
 * que podem ser usados na construção de geometrias de equipamentos mais complexas.
 */
import * as THREE from 'three';

interface BollardConfig {
  parentWidth: number;
  parentDepth: number;
  parentHeight: number; // Altura do objeto pai, para referência de escala
  bollardRadiusRatio?: number;
  bollardHeightRatio?: number; // Altura do cabeço em si, proporcional à parentHeight ou um valor absoluto pequeno
  countPerSide: number;
  yOffset?: number; // Deslocamento Y para posicionar a base dos cabeços (e.g., no nível do convés)
}

/**
 * Cria um grupo de cabeços de amarração (bollards).
 * @param {BollardConfig} config - Configurações para os bollards.
 * @returns {THREE.Group} Um grupo contendo os meshes dos bollards.
 */
export function createBollardsGroup(config: BollardConfig): THREE.Group {
  const group = new THREE.Group();
  const {
    parentWidth,
    parentDepth,
    parentHeight, // Usado para escala relativa da altura do cabeço
    bollardRadiusRatio = 0.02, // Raio do cabeço como % da menor dimensão (largura/profundidade)
    bollardHeightRatio = 0.05, // Altura do cabeço como % da altura do pai
    countPerSide,
    yOffset = 0, // Onde a base dos cabeços deve estar (e.g., convés)
  } = config;

  const baseDimForRadius = Math.min(parentWidth, parentDepth);
  const bollardRadius = baseDimForRadius * bollardRadiusRatio;
  const bollardActualHeight = Math.max(0.1, parentHeight * bollardHeightRatio); // Altura do próprio cilindro do cabeço

  const bollardGeo = new THREE.CylinderGeometry(bollardRadius, bollardRadius, bollardActualHeight, 8);
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, visible: false }); // Cinza escuro

  // Pontos de distribuição ao longo da profundidade
  const spacing = parentDepth / (countPerSide > 1 ? countPerSide -1 : 1);

  for (let i = 0; i < countPerSide; i++) {
    const zPos = -parentDepth / 2 + (i * spacing) + (countPerSide === 1 ? parentDepth / 2 : 0); // Centraliza se for um só
    
    const bollardLeft = new THREE.Mesh(bollardGeo, tempMaterial.clone());
    // Posiciona a base do cabeço no yOffset, e o centro do cilindro em yOffset + altura/2
    bollardLeft.position.set(-parentWidth / 2 + bollardRadius * 1.5, yOffset + bollardActualHeight / 2, zPos);
    group.add(bollardLeft);

    const bollardRight = new THREE.Mesh(bollardGeo, tempMaterial.clone());
    bollardRight.position.set(parentWidth / 2 - bollardRadius * 1.5, yOffset + bollardActualHeight / 2, zPos);
    group.add(bollardRight);
  }
  return group;
}

interface FenderConfig {
  parentWidth: number;
  parentDepth: number;
  parentHeight: number;
  fenderRadiusRatio?: number; // Raio do toro
  fenderTubeRatio?: number;   // Raio do tubo do toro
  countPerSide: number;
  yOffset?: number; // Deslocamento Y para o centro vertical das defensas
}

/**
 * Cria um grupo de defensas (fenders) laterais.
 * @param {FenderConfig} config - Configurações para as defensas.
 * @returns {THREE.Group} Um grupo contendo os meshes das defensas.
 */
export function createFendersGroup(config: FenderConfig): THREE.Group {
  const group = new THREE.Group();
  const {
    parentWidth,
    parentDepth,
    parentHeight,
    fenderRadiusRatio = 0.1, // Raio do toro como % da altura do pai
    fenderTubeRatio = 0.2,   // Raio do tubo como % do raio do toro
    countPerSide,
    yOffset = 0, // Onde o centro das defensas deve estar no eixo Y do objeto pai
  } = config;

  const fenderRadius = parentHeight * fenderRadiusRatio;
  const fenderTubeRadius = fenderRadius * fenderTubeRatio;
  const fenderGeo = new THREE.TorusGeometry(fenderRadius, fenderTubeRadius, 8, 16);
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, visible: false }); // Quase preto
  
  const spacing = parentDepth / (countPerSide > 1 ? countPerSide : 1); // Ajuste para melhor distribuição

  for (let i = 0; i < countPerSide; i++) {
    const zPosFender = -parentDepth / 2 + spacing / 2 + (i * spacing);
    
    const fenderLeft = new THREE.Mesh(fenderGeo, tempMaterial.clone());
    // yOffset é o centro Y do objeto pai, as defensas ficam centradas aí
    fenderLeft.position.set(-parentWidth / 2 - fenderTubeRadius, yOffset, zPosFender);
    fenderLeft.rotation.y = Math.PI / 2; // Rotaciona o toro para ficar "de pé" na lateral
    group.add(fenderLeft);

    const fenderRight = new THREE.Mesh(fenderGeo, tempMaterial.clone());
    fenderRight.position.set(parentWidth / 2 + fenderTubeRadius, yOffset, zPosFender);
    fenderRight.rotation.y = Math.PI / 2;
    group.add(fenderRight);
  }
  return group;
}
