 import { APIRequestContext } from "@playwright/test";

export class APIHelper {
    private BASE_URL: string;
    private TEST_USERNAME: string;
    private TEST_PASSWORD: string;
    private user_username: string | null = null;
    private token: string


    constructor(baseUrl: string, username: string, password: string) {
        this.BASE_URL = baseUrl;
        this.TEST_USERNAME = username;
        this.TEST_PASSWORD = password;
    }
    async performLogin(request: APIRequestContext) {
        const response = await request.post(`${this.BASE_URL}/login`, {
            data: {
                username: this.TEST_USERNAME,
                password: this.TEST_PASSWORD,
            }
        })
        const responseData = await response.json();
        this.token = responseData.token;
        this.user_username = responseData.username;

        return response

    }
    async getAllRooms(request: APIRequestContext) {
        const authPayload = JSON.stringify({
            username: this.TEST_USERNAME,
            token: this.token         
        })

        const response = await request.get(`${this.BASE_URL}/rooms`, {
            headers: {
                'x-user-auth': authPayload,
                'Content-Type': 'application/json'
            }
        })
        return response
    }
    async postNewRoom(request: APIRequestContext, payload: object) {
        const authPayload = JSON.stringify({
            username: this.TEST_USERNAME,
            token: this.token
        });
        const response = await request.post(`${this.BASE_URL}/room/new`, {
            headers: {
                'x-user-auth': authPayload,  // Send authPayload as JSON string
                'Content-Type': 'application/json',  // Specify content type
            },
            data: payload
        });
        return response;
    }

    async deleteRoom(request: APIRequestContext, roomId: number) {
        const authPayload = JSON.stringify({
            username: this.TEST_USERNAME,
            token: this.token
        });

        const response = await request.delete(`${this.BASE_URL}/room/${roomId}`, {
            headers: {
                'x-user-auth': authPayload,  // Auth as JSON string
                'Content-Type': 'application/json',  // Ensure the payload is JSON
            }

        })
        return response
    }

}