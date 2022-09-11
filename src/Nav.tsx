import * as React from 'react';
import { IData } from './App';
import './Nav.scss';
import Entries from './sections/Entries';
import Prizes from './sections/Prizes';
export interface INavProps {
    onChange:($id:string)=>void;
    curSection:string;
    onLoad:($file:FileList | null)=>void;
    onSave:()=>void;
    data?:IData;
    ready:boolean;
}

export interface INavState {
}

export default class Nav extends React.Component<INavProps, INavState> {
    constructor(props: INavProps) {
        super(props);

        this.state = {
        }
    }
    _onInput=($event:React.ChangeEvent<HTMLInputElement>)=>{
        this.props.onLoad($event.target.files);
    }

    render() {

        let entriesCount:number=0;
        let prizeCount:number=0;

        if(this.props.data){
            entriesCount = this.props.data.entries.length;
            prizeCount = this.props.data.prizes.length;
        }



        let sections:{id:string, label:string, selected?:boolean}[] = [
            {id:Entries.ID, label:"Entries ("+entriesCount+")"},
            {id:Prizes.ID, label:"Prizes ("+prizeCount+")"},
           // {id:Draw.ID, label:"Draw Winners"}            
        ];



        let strCN:string = "nav";
        if(this.props.ready){
            strCN+=" ready";
        }

        return (
            <div className={strCN}>
                <label htmlFor="file-upload" className="btn" >Load File</label>
                <input id="file-upload" type="file" onChange={this._onInput}/>
                
                <div className="navItems">
                    {sections.map(($section)=>{
                        let strCN:string = "navItem";
                        if(this.props.curSection===$section.id){
                            strCN+=" selected";
                        }
                        return (                        
                            <div key={$section.id} className={strCN} onClick={()=>{
                                this.props.onChange($section.id);
                            }}>
                                {$section.label}
                            </div>
                        );
                    })}

                </div>
                <div className="btn saveData" onClick={this.props.onSave}>Save</div>
                

            </div>
        );
    }
}
