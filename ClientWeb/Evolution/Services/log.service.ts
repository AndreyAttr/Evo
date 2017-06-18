import {Injectable} from "@angular/core";
import {ArrayHelper} from "../Helpers/array-helper";
//const ArrayHelper = require('../Helpers/array-helper');   //TODO: it's not the same as import declaration!

export class CustomLog{
    messageTemplate: string;
    styles?: string|string[];
    content?: string;
    constructor(message: string, css?: string|Array<string>, content?: string){
        this.messageTemplate = message;
        this.styles = css;
        this.content = content;
    }
}

type Handler = (message: string, ...optionalParams: Array<string>) => void;     //type aliasing

@Injectable()
export default class LogService{
    logs: Array<string> = [];

    constructor(private arrayHelper: ArrayHelper<string>){}

    protected prepareMessage(message: string, title?: string){
        title = title ? title : 'LOG';
        let msg = `${title}: ${message}`;
        this.logs.push(msg);
        return msg;
    }

    //TODO: clarify difference between overloading(log) and just using union(warn, err)
    //Remark:difference is when you return different types based on provided different
    //Remark: params types - then overload allows you to create two type-specific functions
    //Note: here this difference is not essential because we return 'void'.
    log(message: string): void;
    //log(customLog: {messageTemplate: string; styles?: string|Array<string>; content?: string}): void;
    log(logData: CustomLog): void;
    log(logData: string | CustomLog){
        this.adjustDefaultValues(logData, 'background-color: rgb(161, 178, 255); color: blue;');
        this.write(logData, console.log);
    }

    info(logData: string| CustomLog){
        this.adjustDefaultValues(logData, 'background-color: #caf488; color: #9c00fa; font-style: italic;');
        this.write(logData, console.info, 'INFO');
    }
    warn(logData: string | CustomLog){
        this.adjustDefaultValues(logData, 'background-color: orange; color: black; font-weight: bold;');
        this.write(logData, console.warn, 'WARN');
    }
    err(logData: string | CustomLog){
        this.adjustDefaultValues(logData, 'background-color: red; color: white;');
        this.write(logData, console.error, 'ERR');
    }

    adjustDefaultValues(logData: string | CustomLog, css: string){
        if(typeof logData == 'object' && !logData.styles)
            logData.styles = css;
    }

    //Arrow function declared as a method:
    write = (customLog: string | CustomLog,
          handler: Handler, title?: string) =>
    {
        if (typeof customLog == 'string') handler(this.prepareMessage(customLog), title);
        // Check to see if we're working with an object/array
        else if (typeof customLog == 'object') {
            //Arrow function(simple):
            let formatter = (customLog: CustomLog, handler: Handler, title?: string) =>
            {
                let optionalParams: string[] = [];
                customLog.messageTemplate = this.prepareMessage(customLog.messageTemplate, title);
                if(customLog.styles) {
                    customLog.messageTemplate = '%c'.concat(customLog.messageTemplate);
                    let stylesCombined = (typeof customLog.styles == 'string') ? customLog.styles : customLog.styles.join(';');
                    this.arrayHelper.addTo(stylesCombined, optionalParams);
                }
                if(customLog.content) {
                    customLog.messageTemplate += ' %s';
                    this.arrayHelper.addTo(customLog.content, optionalParams);
                }
                handler(customLog.messageTemplate, ...optionalParams);
            };
            formatter(customLog, handler, title);
        }
    }
}
