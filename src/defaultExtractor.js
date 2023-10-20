import { DontSetValue } from "./bind";
import { isReactEvent } from "./isReactEvent";

export function defaultExtractor(e, v) {
    if (v !== undefined)
        return v;
    if (e?.target?.value !== undefined)
        return e.target.value;
    if (!isReactEvent(e))
        return e;
    return DontSetValue;
}
