export default class Session {
    authorities: string[];
    department: string;
    email: string;
    employeeId: string;
    userId: string;
    username: string;

    constructor(user?: any) {
        if (user) {
            this.authorities = user.authorities;
            this.department = `${user.department}`;
            this.email = `${user.email}`;
            this.employeeId = `${user.employeeId}`;
            this.userId = `${user.userId}`;
            this.username = `${user.username}`;
        }
    }

    hasRole(role: string): boolean {
        return this.authorities.includes(role);
    }

    get isAdmin(): boolean {
        return this.hasRole('admin');
    }

    get isUser(): boolean {
        return this.hasRole('user');
    }
}
