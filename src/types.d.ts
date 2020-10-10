type RuleItem = {
    rules: string,
    field?: string,
    object?: Object,
    arrayobject?: ValidationRules,
    belongsto?: Array<any>,
    minlen?: number,
    maxlen?: number,
    unique?: {
        exists: Function
    },
    eachbelongsto?: Array<any>,
    messages?: Array<{
        required?: string,
        unique?: string,
        array?: string,
        number?: string,
        object?: string,
        email?: string,
        arrayobject?: string,
        minlen?: string,
        maxlen?: string,
        belongsto?: string,
        eachbelongsto?: string,
    }>,
};

type Rule = 'required' | 
    'array' |
    'email' |
    'image' |
    'unique' |
    'number' |
    'object' |
    'minlen' |
    'maxlen' |
    'string' |
    'belongsto' |
    'arrayobject' |
    'eachbelongsto';

type ValidationRules = {
    [key: string]: string | RuleItem,
} | Array<RuleItem>;

type ValidationResponse = {
    isValid: boolean,
    hasConflict: boolean,
    errors: { [key: string]: string },
};

declare interface String {
    capitalize(): string;
}
