import {Store, ImmutableStore} from './';

interface State {
    x?: number | string;
    y?: number;
    z?: {y: {x?: string}};
}

for (let store of [new Store(), new ImmutableStore()]) {
    console.log(store.constructor.name);
    let state: State, x: State['x'];

    store.onUpdate(() => {
        state = store.getState();
        x = store.get<State['x']>('x');
    });

    console.assert(store instanceof Store, 'inheritance');

    store.mergeState({x: 1});
    console.assert(JSON.stringify(state) === JSON.stringify({x: 1}), 'initial state');
    console.assert(x === 1, 'initial x');

    store.mergeState({x: 2, y: 3});
    console.assert(JSON.stringify(state) === JSON.stringify({x: 2, y: 3}), 'update');
    console.assert(x === 2, 'update: x');

    store.set<State['z']['y']>('z.y', {x: 'test'});
    console.assert(JSON.stringify(state) === JSON.stringify({x: 2, y: 3, z: {y: {x: 'test'}}}), 'nested update');
    console.assert(store.get<State['z']['y']['x']>('z.y.x') === 'test', 'nested update: z.y.x');

    store.merge<State['z']['y']>('z.y', {x: '!'});
    console.assert(store.get<State['z']['y']['x']>('z.y.x') === '!', 'merged substate value');

    store.remove('z.y.x');
    console.assert(store.get<State['z']['y']['x']>('z.y.x') === undefined, 'remove nested, undefined value');
    console.assert(JSON.stringify(store.get<State['z']['y']>('z.y')) === '{}', 'remove nested, parent object');
}
