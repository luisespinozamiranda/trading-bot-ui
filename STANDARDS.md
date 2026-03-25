# Standards — Trading Bot Platform

> Documento normativo de diseño y programacion. Cada cambio en backend o frontend **debe** cumplir estas reglas.
> Violaciones bloquean merge. Sin excepciones.

---

## 1. Principios Fundamentales

### 1.1 Clean Code (Robert C. Martin)
- El codigo se lee mucho mas de lo que se escribe. Priorizar legibilidad.
- Nombres descriptivos y autoexplicativos. Prohibido `processData`, `handleStuff`, `doWork`, `temp`, `data`.
- No comentarios obvios. Solo comentar el *por que*, nunca el *que*.
- Boy Scout Rule: dejar el codigo mejor de como lo encontraste — pero solo en el scope del cambio.

### 1.2 SOLID
| Principio | Regla |
|-----------|-------|
| **S** — Single Responsibility | Una clase, un motivo de cambio. Un metodo, una tarea. |
| **O** — Open/Closed | Extender via interfaces y strategy pattern. No modificar clases existentes para agregar variantes. |
| **L** — Liskov Substitution | Toda implementacion de port/interface debe ser intercambiable sin romper el contrato. |
| **I** — Interface Segregation | Interfaces pequenas y especificas. `OrderManager` no debe tener metodos de `AccountService`. |
| **D** — Dependency Inversion | Domain depende de ports (interfaces). Adapters implementan ports. Nunca al reves. |

### 1.3 DRY (Don't Repeat Yourself)
- Si copias mas de 3 lineas, extrae metodo o utilidad.
- Constantes centralizadas: `constants.ts` (frontend), enums/config records (backend).
- Formatters, validadores y helpers en `lib/` (frontend) o `domain/service/` (backend).

---

## 2. Arquitectura

### 2.1 Backend — Hexagonal (Ports & Adapters)

```
domain/                          ← Nucleo puro. CERO dependencias externas.
├── model/                       ← Records inmutables, enums, value objects
├── port/                        ← Interfaces (contratos)
├── service/                     ← Logica de negocio
└── config/                      ← Configuracion de dominio (TradingConfig)

adapter/                         ← Implementaciones tecnicas
├── inbound/
│   ├── controller/              ← HTTP only. Delega a services.
│   ├── dto/                     ← Records para request/response
│   └── mapper/                  ← Domain ↔ DTO. Clases estaticas.
├── persistence/                 ← Repositorios JDBC/JPA
├── integration/                 ← Clientes externos (Binance, etc.)
└── engine/                      ← Estrategias, indicadores, ejecucion

configuration/                   ← Spring beans, security, OpenAPI
error/                           ← GlobalExceptionHandler, ApiError
```

**Reglas inquebrantables:**
1. `domain/` **nunca** importa de `adapter/`, `configuration/`, ni frameworks Spring.
2. `controller/` solo hace: validar input → llamar service → mapear response. **Cero logica de negocio.**
3. Entidades de dominio **nunca** se exponen en API. Siempre DTOs (records).
4. Un adapter implementa exactamente un port.

### 2.2 Frontend — Feature-based con API Layer

```
api/
├── client.ts                    ← Axios instance + interceptors
├── endpoints.ts                 ← Constantes de rutas API
├── hooks/                       ← 1 query hook por GET endpoint
│   └── mutations/               ← Mutation hooks agrupados por dominio
└── types/                       ← Interfaces TypeScript = backend DTOs

components/
├── layout/                      ← AppLayout, Sidebar, TopBar, StatusBar
├── charts/                      ← Componentes de graficos
├── trading/                     ← Componentes especificos de trading
└── shared/                      ← Componentes genericos reutilizables

pages/                           ← 1 archivo = 1 ruta. Compone componentes.
stores/                          ← Zustand. Solo estado UI (tema, sidebar).
lib/                             ← Utilidades puras, constantes, formatters.
```

**Reglas inquebrantables:**
1. `pages/` compone componentes. No tiene logica de formateo ni calculo.
2. `components/` no hace fetch de datos. Recibe props.
3. Estado del servidor **siempre** via TanStack Query. Zustand solo para UI.
4. Types de `api/types/` deben coincidir exactamente con los DTOs del backend.

---

## 3. Convenciones de Codigo

### 3.1 Backend (Java 21 / Spring Boot)

#### Metodos
- **Maximo 10-15 lineas**. Si excede, extraer metodo privado.
- Un metodo hace UNA cosa. Si tiene `and` en el nombre, dividir.
- Nombres verbales: `calculatePositionSize()`, `findBySymbol()`, `validateConfig()`.
- Prefijos consistentes:
  - `find*`, `get*` → lectura
  - `create*`, `save*` → creacion
  - `update*` → modificacion
  - `delete*`, `remove*` → eliminacion
  - `is*`, `has*`, `can*` → booleanos

#### Clases
- Records para datos inmutables: DTOs, value objects, configs.
- Clases para estado mutable: engines, services con ciclo de vida.
- **Una responsabilidad por clase.** `BacktestingService` no hace reportes.
- Sufijos obligatorios:
  - Controllers: `*Controller`
  - Services: `*Service`
  - Repositories: `*Repository`
  - DTOs: `*Request`, `*Response`, `*Dto`
  - Mappers: `*Mapper`
  - Factories: `*Factory`

#### Inyeccion de Dependencias
```java
// CORRECTO — constructor injection
public class LiveTradingManager {
    private final AccountService accountService;
    private final StrategyFactory strategyFactory;

    public LiveTradingManager(AccountService accountService, StrategyFactory factory) {
        this.accountService = accountService;
        this.strategyFactory = factory;
    }
}

// PROHIBIDO — field injection
@Autowired private AccountService accountService;
```

#### Manejo de Errores
```java
// CORRECTO — excepciones con contexto
throw new IllegalArgumentException(
    "Strategy '%s' not found for symbol %s".formatted(name, symbol)
);

// PROHIBIDO — mensajes genericos
throw new RuntimeException("Error");
```

- Excepciones de negocio → custom exceptions (`BacktestNotFoundException`).
- `@RestControllerAdvice` captura y devuelve `ApiError` con code + message + timestamp.
- **Nunca** capturar `Exception` generica salvo en el handler global.

#### Base de Datos
- Flyway para migraciones. Nunca DDL manual.
- `NUMERIC(18,8)` para precios. Nunca `DOUBLE` en esquema.
- Indices en FKs y columnas de query frecuente.
- `ON CONFLICT` para upserts. Nunca delete + insert.

### 3.2 Frontend (React 19 / TypeScript)

#### Componentes
- Funcionales solamente. Cero class components.
- Props via `interface`, no `type` (por convencion del proyecto).
- Export default para componentes y paginas.
- Export named para hooks y utilidades.
- **Maximo 150 lineas por componente.** Si excede, extraer sub-componentes.

```tsx
// CORRECTO
interface MetricCardProps {
  label: string
  value: number | null
  format?: 'currency' | 'percent' | 'decimal'
}

export default function MetricCard({ label, value, format = 'decimal' }: MetricCardProps) {
  return (...)
}

// PROHIBIDO — props inline sin interface
export default function MetricCard(props: { label: string, value: number }) { ... }
```

#### Hooks
- Nombre: `use` + dominio + accion: `useAccountSnapshot`, `useRunBinanceBacktest`.
- Un hook por endpoint GET. Mutations agrupadas por dominio.
- Siempre tipar genericos: `useQuery<AccountSnapshot>`, `useMutation<void, Error, Request>`.
- Polling via `refetchInterval` en constantes centralizadas.

```tsx
// CORRECTO
export function useAccountSnapshot() {
  return useQuery<AccountSnapshot>({
    queryKey: ['account', 'snapshot'],
    queryFn: async () => {
      const { data } = await apiClient.get<AccountSnapshot>(API.account.snapshot)
      return data
    },
    refetchInterval: POLLING_INTERVALS.ACCOUNT,
  })
}
```

#### Estado
- **Zustand** para: tema, sidebar, symbol seleccionado. Persistido en localStorage.
- **TanStack Query** para: todo dato del servidor. Sin excepciones.
- **useState local** para: formularios, filtros, toggles de UI temporales.
- **Prohibido**: estado global para datos del servidor (`zustand` con fetch manual).

#### Estilos
- Tailwind CSS utility classes. Cero CSS modules, cero styled-components.
- Colores via CSS custom properties: `text-[var(--color-accent)]`.
- Clases dinamicas via `cn()` (clsx + tailwind-merge).
- **Prohibido**: estilos inline (`style={{ color: 'red' }}`), salvo valores computados de charts.

```tsx
// CORRECTO
<div className={cn(
  'rounded-lg border border-[var(--color-border)] p-4',
  isActive && 'bg-[var(--color-accent-muted)]',
)} />

// PROHIBIDO
<div style={{ backgroundColor: isActive ? '#2F81F7' : 'transparent' }} />
```

#### Tipos
- Interfaces en `api/types/` deben ser **espejo exacto** de los DTOs del backend.
- Si el backend agrega un campo, el type se actualiza en el **mismo PR**.
- Nombres sin sufijo `Dto` en frontend (el backend usa `AccountSnapshotDto`, el frontend `AccountSnapshot`).
- Enums como `as const` + type inference:

```tsx
export const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const
export type Interval = (typeof INTERVALS)[number]
```

---

## 4. Diseno Visual

### 4.1 Paleta de Colores

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `--color-bg-primary` | `#0D1117` | `#FFFFFF` | Fondo principal |
| `--color-bg-secondary` | `#161B22` | `#F6F8FA` | Cards, panels, sidebar |
| `--color-bg-tertiary` | `#1C2333` | `#F0F2F5` | Modals, dropdowns, headers |
| `--color-surface` | `#21262D` | `#E8ECF0` | Inputs, filas alternadas |
| `--color-border` | `#30363D` | `#D0D7DE` | Bordes, divisores |
| `--color-text-primary` | `#E6EDF3` | `#1F2328` | Texto principal |
| `--color-text-secondary` | `#8B949E` | `#656D76` | Labels, captions |
| `--color-text-muted` | `#6E7681` | `#8C959F` | Placeholders, disabled |
| `--color-accent` | `#2F81F7` | `#0969DA` | Acciones primarias, links |
| `--color-success` | `#2EA043` | `#1A7F37` | Profit, BUY, positivo |
| `--color-danger` | `#DA3633` | `#CF222E` | Loss, SELL, negativo |
| `--color-warning` | `#D29922` | `#9A6700` | Warnings, pending |

**Reglas:**
- Profit siempre `success`. Loss siempre `danger`. Sin excepciones.
- Nunca hardcodear hex en componentes. Siempre `var(--color-*)`.
- Dark theme es el default. Light theme es secundario.

### 4.2 Tipografia

| Uso | Familia | Peso | Tamano |
|-----|---------|------|--------|
| Titulos de pagina | Inter | 600 | 20px (`text-xl`) |
| Titulos de seccion | Inter | 600 | 14px (`text-sm font-semibold`) |
| Labels | Inter | 400 | 12px (`text-xs`) |
| Body | Inter | 400 | 14px (`text-sm`) |
| Datos financieros | JetBrains Mono | 700 | 28px (`text-2xl font-bold font-mono`) |
| Datos de tabla | JetBrains Mono | 400 | 13px (`text-xs font-mono`) |
| Status bar | JetBrains Mono | 400 | 10px (`text-[10px] font-mono`) |

**Regla:** Todo numero financiero (precios, P/L, porcentajes, cantidades) usa `font-mono` para alineacion visual.

### 4.3 Componentes de UI

#### MetricCard
- Borde `1px`, border-radius `8px`, padding `16px`.
- Label: `text-xs uppercase tracking-wider text-secondary`.
- Valor: `text-2xl font-bold font-mono`. Color segun signo (success/danger/neutral).
- Subtitle opcional: `text-xs text-muted`.

#### DataTable
- Header sticky con `bg-tertiary`.
- Filas hover con `bg-surface`.
- Numeros right-aligned y monospace.
- Columnas sortables con icono `ArrowUpDown`.
- Bordes entre filas con `border-[var(--color-border)]`.

#### StatusBadge
- Pill con `text-[10px] font-semibold uppercase`.
- Color automatico segun status string (DEPLOYED=success, VALIDATED=info, REJECTED=danger).

#### Buttons
- Primario: `bg-accent text-white hover:bg-accent-hover`.
- Secundario: `border border-border text-primary hover:bg-surface`.
- Danger: `bg-danger text-white hover:opacity-90`.
- Disabled: `opacity-50 cursor-not-allowed`.
- Tamano: `px-4 py-2 text-sm font-medium rounded-lg`.

#### Forms
- Inputs: `bg-surface border border-border rounded px-2 py-1.5 text-xs`.
- Focus: `focus:outline-none focus:border-accent`.
- Labels: `text-xs text-secondary` arriba del input.
- Selects: mismo estilo que inputs.

### 4.4 Layout

- Sidebar: 224px expandido (`w-56`), 64px colapsado (`w-16`).
- TopBar: 48px de alto (`h-12`).
- StatusBar: 28px de alto (`h-7`).
- Content area: padding `24px` (`p-6`).
- Grid gap entre cards: `16px` (`gap-4`).
- Spacing vertical entre secciones: `24px` (`space-y-6`).

### 4.5 Iconografia
- Libreria: **Lucide React** exclusivamente.
- Tamano en sidebar/topbar: `18px`.
- Tamano en botones: `14px`.
- Tamano en tablas: `14px`.
- Color: hereda del texto padre.

---

## 5. Testing

### 5.1 Backend
- Framework: **JUnit 5** + Spring Boot Test.
- Naming: `metodoQueSeTestea_condicion_resultadoEsperado`.
- Estructura: Arrange / Act / Assert. Una asercion logica por test.
- Mocks: solo para dependencias externas (APIs, BD). No mockear domain services.
- Tests de integracion con `@SpringBootTest` y `-Pintegration`.
- Cobertura minima: cada service publico, cada strategy, cada mapper.

```java
@Test
void calculatePositionSize_withValidCapital_returnsCorrectSize() {
    // Arrange
    double capital = 10_000;
    double stopLoss = 3.0;

    // Act
    double size = riskManager.calculatePositionSize(capital, 65000, stopLoss);

    // Assert
    assertThat(size).isGreaterThan(0);
    assertThat(size).isLessThanOrEqualTo(capital);
}
```

### 5.2 Frontend
- Framework: **Vitest** + Testing Library + jsdom.
- Archivos: `*.test.ts` o `*.test.tsx` junto al archivo que testean.
- Utilities: `renderWithProviders()` de `test/test-utils.tsx` (incluye QueryClient + Router).
- Mocks: `vi.mock()` para API hooks. Nunca mockear componentes internos.
- Cobertura minima: cada componente de `trading/`, cada pagina, stores, utils.

```tsx
describe('MetricCard', () => {
  it('renders label and formatted value', () => {
    render(<MetricCard label="Net Profit" value={1234.56} format="currency" />)
    expect(screen.getByText('Net Profit')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies green color for positive values', () => {
    const { container } = render(<MetricCard label="P/L" value={500} format="currency" />)
    expect(container.querySelector('.font-mono')?.className).toContain('success')
  })
})
```

### 5.3 Reglas Generales de Testing
1. **Cada PR debe incluir tests** para el codigo nuevo o modificado.
2. Tests existentes **nunca** se borran sin justificacion en el PR.
3. Si un test falla, se arregla el codigo, no se skipea el test.
4. Naming descriptivo: leer el nombre del test debe explicar que se valida.
5. Test data realista: usar precios, cantidades y parametros del dominio de trading.

---

## 6. API Contract

### 6.1 Estructura de URLs
```
/api/v1/{recurso}                    # Coleccion
/api/v1/{recurso}/{id}               # Elemento
/api/v1/{recurso}/{id}/{accion}      # Accion sobre elemento
```

### 6.2 Verbos HTTP
| Verbo | Uso | Idempotente |
|-------|-----|-------------|
| GET | Lectura. Sin side effects. | Si |
| POST | Crear recurso o ejecutar accion (backtest, start). | No |
| PUT | Actualizar recurso completo o ejecutar accion idempotente (deploy, reject). | Si |
| DELETE | Eliminar recurso. | Si |

### 6.3 Respuestas
- **200**: Exito con body.
- **201**: Recurso creado.
- **204**: Exito sin body (delete).
- **400**: Input invalido. Body: `ApiError`.
- **404**: Recurso no encontrado. Body: `ApiError`.
- **409**: Conflicto (e.g., engine ya corriendo). Body: `ApiError`.
- **500**: Error interno. Body: `ApiError`.

### 6.4 Error Format
```json
{
  "code": "INVALID_CONFIG",
  "message": "SMA period must be between 5 and 200",
  "timestamp": "2024-03-24T14:30:00"
}
```

### 6.5 Autenticacion
- Header: `X-API-Key`.
- Configurable via `TRADING_API_KEY` env var.
- Swagger UI y health checks exentos.

---

## 7. Git & PRs

### 7.1 Commits
- Formato: `tipo: descripcion concisa`
- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- Descripcion en imperativo: "add reload endpoint", no "added" ni "adding".
- Cuerpo opcional para contexto del *por que*.

### 7.2 PRs
- Titulo < 70 caracteres.
- Body con: `## Summary` (bullets) + `## Test plan` (checklist).
- Un PR = un cambio logico. No mezclar refactors con features.
- Tests deben pasar antes de merge.

### 7.3 Branches
- `master` — produccion.
- `feat/nombre-corto` — features.
- `fix/nombre-corto` — bug fixes.

---

## 8. Checklist Pre-Merge

Antes de considerar cualquier cambio como completo:

- [ ] Metodos de max 10-15 lineas
- [ ] Nombres descriptivos (sin `data`, `temp`, `process`)
- [ ] Separacion de capas respetada (controller no tiene logica)
- [ ] DTOs usados en API (nunca entidades de dominio)
- [ ] Constructor injection (no `@Autowired`)
- [ ] Tests escritos para codigo nuevo/modificado
- [ ] Tests existentes siguen pasando (`npm test` / `mvn test`)
- [ ] Types frontend actualizados si backend DTO cambio
- [ ] Colores via CSS custom properties (no hex hardcoded)
- [ ] Datos financieros con `font-mono`
- [ ] Sin `console.log` ni `System.out.println` en codigo final
- [ ] Sin credenciales hardcodeadas
- [ ] Commit message con formato correcto
