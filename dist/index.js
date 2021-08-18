import { isCollection, fromJS } from 'immutable';
import { toPath } from 'lodash-es';
import { Store } from '@axtk/store';
export * from '@axtk/store';
const toPlain = (x) => isCollection(x) ? x.toJS() : x;
const toImmutableMap = (x) => {
    let t = fromJS(x && typeof x === 'object' ? x : {});
    return isCollection(t) ? t.toMap() : fromJS({});
};
export class ImmutableStore extends Store {
    getState() {
        return toPlain(this.state);
    }
    get(path, defaultValue) {
        return toPlain(this.state.getIn(toPath(path), defaultValue));
    }
    setState(x) {
        this.state = typeof x === 'function' ? x(this) : toImmutableMap(x);
        this.dispatchUpdate();
    }
    set(path, x) {
        this.state = this.state.setIn(toPath(path), fromJS(x));
        this.dispatchUpdate();
    }
    mergeState(x) {
        this.state = this.state.merge(toImmutableMap(x));
        this.dispatchUpdate();
    }
    merge(path, x) {
        this.state = this.state.mergeIn(toPath(path), fromJS(x));
        this.dispatchUpdate();
    }
    remove(path) {
        this.state = this.state.deleteIn(toPath(path));
        this.dispatchUpdate();
    }
}
