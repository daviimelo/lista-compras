import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLista, Item } from './store';

const cores = {
  fundo: '#F2F5F9',
  primaria: '#0A7483',
  primariaClara: '#DDF1F4',
  texto: '#111A2E',
  textoSuave: '#6B7891',
  cartao: '#FFFFFF',
  borda: '#E3E9F1',
  perigo: '#D64545',
  perigoClaro: '#FCE8E8',
};

export default function App() {
  const [texto, setTexto] = useState('');
  const itens = useLista((s) => s.itens);
  const adicionar = useLista((s) => s.adicionar);
  const alternar = useLista((s) => s.alternar);
  const remover = useLista((s) => s.remover);

  const comprados = itens.filter((i) => i.comprado).length;
  const progresso = itens.length === 0 ? 0 : comprados / itens.length;

  function aoAdicionar() {
    if (texto.trim() === '') return;
    adicionar(texto.trim());
    setTexto('');
  }

  function renderItem({ item }: { item: Item }) {
    return (
      <View style={styles.cartao}>
        <Pressable style={styles.areaToque} onPress={() => alternar(item.id)}>
          <View style={[styles.checkbox, item.comprado && styles.checkboxMarcado]}>
            {item.comprado && <Image source={require('./assets/check.png')} style={styles.check} />}
          </View>
          <Text style={[styles.nomeItem, item.comprado && styles.nomeComprado]}>{item.nome}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.botaoExcluir, pressed && styles.pressionado]}
          onPress={() => remover(item.id)}
          hitSlop={8}
        >
          <Text style={styles.textoExcluir}>✕</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <StatusBar style="light" />

      {/* Cabeçalho colorido com o progresso */}
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Lista de Compras</Text>
        <Text style={styles.subtitulo}>
          {comprados} de {itens.length} itens comprados
        </Text>
        <View style={styles.barraFundo}>
          <View style={[styles.barraProgresso, { width: `${progresso * 100}%` }]} />
        </View>
      </View>

      {/* Campo para adicionar */}
      <View style={styles.entrada}>
        <TextInput
          style={styles.campo}
          placeholder="O que falta comprar?"
          placeholderTextColor={cores.textoSuave}
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={aoAdicionar}
          returnKeyType="done"
        />
        <Pressable
          style={({ pressed }) => [styles.botaoAdicionar, pressed && styles.pressionado]}
          onPress={aoAdicionar}
        >
          <Text style={styles.textoAdicionar}>+</Text>
        </Pressable>
      </View>

      {/* Lista */}
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🛒</Text>
            <Text style={styles.vazioTitulo}>Sua lista está vazia</Text>
            <Text style={styles.vazioTexto}>Adicione o primeiro item lá em cima.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },

  // Cabeçalho
  cabecalho: {
    backgroundColor: cores.primaria,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  titulo: { fontSize: 30, fontWeight: 'bold', color: '#FFFFFF' },
  subtitulo: { fontSize: 15, color: '#D4EEF2', marginTop: 4 },
  barraFundo: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  barraProgresso: { height: 8, backgroundColor: '#FFFFFF', borderRadius: 4 },

  // Campo de entrada (sobe um pouco sobre o cabeçalho)
  entrada: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: -28,
    padding: 8,
    backgroundColor: cores.cartao,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  campo: { flex: 1, fontSize: 16, paddingHorizontal: 12, color: cores.texto },
  botaoAdicionar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAdicionar: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginTop: -2 },

  // Lista e cartões
  lista: { padding: 20, gap: 10 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 14,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  areaToque: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMarcado: { backgroundColor: cores.primaria },
  check: { width: 14, height: 14, tintColor: '#FFFFFF' },
  nomeItem: { flex: 1, fontSize: 17, color: cores.texto },
  nomeComprado: { color: cores.textoSuave, textDecorationLine: 'line-through' },
  botaoExcluir: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: cores.perigoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoExcluir: { color: cores.perigo, fontSize: 16, fontWeight: 'bold' },
  pressionado: { opacity: 0.6 },

  // Lista vazia
  vazio: { alignItems: 'center', marginTop: 48, gap: 6 },
  vazioEmoji: { fontSize: 48 },
  vazioTitulo: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  vazioTexto: { fontSize: 15, color: cores.textoSuave },
});