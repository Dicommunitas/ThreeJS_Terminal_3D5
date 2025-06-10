

/**
 * @module app/page
 * Componente principal da página da aplicação Terminal 3D.
 *
 * Responsabilidades:
 * 1.  Orquestração de Hooks de Estado: Inicializa e coordena os principais hooks customizados
 *     que gerenciam diferentes aspectos do estado da aplicação (e.g., `useCommandHistory`,
 *     `useEquipmentDataManager`, `useCameraManager`, `useFilterManager`, `useAnnotationManager`,
 *     `useEquipmentSelectionManager`, `useLayerManager`).
 * 2.  Gerenciamento de Estado da UI: Controla estados locais específicos da UI que não pertencem
 *     a um hook dedicado (e.g., `colorMode`).
 * 3.  Derivação de Dados para UI: Calcula ou formata dados derivados dos estados dos hooks para
 *     serem passados como props para componentes da UI (e.g., `cameraViewSystems`,
 *     `selectedEquipmentDetails`, `equipmentAnnotation`, `availableOperationalStatesList`,
 *     `availableProductsList`).
 * 4.  Manipulação de Interações Complexas: Implementa lógicas de callback que podem envolver
 *     múltiplos hooks ou estados (e.g., `handleFocusAndSelectSystem` que afeta a câmera e a seleção).
 * 5.  Renderização do Layout Principal: Define a estrutura da página, renderizando componentes
 *     de alto nível como `MainSceneArea` (contendo a cena 3D e o painel de informações),
 *     a `Sidebar` (com seus controles) e o `AnnotationDialog`.
 * 6.  Passagem de Props e Callbacks: Conecta os hooks de estado aos componentes da UI,
 *     fornecendo os dados necessários e as funções de callback para manipulação de eventos.
 *
 * @see {@link documentation/api/components/main-scene-area/README.md} Para a área principal da cena.
 * @see {@link documentation/api/components/ui/sidebar/README.md} Para a barra lateral de controles.
 * @see {@link documentation/api/components/annotation-dialog/README.md} Para o diálogo de anotações.
 * @see {@link documentation/api/hooks/use-command-history/README.md} Para o gerenciamento de histórico de comandos.
 * @see {@link documentation/api/hooks/use-equipment-data-manager/README.md} Para o gerenciamento de dados de equipamentos.
 * @see {@link documentation/api/hooks/use-camera-manager/README.md} Para o gerenciamento da câmera.
 * @see {@link documentation/api/hooks/use-filter-manager/README.md} Para o gerenciamento de filtros.
 * @see {@link documentation/api/hooks/use-annotation-manager/README.md} Para o gerenciamento de anotações.
 * @see {@link documentation/api/hooks/use-equipment-selection-manager/README.md} Para o gerenciamento de seleção de equipamentos.
 * @see {@link documentation/api/hooks/use-layer-manager/README.md} Para o gerenciamento de camadas.
 *
 * Diagrama de Interação de Alto Nível da Terminal3DPage:
 * ```mermaid
 * graph LR
 *     Terminal3DPage["Terminal3DPage (Página Principal)"] --> H_CmdHistory["useCommandHistory (Hook Histórico)"];
 *     Terminal3DPage --> H_EquipData["useEquipmentDataManager (Hook Dados Equip.)"];
 *     Terminal3DPage --> H_CameraMgr["useCameraManager (Hook Câmera)"];
 *     Terminal3DPage --> H_FilterMgr["useFilterManager (Hook Filtros)"];
 *     Terminal3DPage --> H_AnnotMgr["useAnnotationManager (Hook Anotações)"];
 *     Terminal3DPage --> H_EquipSelectMgr["useEquipmentSelectionManager (Hook Seleção)"];
 *     Terminal3DPage --> H_LayerMgr["useLayerManager (Hook Camadas)"];
 *
 *     Terminal3DPage --> MainSceneArea_Comp["MainSceneArea (Comp. Área da Cena)"];
 *     Terminal3DPage --> Sidebar_Comp["Sidebar (Comp. Barra Lateral)"];
 *     Terminal3DPage --> AnnotationDialog_Comp["AnnotationDialog (Comp. Diálogo Anotação)"];
 *
 *     MainSceneArea_Comp --> ThreeScene_Comp["ThreeScene (Comp. Cena 3D)"];
 *     MainSceneArea_Comp --> InfoPanel_Comp["InfoPanel (Comp. Painel Info)"];
 *     Sidebar_Comp --> SidebarContentLayout_Comp["SidebarContentLayout (Comp. Conteúdo Sidebar)"];
 *
 *     subgraph "Hooks de Gerenciamento de Estado da Aplicação"
 *       H_CmdHistory;
 *       H_EquipData;
 *       H_CameraMgr;
 *       H_FilterMgr;
 *       H_AnnotMgr;
 *       H_EquipSelectMgr;
 *       H_LayerMgr;
 *     end
 *
 *     subgraph "Componentes de UI Principais"
 *       MainSceneArea_Comp;
 *       Sidebar_Comp;
 *       AnnotationDialog_Comp;
 *       InfoPanel_Comp;
 *       ThreeScene_Comp;
 *       SidebarContentLayout_Comp;
 *     end
 * ```
 */
"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Equipment, Layer, Command, CameraState, Annotation, ColorMode, TargetSystemInfo } from '@/lib/types';
import { useCommandHistory } from '@/hooks/use-command-history';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Undo2Icon, Redo2Icon, PanelLeft } from 'lucide-react';

// Hooks de gerenciamento de estado
import { useAnnotationManager } from '@/hooks/useAnnotationManager';
import { useEquipmentSelectionManager } from '@/hooks/use-equipment-selection-manager';
import { useFilterManager } from '@/hooks/use-filter-manager';
import { useEquipmentDataManager } from '@/hooks/useEquipmentDataManager';
import { useCameraManager, defaultInitialCameraPosition, defaultInitialCameraLookAt } from '@/hooks/useCameraManager';
import { useLayerManager } from '@/hooks/use-layer-manager';

// Componentes de Layout
import { MainSceneArea } from '@/components/main-scene-area';
import { SidebarContentLayout } from '@/components/sidebar-content-layout';
import { AnnotationDialog } from '@/components/annotation-dialog';


/**
 * Componente principal da página Terminal 3D (Terminal3DPage).
 * Orquestra os diversos hooks de gerenciamento de estado da aplicação e renderiza a UI principal.
 * @returns {JSX.Element} O componente da página Terminal 3D.
 */
export default function Terminal3DPage(): JSX.Element {
  // Hook para histórico de comandos (Undo/Redo)
  const { executeCommand, undo, redo, canUndo, canRedo } = useCommandHistory();

  // Hook para gerenciar os dados dos equipamentos (fonte da verdade)
  const {
    equipmentData,
    handleOperationalStateChange,
    handleProductChange,
  } = useEquipmentDataManager();

  // Hook para gerenciar o estado da câmera
  const {
    currentCameraState,
    targetSystemToFrame,
    handleSetCameraViewForSystem,
    handleCameraChangeFromScene,
    onSystemFramed,
    focusedSystemNameUI,
    currentViewIndexUI,
  } = useCameraManager({ executeCommand });

  // Hook para gerenciar filtros de equipamentos
  const {
    searchTerm,
    setSearchTerm,
    selectedSistema,
    setSelectedSistema,
    selectedArea,
    setSelectedArea,
    availableSistemas,
    availableAreas,
    filteredEquipment,
  } = useFilterManager({ allEquipment: equipmentData });

  // Hook para gerenciar anotações
  const {
    annotations,
    isAnnotationDialogOpen,
    annotationTargetEquipment,
    editingAnnotation,
    handleOpenAnnotationDialog,
    handleSaveAnnotation,
    handleDeleteAnnotation,
    getAnnotationForEquipment,
    setIsAnnotationDialogOpen,
  } = useAnnotationManager({});

  // Hook para gerenciar seleção de equipamentos
  const {
    selectedEquipmentTags,
    hoveredEquipmentTag,
    handleEquipmentClick,
    handleSetHoveredEquipmentTag,
    selectTagsBatch,
  } = useEquipmentSelectionManager({ equipmentData, executeCommand });

  // Hook para gerenciar camadas de visibilidade
  const { layers, handleToggleLayer } = useLayerManager({ executeCommand });

  // Estado local para o modo de colorização
  const [colorMode, setColorMode] = useState<ColorMode>('Estado Operacional');

  // Memoiza a lista de sistemas para o painel de controle da câmera
  const cameraViewSystems = useMemo(() => {
    return availableSistemas.filter(s => s !== 'All');
  }, [availableSistemas]);

  // Refs para controle de debounce/throttle de foco
  const isFocusingRef = useRef(false);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Manipula a ação de focar a câmera em um sistema e selecionar todos os equipamentos desse sistema.
   * @param {string} systemName - O nome do sistema para focar e selecionar.
   */
  const handleFocusAndSelectSystem = useCallback((systemName: string) => {
    if (isFocusingRef.current) {
      return;
    }
    isFocusingRef.current = true;
    handleSetCameraViewForSystem(systemName);
    const equipmentInSystem = equipmentData
      .filter(equip => equip.sistema === systemName)
      .map(equip => equip.tag);
    selectTagsBatch(equipmentInSystem, `Focado e selecionado sistema ${systemName}.`);

    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      isFocusingRef.current = false;
    }, 100);

  }, [equipmentData, handleSetCameraViewForSystem, selectTagsBatch]);

  // Limpa o timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  // Memoiza os detalhes do equipamento selecionado (se apenas um estiver selecionado)
  const selectedEquipmentDetails = useMemo(() => {
    if (selectedEquipmentTags.length === 1) {
      const tag = selectedEquipmentTags[0];
      return equipmentData.find(e => e.tag === tag) || null;
    }
    return null;
  }, [selectedEquipmentTags, equipmentData]);

  // Memoiza a anotação para o equipamento selecionado
  const equipmentAnnotation = useMemo(() => {
    if (selectedEquipmentDetails) {
      return getAnnotationForEquipment(selectedEquipmentDetails.tag);
    }
    return null;
  }, [selectedEquipmentDetails, getAnnotationForEquipment]);

  // Memoiza a lista de estados operacionais disponíveis para os dropdowns
  const availableOperationalStatesList = useMemo(() => {
    const states = new Set<string>();
    equipmentData.forEach(equip => {
      if (equip.operationalState) states.add(equip.operationalState);
    });
    const sortedStates = Array.from(states).sort((a, b) => {
      if (a === "Não aplicável") return -1;
      if (b === "Não aplicável") return 1;
      return a.localeCompare(b);
    });
    return sortedStates;
  }, [equipmentData]);

  // Memoiza a lista de produtos disponíveis para os dropdowns
  const availableProductsList = useMemo(() => {
    const products = new Set<string>();
    equipmentData.forEach(equip => {
      if (equip.product) products.add(equip.product);
    });
     const sortedProducts = Array.from(products).sort((a,b) => {
      if (a === "Não aplicável") return -1;
      if (b === "Não aplicável") return 1;
      return a.localeCompare(b);
    });
    return sortedProducts;
  }, [equipmentData]);


  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-screen flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
        {/* Área principal da cena 3D e painel de informações */}
        <MainSceneArea
          equipment={filteredEquipment}
          allEquipmentData={equipmentData}
          layers={layers}
          annotations={annotations}
          selectedEquipmentTags={selectedEquipmentTags}
          onSelectEquipment={handleEquipmentClick}
          hoveredEquipmentTag={hoveredEquipmentTag}
          setHoveredEquipmentTag={handleSetHoveredEquipmentTag}
          cameraState={currentCameraState}
          onCameraChange={handleCameraChangeFromScene}
          initialCameraPosition={defaultInitialCameraPosition}
          initialCameraLookAt={defaultInitialCameraLookAt}
          colorMode={colorMode}
          targetSystemToFrame={targetSystemToFrame}
          onSystemFramed={onSystemFramed}
          selectedEquipmentDetails={selectedEquipmentDetails}
          equipmentAnnotation={equipmentAnnotation}
          onOpenAnnotationDialog={() => selectedEquipmentDetails && handleOpenAnnotationDialog(selectedEquipmentDetails)}
          onDeleteAnnotation={handleDeleteAnnotation}
          onOperationalStateChange={handleOperationalStateChange}
          availableOperationalStatesList={availableOperationalStatesList}
          onProductChange={handleProductChange}
          availableProductsList={availableProductsList}
        />

        {/* Botão para abrir/fechar a Sidebar */}
        <div className="absolute top-4 left-4 z-30">
          <SidebarTrigger asChild className="h-10 w-10 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg p-2">
            <PanelLeft />
          </SidebarTrigger>
        </div>
      </div>

      {/* Componente Sidebar e seu conteúdo */}
      <Sidebar collapsible="offcanvas" className="border-r z-40">
        <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-3 flex justify-between items-center border-b">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Desfazer" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Undo2Icon className="h-5 w-5" />
              </Button>
              <SidebarTrigger
                asChild
                variant="ghost"
                size="default"
                className="p-0 h-auto w-auto hover:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <span className="font-semibold text-lg cursor-pointer hover:underline">
                  Terminal 3D
                </span>
              </SidebarTrigger>
              <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Refazer" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Redo2Icon className="h-5 w-5" />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContentLayout
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSistema={selectedSistema}
            setSelectedSistema={setSelectedSistema}
            availableSistemas={availableSistemas}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            availableAreas={availableAreas}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
            layers={layers}
            onToggleLayer={handleToggleLayer}
            cameraViewSystems={cameraViewSystems}
            onFocusAndSelectSystem={handleFocusAndSelectSystem}
          />
        </div>
      </Sidebar>

      {/* Diálogo para adicionar/editar anotações */}
      <AnnotationDialog
        isOpen={isAnnotationDialogOpen}
        onOpenChange={setIsAnnotationDialogOpen}
        onConfirm={handleSaveAnnotation}
        currentAnnotation={editingAnnotation}
        equipmentName={annotationTargetEquipment?.name || ''}
      />
    </SidebarProvider>
  );
}

