import services from '../config/api/api-services';

export class ApiHelper {
    /*!
    * Get the full URL for a given service
     */
    static get(service: string = '', postfix: string = ''): string {
        
        if (typeof services[service] !== 'undefined') {
            return  services[service] + (postfix ? '/' + postfix : '');
        }
        return '';
    }

    /*!
    * Get the URL (without base URL) for a given service
     */
    static getService(service: string = '', postfix: string = ''): string {
        if (typeof services[service] !== 'undefined') {
            return services[service] + (postfix ? '/' + postfix : '');
        }
        return '';
    }

    // static root(): string {
    //     return baseURL;
    // }
}
