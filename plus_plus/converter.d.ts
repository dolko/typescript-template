declare type bindingDirection = "in" | "out" | "inout";
declare type attribute = [string, any];
export declare class FunctionApp {
    version: "2.0" | "1.0";
    functions: Function[];
    path: string;
    constructor(path: string);
    bindFunction(newFunction: Function): void;
    generateJson(): void;
}
export declare class FunctionJSON {
    /**
     * If set to true, marks the function as disabled (it cannot be triggered).
     */
    disabled?: boolean;
    /**
     * If set to true, the function will not be loaded, compiled, or triggered.
     */
    excluded?: boolean;
    /**
     * Optional path to function script file.
     */
    scriptFile?: string;
    /**
     * Optional named entry point.
     */
    entryPoint?: string;
    /**
     * For C# precompiled functions only. If set to 'attributes', use WebJobs attributes to specify bindings. Otherwise, use the 'bindings' property of this function.json.
     */
    configurationSource?: "attributes" | "config";
    /**
     * A list of function bindings.
     */
    bindings?: BindingBase[];
}
export declare class Function extends FunctionJSON {
    name: string;
    path: string;
    trigger: Trigger;
    inputs: Input[];
    output?: Output;
    constructor(name: string, path: string, trigger: Trigger);
    setTrigger(trigger: Trigger): void;
    bindInput(input: Input): void;
    bindOutput(output: Output): void;
    functionJson(): void;
}
export declare class AzFunction extends Function {
    constructor(name: string, path: string, trigger: Trigger);
}
export interface BindingBase {
    name: string;
    type: string;
    direction: bindingDirection;
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    attributes: attribute[];
}
export declare class Trigger implements BindingBase {
    direction: bindingDirection;
    attributes: attribute[];
    type: string;
    name: string;
    constructor(name: string, type: string);
    addAttr(newattr: attribute): void;
}
export declare class Input implements BindingBase {
    direction: bindingDirection;
    attributes: attribute[];
    type: string;
    name: string;
    constructor(name: string, type: string);
    addAttr(newattr: attribute): void;
}
export declare class Output implements BindingBase {
    direction: bindingDirection;
    attributes: attribute[];
    type: string;
    name: string;
    constructor(name: string, type: string);
    addAttr(newattr: attribute): void;
}
export declare class HttpTrigger extends Trigger {
    constructor(name: string, methods: string[], authLevel: "anonymous" | "function" | "admin");
}
export declare class QueueInput extends Input {
    constructor(name: string, connectionSettingName: string, queueName: string);
}
export declare class HttpOutput extends Output {
    constructor(name: string);
}
export {};
