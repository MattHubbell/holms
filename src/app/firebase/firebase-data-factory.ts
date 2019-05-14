import {LocalData} from "./local-data";

export function localDataFactory () {
    return () => {
        return new LocalData();
    };
}

export let LocalDataFactoryProvider = {provide: LocalData, useFactory: localDataFactory};
