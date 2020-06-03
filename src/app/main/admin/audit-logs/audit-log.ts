export default class AuditLog {
    id: number;
    error: any;
    context: string;
    nickname: string;
    request: any;
    username: string;
    createdAt: Date;

    constructor(log?) {
        if (log) {
            this.id = +log.id;
            if (typeof log.error === 'string') {
                this.error = JSON.parse(log.error);
            } else {
                this.error = log.error;
            }
            this.context = `${log.context}`;
            this.nickname = `${log.nickname}`;
            if (typeof log.request === 'string') {
                this.request = JSON.parse(log.request);
            } else {
                this.request = log.request;
            }
            this.username = `${log.username}`;
            this.createdAt = new Date(log.createdAt);
        }
    }
}
