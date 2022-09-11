import React from 'react';
import './App.scss';
import ChooseWinner from './ChooseWinner';
import Header from './Header';
import Nav from './Nav';
import Draw from './sections/Draw';
import Entries from './sections/Entries';
import Prizes from './sections/Prizes';


export interface IData{
    entries:IDataEntry[];
    prizes:IDataPrize[];
}


export interface IDataEntry{
    id:string;
    name:string;
    prizeExclusions:string[];
    wonPrizeId?:string;
}

export interface IDataPrize{
    label:string;
    id:string;
    winnerId?:string;
}


export interface IAppProps {
}

export interface IAppState {
    curSection:string;
    data?:IData;
    showChoose:boolean;
    choosingPrize?:IDataPrize;
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            curSection:"",
            showChoose:false
        }
    }

    componentDidMount(){

    }

    _save=()=>{

        let data:string = "";
        if(this.state.data){
            data = JSON.stringify(this.state.data);

            let file = new Blob([data],{type:"application/json"});
            const a = document.createElement('a');
            let url =URL.createObjectURL(file);;
            a.href = url;
            a.download = "data";
            document.body.appendChild(a);
            a.click();
            setTimeout(()=>{
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url)
            },0);

        }

    }
    _loadData=($data:FileList | null)=>{
        if($data){
            let file:File = $data.item(0)!;
            let fileReader:FileReader = new FileReader();
            fileReader.onload=($e)=>{
                if($e.target?.result){
                    let content = JSON.parse($e.target.result as string);
                    this.setState({data:content, curSection:Entries.ID});
                }
            }
            fileReader.onerror=()=>{
                console.log('oops');
            }
            fileReader.readAsText(file);
        }

    }
    _onNewEntry=($name:string)=>{
        if(this.state.data){
            
            let entries = [...this.state.data.entries];
            entries.push({id:"entry-"+Date.now()+$name, name:$name, prizeExclusions:[]});

            let data:IData = {...this.state.data};
            data.entries = entries;

            this.setState({data:data});

        }

    }
    _onDelEntry=($id:string)=>{
            if(this.state.data){
            
                let entries = [...this.state.data.entries];
    
                let entryIndex = entries.findIndex(($entry)=>{
                    return $entry.id===$id;
                });
    
                if(entryIndex!==-1){
                    let entry = entries[entryIndex];

                    if(window.confirm("Delete "+entry.name+"?")){
                        entries.splice(entryIndex,1);    
                        let data:IData = {...this.state.data};
                        data.entries = entries;
                        this.setState({data:data});
                    }
                }
            }
    }
    _onDrawPrize=($prize:IDataPrize)=>{

        if(!$prize.winnerId && this.state.data){

            this.setState({showChoose:true, choosingPrize:$prize});

            /*
         
            */
        }

    }
    render() {

        let jsxContent:JSX.Element = <></>;

        if(this.state.data){

            switch(this.state.curSection){
                case Entries.ID:
                    jsxContent = (
                        <Entries 
                            onNew={this._onNewEntry}
                            onDel={this._onDelEntry}
                        data={this.state.data}/>
                    );
                break;
                case Prizes.ID:
                    jsxContent = (
                        <Prizes 
                            onDrawWinner={this._onDrawPrize}
                            onDel={($id)=>{
                                let prizeInd = this.state.data!.prizes.findIndex(($prize)=>{
                                    return $prize.id===$id;
                                });
                                if(prizeInd!==-1){
                                    let prizes = [...this.state.data!.prizes];
                                    prizes.splice(prizeInd,1);

                                    let data:IData = {entries:this.state.data!.entries, prizes:prizes};

                                    this.setState({data});
                                    
                                }
                            }}
                            onNew={($name)=>{

                                let prizes = [...this.state.data!.prizes];
                                prizes.push({
                                    id:"id-"+Math.round(Math.random()*100000+Date.now()),
                                    label:$name
                                });

                                let data:IData = {entries:this.state.data!.entries, prizes:prizes};

                                this.setState({data});

                            }} 
                            data={this.state.data}/>
                    );
                break;
                case Draw.ID:
                    jsxContent = (
                        <Draw data={this.state.data}/>
                    );
                break;
            }
        }

        let isReady:boolean = this.state.data?true:false;

        return (
            <>
                <div className='app'>
                    <Header/>
                    <Nav
                        ready={isReady}
                        onLoad={this._loadData} 
                        onSave={this._save}
                        curSection={this.state.curSection}
                        data={this.state.data} 
                        onChange={($id:string)=>{
                        this.setState({curSection:$id});
                    }}/>
                    <div className="content">
                        {jsxContent}
                    </div>            
                </div>
                {this.state.data && this.state.choosingPrize && (
                    <ChooseWinner onWinnerChosen={()=>{
                        this.setState({showChoose:false});
                    }} data={this.state.data} choosingPrize={this.state.choosingPrize} show={this.state.showChoose}/> 
                )}
            </>
        );
    }
}


