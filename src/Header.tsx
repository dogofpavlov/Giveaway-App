import * as React from 'react';
import './Header.scss';


export interface IHeaderProps {
}

export interface IHeaderState {
}

export default class Header extends React.Component<IHeaderProps, IHeaderState> {
    constructor(props: IHeaderProps) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div className="header">
                
            </div>
        );
    }
}
