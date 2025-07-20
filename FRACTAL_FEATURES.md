# Funcionalidades de Arte Fractal

## Visão Geral

Adicionei funcionalidades completas de arte fractal ao Algorithmic Art Generator, permitindo criar fractais interativos e animados com controles em tempo real.

## Tipos de Fractais Implementados

### 1. Conjunto de Mandelbrot
- **Descrição**: O famoso conjunto de Mandelbrot, uma das imagens fractais mais reconhecidas
- **Características**: 
  - Zoom automático e animado
  - Cores baseadas na paleta selecionada
  - Controles de iterações para detalhamento
- **Parâmetros**: Iterações, escala, ângulo

### 2. Conjunto de Julia
- **Descrição**: Fractal relacionado ao conjunto de Mandelbrot com parâmetros complexos animados
- **Características**:
  - Parâmetros complexos que se movem ao longo do tempo
  - Padrões orgânicos e fluidos
  - Cores dinâmicas baseadas na paleta
- **Parâmetros**: Iterações, escala, ângulo

### 3. Triângulo de Sierpinski
- **Descrição**: Fractal geométrico clássico baseado em triângulos
- **Características**:
  - Estrutura recursiva de triângulos
  - Cores que mudam com a profundidade
  - Controle de iterações para complexidade
- **Parâmetros**: Iterações, escala, ângulo

### 4. Floco de Neve de Koch
- **Descrição**: Fractal baseado em curvas com padrão de floco de neve
- **Características**:
  - Rotação animada
  - Estrutura de três lados
  - Linhas coloridas com espessura variável
- **Parâmetros**: Iterações, escala, ângulo

### 5. Curva do Dragão
- **Descrição**: Fractal baseado em dobras de papel
- **Características**:
  - Padrão de dobra recursivo
  - Rotação animada
  - Linhas coloridas
- **Parâmetros**: Iterações, escala, ângulo

### 6. Mandala Fractal
- **Descrição**: Fractal inspirado em mandalas com simetria radial de 8 pontos
- **Características**:
  - Simetria radial perfeita
  - Cores neon vibrantes (ciano, verde, vermelho, amarelo)
  - Efeitos de brilho e sombra
  - Padrões ondulantes animados
  - Anéis concêntricos com detalhes complexos
- **Parâmetros**: Iterações, escala, ângulo

## Controles Específicos para Fractais

### Parâmetros Principais
- **Fractal Type**: Seleção do tipo de fractal (Mandelbrot, Julia, Sierpinski, Koch, Dragon, Mandala)
- **Fractal Iterations**: Número de iterações (10-300) - controla o nível de detalhe
- **Fractal Scale**: Escala do fractal (0.1-1.0) - controla o tamanho
- **Fractal Angle**: Ângulo de rotação (0-2π) - controla a orientação

### Controles Gerais Aplicáveis
- **Color Palette**: 6 paletas predefinidas (sunset, ocean, forest, cosmic, fire, monochrome)
- **Opacity**: Transparência do fractal (0.1-1.0)
- **Animation**: Toggle para animação estática ou dinâmica
- **Animation Speed**: Velocidade da animação (0.1-5.0)

## Como Usar

1. **Selecionar Padrão Fractal**: No dropdown "Pattern", escolha "Fractal"
2. **Escolher Tipo**: No dropdown "Fractal Type", selecione o tipo desejado
3. **Ajustar Parâmetros**: Use os sliders para personalizar:
   - Aumentar iterações para mais detalhes
   - Ajustar escala para tamanho ideal
   - Modificar ângulo para orientação
4. **Personalizar Cores**: Escolha uma paleta de cores
5. **Animar**: Ative a animação para ver o fractal em movimento
6. **Exportar**: Salve como PNG (estático) ou GIF (animado)

## Características Técnicas

### Performance
- **Mandelbrot/Julia**: Renderização pixel por pixel para máxima qualidade
- **Geométricos**: Renderização vetorial para escalabilidade
- **Otimização**: Limitação de iterações para manter performance

### Animações
- **Zoom automático** nos fractais de Mandelbrot e Julia
- **Rotação** nos fractais geométricos
- **Parâmetros dinâmicos** que mudam ao longo do tempo

### Exportação
- **PNG**: Para fractais estáticos em alta resolução
- **GIF**: Para fractais animados (apenas quando animação está ativa)

## Exemplos de Uso

### Mandelbrot Set
- Use paleta "cosmic" para efeito espacial
- Aumente iterações para detalhes finos
- Ative animação para zoom automático

### Julia Set
- Experimente com paleta "fire" para efeito dramático
- Ajuste velocidade de animação para movimento suave
- Use baixa opacidade para efeito sutil

### Sierpinski Triangle
- Paleta "monochrome" para efeito minimalista
- Poucas iterações para padrão simples
- Muitas iterações para complexidade máxima

### Koch Snowflake
- Paleta "ocean" para efeito gelo
- Animações lentas para movimento gracioso
- Média opacidade para equilíbrio visual

### Dragon Curve
- Paleta "forest" para efeito orgânico
- Animações rápidas para movimento dinâmico
- Alta opacidade para impacto visual

### Mandala Fractal
- Cores neon vibrantes para efeito hipnótico
- Animações lentas para movimento gracioso
- Alta opacidade para máximo brilho
- Ajuste de iterações para complexidade desejada

## Dicas de Criação

1. **Comece simples**: Use poucas iterações e aumente gradualmente
2. **Experimente paletas**: Cada paleta cria atmosfera diferente
3. **Ajuste velocidade**: Animações lentas são mais relaxantes
4. **Combine parâmetros**: Pequenos ajustes podem criar grandes diferenças
5. **Exporte frequentemente**: Salve suas criações favoritas

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (modernos)
- **Dispositivos**: Desktop e mobile responsivo
- **Performance**: Otimizado para renderização em tempo real 