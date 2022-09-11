import * as React from 'react';
import './Section.scss';

export interface ISectionProps extends React.PropsWithChildren{
    id:string;
}

export interface ISectionState {
}

export default class Section extends React.Component<ISectionProps, ISectionState> {
    constructor(props: ISectionProps) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div className={"section "+this.props.id}>
                {this.props.children}
            </div>
        );
    }
}
