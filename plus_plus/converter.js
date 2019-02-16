import { Environment, FileSystemLoader } from "nunjucks";
import { writeFile } from "fs";
export class FunctionApp {
    constructor(path) {
        this.version = "2.0";
        this.functions = [];
        this.path = path;
    }
    bindFunction(newFunction) {
        this.functions.push(newFunction);
    }
    generateJson() {
        this.functions.forEach(function (element) {
            element.functionJson();
        });
        var env = new Environment(new FileSystemLoader('dist/plus_plus/templates'));
        var res = env.render('host.njk', { version: this.version });
        var t = this.path + '/host.json';
        writeFile(t, res, (err) => {
            if (err)
                throw err;
            console.log("generated host.json");
        });
    }
}
export class FunctionJSON {
}
export class Function extends FunctionJSON {
    constructor(name, path, trigger) {
        super();
        this.inputs = [];
        this.name = name;
        this.path = path;
        this.trigger = trigger;
    }
    setTrigger(trigger) {
        this.trigger = trigger;
    }
    bindInput(input) {
        this.inputs.push(input);
    }
    bindOutput(output) {
        this.output = output;
    }
    functionJson() {
        var env = new Environment(new FileSystemLoader('dist/plus_plus/templates'));
        var res = env.render('function.njk', { disabled: this.disabled, trigger: this.trigger, output: this.output, json: JSON.stringify });
        var writePath = this.path + '/function.json';
        writeFile(writePath, res, (err) => {
            if (err)
                throw err;
            console.log(writePath);
        });
    }
}
export class AzFunction extends Function {
    constructor(name, path, trigger) {
        super(name, path, trigger);
    }
}
export class Trigger {
    constructor(name, type) {
        this.direction = "in";
        this.attributes = [];
        this.name = name;
        this.type = type;
    }
    addAttr(newattr) {
        this.attributes.push(newattr);
    }
}
export class Input {
    constructor(name, type) {
        this.direction = "in";
        this.attributes = [];
        this.name = name;
        this.type = type;
    }
    addAttr(newattr) {
        this.attributes.push(newattr);
    }
}
export class Output {
    constructor(name, type) {
        this.direction = "out";
        this.attributes = [];
        this.name = name;
        this.type = type;
    }
    addAttr(newattr) {
        this.attributes.push(newattr);
    }
}
export class HttpTrigger extends Trigger {
    constructor(name, methods, authLevel) {
        super(name, "httpTrigger");
        this.addAttr(["authLevel", authLevel]);
        this.addAttr(["methods", methods]);
    }
}
export class QueueInput extends Input {
    constructor(name, connectionSettingName, queueName) {
        super(name, "queueBinding");
        this.addAttr(["connectionString", connectionSettingName]);
        this.addAttr(["queueName", queueName]);
    }
}
export class HttpOutput extends Output {
    constructor(name) {
        super(name, "http");
    }
}
//# sourceMappingURL=converter.js.map