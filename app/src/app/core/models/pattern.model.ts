export interface Modification {
    id: string;
    old_name: string | null;
    new_name: string | null;
    new_type: 'String' | 'Integer' | 'Float' | 'Boolean' | null;
    new_value: string | null;
}

export interface Pattern {
    id: string;
    name: string;
    modifications: Modification[];
}

export interface NewModification {
    old_name: string | null;
    new_name: string | null;
    new_type: 'String' | 'Integer' | 'Float' | 'Boolean' | null;
    new_value: string | null;
}

export interface NewPattern {
    userId: string;
    name: string;
    modifications: NewModification[];
}

export interface UpdateModification {
    id: string | null;
    old_name: string | null;
    new_name: string | null;
    new_type: 'String' | 'Integer' | 'Float' | 'Boolean' | null;
    new_value: string | null;
}

export interface UpdetePattern {
    id: string;
    name: string;
    modifications: UpdateModification[];
}