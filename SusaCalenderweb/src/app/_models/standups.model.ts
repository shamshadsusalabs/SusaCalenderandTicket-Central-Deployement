export class StandUps{
    _id: string;
    name: string;
    popupDate: string;
    tasks: [{ sid: string, title: string, date: string, description: string, isCompleted: boolean }]

    constructor(standups){
        this._id = standups._id;
        this.name = standups.name;
        this.popupDate = standups.popupDate;
        this.tasks = standups.tasks || [];
    }
}