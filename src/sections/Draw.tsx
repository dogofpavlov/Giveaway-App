import * as React from 'react';
import { IData } from '../App';
import Section from './Section';

export interface IDrawProps {
    data?:IData;
    
}

export interface IDrawState {
}

export default class Draw extends React.Component<IDrawProps, IDrawState> {

    static ID:string = "draw";

    constructor(props: IDrawProps) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <Section id={Draw.ID}>
                draw
            </Section>
            
        );
    }
}
