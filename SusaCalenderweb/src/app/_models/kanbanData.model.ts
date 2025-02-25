export class kanbanData{
    _id: string;
    name: string;
    kanbanFields: [{ statusId: number, statusName: string, sid: string }];
    sharedKanban: [{ userName: string, statusId: number, statusName: string, userId: string, sid: string }];
    sharedKanbanData: [{ userName: string, userId: string, title: string, description: string, imageURL: string }];

    constructor(kanbanData){
        this._id = kanbanData._id;
        this.name = kanbanData.name;
        this.kanbanFields = kanbanData.kanbanFields;
        this.sharedKanban = kanbanData.sharedKanban;
        this.sharedKanbanData = kanbanData.sharedKanbanData;
    }
}