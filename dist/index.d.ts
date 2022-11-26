import type { ObjType, OptionsType, ThisValueType, ValueType } from './typing';
declare class MiniStore<StateT extends ObjType, ActionT extends ObjType> {
    private state;
    private actions?;
    private rawState;
    constructor(value: ValueType<StateT, ActionT>);
    private saveEffectKeys;
    private saveCb;
    useData(this: MiniStore<StateT, ActionT>, thisValue: ThisValueType, options?: OptionsType<StateT>): void;
    unUseData(this: MiniStore<StateT, ActionT>, thisValue: ThisValueType): void;
    dispatch(actionKey: keyof ActionT, ...args: any[]): void;
}
export default MiniStore;
