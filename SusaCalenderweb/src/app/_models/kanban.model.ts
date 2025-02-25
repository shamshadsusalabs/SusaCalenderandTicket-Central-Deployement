export class Kanban{
    id: number;
    statusId: number;
    statusName: string;

    constructor(kanban){
        this.id = kanban.id;
        this.statusId = kanban.statusId;
        this.statusName = kanban.statusName;
    }
}