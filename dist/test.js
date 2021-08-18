import { Store, ImmutableStore } from './';
for (let store of [new Store(), new ImmutableStore()]) {
    console.log(store.constructor.name);
    let state, x;
    store.onUpdate(() => {
        state = store.getState();
        x = store.get('x');
    });
    console.assert(store instanceof Store, 'inheritance');
    store.mergeState({ x: 1 });
    console.assert(JSON.stringify(state) === JSON.stringify({ x: 1 }), 'initial state');
    console.assert(x === 1, 'initial x');
    store.mergeState({ x: 2, y: 3 });
    console.assert(JSON.stringify(state) === JSON.stringify({ x: 2, y: 3 }), 'update');
    console.assert(x === 2, 'update: x');
    store.set('z.y', { x: 'test' });
    console.assert(JSON.stringify(state) === JSON.stringify({ x: 2, y: 3, z: { y: { x: 'test' } } }), 'nested update');
    console.assert(store.get('z.y.x') === 'test', 'nested update: z.y.x');
    store.merge('z.y', { x: '!' });
    console.assert(store.get('z.y.x') === '!', 'merged substate value');
    store.remove('z.y.x');
    console.assert(store.get('z.y.x') === undefined, 'remove nested, undefined value');
    console.assert(JSON.stringify(store.get('z.y')) === '{}', 'remove nested, parent object');
}
