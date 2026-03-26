export interface Modification {
    id: string;
    old_name: string;
    new_name: string;
    new_type: string;
    new_value: string;
}

export interface Pattern {
    id: string;
    name: string;
    type: string;
    modifications: Modification[];
}

export interface NewPattern {
    userId: string;
    name: string;
    type: string;
    modifications: Modification[];
}