export interface Repository<T> {
    find(filter: any): Promise<T[]>
    findOne(filter: any): Promise<T | undefined>
}