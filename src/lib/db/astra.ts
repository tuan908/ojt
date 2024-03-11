import {CollectionName} from "@/constants";
import {AstraDB} from "@datastax/astra-db-ts";
import {
    type FindOneOptions,
    type FindOptions,
} from "@datastax/astra-db-ts/dist/collections";

/**
 * AstraDB
 * @author tuanna
 */
export default class Astra {
    private static instance = new AstraDB(
        process.env["ASTRA_DB_APPLICATION_TOKEN"],
        process.env["ASTRA_DB_API_ENDPOINT"]
    );

    /**
     * Check if object is {}
     * @param param Object to check
     * @returns True if object is empty, else false
     */
    private static isEmptyObject(param: any): boolean {
        return Object.keys(param).length === 0;
    }

    /**
     *
     * @param collectionName
     * @param filter
     * @param options
     * @returns
     */
    static async findOne(
        collectionName: CollectionName,
        filter: Record<string, any>,
        options?: FindOneOptions
    ) {
        const collection = await this.instance.collection(collectionName);
        const data = await collection.findOne(filter, options);
        return data;
    }

    /**
     * Find by condition
     * @param collectionName Collection Name
     * @param callbackFn Callback
     * @param filter Filter condition
     * @returns Results
     */
    static async find<T, K extends T>(
        collectionName: CollectionName,
        callbackFn: (value: T, index: number, array: any[]) => K,
        filter?: Record<string, any>,
        options?: FindOptions
    ) {
        let _filter = {};
        let _options = {};

        if (filter && !this.isEmptyObject(filter)) {
            _filter = filter;
        }

        if (options && !this.isEmptyObject(options)) {
            _options = options;
        }

        const collection = await this.instance.collection(collectionName);
        const raw = await collection.find(_filter, _options).toArray();
        const result = raw.map(callbackFn);
        return result;
    }

    static async insertOne(
        collectionName: CollectionName,
        document: Record<string, any>
    ) {
        const collection = await this.instance.collection(collectionName);
        try {
            await collection.insertOne(document);
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}
