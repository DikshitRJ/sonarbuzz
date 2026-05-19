// Automated credential pool scraper from GitHub
export class ConfigSync{
    private static clientsUrl="https://raw.githubusercontent.com/DikshitRJ/sonarbuzz/refs/heads/main/tidalCreds.json"
    static async client():Promise<{id:string,secret:string}>{
        try{
            const creds=await (await fetch(this.clientsUrl)).json()
            if (creds){return {id: creds.id, secret:creds.secret};}
            return {id:'',secret:''}
        }catch(e){return {id:'',secret:''}}
    }
    static async fetchToken():Promise<String>{
        const clientCreds=await this.client();
        const params = new URLSearchParams({
            client_id: clientCreds.id,
            client_secret: clientCreds.secret,
            grant_type: 'client_credentials',
        });
        const res = await fetch('https://auth.tidal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + btoa(`${clientCreds.id}:${clientCreds.secret}`),
            },
            body: params,
        });
        if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
        const data = await res.json();
        return data.access_token;
    }
}