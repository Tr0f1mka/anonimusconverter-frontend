export interface Template {
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TemplateResponse {
    templates: Template[];
    total: number;
}