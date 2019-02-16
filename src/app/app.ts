import { Context } from "@azure/functions"
import { AzFunction, FunctionApp, HttpTrigger, HttpOutput } from "../plus_plus/converter"


const httpFunction = new AzFunction("simpleTrigger", 'dist/app/functions.js', new HttpTrigger("req", ["get", "post"], "anonymous"));
httpFunction.bindOutput(new HttpOutput("$return"))

const helloWorldNpm = new AzFunction("helloWorldNpm", 'dist/app/functions.js', new HttpTrigger("req", ["get", "post"], "anonymous"));
httpFunction.bindOutput(new HttpOutput("$return"))


const functionApp = new FunctionApp('dist/app');
functionApp.bindFunction(httpFunction);
functionApp.bindFunction(helloWorldNpm);

functionApp.generateJson();