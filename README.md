# Lista de Compras

App de lista de compras feito com **React Native**, **Expo** e **TypeScript**, criado como projeto prático da Oficina de Desenvolvimento Mobile.

Você adiciona itens, marca o que já comprou, acompanha o progresso e exclui o que não precisa mais. A lista fica salva no celular, então continua lá quando você fecha e abre o app de novo.

<p align="center">
  <img width="280" alt="Tela com cinco itens na lista, dois marcados como comprados e a barra de progresso pela metade" src="https://github.com/user-attachments/assets/2e0100ad-5886-493c-aaaa-9838b04b60d4" />
  <img width="280" alt="Tela da lista vazia, com um carrinho de compras e a mensagem Sua lista está vazia" src="https://github.com/user-attachments/assets/399ebc89-1ee8-4e27-b89e-4bd0c18fcbdd" />
</p>

## Funcionalidades

- Adicionar itens pelo botão **+** ou pela tecla Enter do teclado
- Marcar e desmarcar itens como comprados na caixinha de seleção
- Excluir itens no botão **✕**
- Contador e barra de progresso de itens comprados
- Mensagem quando a lista está vazia
- Dados salvos no aparelho: a lista continua lá quando você fecha e abre o app

## Tecnologias

| Tecnologia | Para que serve no projeto |
|---|---|
| [React Native](https://reactnative.dev) | Criar o app para Android e iOS com um único código |
| [Expo](https://docs.expo.dev) (SDK 58) | Rodar o projeto no celular sem configurar Android Studio ou Xcode |
| [TypeScript](https://www.typescriptlang.org) | Tipos que mostram erros no editor antes de o app rodar |
| [Zustand](https://github.com/pmndrs/zustand) | Guardar a lista e as ações que mexem nela (a "store") |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Salvar a lista no armazenamento do celular |

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) 22.13 ou mais recente
- O app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), na versão compatível com o **SDK 58**
- Celular e computador na **mesma rede Wi-Fi**

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/daviimelo/lista-compras.git
cd lista-compras

# 2. Instalar as dependências
npm install

# 3. Iniciar o servidor
npx expo start
```

Depois, escaneie o QR code que aparece no terminal: no Android, pelo próprio Expo Go; no iPhone, pelo app Câmera.

### Se algo der errado

| Problema | Solução |
|---|---|
| O QR code não conecta | Confira se estão no mesmo Wi-Fi, ou rode `npx expo start --tunnel` |
| O Expo Go diz que a versão do SDK é incompatível | Atualize o Expo Go, ou aperte `w` no terminal para abrir o app no navegador |
| A tela não atualiza depois de salvar um arquivo | Aperte `r` no terminal para recarregar |

## Estrutura do projeto

```
lista-compras/
├── App.tsx          # A tela: campo de texto, lista e estilos
├── store.ts         # A store do Zustand: a lista e as ações (adicionar, alternar, remover)
├── index.ts         # Ponto de entrada do app (gerado pelo Expo)
├── assets/
│   └── check.png    # Ícone de verificado da caixinha
├── docs/            # Imagens usadas neste README
├── app.json         # Configurações do Expo
└── package.json     # Dependências e scripts
```

## Como o código funciona

O app tem dois arquivos principais, cada um com uma responsabilidade.

### `store.ts`: os dados

A store guarda a lista de itens e três ações. Todas seguem a mesma receita:

1. **Pegar** a lista atual com `get().itens`
2. **Criar** uma lista nova, com spread (`...`), `map` ou `filter`
3. **Salvar** com `set({ itens: novaLista })`

```ts
remover: (id) => {
  const novaLista = get().itens.filter((item) => item.id !== id);
  set({ itens: novaLista });
},
```

A store é embrulhada pelo `persist`, que grava a lista no AsyncStorage a cada mudança e a carrega de volta quando o app abre.

### `App.tsx`: a tela

- `useState` guarda só o texto que está sendo digitado, um rascunho que não precisa ser salvo.
- `useLista` busca a lista e as ações na store. Quando a lista muda, a tela se redesenha sozinha.
- O número de comprados e a barra de progresso são **calculados** a partir da lista, sem estado próprio.
- A `FlatList` desenha um cartão para cada item, chamando a função `renderItem`.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
