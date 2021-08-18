import {isCollection, fromJS} from 'immutable';
import {toPath} from 'lodash-es';
import {Store, Path} from '@axtk/store';
export * from '@axtk/store';

const toPlain = (x: any) => isCollection(x) ? x.toJS() : x;

const toImmutableMap = (x: any) => {
    let t = fromJS(x && typeof x === 'object' ? x : {});
    return isCollection(t) ? t.toMap() : fromJS({});
};

export class ImmutableStore extends Store {
    getState() {
        return toPlain(this.state);
    }
    get<T>(path: Path, defaultValue?: T): T {
        return toPlain(this.state.getIn(toPath(path), defaultValue));
    }
    setState(x: any): void {
        this.state = typeof x === 'function' ? x(this) : toImmutableMap(x);
        this.dispatchUpdate();
    }
    set<T>(path: Path, x: T): void {
        this.state = this.state.setIn(toPath(path), fromJS(x));
        this.dispatchUpdate();
    }
    mergeState(x: any): void {
        this.state = this.state.merge(toImmutableMap(x));
        this.dispatchUpdate();
    }
    merge<T>(path: Path, x: T): void {
        this.state = this.state.mergeIn(toPath(path), fromJS(x));
        this.dispatchUpdate();
    }
    remove(path: Path): void {
        this.state = this.state.deleteIn(toPath(path));
        this.dispatchUpdate();
    }
}
