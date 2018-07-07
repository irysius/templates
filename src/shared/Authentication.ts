export namespace Authentication {
    export interface IFailure {
        reason: string;
    }
    export interface ISuccess {
        token: string;
    }
    export interface ICredentials {
        username: string;
        password: string;
    }
    interface IHubSend {
        success: ISuccess;
        failure: IFailure;
    }
    interface IHubReceive {
        authenticate: ICredentials;
    }
    export namespace Hub {
        export interface ISend extends IHubSend {
        }
        export interface IReceive extends IHubReceive {
        }
    }
    export namespace Client {
        export interface ISend extends IHubReceive {
        }
        export interface IReceive extends IHubSend {
        }
    }
}