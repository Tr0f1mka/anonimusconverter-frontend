export interface Template {
    id: string;
    name: string;
    description?: string;
    updatedAt?: Date;
}

export interface TemplateResponse {
    templates: Template[];
    total: number;
}