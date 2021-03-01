import React from 'react';
import './App.scss';

export type ContentState = {
    collapsed: boolean
}

export class TicketContent extends React.Component<{}, ContentState> {
    
    state: ContentState = {
        collapsed: true,
    }

    onChange() {
        this.setState({collapsed: !this.state.collapsed})
    }
    getContent() {
        if (!this.state.collapsed)
            return this.props.children;

        let temp = this.props.children as string;
        let lines = temp.split('\n');

        if (lines.length <= 3)
            return this.props.children;
        
        return lines.slice(0, 3).join('\n');
    }
    render() {
        return (<div className='content'>
                    <p>
                        {this.getContent()}
                    </p>
                    <button onClick={(e) => this.onChange()}>
                    {this.state.collapsed ? 'Show More' : 'Show Less'}
                    </button>
                </div>);
    }
}
