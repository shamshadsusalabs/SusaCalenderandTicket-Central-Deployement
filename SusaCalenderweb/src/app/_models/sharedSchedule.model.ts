export class SharedSchedule{
    _id: number;
    sendTo: string;
    scheduleOf: string;
    sharedDate: string;
    schedules: []

    constructor(shared){
        this._id = shared._id || null;
        this.sendTo = shared.sendTo || '';
        this.scheduleOf = shared.scheduleOf || '';
        this.sharedDate = shared.sharedDate || '';
        this.schedules = shared.schedules || [];
    }
}