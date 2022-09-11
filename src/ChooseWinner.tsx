import gsap from 'gsap';
import * as React from 'react';
import { IData, IDataEntry, IDataPrize } from './App';
import './ChooseWinner.scss';

export interface IChooseWinnerProps {
    show:boolean;
    choosingPrize:IDataPrize;
    data:IData;
    onWinnerChosen:($winner:IDataEntry)=>void;

}

export interface IChooseWinnerState {
    whoCanEnter:IDataEntry[];
    choosing:boolean;
    chosen:boolean;
}

export default class ChooseWinner extends React.Component<IChooseWinnerProps, IChooseWinnerState> {
    _selectedIndex:number = -1;
    _selectedIndexMotion:number = -1;
    
    _winnerIndex:number=-1;

    constructor(props: IChooseWinnerProps) {
        super(props);

        this.state = {
            whoCanEnter:[],
            choosing:false,
            chosen:false
        }
        
    }

    set selectedIndex($value:number){
        this._selectedIndexMotion=$value;
        this._selectedIndex = Math.round($value%this.state.whoCanEnter.length);
        this.forceUpdate();
    }
    get selectedIndex():number{
        return this._selectedIndexMotion;
    }



    componentDidMount(): void {
        this._load();
        
    }
    componentDidUpdate(prevProps: Readonly<IChooseWinnerProps>, prevState: Readonly<IChooseWinnerState>, snapshot?: any): void {
        if(prevProps.show!==this.props.show){
            if(this.props.show){
                this._load();
            }
        }
    }
    _load=()=>{
        let entries:IDataEntry[] = this.props.data.entries.filter(($entry)=>{
            let canEnter:boolean=true;
            let match = $entry.prizeExclusions.find(($exclusion)=>{
                return $exclusion===this.props.choosingPrize.id;
            });
            if(match){
                canEnter=false;
            }
            if($entry.wonPrizeId){
                canEnter=false;
            }
            return canEnter;
        });
        this.selectedIndex=-1;
        this.setState({whoCanEnter:entries, choosing:false, chosen:false});
            

    }
    _start=()=>{
        this.setState({chosen:false, choosing:true},()=>{

            this.selectedIndex=-1;
            this._winnerIndex=-1;
    
            let baseDuration:number = 4;
            let baseWrappingIndex:number = 200;
    
            let numTotalEntries =  this.state.whoCanEnter.length;
    
            this._winnerIndex = Math.floor(Math.random()*(numTotalEntries)); //Random Factor 1
    
            let numMinCycles = 2;//to spice up the show
            let wrappingIndex = (this.state.whoCanEnter.length*numMinCycles)+this._winnerIndex; //Random Factor 3 (the starting index as the last random winner index)
    
            let duration = (wrappingIndex*baseDuration)/baseWrappingIndex;
            if(duration>9){
                duration=9;
            }
            if(duration<2){
                duration=2;
            }
    
    
            let winner = this.state.whoCanEnter[this._winnerIndex];
    
            this.props.choosingPrize.winnerId=winner.id;
            winner.wonPrizeId = this.props.choosingPrize.winnerId;
    
            gsap.to(this,{duration:duration, selectedIndex:wrappingIndex, ease:"power1", onUpdate:()=>{
                console.log("transition", this.selectedIndex, this._selectedIndexMotion);
            }, onComplete:()=>{
                this.setState({chosen:true, choosing:false});
                setTimeout(()=>{
                    this.props.onWinnerChosen(this.state.whoCanEnter[this._winnerIndex]);
                },1000);
            }});
    
        });
    }

    render() {
        let cn:string = "chooseWinner";
        if(this.props.show){
            cn+=" show";
        }
        return (
            <div className={cn}>
                <div className="container">
                    <div className="chooseHeader">
                        <div className="headerStatus">
Drawing winner for: <span>{this.props.choosingPrize.label}</span>
                        </div>
                        {!this.state.choosing && !this.state.chosen && (
                            <div className="btn" onClick={this._start}>Start</div>
                        )}
                        {this.state.chosen && (
                            <div className="winner">{this.state.whoCanEnter[this._winnerIndex].name}</div>
                        )}
                    </div>
                    <div className="chooseEntries">
                        {this.state.whoCanEnter.map(($entrant,$index)=>{
                            let itemCN:string = "entryItem";
                            if($index===this._selectedIndex){
                                itemCN+=" selected";
                            }
                            return (
                                <div className={itemCN} key={$entrant.id+$index}>
                                    <div className="inside">

                                    {$entrant.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
