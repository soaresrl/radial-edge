export default abstract class Segment {
    private _isSelected: boolean = false;
    private _numberOfSubdv: number = 0;

    setNumberOfSubdivisions(numberOfSubdivisions: number){
        this._numberOfSubdv = numberOfSubdivisions;
    }

    getNumberOfSubdivisions(){
        return this._numberOfSubdv;
    }

    setSelected(isSelected: boolean){
        this._isSelected = isSelected;
    }

    isSelected(){
        return this._isSelected;
    }
}