declare global {
    interface PluginRegistry {
        CappContacts?: CappContacts;
    }
}
export interface CappContacts {
    find(options: {
        matchingName: string;
    }): Promise<any>;
    enumerate(): Promise<any>;
    authorizationStatus(): Promise<any>;
    requestAccess(): Promise<any>;
}
