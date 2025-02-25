export class Schedule{
    _id: number;
    title: string;
    color: string;
    schedules: [
        {
            sid: string,
            start: string;
            end: string;
            details: string;
        }
    ]

    constructor(schedule){
        this._id = schedule.id || null;
        this.title = schedule.title || '';
        this.color = schedule.color || '';
        this.schedules = schedule.schedules || [];
    }
}