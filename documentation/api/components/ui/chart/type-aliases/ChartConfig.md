[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [components/ui/chart](../README.md) / ChartConfig

# Type Alias: ChartConfig

> **ChartConfig** = \{ \[k in string\]: \{ icon?: React.ComponentType; label?: React.ReactNode \} & (\{ color?: string; theme?: never \} \| \{ color?: never; theme: Record\<keyof typeof THEMES, string\> \}) \}

Defined in: [src/components/ui/chart.tsx:36](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/ui/chart.tsx#L36)

Configuração para os gráficos, permitindo a definição de rótulos, ícones e cores
para cada item de dados do gráfico. As cores podem ser definidas diretamente ou
através de um objeto de tema para suportar diferentes temas (claro/escuro).

<div class="mermaid-block"><div class="mermaid dark">%%{init:{"theme":"dark"}}%%
classDiagram
    class ChartConfig {
      +label?: React.ReactNode
      +icon?: React.ComponentType
      +color?: string
      +theme?: object
    }
    class THEMES_Object {
      +light: string
      +dark: string
    }
    ChartConfig --&gt; THEMES_Object : theme</div><div class="mermaid light">%%{init:{"theme":"default"}}%%
classDiagram
    class ChartConfig {
      +label?: React.ReactNode
      +icon?: React.ComponentType
      +color?: string
      +theme?: object
    }
    class THEMES_Object {
      +light: string
      +dark: string
    }
    ChartConfig --&gt; THEMES_Object : theme</div><pre><code class="language-mermaid">classDiagram
    class ChartConfig {
      +label?: React.ReactNode
      +icon?: React.ComponentType
      +color?: string
      +theme?: object
    }
    class THEMES_Object {
      +light: string
      +dark: string
    }
    ChartConfig --&gt; THEMES_Object : theme</code></pre></div>
<style>
:root.mermaid-enabled .mermaid-block > pre {
  display: none;
}
:root:not(.mermaid-enabled) .mermaid-block > .mermaid {
  display: none !important;
}

.mermaid-block > .mermaid[data-inserted].dark {
  display: var(--mermaid-dark-display);
}
.mermaid-block > .mermaid[data-inserted].light {
  display: var(--mermaid-light-display);
}

:root {
  --mermaid-dark-display: none;
  --mermaid-light-display: block;
}
@media (prefers-color-scheme: light) {
  :root {
    --mermaid-dark-display: none;
    --mermaid-light-display: block;
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    --mermaid-dark-display: block;
    --mermaid-light-display: none;
  }
}
body.light, :root[data-theme="light"] {
  --mermaid-dark-display: none;
  --mermaid-light-display: block;
}
body.dark, :root[data-theme="dark"] {
  --mermaid-dark-display: block;
  --mermaid-light-display: none;
}
</style>

<script type="module">
import mermaid from "https://unpkg.com/mermaid@latest/dist/mermaid.esm.min.mjs";

document.documentElement.classList.add("mermaid-enabled");

mermaid.initialize({startOnLoad:true});

requestAnimationFrame(function check() {
  let some = false;
  document.querySelectorAll("div.mermaid:not([data-inserted])").forEach(div => {
    some = true;
    if (div.querySelector("svg")) {
      div.dataset.inserted = true;
    }
  });

  if (some) {
    requestAnimationFrame(check);
  }
});
</script>

