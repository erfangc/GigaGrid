export class SubtotalRow {
    public detailRows: any[];
    public title: string;
    public children: SubtotalRow[];
    constructor(title: string, children?: SubtotalRow[]) {
        this.detailRows = [];
        this.title = title;
        this.children = children || [];
    }
    getChildByTitle(title: string): SubtotalRow {
        var result = null;
        for(let i = 0; i < this.children.length; i++)
            if (this.children[i].title === title)
                result = this.children[i];
        return result;
    }
    hasChildWithTitle(title: string): boolean {
        return this.getChildByTitle(title) != null;
    }
}
