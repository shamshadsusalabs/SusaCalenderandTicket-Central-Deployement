export class EventDetails{
    _id: number;
    title: string;
    start: Date
    end: Date
    details: string
    colour: string

    constructor(event){
        this._id = event._id;
        this.title = event.title;
        this.start = event.start;
        this.end = event.end;
        this.colour = event.colour;
        this.details = event.details;
    }
}