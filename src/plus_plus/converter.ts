import { AzureFunction, Context } from "@azure/functions";
import { Environment, FileSystemLoader } from "nunjucks";
import { writeFile, copyFile, mkdir } from "fs";



type bindingDirection = "in" | "out" | "inout"; 
type attribute = [string, any];


export class FunctionApp {
    version: "2.0" | "1.0" = "2.0";
    functions: Function[] = [];
    path: string;
    constructor(path:string) {
        this.path = path;
    }

    bindFunction(newFunction: Function){
        newFunction.functionAppPath = this.path;
        this.functions.push(newFunction);
    }

    generateJson(){
        this.functions.forEach(function(element){
            element.functionJson();
        })

        var env = new Environment(new FileSystemLoader('dist/plus_plus/templates'));
        var hostJson = env.render('host.njk', { version: this.version });
        var hostPath = this.path + '/host.json';
        var localJson = env.render('local.njk', { language : 'node' });
        var localPath = this.path + '/local.settings.json';
        writeFile(hostPath, hostJson, (err) => {
            if (err) throw err;
            console.log("generated host.json")
        });
        writeFile(localPath, localJson, (err) => {
            if (err) throw err;
            console.log("generated host.json")
        });
    }
}

export class FunctionJSON {
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


export class Function extends FunctionJSON {
    functionAppPath?: string;
    functionName: string;
    functionPath: string;
    trigger: Trigger;
    inputs: Input[] = [];
    output?: Output;


    constructor(functionName: string, functionPath: string, trigger: Trigger) {
        super();
        this.functionName = functionName;
        this.functionPath = functionPath;
        this.trigger = trigger;
    }

    setTrigger(trigger: Trigger) {
        this.trigger = trigger;
    }

    bindInput(input: Input) {
        this.inputs.push(input);
    }

    bindOutput(output: Output){
        this.output = output;
    }

    functionJson(){
        var env = new Environment(new FileSystemLoader('dist/plus_plus/templates'));
        //setup the paths
        var path = this.functionAppPath + '/' + this.functionName;
        var functionJsonFilePath = path + '/function.json';
        var functionFilePath = path + '/index.js';
        var source = this.functionPath;
        // generate the json
        var functionJson = env.render('function.njk', { disabled: this.disabled,
                                                        scriptFile: 'index.js',
                                                        entryPoint:this.functionName,
                                                        trigger: this.trigger,
                                                        output: this.output,
                                                        json : JSON.stringify});

        // need to create a folder of the name of the function:
        mkdir(path, function(err) {
            if (err) {
                if (err.code != 'EEXIST') throw err; // catch the error if the error isnt that the folder already exists
            }
            // write to the function.json
            writeFile(functionJsonFilePath, functionJson, (err) => {
                if (err) throw err;
                console.log(functionJsonFilePath);
            });
            // copy the file where the function is to the write place
            copyFile(source, functionFilePath, (err) => {
                if (err) throw err;
                console.log(source + ' was copied to destination.txt');
            });
        });
    }
}

export class AzFunction extends Function {
    constructor(name: string, path: string, trigger: Trigger) {
        super(name, path, trigger);
    }
}


export interface BindingBase {
    name: string;
    type: string;
    direction: bindingDirection;
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    // hash of the rest
    attributes: attribute[];
}

export class Trigger implements BindingBase {
    direction : bindingDirection = "in";
    attributes: attribute[] = [];
    type: string;
    name: string;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
    addAttr(newattr : attribute){
        this.attributes.push(newattr);
    }
}

export class Input implements BindingBase {
    direction : bindingDirection = "in";
    attributes: attribute[] = [];
    type: string;
    name: string;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    addAttr(newattr : attribute){
        this.attributes.push(newattr);
    }
}

export class Output implements BindingBase {
    direction : bindingDirection = "out";
    attributes: attribute[] = [];
    type: string;
    name: string;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
    addAttr(newattr : attribute){
        this.attributes.push(newattr);
    }
}

export class HttpTrigger extends Trigger {

    constructor(name: string, methods: string[], authLevel: "anonymous"|"function"|"admin" ) {
        super(name, "httpTrigger")
        this.addAttr(["authLevel", authLevel])
        this.addAttr(["methods", methods])
    }
}

export class QueueInput extends Input {
    constructor(name: string, connectionSettingName: string, queueName: string) {
        super(name, "queueBinding");
        this.addAttr(["connectionString", connectionSettingName])
        this.addAttr(["queueName", queueName])
    }
}

export class HttpOutput extends Output{
    constructor(name: string){
        super(name, "http")
    }
}