declare interface PreferencesOptions {
    key?: string
    encrypt?: boolean
    format?: ('json'|'yaml')
}

declare class Preferences {
    constructor(key: string, defaults?: any, options?: PreferencesOptions);
    [prop: string]: any
    save(): void
    clear(): void
}

export = Preferences;