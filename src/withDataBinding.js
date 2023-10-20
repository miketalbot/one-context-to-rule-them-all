import { B } from "./bind";


export function withDataBinding(param) {
    if (typeof param === "function") {
        return function BoundComponent(...params) {
            return withDataBinding(param(...params));
        };
    }
    return scan(param);

    function scan(element) {
        if (!element)
            return element;
        if (Array.isArray(element)) {
            return element.map(scanItem);
        } else if (typeof element === "function") {
            return element;
        } else {
            return scanItem(element);
        }
    }

    function scanItem(child) {
        const {
            children, field, defaultValue, valueProp, changeProp, extract, transformIn, transformOut, target, blur, ...props
        } = child.props;

        const newChildren = scan(children);
        if (field) {
            return (
                <B
                    field={field}
                    defaultValue={defaultValue}
                    valueProp={valueProp}
                    changeProp={changeProp}
                    extract={extract}
                    transformIn={transformIn}
                    transformOut={transformOut}
                    blur={blur}
                    target={target}
                >
                    {{
                        $$typeof: Symbol.for("react.element"),
                        ...child,
                        props: { ...props, children: newChildren }
                    }}
                </B>
            );
        }

        return {
            $$typeof: Symbol.for("react.element"),
            ...child,
            props: { ...props, children: newChildren }
        };
    }
}
