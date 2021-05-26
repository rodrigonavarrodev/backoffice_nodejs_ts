namespace accountsAdminModel {
   
    export interface registerUser {
        name: string,
        email: string,
        firstName: string,
        role: any,
        boRole: string,
        password: string,
        confirmPassword: string
    }

    export interface authenticateUser{
        email: string,
        password?: string
    }

    export interface updateUser {
        name: string,
        email: string,
        role: any
    }
}