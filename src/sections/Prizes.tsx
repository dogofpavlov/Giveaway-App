import * as React from 'react';
import { IData, IDataPrize } from '../App';
import Section from './Section';
import './Prizes.scss';

export interface IPrizesProps {
    data?:IData;
    onNew:($value:string)=>void;
    onDel:($id:string)=>void;
    onDrawWinner:($prize:IDataPrize)=>void;
}

export interface IPrizesState {
    newPrize:string;
}

export default class Prizes extends React.Component<IPrizesProps, IPrizesState> {
    
    static ID:string = "prizes";

    constructor(props: IPrizesProps) {
        super(props);

        this.state = {
            newPrize:""
        }
    }

    _addNew=()=>{
        this.props.onNew(this.state.newPrize);
        this.setState({newPrize:""});
    }

    render() {
        return (
            <Section id={Prizes.ID}>
                
                <div className="addNew">
                    <input type="text" value={this.state.newPrize} onChange={($event)=>{
                        this.setState({newPrize:$event.target.value});
                    }}/>
                    <div className="btn" onClick={this._addNew}>Add Prize</div>
                </div>

                <div className="dataTable">
                    <div className="dataTableHeader">
                        <div className="col Prizes" style={{width:"80%"}}>
                            Prize Name
                        </div>    
                        <div className="col draw" style={{width:"20%"}}>
                            Draw Winner
                        </div>    
                    </div>
                    <div className="dataTableContent">
                        {this.props.data && this.props.data.entries && this.props.data?.prizes.map(($prize,$prizeIndex)=>{

                            let drawCN:string = "btn";
                            let drawLbl:string = "Draw Winner";
                            if($prize.winnerId){
                                drawCN+=" green";
                                let winner = this.props.data!.entries.find(($entry)=>{
                                    return $entry.id===$prize.winnerId;
                                });
                                if(winner){
                                    drawLbl = winner.name+" Won!";
                                }
                            }else{
                                drawCN+=" red";
                            }

                            return (
                                <div className="prizeItem" key={"prize"+$prize.id}>
                                    <div className="prizeItemName col" style={{width:"68%"}}>
                                        <span>{($prizeIndex+1)}</span>
                                        {$prize.label} 
                                        
                                    </div>
                                    <div className="prizeItemID col" style={{width:"12%"}}>
                                        <div className="btn" onClick={()=>{
                                            if(window.confirm("Delete "+$prize.label+"?")){
                                                this.props.onDel($prize.id);
                                            }
                                        }}>Del</div>
                                    </div>
                                    <div className="draw col" style={{width:"20%"}}>
                                        <div className={drawCN} onClick={()=>{
                                            this.props.onDrawWinner($prize);
                                        }}>{drawLbl}</div>
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
