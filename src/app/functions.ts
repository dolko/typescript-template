import { AzureFunction, HttpRequest, Context } from "@azure/functions"
import { intersection } from "lodash"

const helloWorldNpm: AzureFunction = async function (context: Context, req: HttpRequest) {
    context.log(`JavaScript HTTP triggered function '${context.executionContext.functionName}' processed a request.`);
    const helloArray = intersection(["hello", "world!"], ["hello", "there", "world!", ":)"]);
    return {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(helloArray)
    };
};

const simpleTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        return {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        return {
            status: 402,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};


export { helloWorldNpm,  simpleTrigger};