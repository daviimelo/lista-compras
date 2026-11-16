import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Item de uma Lista
export type Item = {
  id: string;
  nome: string;
  comprado: boolean;
};

// O que a store guarda: a lista e as ações que mexem nela
type Lista = {
  itens: Item[];
  adicionar: (nome: string) => void;
  alternar: (id: string) => void;
  remover: (id: string) => void;
};

// A store
// get() -> lê a lista atual
// set() -> salva a lista nova (e a tela atualiza sozinha)
export const useLista = create<Lista>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionar: (nome) => {
        const novoItem = { id: Date.now().toString(), nome: nome, comprado: false };
        const novaLista = [...get().itens, novoItem];
        set({ itens: novaLista });
      },

      alternar: (id) => {
        const novaLista = get().itens.map((item) => {
          if (item.id === id) {
            return { ...item, comprado: !item.comprado };
          }
          return item;
        });
        set({ itens: novaLista });
      },

      remover: (id) => {
        const novaLista = get().itens.filter((item) => item.id !== id);
        set({ itens: novaLista });
      },
    }),

    // Configura onde salvar o nome da caixa" e onde guardar no celular
    {
      name: 'lista-compras',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);