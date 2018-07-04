import { ClientTemplate, Client, augmentClient } from '@irysius/anguli-components/Client';
import { ISize } from '@irysius/grid-math/Size';

interface ComponentState {
    [key: string]: any;
}
interface ComponentUpdate {
    [type: string]: {
        [id: string]: ComponentState;
    };
}
interface ISend {
    hail: IViewport;
}
interface IReceive {
    update: ComponentUpdate;
}
interface IViewport {
    cameraId: string;
    size: ISize;
}

// client should have way to hail on init
let _client: ClientTemplate<IReceive, ISend> = {
    path: '/game',
    connect: function () {
        this.hail({ cameraId: 'player', size: { width: 600, height: 400 } });
        // Get socketid
    },
    reconnect: null,
    sendTypes: { hail: null },
    receive: {
        update: function (payload) {

        }
    },
    disconnect: null
};