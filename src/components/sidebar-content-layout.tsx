
/**
 * @module components/sidebar-content-layout
 * Componente para renderizar o conteúdo principal da sidebar.
 *
 * Principal Responsabilidade:
 * Exibir os diversos painéis de controle e filtros dentro da área de conteúdo da sidebar.
 * Utiliza uma ScrollArea para permitir a rolagem do conteúdo.
 *
 * Inclui:
 * - Controles de câmera ("Focus on System").
 * - Filtros de busca textual e seleção por Sistema/Área.
 * - Seletor de modo de colorização.
 * - Gerenciador de camadas de visibilidade.
 * - Link para a documentação externa do projeto.
 *
 * ```mermaid
 *   classDiagram
 *     class SidebarContentLayoutProps {
 *       +searchTerm: string
 *       +setSearchTerm(value: string): void
 *       +selectedSistema: string
 *       +setSelectedSistema(value: string): void
 *       +availableSistemas: string[]
 *       +selectedArea: string
 *       +setSelectedArea(value: string): void
 *       +availableAreas: string[]
 *       +colorMode: ColorMode
 *       +onColorModeChange(mode: ColorMode): void
 *       +layers: Layer[]
 *       +onToggleLayer(layerId: string): void
 *       +cameraViewSystems: string[]
 *       +onFocusAndSelectSystem(systemName: string): void
 *     }
 *     class ColorMode {
 *
 *     }
 *     class Layer {
 *
 *     }
 *     SidebarContentLayoutProps ..> ColorMode
 *     SidebarContentLayoutProps ..> Layer
 *     class SidebarContentLayout {
 *
 *     }
 *     class ReactFC {
 *
 *     }
 *     class CameraControlsPanel {
 *
 *     }
 *     class ColorModeSelector {
 *
 *     }
 *     class LayerManager {
 *
 *     }
 *     class Input {
 *
 *     }
 *     class Select {
 *
 *     }
 *     class Button {
 *
 *     }
 *     class ScrollArea {
 *
 *     }
 *     SidebarContentLayout --|> ReactFC
 *     SidebarContentLayout ..> CameraControlsPanel : uses
 *     SidebarContentLayout ..> ColorModeSelector : uses
 *     SidebarContentLayout ..> LayerManager : uses
 *     SidebarContentLayout ..> Input : uses
 *     SidebarContentLayout ..> Select : uses
 *     SidebarContentLayout ..> Button : uses
 *     SidebarContentLayout ..> ScrollArea : uses
 * ```
 *
 */
"use client";

import type { ColorMode, Layer } from '@/lib/types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayerManager } from "@/components/layer-manager";
import { ColorModeSelector } from "@/components/color-mode-selector";
import { CameraControlsPanel } from "@/components/camera-controls-panel";
import { Separator } from "@/components/ui/separator";
import { XIcon, SearchIcon, FilterIcon, BookOpenIcon } from "lucide-react";

/**
 * Props para o componente SidebarContentLayout.
 * @interface SidebarContentLayoutProps
 * @property {string} searchTerm - O termo de busca textual atual.
 * @property {(value: string) => void} setSearchTerm - Função para atualizar o termo de busca.
 * @property {string} selectedSistema - O sistema selecionado para filtro.
 * @property {(value: string) => void} setSelectedSistema - Função para atualizar o sistema selecionado.
 * @property {string[]} availableSistemas - Lista de sistemas disponíveis para filtro.
 * @property {string} selectedArea - A área selecionada para filtro.
 * @property {(value: string) => void} setSelectedArea - Função para atualizar a área selecionada.
 * @property {string[]} availableAreas - Lista de áreas disponíveis para filtro.
 * @property {ColorMode} colorMode - O modo de colorização atual.
 * @property {(mode: ColorMode) => void} onColorModeChange - Função para atualizar o modo de colorização.
 * @property {Layer[]} layers - Lista de camadas para o LayerManager.
 * @property {(layerId: string) => void} onToggleLayer - Função para alternar a visibilidade de uma camada.
 * @property {string[]} cameraViewSystems - Lista de nomes de sistemas para o CameraControlsPanel.
 * @property {(systemName: string) => void} onFocusAndSelectSystem - Callback para focar e selecionar um sistema.
 */
export interface SidebarContentLayoutProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSistema: string;
  setSelectedSistema: (value: string) => void;
  availableSistemas: string[];
  selectedArea: string;
  setSelectedArea: (value: string) => void;
  availableAreas: string[];
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  layers: Layer[];
  onToggleLayer: (layerId: string) => void;
  cameraViewSystems: string[];
  onFocusAndSelectSystem: (systemName: string) => void;
}

/**
 * Renderiza o layout do conteúdo da sidebar, incluindo filtros, painéis de controle e link para documentação.
 * Utiliza uma ScrollArea para permitir a rolagem do conteúdo se ele exceder a altura da sidebar.
 * @param {SidebarContentLayoutProps} props As props do componente.
 * @returns {JSX.Element} O componente SidebarContentLayout.
 */
export function SidebarContentLayout({
  searchTerm,
  setSearchTerm,
  selectedSistema,
  setSelectedSistema,
  availableSistemas,
  selectedArea,
  setSelectedArea,
  availableAreas,
  colorMode,
  onColorModeChange,
  layers,
  onToggleLayer,
  cameraViewSystems,
  onFocusAndSelectSystem,
}: SidebarContentLayoutProps): JSX.Element {
  // console.log("[SidebarContentLayout.tsx] Rendering with props:", { searchTerm, selectedSistema, availableSistemas, selectedArea, availableAreas, colorMode, layers, cameraViewSystems });
  return (
    <ScrollArea className="h-full flex-1">
      <div className="p-4 space-y-6 pb-6 overflow-x-hidden">
        <CameraControlsPanel systems={cameraViewSystems} onSetView={onFocusAndSelectSystem} />

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FilterIcon className="mr-2 h-5 w-5" />
              Filtrar e Buscar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="search-equipment" className="text-xs text-muted-foreground">
                Busca (Nome, Tipo, TAG)
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="search-equipment"
                  type="text"
                  placeholder="Buscar equipamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-7 w-7"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpar busca"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="filter-sistema" className="text-xs text-muted-foreground">
                Filtrar por Sistema
              </Label>
              <Select value={selectedSistema} onValueChange={setSelectedSistema}>
                <SelectTrigger id="filter-sistema" className="h-9">
                  <SelectValue placeholder="Todos os Sistemas" />
                </SelectTrigger>
                <SelectContent>
                  {availableSistemas.map((sistema) => (
                    <SelectItem key={sistema} value={sistema}>
                      {sistema === 'All' ? 'Todos os Sistemas' : sistema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-area" className="text-xs text-muted-foreground">
                Filtrar por Área
              </Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger id="filter-area" className="h-9">
                  <SelectValue placeholder="Todas as Áreas" />
                </SelectTrigger>
                <SelectContent>
                  {availableAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area === 'All' ? 'Todas as Áreas' : area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <ColorModeSelector
          colorMode={colorMode}
          onColorModeChange={onColorModeChange}
        />
        <LayerManager layers={layers} onToggleLayer={onToggleLayer} />

        <Separator />
        <Button
          variant="link"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground whitespace-normal h-auto py-2"
          asChild
        >
          <a href="https://github.com/Dicommunitas/ThreeJS_Terminal_3D" target="_blank" rel="noopener noreferrer">
            <BookOpenIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="flex-grow">Ver Documentação no GitHub</span>
          </a>
        </Button>
      </div>
    </ScrollArea>
  );
}
