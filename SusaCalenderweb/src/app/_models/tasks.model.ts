import { formatDate } from '@angular/common';

export class Tasks{
    id: number;
    orderNo: number;
    totalItems: number;
    company: string;
    entryDate: string;
    followUpDate: string;
    expirationDate: string;
    totalCost: number;
    totalPrice: number;
    contact: number;
    createdBy: string;
    salesPerson: string;
    priority: string;
    statusId: number;
    index: number;

    constructor(tasks){
        this.id = tasks.id;
        this.orderNo = tasks.orderNo;
        this.totalItems = tasks.totalItems;
        this.company = tasks.company;
        this.entryDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.followUpDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.expirationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.totalCost = tasks.totalCost;
        this.totalPrice = tasks.totalPrice;
        this.contact = tasks.contact;
        this.createdBy = tasks.createdBy;
        this.salesPerson = tasks.salesPerson;
        this.priority = tasks.priority;
        this.statusId = tasks.statusId;
        this.index = tasks.index;
    }
}
