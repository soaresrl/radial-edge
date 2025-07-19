export default abstract class Segment {
    private _isSelected;
    private _numberOfSubdv;
    setNumberOfSubdivisions(numberOfSubdivisions: number): void;
    getNumberOfSubdivisions(): number;
    setSelected(isSelected: boolean): void;
    isSelected(): boolean;
}
