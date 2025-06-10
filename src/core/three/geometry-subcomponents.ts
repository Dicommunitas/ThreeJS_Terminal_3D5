
/**
 * @module core/three/geometry-subcomponents
 * Este módulo fornece funções para criar subcomponentes geométricos reutilizáveis
 * que podem ser usados na construção de geometrias de equipamentos mais complexas.
 */
import * as THREE from 'three';

interface BollardConfig {
  parentWidth: number;
  parentDepth: number;
  parentHeight: number;
  bollardRadiusRatio?: number;
  bollardHeightRatio?: number;
  countPerSide: number;
  yOffset?: number;
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
    parentHeight,
    bollardRadiusRatio = 0.02,
    bollardHeightRatio = 0.15,
    countPerSide,
    yOffset = 0,
  } = config;

  const bollardRadius = Math.min(parentWidth, parentDepth) * bollardRadiusRatio;
  const bollardHeight = parentHeight * bollardHeightRatio;
  const bollardGeo = new THREE.CylinderGeometry(bollardRadius, bollardRadius, bollardHeight, 8);
  // Material temporário apenas para o subcomponente, será substituído
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, visible: false });


  for (let i = 0; i < countPerSide; i++) {
    const zPos = -parentDepth / 2 + (i * (parentDepth / (countPerSide > 1 ? countPerSide - 1 : 1)));
    
    const bollardLeft = new THREE.Mesh(bollardGeo, tempMaterial.clone()); // Usa clone do material se necessário
    bollardLeft.position.set(-parentWidth / 2 + bollardRadius * 2.5, yOffset + parentHeight / 2 + bollardHeight / 2, zPos);
    group.add(bollardLeft);

    const bollardRight = new THREE.Mesh(bollardGeo, tempMaterial.clone());
    bollardRight.position.set(parentWidth / 2 - bollardRadius * 2.5, yOffset + parentHeight / 2 + bollardHeight / 2, zPos);
    group.add(bollardRight);
  }
  // bollardGeo.dispose(); // Não descarte aqui se for reutilizado, mas neste caso é clonado.
  return group;
}

interface FenderConfig {
  parentWidth: number;
  parentDepth: number;
  parentHeight: number;
  fenderRadiusRatio?: number;
  fenderTubeRatio?: number;
  countPerSide: number;
  yOffset?: number;
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
    fenderRadiusRatio = 0.25,
    fenderTubeRatio = 0.25,
    countPerSide,
    yOffset = 0,
  } = config;

  const fenderRadius = Math.min(parentWidth, parentHeight, parentDepth) * fenderRadiusRatio;
  const fenderTubeRadius = fenderRadius * fenderTubeRatio;
  const fenderGeo = new THREE.TorusGeometry(fenderRadius, fenderTubeRadius, 8, 16);
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, visible: false });
  
  for (let i = 0; i < countPerSide; i++) {
    const zPosFender = -parentDepth / 2 + fenderRadius + (countPerSide > 1 ? (i * (parentDepth - 2 * fenderRadius) / (countPerSide - 1)) : 0);
    
    const fenderLeft = new THREE.Mesh(fenderGeo, tempMaterial.clone());
    fenderLeft.position.set(-parentWidth / 2 - fenderTubeRadius + 0.05, yOffset + parentHeight / 2 - fenderRadius * 0.5, zPosFender);
    fenderLeft.rotation.y = Math.PI / 2;
    group.add(fenderLeft);

    const fenderRight = new THREE.Mesh(fenderGeo, tempMaterial.clone());
    fenderRight.position.set(parentWidth / 2 + fenderTubeRadius - 0.05, yOffset + parentHeight / 2 - fenderRadius * 0.5, zPosFender);
    fenderRight.rotation.y = Math.PI / 2;
    group.add(fenderRight);
  }
  // fenderGeo.dispose();
  return group;
}
