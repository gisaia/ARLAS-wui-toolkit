import { HttpClient } from '@angular/common/http';
export abstract class WalkthroughLoader {

    public abstract loader(): Promise<any>;

}

export class BasicWalkthroughLoader extends WalkthroughLoader {
    public constructor(private http: HttpClient) {
        super();
    }
    public loader(): Promise<any> {
        return this.http
            .get('/asset/tour/tour_en.json?' + Date.now())
            .toPromise();
    }
}
