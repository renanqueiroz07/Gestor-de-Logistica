# Estrutura do Projeto

Este projeto e um dashboard web estatico organizado por dominio.

## Raiz

- `Novo.html`, `style.css`, `script.js`: landing page publica.
- `inicio.server/`: dashboard principal legado.
- `pages/clientes/`: dominio de clientes, com componentes, hook/store, services, styles e utils.
- `pages/module/`: modulos operacionais do dashboard.
- `api/v1/`: contratos e logica de backend simulada para ingestao e roteamento.
- `tests/`: testes automatizados em Node.

## Padrao de Modulo

Novos modulos devem seguir:

```text
pages/module/nome-do-modulo/
  index.html
  styles/
    nome-do-modulo.css
  scripts/
    nome-do-modulo.js
```

Modulos com logica de dominio mais complexa devem adicionar subpastas como:

```text
components/
hooks/
services/
utils/
types/
```

## Regras

- Evitar estado compartilhado mutavel exposto diretamente para a UI.
- Manter links relativos validados ao alterar pastas.
- Separar visual (`styles`), comportamento de tela (`scripts`) e dominio (`api` ou `services`).
- Preferir nomes de pasta em kebab-case para novos modulos.
