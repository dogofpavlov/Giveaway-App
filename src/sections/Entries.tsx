import * as React from 'react';
import { IData } from '../App';
import Section from './Section';
import './Entries.scss';
import Checkbox from '../Checkbox';

export interface IEntriesProps {
    data?:IData;
    onNew:($value:string)=>void;
    onDel:($id:string)=>void;

}

export interface IEntriesState {
    newName:string;
}

export default class Entries extends React.Component<IEntriesProps, IEntriesState> {
    
    static ID:string = "entries";

    constructor(props: IEntriesProps) {
        super(props);

        this.state = {
            newName:""
        }
    }
    _addNew=()=>{
        this.props.onNew(this.state.newName);
        this.setState({newName:""});

    }

    render() {

        let percentRemaining:number = 80;

        let perPerPrize:number = 0;
        if(this.props.data?.prizes){
            perPerPrize = (percentRemaining/this.props.data.prizes.length);
        }

        return (
            <Section id={Entries.ID}>
                
                <div className="addNew">
                    <input type="text" value={this.state.newName} onChange={($event)=>{
                        this.setState({newName:$event.target.value});
                    }}/>
                    <div className="btn" onClick={this._addNew}>Add Entry</div>
                </div>

                <div className="dataTable">
                    <div className="dataTableHeader">
                        <div className="col Name" style={{width:"15%"}}>
                            Username
                        </div>   
                        {this.props.data?.prizes.map(($prize, $index)=>{
                            return (
                                <div className="col prize" key={"prizeCol"+$index} style={{width:perPerPrize+"%"}}>
                                    <div className="prizeLabel">
                                        {$prize.label}
                                    </div>
                                </div>
                            );
                        })}   
                    </div>
                    <div className="dataTableContent">
                        {this.props.data?.entries.map(($entry,$index)=>{
                            return (
                                <div className="entryItem" key={"entryItem"+$index+$entry.id}>
                                    
                                    <div className="col Name" style={{width:"15%"}}>
                                        {$entry.name}
                                    </div>   
                                    {this.props.data?.prizes.map(($prize, $index2)=>{

                                        let checked:boolean = true;
                                        let excluded = $entry.prizeExclusions.find(($exclu)=>{
                                            return $exclu===$prize.id;
                                        });
                                        if(excluded){
                                            checked=false;
                                        }

                                        let won = $prize.winnerId===$entry.id;
                                        if(won){
                                            checked=true;
                                        }

                                        return (
                                            <div className="col prize" key={"prizeColRow"+$entry.id+$prize.id} style={{width:perPerPrize+"%"}} onClick={()=>{
                                                let alreadyExistsIndex = $entry.prizeExclusions.findIndex(($prizeExclu)=>{
                                                    return  $prizeExclu===$prize.id;
                                                });
                                                if(alreadyExistsIndex===-1){
                                                    $entry.prizeExclusions.push($prize.id);
                                                }else{
                                                    $entry.prizeExclusions.splice(alreadyExistsIndex,1);
                                                }
                                                this.forceUpdate();

                                            }}>
                                                <Checkbox won={won} checked={checked}/>
                                            </div>
                                        );
                                    })}   
                                    <div className="btn" style={{width:"5%"}} onClick={()=>{
                                        this.props.onDel($entry.id);
                                    }}>
                                        Del
                                    </div>   
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Section>
        );
    }
}
