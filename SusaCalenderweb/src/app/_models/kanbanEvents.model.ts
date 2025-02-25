export class kanbanEvents{
    _id: string;
    name: string;
    statusId: number;
    index: number;
    title: string;
    description: string;
    imageURL: string;
    priority: string;
    modifiedDate: string;
    creationDate: string;
    closingDate: string;
    progressDate: string;
    ticketId: number;
    projectOwner: string;
    projectName: string;
    tickethours: number;
    resources: { resourcesName: string }[]; // Define resources as an array of objects
    projectID: string;
    comment: { userName: string }[]; // Define comment as an array of objects
    ticketowner: string;

    constructor(kanbanEvents) {
        this._id = kanbanEvents._id;
        this.name = kanbanEvents.name;
        this.statusId = kanbanEvents.statusId;
        this.index = kanbanEvents.index;
        this.title = kanbanEvents.title;
        this.description = kanbanEvents.description;
        this.imageURL = kanbanEvents.imageURL;
        this.priority = kanbanEvents.priority;
        this.closingDate = kanbanEvents.closingDate;
        this.creationDate = kanbanEvents.creationDate;
        this.modifiedDate = kanbanEvents.modifiedDate;
        this.progressDate = kanbanEvents.progressDate;
        this.ticketId = kanbanEvents.ticketId;
        this.projectOwner = kanbanEvents.projectOwner; // Added field
        this.projectName = kanbanEvents.projectName; // Added field
        this.tickethours = kanbanEvents.tickethours; // Added field
        this.resources = kanbanEvents.resources || []; // Added field
        this.projectID = kanbanEvents.projectID; // Added field
        this.comment = kanbanEvents.comment || []; // Added field
        this.ticketowner = kanbanEvents.ticketowner;
    }
}
