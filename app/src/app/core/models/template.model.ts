export interface Modification {
    id: string;
    old_name: string;
    new_name: string | null;
    new_type: string | null;
    new_value: string | null;
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