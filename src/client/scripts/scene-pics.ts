export class ScenePictures{
    private leftChar: string;
    private rightChar: string;
    private background: string;
    constructor(leftChar: string, rightChar: string, background: string) {
        this.leftChar = leftChar;
        this.rightChar = rightChar;
        this.background = background;
    }
    public formatPictures(){

    }

    public getleftChar(): string {
        return this.leftChar;
    }

    public getRightChar(): string {
        return this.rightChar;
    }

    public getBackground(): string {
        return this.background;
    }

    private setLeftChar(value: string) {
        this.leftChar = value;
    }

    private setRightChar(value: string) {
        this.rightChar = value;
    }

    private setBackground(value: string) {
        this.background = value;
    }
}
