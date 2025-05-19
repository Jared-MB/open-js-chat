export interface Repository<T> {
    create(data: T): Promise<T[]>
    find(filter?: any): Promise<T[]>
    findOne(filter: any): Promise<T | undefined>
    remove?(filter: any): Promise<boolean>
}