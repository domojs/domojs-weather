declare var eachAsync: eachAsync.main;

// Support AMD require
declare module 'each-async'
{
    export = eachAsync;
}

declare namespace eachAsync
{
    export interface main
    {
        <T>(array: T[], next: (item: T, key: number, callback: () => void) => void, completed: (error?: any) => void): void;
        (object: any, next: (item: any, key: string, callback: () => void) => void, completed: (error?: any) => void): void;
    }
}