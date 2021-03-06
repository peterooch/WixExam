import React from 'react';
import './App.scss';

export type ContentState = {
    collapsed: boolean,
}
export interface ITicketProps {
    content: string
}

/* Separate the ticket dynamic parts into a component so to not mix up states */
export class TicketContent extends React.Component<ITicketProps, ContentState> {
    
    state: ContentState = {
        collapsed: true
    }

    switchState() {
        this.setState({collapsed: !this.state.collapsed})
    }

    render() {
        return (<div className='content'>
                    <div className={this.state.collapsed ? "collapsed" : ""}>
                        {this.props.content}
                    </div>
                    <button className='btn btn-link btn-sm' onClick={() => this.switchState()}>
                        {this.state.collapsed ? 'Show More' : 'Show Less'}
                    </button>
                </div>);
    }
}
