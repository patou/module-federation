type RemoteMount = import("@demo/contracts").RemoteApplication["mount"];

declare module "vue_clients/app" { export const mount: RemoteMount; }
declare module "vue_backoffice/app" { export const mount: RemoteMount; }
declare module "angular_clients/app" { export const mount: RemoteMount; }
declare module "angular_backoffice/app" { export const mount: RemoteMount; }
