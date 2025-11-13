# 🧪 Guia de Testes - TestSprite

## 📦 Instalação

Para executar os testes criados, você precisa instalar as dependências de teste:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

## 🚀 Comandos Disponíveis

### Executar todos os testes (uma vez)
```bash
npm test
```

### Executar testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Abrir interface visual dos testes
```bash
npm run test:ui
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📁 Estrutura de Testes

```
src/
├── utils/
│   ├── __tests__/
│   │   ├── flowParser.test.ts      # Testes do parser de fluxos
│   │   ├── formStorage.test.ts     # Testes do storage local
│   │   └── webhookSender.test.ts   # Testes do envio de webhooks
│   ├── flowParser.ts
│   ├── formStorage.ts
│   └── webhookSender.ts
└── test/
    └── setup.ts                     # Configuração global dos testes
```

## ✅ Testes Implementados

### flowParser.test.ts
- ✅ Parse de JSON válido
- ✅ Rejeição de JSON inválido
- ✅ Validação de estrutura de fluxo
- ✅ Extração de nome do fluxo
- ✅ Validação de grupos e blocos

### formStorage.test.ts
- ✅ Geração de IDs únicos
- ✅ Codificação/decodificação base64
- ✅ Salvamento de arquivos
- ✅ Recuperação de metadados
- ✅ Atualização de status de publicação
- ✅ Remoção de formulários
- ✅ Tratamento de quota excedida

### webhookSender.test.ts
- ✅ Envio bem-sucedido
- ✅ Tratamento de erro HTTP
- ✅ Tratamento de erro de rede
- ✅ Validação de URLs inseguras

## 🎯 Exemplo de Saída

```
✓ src/utils/__tests__/flowParser.test.ts (8 tests)
✓ src/utils/__tests__/formStorage.test.ts (12 tests)
✓ src/utils/__tests__/webhookSender.test.ts (4 tests)

Test Files  3 passed (3)
     Tests  24 passed (24)
  Start at  10:30:45
  Duration  1.23s
```

## 🐛 Debugging de Testes

### Ver logs detalhados
```bash
npm test -- --reporter=verbose
```

### Executar apenas um arquivo
```bash
npm test -- flowParser.test.ts
```

### Executar apenas um teste específico
```bash
npm test -- -t "deve parsear JSON válido"
```

## 📊 Cobertura de Código

Após executar `npm run test:coverage`, abra o relatório HTML:

```bash
# Windows
start coverage/index.html

# Linux/Mac
open coverage/index.html
```

## 🔧 Configuração

A configuração dos testes está em:
- **vitest.config.ts** - Configuração principal do Vitest
- **src/test/setup.ts** - Setup global (mocks, cleanup)

## 💡 Dicas

### Adicionar novos testes
1. Crie arquivo `*.test.ts` na pasta `__tests__`
2. Importe as funções a testar
3. Use `describe` para agrupar testes relacionados
4. Use `it` ou `test` para cada caso de teste

Exemplo:
```typescript
import { describe, it, expect } from 'vitest';
import { minhaFuncao } from '../minhaFuncao';

describe('minhaFuncao', () => {
  it('deve retornar resultado esperado', () => {
    const resultado = minhaFuncao('input');
    expect(resultado).toBe('output esperado');
  });
});
```

### Mockar dependências
```typescript
import { vi } from 'vitest';

// Mock de função
const mockFn = vi.fn();

// Mock de módulo
vi.mock('../modulo', () => ({
  funcao: vi.fn(() => 'valor mockado'),
}));
```

### Testar código assíncrono
```typescript
it('deve processar dados assíncronos', async () => {
  const resultado = await funcaoAssincrona();
  expect(resultado).toBeDefined();
});
```

## 🚨 Troubleshooting

### Erro: "Cannot find module '@/...'"
Verifique se o alias está configurado em `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Erro: "localStorage is not defined"
Certifique-se de que `setupFiles` está configurado em `vitest.config.ts` e aponta para `src/test/setup.ts`.

### Testes lentos
Use `--no-coverage` para testes mais rápidos durante desenvolvimento:
```bash
npm test -- --no-coverage
```

## 📚 Recursos

- [Documentação Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Guia de Mocking](https://vitest.dev/guide/mocking.html)

---

**Criado por:** Kiro AI + TestSprite MCP  
**Última atualização:** 13/11/2025
