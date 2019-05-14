import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], columnName: string, searchText: string, searchType: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        const list = items.filter( item => {
            if (!searchType) {
                return item[columnName].toLowerCase().startsWith(searchText);
            }
            if (searchType == 'equals') {
                return item[columnName].toLowerCase() == searchText;
            }
        });
        return list;
    }
}