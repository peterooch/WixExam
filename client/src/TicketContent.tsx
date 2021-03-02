import React from 'react';
import './App.scss';

export type ContentState = {
    collapsed: boolean,
    btnNeeded: boolean
}
export interface ITicketProps {
    content: string
}

export class TicketContent extends React.Component<ITicketProps, ContentState> {
    
    state: ContentState = {
        collapsed: true,
        btnNeeded: false
    }

    componentDidMount() {
        let btnNeeded = this.props.content.split('\n').length > 3;
        this.setState({btnNeeded: btnNeeded});
    }

    onChange() {
        this.setState({collapsed: !this.state.collapsed})
    }
    getContent() {
        return this.props.content.split('\n').slice(0, 3).join('\n');
    }
    render() {
        return (<div className='content'>
                    <p>
                        {this.state.btnNeeded && this.state.collapsed ? this.getContent() : this.props.content}
                    </p>
                        {this.state.btnNeeded ? 
                        <button className='btn btn-secondary btn-sm' onClick={(_) => this.onChange()}>
                        {this.state.collapsed ? 'Show More' : 'Show Less'}
                        </button>
                        : null
                        }
                </div>);
    }
}
