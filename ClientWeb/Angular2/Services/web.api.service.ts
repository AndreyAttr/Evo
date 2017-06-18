import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Test } from '../Dto/test';

import {Observable} from 'rxjs/Observable';
//import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';


@Injectable()
export class WebApiService {
    private webApiUrl: string = 'http://localhost:56120/api/Test/ModifyTest';
    private serviceUrl: string = 'http://localhost:56120/api/skyscanner/Travel/GetService';

    constructor(private http: Http) { }

    getService<T>(serviceName: string): Observable<T>
    {
         //http.put(`${this.baseUrl}/people/${person.id}`, JSON.stringify(person),
        let url = this.serviceUrl.concat('/', serviceName);
        return this.http.get(url)
            .map((response: Response) =>
            {
                //let result = JSON.parse(response.text());
                let result = response.json();
                return result as T;
            })
            //.do(data => console.log('Data loaded: ' + JSON.stringify(data)))      //big JSON output, so commented. May be used for little portion of JSON
            .catch((error: any) => this.throwError(error));
    }

    //TODO: need to implement in base class
    throwError(error: any) :  Observable<any>
    {
        if (error instanceof Response)
        {
            let response = error as Response;
            if (response.status === 500)
                return Observable.throw(response.json().error || 'Server error');
            return Observable.throw('HTTP request has failed with status: '.concat(response.status.toString(), ' ', response.statusText));
        }
        return Observable.throw(error);
    }
    error(message: string): never
    {
        throw new Error(message);
    }

    postService(serviceName: string): Observable<boolean> {

        //let headers: Headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });      //CORS: sending Content-Type='application/x-www-form-urlencoded' doesn't generate OPTIONS CORS request: http://stackoverflow.com/a/26653781
        //let params = new URLSearchParams();
        //params.set('serviceName', serviceName);
        //let data = params.toString();
        //OR
        //let postData = "email=" + user.email + "&password=" + user.password;

        let headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });      //CORS: sending Content-Type cause OPTIONS CORS request if content type is "application/json": http://stackoverflow.com/a/26653781
        let url = this.serviceUrl;

        //=========All this ways don't work==========
        //let data = $.param({ '': serviceName });
        //let data = JSON.stringify({ "": serviceName });
        //let data = { "": serviceName };

        let data = JSON.stringify(serviceName);

        return this.http.post(url, data, { headers: headers })
            .map(response => { return true; })
            .catch(error => Observable.throw(error));
    }

    post(obj: any): Observable<Test> {
        const data: string = JSON.stringify(obj);
        let headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });       //JSON data: No MediaTypeFormatter is available to read an object of type '...' from content with media type 'text/plain'.
        return this.http.post(this.webApiUrl, data, { headers: headers })
            .map((response: Response) => {
                let data = response.json();
                return new Test(data.label, data.x, data.y);
            })
            .catch((error: any) => Observable.throw(error));
    }
}
