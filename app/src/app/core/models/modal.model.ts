export interface ModalConfig {
    id: string;
    title: string;
    content: string[];
    type: 'help' | 'dev' | 'info' | 'warning';
    size?: 'small' | 'medium' | 'large';
}