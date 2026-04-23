export class Task { //entidad con la que se esta recibiendo la data o se quiere enviar, como se maneja de forma interna para poder responder por medio de la API
    id!: number;
    name!: string;
    description!: string;
    priority!: boolean;
    user_id!: number;
}