import { InjectionKey, UnwrapNestedRefs } from 'vue'

interface Action<S> {
  [key: string]: (store: UnwrapNestedRefs<S>, ...args: any[]) => any
}

type SliceOne<T> = T extends [any, ...infer U] ? U : never

interface StoreData<S, A extends Action<S>> {
  store: UnwrapNestedRefs<S>
  actions: {
    [key in keyof A]: (...args: SliceOne<Parameters<A[key]>>) => ReturnType<A[key]>
  }
}

export function createStore<S extends {}, A extends Action<S>>(
  store: () => S,
  actions: A,
  symbolName?: string
) {
  type SData = StoreData<S, A>

  const storeKey: InjectionKey<SData> = Symbol(symbolName)

  const provideStore = () => {
    const newStore = reactive(store())
    const newActions: any = {}

    Object.keys(actions).forEach((action) => {
      const fn = actions[action]
      newActions[action] = fn.bind(actions, newStore)
    })

    const data: SData = {
      store: newStore,
      actions: newActions,
    }

    provide(storeKey, data)

    return data
  }

  const injectStore = () => {
    const data = inject(storeKey)

    if (!data) throw new Error('Inject failed')

    return data
  }

  return {
    provide: provideStore,
    inject: injectStore,
  }
}
