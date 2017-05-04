/*
 * README
 * any changes to this file and you have to run `npm run build` to generate the bundle
 *
 * Polyfills
 * Vendors
 * RxJS
 */

// Polyfills
export function polyfills(env?: IMetadata) : Array<string> {
    // return [
    //     // 'ie-shim',
    //
    //     'core-js/es6/symbol',
    //     'core-js/es6/object',
    //     'core-js/es6/function',
    //     'core-js/es6/parse-int',
    //     'core-js/es6/parse-float',
    //     'core-js/es6/number',
    //     'core-js/es6/math',
    //     'core-js/es6/string',
    //     'core-js/es6/date',
    //     'core-js/es6/array',
    //     'core-js/es6/regexp',
    //     'core-js/es6/map',
    //     'core-js/es6/set',
    //     'core-js/es6/weak-map',
    //     'core-js/es6/weak-set',
    //     'core-js/es6/typed',
    //     'core-js/es6/reflect',
    //     // 'core-js/es6/promise', // problem with firefox
    //     'core-js/es7/reflect',
    //
    //     // zone.js
    //     'zone.js/dist/zone',
    //     'zone.js/dist/long-stack-trace-zone',
    //
    //     // typescript helpers
    //     'ts-helpers',
    // ];

    let polyfills: Array<string> = [
        'reflect-metadata',
        'core-js/es6',
        'core-js/es7/reflect',
        'es6-shim',
        'zone.js/dist/zone'
    ];
    if(env != null)
    {
        if (env.IS_PRODUCTION) {
            // Production
        } else {
            // Development and test
            Error['stackTraceLimit'] = Infinity;
            polyfills.concat('zone.js/dist/long-stack-trace-zone');
        }
    }
    return polyfills;
}

// Angular 2 and other Vendor imports
export function vendors() : Array<string> {
    // return [
    //     '@angular/platform-browser',
    //     '@angular/platform-browser-dynamic',
    //     '@angular/compiler',
    //     '@angular/router',
    //     '@angular/forms',
    //     '@angular/common',
    //     '@angular/core',
    //     '@angular/http',
    //
    //     '@angularclass/form-validators',
    //     '@angularclass/hmr',
    // ];
    let vendors: Array<string> = [
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/core',
        '@angular/common',
        '@angular/http',
        '@angular/router',
        '@angular/forms',

        'jquery',
        //'bootstrap-webpack'
        //'bootstrap-webpack!./bootstrap.config.js'
        'bootstrap-webpack!./Webpack/bootstrap-webpack/bootstrap.config.js'
    ];
    return vendors;
}

// RxJS
export function rxjs() : Array<string> {
    return [
        //TODO: choose only what you need!
        // 'rxjs/Observable',
        // 'rxjs/Subscription',
        // 'rxjs/Subject',
        // 'rxjs/BehaviorSubject',
        // 'rxjs/add/operator/map',
        // 'rxjs/add/operator/mergeMap',
        // 'rxjs/add/operator/distinctUntilChanged',
        'rxjs'
    ];
}

