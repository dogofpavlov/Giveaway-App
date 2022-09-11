import * as React from 'react';
import './Checkbox.scss';
export interface ICheckboxProps {
    checked?:boolean;
    won?:boolean;
}

export default class Checkbox extends React.Component<ICheckboxProps> {
    render() {

        let cn:string = "checkbox";
        if(this.props.checked){
            cn+=" checked";
        }
        if(this.props.won){
            cn+=" won";
        }

        return (
            <div className={cn}/>
        );
    }
}
